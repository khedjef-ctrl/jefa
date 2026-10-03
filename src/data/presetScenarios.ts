import { QuotePresetScenario, CommercialAnalysisOutput } from '../types/insurance';

export const PRESET_SCENARIOS: QuotePresetScenario[] = [
  {
    id: 'contractor-hvac',
    title: 'HVAC & Mechanical Services (Apex Mechanical LLC)',
    businessType: 'Commercial HVAC, Refrigeration & Piping Contractor',
    namedInsured: 'Apex Mechanical Solutions, LLC',
    description: '3 commercial quotes comparing General Liability, Tools/Inland Marine, and Commercial Auto with critical subcontractor warranty traps and water damage deductibles.',
    quotes: [
      {
        id: 'quote-trv-1',
        carrierName: 'Travelers Property Casualty of America',
        fileName: 'Travelers_Quote_TRV-89421-2026.pdf',
        fileType: 'application/pdf',
        fileSize: '412 KB',
        isPreset: true,
        textContent: `TRAVELERS INSURANCE COMPANY
COMMERCIAL LINES QUOTE DECLARATIONS
QUOTE NUMBER: TRV-89421-2026
NAMED INSURED: Apex Mechanical Solutions, LLC
MAILING ADDRESS: 1420 Industrial Parkway, Suite 300, Columbus, OH 43215
BUSINESS DESCRIPTION: Commercial Heating, Ventilation, Air Conditioning & Refrigeration Contractor (Class Code: 91560)
POLICY PERIOD: Effective 11/01/2026 to 11/01/2027 (12:01 AM Standard Time)
TOTAL ANNUAL ESTIMATED PREMIUM: $14,250.00
PAYMENT TERMS: 20% down ($2,850.00) + 9 monthly installments of $1,266.67 (EFT available)

PAGE 2 - COVERAGES AND LIMITS OF INSURANCE
COMMERCIAL GENERAL LIABILITY (Occurrence Form CG 00 01 04 13):
- Each Occurrence Limit: $1,000,000
- General Aggregate Limit: $2,000,000 (Per Project Aggregate Endorsement CG 25 03 included)
- Products/Completed Operations Aggregate: $2,000,000
- Personal & Advertising Injury Limit: $1,000,000
- Damage to Premises Rented to You: $300,000 Any One Premises
- Medical Expense Limit: $10,000 Any One Person
- Employee Benefits Liability: $1,000,000 ($1,000 deductible)

PAGE 3 - INLAND MARINE / CONTRACTORS EQUIPMENT FLOATER:
- Scheduled Equipment Limit: $150,000
- Unscheduled Tools & Equipment: $25,000 ($2,500 maximum any one tool)
- Deductible: $1,000 per occurrence

PAGE 4 - DEDUCTIBLES & SPECIAL CONDITIONS:
- General Liability Property Damage Deductible: $1,000 per claim.
- CRITICAL ENDORSEMENT TRV-PD-99: Property Damage to Work in Progress and Water Intrusion Deductible is $10,000 per occurrence for any plumbing or HVAC piping water leakage claims occurring during installation.

PAGE 5 - EXTENSIONS & ENDORSEMENTS:
- Travelers Contractor XTEND Endorsement: Includes Blanket Additional Insured (CG 20 10 / CG 20 37 ongoing & completed ops), Blanket Waiver of Subrogation, Primary and Non-Contributory wording.
- Hired & Non-Owned Auto Liability: $1,000,000 Combined Single Limit (Included).

PAGE 7 - NOTABLE EXCLUSIONS:
- Standard ISO Pollution Exclusion with standard HVAC friendly heating equipment exception.
- Asbestos & Silica Total Exclusion.
- Fungi or Bacteria Exclusion.`,
      },
      {
        id: 'quote-hft-2',
        carrierName: 'The Hartford Insurance Group',
        fileName: 'Hartford_Quote_HFT-99120-GL.pdf',
        fileType: 'application/pdf',
        fileSize: '368 KB',
        isPreset: true,
        textContent: `THE HARTFORD UNDERWRITING GROUP
COMMERCIAL POLICY QUOTE PROPOSAL
QUOTE NUMBER: HFT-99120-GL
NAMED INSURED: Apex Mechanical Solutions, LLC
POLICY TERM: 11/01/2026 to 11/01/2027
ANNUAL ESTIMATED PREMIUM: $11,800.00
PAYMENT TERMS: Annual Pay or 10-Pay ($1,180.00/mo) via Hartford Direct Bill

PAGE 1 - SUMMARY OF COVERAGE
COMMERCIAL GENERAL LIABILITY (Form HC 00 01):
- Each Occurrence: $1,000,000
- General Aggregate: $2,000,000
- Products/Completed Operations Aggregate: $1,000,000 (Note: lower aggregate than other quotes)
- Personal & Advertising Injury: $1,000,000
- Damage to Rented Premises: $100,000
- Medical Payments: $5,000
- Deductible: $2,500 per claim (Bodily Injury & Property Damage)

PAGE 3 - CONTRACTOR'S EQUIPMENT:
- Blanket Equipment & Tools: $50,000 ($1,000 deductible)

PAGE 6 - CRITICAL EXCLUSION ENDORSEMENT CG 21 34:
- TOTAL POLLUTION EXCLUSION WITH ABUSE EXCLUSION: Carrier modifies standard definition. Does NOT contain exception for smoke or fumes from heating equipment. Any refrigerant leakage (Freon, R-410A) or carbon monoxide claim is strictly excluded from coverage.

PAGE 8 - CONDITIONAL ENDORSEMENT HG 22 19 (SUBCONTRACTOR WARRANTY):
- "WARRANTY: Coverage under this policy does NOT apply to any injury or damage arising out of operations performed for you by independent contractors or subcontractors, UNLESS you have secured prior written hold harmless agreements AND certificates of insurance showing minimum $1,000,000 limits naming you as additional insured with waiver of subrogation prior to commencement of work."
- Failure to maintain these certificates results in complete denial of coverage for subcontractor-related losses!

PAGE 9 - ADDITIONAL COVERAGE NOTES:
- Hired & Non-Owned Auto: Not included in this quote (must be written under separate commercial auto).
- Cyber Suite: $50,000 sublimit included.`,
      },
      {
        id: 'quote-lm-3',
        carrierName: 'Liberty Mutual Commercial Lines',
        fileName: 'Liberty_Mutual_Quote_LM-44029-BOP.pdf',
        fileType: 'application/pdf',
        fileSize: '512 KB',
        isPreset: true,
        textContent: `LIBERTY MUTUAL INSURANCE
COMMERCIAL PACKAGE & UMBRELLA QUOTE
QUOTE NUMBER: LM-44029-BOP
NAMED INSURED: Apex Mechanical Solutions, LLC
EFFECTIVE DATE: 11/01/2026 to 11/01/2027
ANNUAL ESTIMATED PREMIUM: $17,900.00
PAYMENT TERMS: 25% down ($4,475.00), 3 quarterly installments of $4,475.00

PAGE 2 - COMMERCIAL GENERAL LIABILITY:
- Each Occurrence: $2,000,000
- General Aggregate: $4,000,000
- Products & Completed Operations Aggregate: $4,000,000
- Personal & Advertising Injury: $2,000,000
- Damage to Rented Premises: $500,000
- Medical Payments: $10,000
- General Liability Deductible: $5,000 Per Occurrence

PAGE 4 - COMMERCIAL UMBRELLA / EXCESS LIABILITY:
- Each Occurrence Limit: $2,000,000
- Aggregate Limit: $2,000,000
- Underlying covers General Liability ($2M/$4M) and Hired/Non-Owned Auto ($1M).
- Self-Insured Retention (SIR): $0

PAGE 5 - INLAND MARINE / CONTRACTORS EQUIPMENT:
- Rented & Leased Equipment: $100,000
- Scheduled Equipment: $175,000
- Employee Tools: $30,000
- Deductible: $1,000

PAGE 6 - COMMERCIAL AUTO (HIRED & NON-OWNED):
- Liability Limit: $1,000,000 CSL

PAGE 8 - ENDORSEMENTS & EXCLUSIONS:
- Blanket Additional Insured for Construction Contracts.
- Subcontractor Coverage: Standard coverage with favorable audit warranty (no strict warranty forfeiture clause).
- Pollution: Standard ISO pollution wording with full HVAC hostile fire / HVAC equipment heating exception.`,
      },
    ],
  },
  {
    id: 'hospitality-restaurant',
    title: 'Restaurant & Craft Tavern (Harbor & Hearth LLC)',
    businessType: 'Upscale Casual Dining Restaurant & Full Bar',
    namedInsured: 'Harbor & Hearth Hospitality, LLC',
    description: '3 restaurant quotes examining Liquor Liability, Assault & Battery exclusions, Food Spoilage sublimits, and Wind/Hail property deductibles.',
    quotes: [
      {
        id: 'quote-chubb-1',
        carrierName: 'Chubb Custom Insurance',
        fileName: 'Chubb_Quote_CHB-30911-PKG.pdf',
        fileType: 'application/pdf',
        fileSize: '488 KB',
        isPreset: true,
        textContent: `CHUBB COMMERCIAL INSURANCE
HOSPITALITY PACKAGE POLICY QUOTE
QUOTE NUMBER: CHB-30911-PKG
NAMED INSURED: Harbor & Hearth Hospitality, LLC
LOCATION: 742 Ocean Boulevard, Portsmouth, NH 03801
BUSINESS: Full Service Restaurant & Bar (40% alcohol receipts)
TERM: 12/01/2026 to 12/01/2027
ANNUAL PREMIUM: $22,400.00
PAYMENT TERMS: Quarterly Equal Payments ($5,600.00/qtr) or 10-Pay direct debit

PAGE 2 - COMMERCIAL GENERAL LIABILITY:
- Each Occurrence: $1,000,000
- General Aggregate: $2,000,000
- Products/Completed Operations Aggregate: $2,000,000
- Personal & Advertising Injury: $1,000,000
- Damage to Rented Premises: $1,000,000
- Medical Expense: $10,000
- GL Deductible: $0 (No deductible on General Liability)

PAGE 3 - LIQUOR LIABILITY COVERAGE:
- Each Common Cause: $1,000,000
- Aggregate Limit: $2,000,000
- Deductible: $0

PAGE 4 - PROPERTY & BUSINESS INTERRUPTION:
- Building: Not covered (Tenant occupies leased space)
- Business Personal Property (BPP): $450,000 (Replacement Cost)
- Business Income & Extra Expense: Actual Loss Sustained (12 Months)
- Food Spoilage & Contamination: $100,000
- Utility Services - Direct Damage & Time Element: $75,000
- Property Deductible: $2,500 All Other Perils
- WIND/HAIL DEDUCTIBLE: Page 5 Endorsement: $7,500 Named Storm / Coastal Windstorm Deductible per occurrence.

PAGE 6 - SECURITY & ASSAULT & BATTERY:
- Assault & Battery: Full policy limits ($1,000,000) included without sublimit.`,
      },
      {
        id: 'quote-cna-2',
        carrierName: 'CNA Commercial Insurance',
        fileName: 'CNA_Quote_CNA-88410-PKG.pdf',
        fileType: 'application/pdf',
        fileSize: '395 KB',
        isPreset: true,
        textContent: `CNA COMMERCIAL INSURANCE
RESTAURANT CHOICE QUOTE
QUOTE NUMBER: CNA-88410-PKG
NAMED INSURED: Harbor & Hearth Hospitality, LLC
POLICY DATES: 12/01/2026 to 12/01/2027
ANNUAL PREMIUM: $16,800.00
PAYMENT TERMS: 20% down + 8 monthly payments

PAGE 1 - GENERAL LIABILITY:
- Each Occurrence: $1,000,000
- General Aggregate: $2,000,000
- Products/Completed Ops: $2,000,000
- Medical Payments: $5,000
- Deductible: $1,000

PAGE 3 - PROPERTY COVERAGE:
- Business Personal Property: $400,000 ($2,500 deductible)
- Business Income: $250,000 (Limited period of indemnity - not ALS)
- Food Spoilage: $25,000
- Water Backup of Sewers and Drains: $25,000

PAGE 7 - CRITICAL GAP: LIQUOR LIABILITY
- "Liquor Liability Coverage is NOT PROVIDED under this policy. An exclusion endorsement CG 21 55 is attached to General Liability. Insured sells alcoholic beverages and must obtain a separate monoline liquor policy or pay additional $4,200 endorsement fee."

PAGE 9 - RED FLAG ENDORSEMENT EX-AB-01:
- "ABSOLUTE ASSAULT AND BATTERY EXCLUSION: This insurance does not apply to any claim arising out of assault, battery, disorderly conduct, or physical altercations, whether caused by employees, patrons, bouncers, or third parties, including any failure to provide adequate security, failure to protect patrons, or negligent hiring and supervision."`,
      },
      {
        id: 'quote-amt-3',
        carrierName: 'AmTrust Financial Services',
        fileName: 'AmTrust_Quote_AMT-55102-GL.pdf',
        fileType: 'application/pdf',
        fileSize: '320 KB',
        isPreset: true,
        textContent: `AMTRUST FINANCIAL
SPECIALTY RESTAURANT & TAVERN QUOTE
QUOTE NUMBER: AMT-55102-GL
NAMED INSURED: Harbor & Hearth Hospitality, LLC
DATES: 12/01/2026 to 12/01/2027
ANNUAL PREMIUM: $13,200.00
PAYMENT TERMS: Monthly EFT 12-Pay ($1,100.00/month)

PAGE 1 - GENERAL LIABILITY:
- Each Occurrence: $1,000,000
- General Aggregate: $2,000,000
- Products-Completed Ops: $2,000,000
- Damage to Rented Premises: $100,000
- Deductible: $1,000

PAGE 2 - LIQUOR LIABILITY:
- Each Common Cause: $500,000 (Sublimited)
- Aggregate: $1,000,000

PAGE 3 - PROPERTY SCHEDULE:
- Business Personal Property: $350,000
- Food Spoilage: $5,000 (Extremely low sublimit for restaurant holding $40k+ fresh seafood inventory)
- Deductible: $2,500

PAGE 4 - DANGEROUS RED FLAG / CLASSIFICATION LIMITATION:
- "Endorsement AMT-CLS-99: Restrictive Operating Warranty. Coverage is strictly conditioned on the business operating as a dining establishment closing no later than 11:00 PM on all days, with NO live amplified music, NO DJ, and NO dedicated security personnel/doormen. Any loss occurring after 11:00 PM or during live musical entertainment is completely voided from coverage."`,
      },
    ],
  },
  {
    id: 'technology-saas',
    title: 'HealthTech SaaS (Vertex Digital Health)',
    businessType: 'Healthcare Data Management & Telehealth SaaS Platform',
    namedInsured: 'Vertex Digital Health Systems, Inc.',
    description: '3 professional liability quotes comparing Tech E&O, Cyber/Data Breach, and General Liability with retroactive date traps and $10k tech deductibles.',
    quotes: [
      {
        id: 'quote-hiscox-1',
        carrierName: 'Hiscox Insurance Company',
        fileName: 'Hiscox_Quote_HIS-67210-EO.pdf',
        fileType: 'application/pdf',
        fileSize: '380 KB',
        isPreset: true,
        textContent: `HISCOX PRO TECHNOLOGY & CYBER QUOTE
QUOTE NUMBER: HIS-67210-EO
NAMED INSURED: Vertex Digital Health Systems, Inc.
INDUSTRY: Telehealth Software Provider / Medical IT
EFFECTIVE: 01/15/2027 to 01/15/2028
ANNUAL PREMIUM: $9,600.00
PAYMENT TERMS: Annual in full or 4 quarterly payments of $2,400.00

PAGE 1 - TECHNOLOGY ERRORS & OMISSIONS:
- Each Claim Limit: $2,000,000
- Aggregate Limit: $2,000,000
- Retention / Deductible: $5,000 each claim
- Retroactive Date: Full Prior Acts (Coverage covers acts occurring since company inception in 2021)

PAGE 2 - INFORMATION SECURITY & PRIVACY (CYBER) LIABILITY:
- Privacy & Network Security: $1,000,000
- Regulatory Defense & Penalties (HIPAA / GDPR): $1,000,000
- Breach Response Costs (Forensics, Notifications, ID monitoring): $1,000,000
- Cyber Extortion / Ransomware: $500,000 ($5,000 deductible)

PAGE 3 - GENERAL LIABILITY:
- Each Occurrence: $1,000,000
- General Aggregate: $2,000,000
- Damage to Rented Premises: $500,000
- Deductible: $0

PAGE 4 - CONTRACTUAL LIABILITY:
- Contractual indemnification coverage included for technology service agreements.`,
      },
      {
        id: 'quote-hanover-2',
        carrierName: 'The Hanover Insurance Company',
        fileName: 'Hanover_Quote_HAN-44120-TECH.pdf',
        fileType: 'application/pdf',
        fileSize: '425 KB',
        isPreset: true,
        textContent: `THE HANOVER INSURANCE GROUP
HANOVER TECH ADVANTAGE PROPOSAL
QUOTE NUMBER: HAN-44120-TECH
NAMED INSURED: Vertex Digital Health Systems, Inc.
TERM: 01/15/2027 to 01/15/2028
ANNUAL PREMIUM: $12,400.00
PAYMENT TERMS: 10-Pay direct bill ($1,240.00/mo)

PAGE 2 - COVERAGE LIMITS:
- Technology E&O Limit: $3,000,000
- Cyber Liability Limit: $2,000,000
- General Liability: $1,000,000 / $2,000,000
- Worldwide Territory Coverage: Included

PAGE 4 - DEDUCTIBLE RED FLAG:
- Technology E&O Deductible: $10,000 per claim (Exceeds standard $5,000 agency threshold).
- Cyber Breach Retention: $10,000.

PAGE 5 - HAMMER CLAUSE CONDITION:
- Endorsement HAN-881: 50/50 Settlement Clause (Insured liability capped if insured refuses carrier settlement recommendation).

PAGE 7 - RETROACTIVE DATE:
- Retroactive Date: 01/15/2021 (Maintains full historical coverage continuity).`,
      },
      {
        id: 'quote-phl-3',
        carrierName: 'Philadelphia Insurance Companies (PHLY)',
        fileName: 'PHLY_Quote_PHL-90234-PI.pdf',
        fileType: 'application/pdf',
        fileSize: '310 KB',
        isPreset: true,
        textContent: `PHILADELPHIA INSURANCE COMPANIES
MISCELLANEOUS E&O AND CYBER SECURITY
QUOTE NUMBER: PHL-90234-PI
NAMED INSURED: Vertex Digital Health Systems, Inc.
POLICY DATES: 01/15/2027 to 01/15/2028
ANNUAL PREMIUM: $7,100.00 (-28% below multi-quote average)
PAYMENT TERMS: Single Pay or 2-Pay ($3,550.00 x 2)

PAGE 1 - LIMITS OF LIABILITY:
- Technology Errors & Omissions: $1,000,000 Each Claim / $1,000,000 Aggregate
- Cyber Liability: Sublimited to $250,000
- General Liability: $1,000,000 Occurrence / $2,000,000 Aggregate
- Deductible: $2,500

PAGE 7 - CRITICAL RED FLAG - RETROACTIVE DATE:
- "RETROACTIVE DATE: 01/15/2027 (INCEPTION ONLY). This policy only provides coverage for wrongful acts committed on or after the effective date of this policy. All acts, software code written, and services rendered prior to 01/15/2027 are completely excluded from coverage!"
- High severity trap: Client has been operating since 2021; switching to this quote will forfeit coverage for past 6 years of client software deployments!

PAGE 11 - CONTRACTUAL LIABILITY RESTRICTION:
- Endorsement PI-EX-12: Total exclusion for liability assumed under any contract or agreement that exceeds common law negligence.`,
      },
    ],
  },
];
