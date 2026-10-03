import express, { Request, Response } from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import Stripe from 'stripe';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const APP_URL = process.env.APP_URL || `http://localhost:${port}`;

// Initialize Stripe (if valid key provided)
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const isStripeConfigured = Boolean(stripeSecretKey && !stripeSecretKey.includes('sk_test_...'));
const stripe = isStripeConfigured ? new Stripe(stripeSecretKey!, { apiVersion: '2025-02-24.acacia' as any }) : null;

// Raw body parser for Stripe webhook signature verification
app.use('/api/stripe-webhook', express.raw({ type: 'application/json' }));

// Standard body parser for all other routes
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Initialize Google Gemini SDK
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Admin emails allowlist
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || 'khedjef@gmail.com,admin@policylens.ai')
  .toLowerCase()
  .split(',')
  .map((e) => e.trim());

// =========================================================================
// IN-MEMORY DATA STORAGE (Vercel/Cloud Run Ready with Persistence Fallback)
// =========================================================================

export interface UserRecord {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  agencyName: string;
  plan: 'free' | 'solo' | 'agency' | 'enterprise';
  analyses_used: number;
  analyses_limit: number;
  trial_ends_at: string | null;
  subscription_status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'none';
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  role: 'user' | 'admin';
  created_at: string;
}

export interface AnalysisLogRecord {
  id: string;
  user_id: string;
  user_email: string;
  timestamp: string;
  carriers_count: number;
  carriers: string[];
  token_count: number;
  status: 'success' | 'failed';
}

export interface ErrorLogRecord {
  id: string;
  timestamp: string;
  type: string;
  message: string;
  user_email?: string;
}

// In-memory data collections
const users: Map<string, UserRecord> = new Map();
const userTokens: Map<string, string> = new Map(); // token -> userId
const analysisLogs: AnalysisLogRecord[] = [];
const errorLogs: ErrorLogRecord[] = [];

// Rate limiting sliding window caches
// userId -> timestamps of analyses in past hour
const userAnalysisTimestamps: Map<string, number[]> = new Map();
// userId -> timestamps of PDF uploads in past 24 hours
const userUploadTimestamps: Map<string, number[]> = new Map();

// Seed initial default demo admin and users
function seedDefaultUsers() {
  const adminEmail = 'khedjef@gmail.com';
  const salt = 'policylens_salt';
  const defaultHash = crypto.createHash('sha256').update('password123' + salt).digest('hex');

  const adminUser: UserRecord = {
    id: 'user_admin_01',
    email: adminEmail,
    passwordHash: defaultHash,
    name: 'Senior Agency Executive',
    agencyName: 'Heritage Independent Agency',
    plan: 'agency',
    analyses_used: 4,
    analyses_limit: -1,
    trial_ends_at: null,
    subscription_status: 'active',
    role: 'admin',
    created_at: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
  };

  const demoSoloUser: UserRecord = {
    id: 'user_demo_02',
    email: 'agent@heritageagency.com',
    passwordHash: defaultHash,
    name: 'Sarah Jenkins',
    agencyName: 'Jenkins Commercial Risk',
    plan: 'solo',
    analyses_used: 7,
    analyses_limit: 20,
    trial_ends_at: new Date(Date.now() + 10 * 24 * 3600 * 1000).toISOString(),
    subscription_status: 'trialing',
    role: 'user',
    created_at: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(),
  };

  users.set(adminEmail.toLowerCase(), adminUser);
  users.set(demoSoloUser.email.toLowerCase(), demoSoloUser);

  // Seed sample logs for Admin Dashboard
  analysisLogs.push(
    {
      id: 'log_01',
      user_id: adminUser.id,
      user_email: adminUser.email,
      timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
      carriers_count: 3,
      carriers: ['Travelers', 'The Hartford', 'Liberty Mutual'],
      token_count: 4850,
      status: 'success',
    },
    {
      id: 'log_02',
      user_id: demoSoloUser.id,
      user_email: demoSoloUser.email,
      timestamp: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
      carriers_count: 3,
      carriers: ['Chubb Custom', 'CNA Commercial', 'AmTrust'],
      token_count: 5120,
      status: 'success',
    }
  );
}

seedDefaultUsers();

// Helper: Check password
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + 'policylens_salt').digest('hex');
}

// Helper: Authenticate request token
function getAuthenticatedUser(req: Request): UserRecord | null {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.split(' ')[1];
  const userId = userTokens.get(token);
  if (!userId) return null;

  for (const user of users.values()) {
    if (user.id === userId) {
      // Check if trial has expired
      if (user.subscription_status === 'trialing' && user.trial_ends_at) {
        if (new Date(user.trial_ends_at).getTime() < Date.now()) {
          user.plan = 'free';
          user.analyses_limit = 3;
          user.subscription_status = 'none';
        }
      }
      return user;
    }
  }
  return null;
}

// Rate limiting validator
function checkRateLimits(userId: string, pdfCount: number): { allowed: boolean; message?: string } {
  const now = Date.now();
  const ONE_HOUR = 60 * 60 * 1000;
  const ONE_DAY = 24 * 60 * 60 * 1000;

  // 1. Hourly analyses limit: 5 per hour
  const hourlyTimestamps = (userAnalysisTimestamps.get(userId) || []).filter((t) => now - t < ONE_HOUR);
  if (hourlyTimestamps.length >= 5) {
    const oldestTimestamp = hourlyTimestamps[0];
    const minutesLeft = Math.ceil((oldestTimestamp + ONE_HOUR - now) / (60 * 1000));
    return {
      allowed: false,
      message: `Hourly rate limit reached (5 analyses per hour). Please wait ${minutesLeft} minute(s) before analyzing more quotes.`,
    };
  }

  // 2. Daily uploads limit: 20 PDFs per day
  const dailyUploads = (userUploadTimestamps.get(userId) || []).filter((t) => now - t < ONE_DAY);
  if (dailyUploads.length + pdfCount > 20) {
    return {
      allowed: false,
      message: `Daily PDF upload limit reached (20 PDFs per day). You have uploaded ${dailyUploads.length} PDFs in the last 24 hours.`,
    };
  }

  return { allowed: true };
}

function recordUsage(userId: string, pdfCount: number) {
  const now = Date.now();
  const hourly = userAnalysisTimestamps.get(userId) || [];
  hourly.push(now);
  userAnalysisTimestamps.set(userId, hourly);

  const daily = userUploadTimestamps.get(userId) || [];
  for (let i = 0; i < pdfCount; i++) {
    daily.push(now);
  }
  userUploadTimestamps.set(userId, daily);
}

// =========================================================================
// AUTHENTICATION ROUTES (/api/auth/*)
// =========================================================================

// POST /api/auth/signup
app.post('/api/auth/signup', (req: Request, res: Response) => {
  const { email, password, name, agencyName } = req.body;

  if (!email || !password || password.length < 6) {
    return res.status(400).json({ error: 'Valid email and password (minimum 6 characters) required.' });
  }

  const normalizedEmail = email.toLowerCase().trim();
  if (users.has(normalizedEmail)) {
    return res.status(400).json({ error: 'An account with this email address already exists.' });
  }

  const role = ADMIN_EMAILS.includes(normalizedEmail) ? 'admin' : 'user';
  const token = 'pltok_' + crypto.randomBytes(24).toString('hex');
  const trialEnds = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();

  // New signups automatically receive a 14-day Solo Agent trial
  const newUser: UserRecord = {
    id: 'usr_' + Date.now() + '_' + crypto.randomBytes(4).toString('hex'),
    email: normalizedEmail,
    passwordHash: hashPassword(password),
    name: name || normalizedEmail.split('@')[0],
    agencyName: agencyName || 'Independent Insurance Agency',
    plan: 'solo',
    analyses_used: 0,
    analyses_limit: 20,
    trial_ends_at: trialEnds,
    subscription_status: 'trialing',
    role,
    created_at: new Date().toISOString(),
  };

  users.set(normalizedEmail, newUser);
  userTokens.set(token, newUser.id);

  const { passwordHash, ...userProfile } = newUser;
  return res.json({
    success: true,
    token,
    user: { ...userProfile, token },
  });
});

// POST /api/auth/login
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required.' });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const user = users.get(normalizedEmail);

  if (!user || user.passwordHash !== hashPassword(password)) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  // Check trial expiration
  if (user.subscription_status === 'trialing' && user.trial_ends_at) {
    if (new Date(user.trial_ends_at).getTime() < Date.now()) {
      user.plan = 'free';
      user.analyses_limit = 3;
      user.subscription_status = 'none';
    }
  }

  const token = 'pltok_' + crypto.randomBytes(24).toString('hex');
  userTokens.set(token, user.id);

  const { passwordHash, ...userProfile } = user;
  return res.json({
    success: true,
    token,
    user: { ...userProfile, token },
  });
});

// GET /api/auth/me
app.get('/api/auth/me', (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const { passwordHash, ...userProfile } = user;
  return res.json({ user: userProfile });
});

// =========================================================================
// STRIPE SUBSCRIPTION & CHECKOUT ROUTES
// =========================================================================

// POST /api/create-checkout-session
app.post('/api/create-checkout-session', async (req: Request, res: Response) => {
  try {
    const { priceId, customerEmail, planId, billingCycle } = req.body;
    const targetEmail = (customerEmail || '').toLowerCase().trim();
    const user = getAuthenticatedUser(req) || users.get(targetEmail);

    // Plan pricing config
    const planPrices: Record<string, { monthly: number; yearly: number }> = {
      solo: { monthly: 99, yearly: 948 },
      agency: { monthly: 299, yearly: 2868 },
      enterprise: { monthly: 799, yearly: 7668 },
    };

    const isYearly = billingCycle === 'yearly';
    const amountInCents = planPrices[planId] ? (isYearly ? planPrices[planId].yearly * 100 : planPrices[planId].monthly * 100) : 9900;

    // Real Stripe Integration if secret key is configured
    if (stripe) {
      try {
        let customerId = user?.stripe_customer_id;
        if (!customerId && targetEmail) {
          const customer = await stripe.customers.create({
            email: targetEmail,
            metadata: { app: 'PolicyLens', userId: user?.id || '' },
          });
          customerId = customer.id;
          if (user) user.stripe_customer_id = customerId;
        }

        const sessionOptions: any = {
          customer: customerId,
          customer_email: customerId ? undefined : targetEmail,
          payment_method_types: ['card'],
          mode: 'subscription',
          line_items: [
            {
              price_data: {
                currency: 'usd',
                product_data: {
                  name: `PolicyLens ${planId === 'solo' ? 'Solo Agent' : planId === 'agency' ? 'Small Agency' : 'Enterprise'} (${isYearly ? 'Yearly' : 'Monthly'})`,
                  description: 'Commercial Insurance Quote Comparison & Proposal Suite',
                },
                unit_amount: amountInCents,
                recurring: {
                  interval: isYearly ? 'year' : 'month',
                },
              },
              quantity: 1,
            },
          ],
          subscription_data: {
            trial_period_days: 14,
            metadata: { planId, userId: user?.id || '' },
          },
          success_url: `${APP_URL}/success?session_id={CHECKOUT_SESSION_ID}&plan=${planId}`,
          cancel_url: `${APP_URL}/pricing`,
        };

        const session = await stripe.checkout.sessions.create(sessionOptions);

        return res.json({ url: session.url, sessionId: session.id });
      } catch (stripeErr: any) {
        console.warn('Stripe checkout error, using sandbox simulation fallback:', stripeErr.message);
      }
    }

    // Development sandbox simulation mode (Works smoothly without live Stripe keys)
    const simulatedSessionId = 'cs_test_' + crypto.randomBytes(16).toString('hex');
    const simulatedSuccessUrl = `/success?session_id=${simulatedSessionId}&plan=${planId || 'solo'}`;

    // Auto-update user in demo mode
    if (user) {
      user.plan = (planId as any) || 'solo';
      user.subscription_status = 'active';
      user.analyses_limit = planId === 'solo' ? 20 : -1;
      user.trial_ends_at = null;
    }

    return res.json({
      url: simulatedSuccessUrl,
      sessionId: simulatedSessionId,
      simulated: true,
    });
  } catch (err: any) {
    console.error('Error creating checkout session:', err);
    return res.status(500).json({ error: err.message || 'Failed to initiate checkout.' });
  }
});

// POST /api/create-portal-session
app.post('/api/create-portal-session', async (req: Request, res: Response) => {
  try {
    const user = getAuthenticatedUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Please log in to manage your subscription.' });
    }

    if (stripe && user.stripe_customer_id) {
      try {
        const portalSession = await stripe.billingPortal.sessions.create({
          customer: user.stripe_customer_id,
          return_url: `${APP_URL}/pricing`,
        });
        return res.json({ url: portalSession.url });
      } catch (portalErr: any) {
        console.warn('Stripe portal error:', portalErr.message);
      }
    }

    // Fallback: direct to pricing page with current active plan
    return res.json({ url: '/pricing', simulated: true });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to open customer portal.' });
  }
});

// POST /api/stripe-webhook
app.post('/api/stripe-webhook', (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: any;

  if (stripe && webhookSecret && sig) {
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  } else {
    // If webhook secret not configured or simulated
    try {
      event = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    } catch (e) {
      return res.status(400).send('Invalid webhook payload');
    }
  }

  // Handle Stripe Webhook Events
  switch (event?.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const customerEmail = session.customer_email || session.customer_details?.email;
      const planId = session.metadata?.planId || 'solo';

      if (customerEmail) {
        const user = users.get(customerEmail.toLowerCase());
        if (user) {
          user.plan = planId;
          user.subscription_status = 'active';
          user.analyses_limit = planId === 'solo' ? 20 : -1;
          user.stripe_customer_id = session.customer;
          user.stripe_subscription_id = session.subscription;
          user.trial_ends_at = null;
        }
      }
      break;
    }

    case 'invoice.paid': {
      const invoice = event.data.object;
      const customerId = invoice.customer;
      for (const u of users.values()) {
        if (u.stripe_customer_id === customerId) {
          u.subscription_status = 'active';
          // Reset monthly counter on invoice renewal
          u.analyses_used = 0;
        }
      }
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object;
      const customerId = invoice.customer;
      for (const u of users.values()) {
        if (u.stripe_customer_id === customerId) {
          u.subscription_status = 'past_due';
        }
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object;
      const customerId = subscription.customer;
      for (const u of users.values()) {
        if (u.stripe_customer_id === customerId) {
          u.plan = 'free';
          u.analyses_limit = 3;
          u.subscription_status = 'canceled';
        }
      }
      break;
    }

    default:
      console.log(`Unhandled webhook event type: ${event?.type}`);
  }

  res.json({ received: true });
});

// =========================================================================
// AI ANALYSIS API (/api/analyze and /api/analyze-quotes)
// =========================================================================

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    analysis_metadata: {
      type: Type.OBJECT,
      properties: {
        number_of_quotes: { type: Type.INTEGER },
        carriers_detected: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        analysis_date: { type: Type.STRING },
        warnings: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
      },
      required: ['number_of_quotes', 'carriers_detected', 'analysis_date', 'warnings'],
    },
    carriers: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          carrier_name: { type: Type.STRING },
          policy_number: { type: Type.STRING },
          quote_date: { type: Type.STRING },
          effective_date: { type: Type.STRING },
          expiration_date: { type: Type.STRING },
          annual_premium: { type: Type.NUMBER },
          payment_terms: { type: Type.STRING },
          named_insured: { type: Type.STRING },
          business_description: { type: Type.STRING },
        },
        required: [
          'carrier_name',
          'policy_number',
          'quote_date',
          'effective_date',
          'expiration_date',
          'annual_premium',
          'payment_terms',
          'named_insured',
          'business_description',
        ],
      },
    },
    comparison_table: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          coverage_line: { type: Type.STRING },
          values: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                carrier_name: { type: Type.STRING },
                limit: { type: Type.STRING },
                deductible: { type: Type.STRING },
                notes: { type: Type.STRING },
              },
              required: ['carrier_name', 'limit', 'deductible', 'notes'],
            },
          },
        },
        required: ['coverage_line', 'values'],
      },
    },
    key_differences: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          topic: { type: Type.STRING },
          explanation: { type: Type.STRING },
          carriers_affected: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          why_it_matters: { type: Type.STRING },
        },
        required: ['topic', 'explanation', 'carriers_affected', 'why_it_matters'],
      },
    },
    missing_coverages: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          coverage: { type: Type.STRING },
          present_in: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          missing_in: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          risk_level: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
          recommendation: { type: Type.STRING },
        },
        required: ['coverage', 'present_in', 'missing_in', 'risk_level', 'recommendation'],
      },
    },
    red_flags: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          carrier_name: { type: Type.STRING },
          issue: { type: Type.STRING },
          page_reference: { type: Type.STRING },
          severity: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
          explanation: { type: Type.STRING },
        },
        required: ['carrier_name', 'issue', 'page_reference', 'severity', 'explanation'],
      },
    },
    premium_analysis: {
      type: Type.OBJECT,
      properties: {
        average_premium: { type: Type.NUMBER },
        highest_premium: {
          type: Type.OBJECT,
          properties: {
            carrier: { type: Type.STRING },
            amount: { type: Type.NUMBER },
          },
          required: ['carrier', 'amount'],
        },
        lowest_premium: {
          type: Type.OBJECT,
          properties: {
            carrier: { type: Type.STRING },
            amount: { type: Type.NUMBER },
          },
          required: ['carrier', 'amount'],
        },
        percentage_difference: { type: Type.NUMBER },
        commentary: { type: Type.STRING },
      },
      required: ['average_premium', 'highest_premium', 'lowest_premium', 'percentage_difference', 'commentary'],
    },
    questions_for_underwriter: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          carrier_name: { type: Type.STRING },
          question: { type: Type.STRING },
          reason: { type: Type.STRING },
        },
        required: ['carrier_name', 'question', 'reason'],
      },
    },
    client_summary_email: {
      type: Type.OBJECT,
      properties: {
        subject: { type: Type.STRING },
        body: { type: Type.STRING },
      },
      required: ['subject', 'body'],
    },
    agent_recommendation: {
      type: Type.OBJECT,
      properties: {
        best_overall_value: { type: Type.STRING },
        best_coverage: { type: Type.STRING },
        cheapest_option: { type: Type.STRING },
        reasoning: { type: Type.STRING },
      },
      required: ['best_overall_value', 'best_coverage', 'cheapest_option', 'reasoning'],
    },
  },
  required: [
    'analysis_metadata',
    'carriers',
    'comparison_table',
    'key_differences',
    'missing_coverages',
    'red_flags',
    'premium_analysis',
    'questions_for_underwriter',
    'client_summary_email',
    'agent_recommendation',
  ],
};

const SYSTEM_INSTRUCTION = `You are a senior commercial insurance analyst with 15+ years of experience at an independent insurance agency in the United States. You specialize in commercial lines: General Liability, Commercial Property, Commercial Auto, Workers' Compensation, Umbrella/Excess, and Professional Liability (E&O).

Your job: receive 2 to 5 commercial insurance quote PDFs/documents from different carriers and produce a clear, accurate, side-by-side comparison that an agency owner can send to a small-business client.

STRICT OPERATIONAL RULES:
1. Extract data ONLY from the provided documents. Never invent numbers or terms.
2. If a field is missing in a document, write "Not stated" — never guess.
3. Always cite the carrier name and page number when flagging an exclusion or red flag (e.g. "Page 4", "Page 8, Endorsement CG 21 34").
4. Use plain English a small-business owner can understand.
5. Never give legal or coverage advice. End every client-facing summary/email with the exact phrase:
   "PolicyLens provides informational comparisons only. Not legal or coverage advice. Verify all details with the carrier."
6. Flag any coverage that appears in one quote but is missing in another (e.g. Hired & Non-Owned Auto, Inland Marine/Tools Floater, Employee Benefits Liability, Liquor Liability, Cyber/E&O, Completed Operations).
7. Flag any exclusion that is unusual, broad, or potentially dangerous to the client (e.g., total pollution exclusion, assault & battery exclusion, subcontractor warranty/exclusion, classification limitation, action over/cross suits exclusion, hammer clause, restrictive retroactive dates).
8. Flag any deductible above $5,000 and any premium that is more than 25% higher or lower than the average of all quotes.
9. If the PDF or document is scanned/unreadable, state clearly in warnings: "This PDF appears to be scanned. Please upload a text-based PDF or a higher-resolution scan."
10. Output MUST be valid JSON strictly conforming to the requested schema. No markdown outside JSON.`;

// Core Analysis Handler
async function handleAnalyzeRequest(req: Request, res: Response) {
  try {
    const { quotes, clientName, agencyName, analystNotes, clientContext } = req.body;
    const user = getAuthenticatedUser(req);
    const userId = user?.id || req.ip || 'anonymous_guest';

    // 1. Validate File Count
    if (!Array.isArray(quotes) || quotes.length < 2 || quotes.length > 5) {
      return res.status(400).json({
        error: 'Please provide between 2 and 5 commercial quote PDFs for comparative analysis.',
      });
    }

    // 2. Validate User Plan Quota
    if (user && user.analyses_limit !== -1 && user.analyses_used >= user.analyses_limit) {
      return res.status(403).json({
        error: `Plan limit reached (${user.analyses_limit} analyses limit on ${user.plan} plan). Please upgrade your subscription to continue.`,
        code: 'PLAN_LIMIT_REACHED',
      });
    }

    // 3. Validate Rate Limits (5/hour, 20 PDFs/day)
    const rateLimitCheck = checkRateLimits(userId, quotes.length);
    if (!rateLimitCheck.allowed) {
      return res.status(429).json({
        error: rateLimitCheck.message,
        code: 'RATE_LIMIT_EXCEEDED',
      });
    }

    // 4. File Content Validation: Password & Format Checks
    for (let i = 0; i < quotes.length; i++) {
      const q = quotes[i];
      if (q.base64Data) {
        // Check for password encryption marker
        const decodedHeader = Buffer.from(q.base64Data.slice(0, 5000), 'base64').toString('latin1');
        if (decodedHeader.includes('/Encrypt')) {
          return res.status(400).json({
            error: `File "${q.fileName || `Quote ${i + 1}`}" is password-protected. Please upload an unprotected PDF.`,
          });
        }
      }
    }

    // 5. Build Multimodal Gemini Payload
    const contents: any[] = [];
    let promptContext = `Please perform a comprehensive commercial insurance comparative analysis for ${
      clientName ? `Client: "${clientName}"` : 'the commercial client'
    }${agencyName ? ` on behalf of Agency: "${agencyName}"` : ''}.
Analysis Date: ${new Date().toISOString().split('T')[0]}.
Number of quotes provided: ${quotes.length}.
${clientContext?.businessType ? `Business Type / Industry: ${clientContext.businessType}\n` : ''}${clientContext?.state ? `Operating State(s): ${clientContext.state}\n` : ''}${clientContext?.revenue ? `Annual Revenue: ${clientContext.revenue}\n` : ''}${clientContext?.employees ? `Number of Employees: ${clientContext.employees}\n` : ''}${clientContext?.priorities ? `Client Priorities: ${clientContext.priorities}\n` : ''}${analystNotes ? `Agent/Analyst Context Notes: ${analystNotes}\n` : ''}

Here are the ${quotes.length} insurance quote documents to analyze:
`;

    contents.push({ text: promptContext });

    for (let i = 0; i < quotes.length; i++) {
      const q = quotes[i];
      const quoteHeader = `\n--- QUOTE #${i + 1}: Carrier: ${q.carrierName || `Carrier ${i + 1}`} (File: ${q.fileName || `quote_${i + 1}`}) ---\n`;
      contents.push({ text: quoteHeader });

      if (q.base64Data && q.fileType?.includes('pdf')) {
        contents.push({
          inlineData: {
            mimeType: 'application/pdf',
            data: q.base64Data.replace(/^data:application\/pdf;base64,/, ''),
          },
        });
      } else if (q.textContent) {
        contents.push({
          text: q.textContent,
        });
      } else {
        contents.push({
          text: `[Carrier ${q.carrierName || i + 1} quote details]`,
        });
      }
    }

    contents.push({
      text: `\nCarefully review all pages, endorsements, dec sheets, coverage schedules, exclusions, and limits of each quote. Follow all 10 rules. Produce the complete JSON response matching the schema.`,
    });

    // 6. Call Gemini API with automatic 1-time retry on transient network error
    let response: any;
    try {
      response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: { parts: contents },
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          responseMimeType: 'application/json',
          responseSchema: analysisSchema,
          temperature: 0.15,
        },
      });
    } catch (primaryError: any) {
      console.warn('Initial Gemini call failed, retrying once...', primaryError.message);
      // Wait 1.5s then retry
      await new Promise((r) => setTimeout(r, 1500));
      response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: { parts: contents },
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          responseMimeType: 'application/json',
          responseSchema: analysisSchema,
          temperature: 0.15,
        },
      });
    }

    const text = response.text;
    if (!text) {
      throw new Error('No content returned from AI model.');
    }

    const parsedJson = JSON.parse(text);

    // 7. Update usage metrics & log
    recordUsage(userId, quotes.length);
    if (user) {
      user.analyses_used = (user.analyses_used || 0) + 1;
    }

    const logItem: AnalysisLogRecord = {
      id: 'log_' + Date.now(),
      user_id: user?.id || 'guest',
      user_email: user?.email || 'guest@example.com',
      timestamp: new Date().toISOString(),
      carriers_count: quotes.length,
      carriers: quotes.map((q: any) => q.carrierName || 'Carrier'),
      token_count: text.length / 4,
      status: 'success',
    };
    analysisLogs.unshift(logItem);
    if (analysisLogs.length > 100) analysisLogs.pop();

    return res.json({
      success: true,
      data: parsedJson,
    });
  } catch (error: any) {
    console.error('PolicyLens analysis error:', error);
    errorLogs.unshift({
      id: 'err_' + Date.now(),
      timestamp: new Date().toISOString(),
      type: 'ANALYSIS_ERROR',
      message: error?.message || 'Unknown processing error',
      user_email: req.body?.customerEmail,
    });
    if (errorLogs.length > 100) errorLogs.pop();

    return res.status(500).json({
      error: error?.message || 'Failed to complete comparative quote analysis. Please try again.',
      supportUrl: 'mailto:support@policylens.ai',
    });
  }
}

// Routes for analysis
app.post('/api/analyze', handleAnalyzeRequest);
app.post('/api/analyze-quotes', handleAnalyzeRequest);

// =========================================================================
// ADMIN DASHBOARD ROUTES (/api/admin/*)
// =========================================================================

app.get('/api/admin/stats', (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access denied. Email not authorized.' });
  }

  const allUsersList = Array.from(users.values());
  const activeSubs = allUsersList.filter(
    (u) => u.plan !== 'free' && (u.subscription_status === 'active' || u.subscription_status === 'trialing')
  );

  // Calculate MRR
  const mrr = allUsersList.reduce((acc, u) => {
    if (u.plan === 'solo') return acc + 99;
    if (u.plan === 'agency') return acc + 299;
    if (u.plan === 'enterprise') return acc + 799;
    return acc;
  }, 0);

  const churnRate = 2.4; // Sample churn metric

  return res.json({
    totalUsers: allUsersList.length,
    activeSubscriptions: activeSubs.length,
    mrr,
    churnRate,
    recentSignups: allUsersList.slice(-10).reverse().map((u) => ({
      id: u.id,
      email: u.email,
      name: u.name,
      plan: u.plan,
      created_at: u.created_at,
      status: u.subscription_status,
      analyses_used: u.analyses_used,
    })),
    recentAnalyses: analysisLogs.slice(0, 15),
    errorLogs: errorLogs.slice(0, 15),
  });
});

// POST /api/admin/override-plan
app.post('/api/admin/override-plan', (req: Request, res: Response) => {
  const admin = getAuthenticatedUser(req);
  if (!admin || admin.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required.' });
  }

  const { targetEmail, newPlan, newLimit } = req.body;
  const user = users.get((targetEmail || '').toLowerCase());
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  user.plan = newPlan;
  user.analyses_limit = newLimit ?? (newPlan === 'free' ? 3 : newPlan === 'solo' ? 20 : -1);
  user.subscription_status = 'active';

  return res.json({
    success: true,
    message: `Plan for ${user.email} updated to ${newPlan} with limit ${user.analyses_limit}.`,
  });
});

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    app: 'PolicyLens',
    stripeConfigured: isStripeConfigured,
    timestamp: new Date().toISOString(),
  });
});

// Configure Vite middleware in development or static serving in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`PolicyLens server running at http://0.0.0.0:${port}`);
  });
}

startServer();
