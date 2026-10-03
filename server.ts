import express, { Request, Response } from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Increase payload limits for PDF base64 uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

export interface UploadedQuote {
  id: string;
  carrierName: string;
  fileName: string;
  fileType: string;
  base64Data?: string;
  textContent?: string;
}

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
   "This comparison is for informational purposes only. Coverage is subject to the actual policy wording. Please confirm all details with your agent."
6. Flag any coverage that appears in one quote but is missing in another (e.g. Hired & Non-Owned Auto, Inland Marine/Tools Floater, Employee Benefits Liability, Liquor Liability, Cyber/E&O, Completed Operations).
7. Flag any exclusion that is unusual, broad, or potentially dangerous to the client (e.g., total pollution exclusion, assault & battery exclusion, subcontractor warranty/exclusion, classification limitation, action over/cross suits exclusion, hammer clause, restrictive retroactive dates).
8. Flag any deductible above $5,000 and any premium that is more than 25% higher or lower than the average of all quotes.
9. If the PDF or document is scanned/unreadable, state clearly in warnings: "Document unreadable — please provide a text-based PDF or higher-resolution scan."
10. Output MUST be valid JSON strictly conforming to the requested schema. No markdown outside JSON.`;

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Analyze quotes endpoint
app.post('/api/analyze-quotes', async (req: Request, res: Response) => {
  try {
    const { quotes, clientName, agencyName, analystNotes, clientContext } = req.body;

    if (!Array.isArray(quotes) || quotes.length < 2 || quotes.length > 5) {
      return res.status(400).json({
        error: 'Please provide between 2 and 5 insurance quotes for comparative analysis.',
      });
    }

    const contents: any[] = [];

    // Context preamble
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
      const q = quotes[i] as UploadedQuote;
      const quoteHeader = `\n--- QUOTE #${i + 1}: Carrier: ${q.carrierName || `Carrier ${i + 1}`} (File: ${q.fileName || `quote_${i + 1}`}) ---\n`;
      contents.push({ text: quoteHeader });

      if (q.base64Data && q.fileType?.includes('pdf')) {
        // Send base64 PDF inline data part
        contents.push({
          inlineData: {
            mimeType: 'application/pdf',
            data: q.base64Data.replace(/^data:application\/pdf;base64,/, ''),
          },
        });
      } else if (q.base64Data && q.fileType?.startsWith('image/')) {
        contents.push({
          inlineData: {
            mimeType: q.fileType,
            data: q.base64Data.replace(/^data:image\/[a-zA-Z]+;base64,/, ''),
          },
        });
      } else if (q.textContent) {
        contents.push({
          text: q.textContent,
        });
      } else {
        contents.push({
          text: `[Carrier ${q.carrierName || i + 1} document details provided in plain text/summary]`,
        });
      }
    }

    contents.push({
      text: `\nCarefully review all pages, endorsements, dec sheets, coverage schedules, exclusions, and limits of each quote. Follow all 10 rules. Produce the complete JSON response matching the schema.`,
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: { parts: contents },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: analysisSchema,
        temperature: 0.2, // Low temperature for high precision factual extraction
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('No response generated by model');
    }

    const parsedJson = JSON.parse(text);
    return res.json({
      success: true,
      data: parsedJson,
    });
  } catch (error: any) {
    console.error('Error analyzing quotes:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to complete commercial quote comparative analysis.',
    });
  }
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
    console.log(`Commercial Insurance Analysis Studio server running on http://0.0.0.0:${port}`);
  });
}

startServer();
