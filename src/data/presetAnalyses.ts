import { CommercialAnalysisOutput } from '../types/insurance';

export const CONTRACTOR_ANALYSIS: CommercialAnalysisOutput = {
  analysis_metadata: {
    number_of_quotes: 3,
    carriers_detected: [
      'Travelers Property Casualty of America',
      'The Hartford Insurance Group',
      'Liberty Mutual Commercial Lines',
    ],
    analysis_date: '2026-10-03',
    warnings: [
      'Hartford quote contains a strict Subcontractor Warranty (Endorsement HG 22 19) that voids coverage if written agreements and $1M certificates are not maintained before work starts.',
      'Travelers imposes an elevated $10,000 Property Damage deductible for plumbing/HVAC water intrusion claims (Page 4).',
      'Hartford premium is 19.5% below average, while Liberty Mutual is 22.2% above average due to bundled $2,000,000 Umbrella coverage.',
    ],
  },
  carriers: [
    {
      carrier_name: 'Travelers Property Casualty of America',
      policy_number: 'TRV-89421-2026',
      quote_date: 'Not stated',
      effective_date: '11/01/2026',
      expiration_date: '11/01/2027',
      annual_premium: 14250,
      payment_terms: '20% down ($2,850.00) + 9 monthly installments of $1,266.67 via EFT',
      named_insured: 'Apex Mechanical Solutions, LLC',
      business_description: 'Commercial Heating, Ventilation, Air Conditioning & Refrigeration Contractor (Class Code: 91560)',
    },
    {
      carrier_name: 'The Hartford Insurance Group',
      policy_number: 'HFT-99120-GL',
      quote_date: 'Not stated',
      effective_date: '11/01/2026',
      expiration_date: '11/01/2027',
      annual_premium: 11800,
      payment_terms: 'Annual Pay or 10-Pay ($1,180.00/mo) direct bill',
      named_insured: 'Apex Mechanical Solutions, LLC',
      business_description: 'Commercial HVAC & Mechanical Contractor',
    },
    {
      carrier_name: 'Liberty Mutual Commercial Lines',
      policy_number: 'LM-44029-BOP',
      quote_date: 'Not stated',
      effective_date: '11/01/2026',
      expiration_date: '11/01/2027',
      annual_premium: 17900,
      payment_terms: '25% down ($4,475.00), 3 quarterly installments of $4,475.00',
      named_insured: 'Apex Mechanical Solutions, LLC',
      business_description: 'Commercial HVAC & Mechanical Contractor',
    },
  ],
  comparison_table: [
    {
      coverage_line: 'General Liability: Each Occurrence',
      values: [
        {
          carrier_name: 'Travelers Property Casualty of America',
          limit: '$1,000,000',
          deductible: '$1,000 ($10,000 on water damage)',
          notes: 'Standard industry limit for commercial trade contractors.',
        },
        {
          carrier_name: 'The Hartford Insurance Group',
          limit: '$1,000,000',
          deductible: '$2,500',
          notes: 'Applies per claim to BI and PD.',
        },
        {
          carrier_name: 'Liberty Mutual Commercial Lines',
          limit: '$2,000,000',
          deductible: '$5,000',
          notes: 'Double the per-occurrence limit of competitors; deductible flagged at $5k threshold.',
        },
      ],
    },
    {
      coverage_line: 'General Aggregate Limit',
      values: [
        {
          carrier_name: 'Travelers Property Casualty of America',
          limit: '$2,000,000',
          deductible: 'N/A',
          notes: 'Includes Per-Project Aggregate Endorsement CG 25 03.',
        },
        {
          carrier_name: 'The Hartford Insurance Group',
          limit: '$2,000,000',
          deductible: 'N/A',
          notes: 'Standard general aggregate.',
        },
        {
          carrier_name: 'Liberty Mutual Commercial Lines',
          limit: '$4,000,000',
          deductible: 'N/A',
          notes: 'Enhanced package aggregate.',
        },
      ],
    },
    {
      coverage_line: 'Products / Completed Operations Aggregate',
      values: [
        {
          carrier_name: 'Travelers Property Casualty of America',
          limit: '$2,000,000',
          deductible: 'N/A',
          notes: 'Crucial for HVAC contractors after installations are finalized.',
        },
        {
          carrier_name: 'The Hartford Insurance Group',
          limit: '$1,000,000',
          deductible: 'N/A',
          notes: 'Substantially lower completed operations protection ($1M vs $2M/$4M).',
        },
        {
          carrier_name: 'Liberty Mutual Commercial Lines',
          limit: '$4,000,000',
          deductible: 'N/A',
          notes: 'Comprehensive completed operations coverage.',
        },
      ],
    },
    {
      coverage_line: 'Commercial Umbrella / Excess Liability',
      values: [
        {
          carrier_name: 'Travelers Property Casualty of America',
          limit: 'Not stated',
          deductible: 'Not stated',
          notes: 'Not included in quote; must be quoted separately.',
        },
        {
          carrier_name: 'The Hartford Insurance Group',
          limit: 'Not stated',
          deductible: 'Not stated',
          notes: 'Not included in quote.',
        },
        {
          carrier_name: 'Liberty Mutual Commercial Lines',
          limit: '$2,000,000 Occ / $2,000,000 Agg',
          deductible: '$0 SIR',
          notes: 'Includes $2M umbrella excess over GL and Hired/Non-Owned Auto.',
        },
      ],
    },
    {
      coverage_line: 'Inland Marine / Contractors Tools & Equipment',
      values: [
        {
          carrier_name: 'Travelers Property Casualty of America',
          limit: '$150,000 Scheduled / $25,000 Unscheduled',
          deductible: '$1,000',
          notes: 'Full tools and equipment schedule with $2,500 any one tool.',
        },
        {
          carrier_name: 'The Hartford Insurance Group',
          limit: '$50,000 Blanket Equipment',
          deductible: '$1,000',
          notes: 'Significantly lower limit ($50k vs $150k+).',
        },
        {
          carrier_name: 'Liberty Mutual Commercial Lines',
          limit: '$175,000 Scheduled + $100k Rented Equipment + $30k Tools',
          deductible: '$1,000',
          notes: 'Highest equipment protection, covers rented scissor lifts/heavy equipment.',
        },
      ],
    },
    {
      coverage_line: 'Hired & Non-Owned Auto Liability',
      values: [
        {
          carrier_name: 'Travelers Property Casualty of America',
          limit: '$1,000,000 CSL',
          deductible: '$0',
          notes: 'Included in Contractor XTEND package.',
        },
        {
          carrier_name: 'The Hartford Insurance Group',
          limit: 'Not stated (Excluded)',
          deductible: 'Not stated',
          notes: 'Missing from quote; exposes company when employees drive personal vehicles.',
        },
        {
          carrier_name: 'Liberty Mutual Commercial Lines',
          limit: '$1,000,000 CSL',
          deductible: '$0',
          notes: 'Included and scheduled under umbrella.',
        },
      ],
    },
  ],
  key_differences: [
    {
      topic: 'Subcontractor Liability & Documentation Warranty',
      explanation:
        'The Hartford policy attaches Endorsement HG 22 19, which completely bars coverage for any injury or property damage caused by a subcontractor unless the insured secured written hold-harmless agreements and $1,000,000 certificates before work started. Travelers and Liberty Mutual do not include this severe forfeiture warranty.',
      carriers_affected: ['The Hartford Insurance Group'],
      why_it_matters:
        'If Apex hires a sheet metal or electrical subcontractor and paperwork is delayed or missing, a major jobsite loss will be completely uninsured under The Hartford.',
    },
    {
      topic: 'Water Intrusion & Plumbing Deductible Trap',
      explanation:
        'Travelers attaches endorsement TRV-PD-99 establishing a $10,000 deductible specifically for property damage arising from water leakage or pipe intrusion during mechanical installation, whereas normal claims have a $1,000 deductible.',
      carriers_affected: ['Travelers Property Casualty of America'],
      why_it_matters:
        'HVAC and commercial refrigeration contractors face frequent water leak claims from condensate lines or piping. A $10,000 out-of-pocket hit per claim represents significant financial exposure.',
    },
    {
      topic: 'Commercial Umbrella & Excess Limits Inclusion',
      explanation:
        'Liberty Mutual includes an integrated $2,000,000 Commercial Umbrella policy sitting over $2,000,000/$4,000,000 GL limits, giving $4M per occurrence total protection. Travelers and Hartford are standalone $1M policies without excess coverage.',
      carriers_affected: ['Liberty Mutual Commercial Lines'],
      why_it_matters:
        'Many general contractors and property managers require $3M to $5M in total liability limits to bid on commercial commercial HVAC contracts.',
    },
  ],
  missing_coverages: [
    {
      coverage: 'Hired & Non-Owned Auto Liability',
      present_in: ['Travelers Property Casualty of America', 'Liberty Mutual Commercial Lines'],
      missing_in: ['The Hartford Insurance Group'],
      risk_level: 'High',
      recommendation:
        'Require Hartford underwriter to endorse Hired & Non-Owned Auto for $1,000,000 or issue a separate commercial auto policy before considering their quote.',
    },
    {
      coverage: 'Commercial Umbrella / Excess Liability',
      present_in: ['Liberty Mutual Commercial Lines'],
      missing_in: ['Travelers Property Casualty of America', 'The Hartford Insurance Group'],
      risk_level: 'Medium',
      recommendation:
        'If client selects Travelers or Hartford, request a companion $2M umbrella quote (approx. $1,800 - $2,500/yr) to match Liberty Mutual protection.',
    },
    {
      coverage: 'Per-Project Aggregate Endorsement (CG 25 03)',
      present_in: ['Travelers Property Casualty of America', 'Liberty Mutual Commercial Lines'],
      missing_in: ['The Hartford Insurance Group'],
      risk_level: 'Medium',
      recommendation:
        'Without this endorsement, one major claim on job A exhausts liability limits for all other active jobs across the entire policy year.',
    },
  ],
  red_flags: [
    {
      carrier_name: 'The Hartford Insurance Group',
      issue: 'Total Pollution Exclusion with heating/freon exception removed (CG 21 34)',
      page_reference: 'The Hartford Quote, Page 6',
      severity: 'High',
      explanation:
        'Standard ISO policies exempt heating equipment smoke or accidental HVAC discharges. Hartford removes this exception, creating a direct coverage denial risk for carbon monoxide or refrigerant release claims.',
    },
    {
      carrier_name: 'The Hartford Insurance Group',
      issue: 'Strict Subcontractor Warranty & Coverage Forfeiture (HG 22 19)',
      page_reference: 'The Hartford Quote, Page 8',
      severity: 'High',
      explanation:
        'Any claim arising from subcontractor operations will be denied if Apex cannot produce executed hold harmless agreements and $1M AI certificates dated prior to work commencement.',
    },
    {
      carrier_name: 'Travelers Property Casualty of America',
      issue: 'Elevated $10,000 Water Intrusion Property Damage Deductible',
      page_reference: 'Travelers Quote, Page 4, Endorsement TRV-PD-99',
      severity: 'Medium',
      explanation:
        'The deductible exceeds the agency $5,000 threshold. In HVAC piping or chilled water installations, water damage is the single most common loss category.',
    },
    {
      carrier_name: 'Liberty Mutual Commercial Lines',
      issue: 'Premium 22.2% above peer average ($17,900 vs $14,650 avg)',
      page_reference: 'Liberty Mutual Quote, Page 1',
      severity: 'Low',
      explanation:
        'The premium is higher primarily because it includes $2M Umbrella, higher base GL limits ($2M/$4M), and $100k rented equipment floater.',
    },
  ],
  premium_analysis: {
    average_premium: 14650,
    highest_premium: {
      carrier: 'Liberty Mutual Commercial Lines',
      amount: 17900,
    },
    lowest_premium: {
      carrier: 'The Hartford Insurance Group',
      amount: 11800,
    },
    percentage_difference: 51.69,
    commentary:
      'The quotes exhibit a substantial spread of $6,100 (51.7% from lowest to highest). The Hartford is the lowest-cost quote at $11,800 (19.5% below average), but achieves savings by stripping Hired & Non-Owned Auto, cutting equipment limits to $50k, and introducing dangerous subcontractor warranties. Liberty Mutual at $17,900 includes $2M Umbrella coverage and $2M base limits, providing superior value per dollar of protection.',
  },
  questions_for_underwriter: [
    {
      carrier_name: 'The Hartford Insurance Group',
      question:
        'Can Endorsement HG 22 19 (Subcontractor Warranty) be deleted or replaced with standard audit wording, and can Hired & Non-Owned Auto be added?',
      reason:
        'Strict warranty puts the insured at risk of catastrophic claim denial on subcontracted mechanical jobs.',
    },
    {
      carrier_name: 'The Hartford Insurance Group',
      question:
        'Can Endorsement CG 21 34 be amended to restore the standard ISO exception for HVAC heating equipment fumes and accidental refrigerant release?',
      reason:
        'HVAC contractors cannot operate safely under an absolute pollution exclusion without standard trade carve-outs.',
    },
    {
      carrier_name: 'Travelers Property Casualty of America',
      question:
        'What is the premium credit to reduce the $10,000 water intrusion deductible back down to the policy standard of $2,500 or $5,000?',
      reason:
        'A $10,000 deductible is excessive for a commercial mechanical trade contractor.',
    },
  ],
  client_summary_email: {
    subject: 'Commercial Insurance Comparison & Policy Review - Apex Mechanical Solutions, LLC',
    body: `Dear Apex Mechanical Solutions Team,

We have completed our detailed comparative analysis of the commercial insurance quotes submitted for your upcoming 11/01/2026 renewal. We evaluated quotes from Travelers, The Hartford, and Liberty Mutual.

EXECUTIVE SUMMARY:
While The Hartford offered the lowest upfront premium at $11,800, we strongly advise against binding it in its current form due to two severe exclusions: a strict Subcontractor Warranty that forfeits coverage if subcontractor paperwork has any gap, and the omission of Hired & Non-Owned Auto coverage. 

Liberty Mutual ($17,900) provides the most comprehensive protection, bundling $2,000,000 in base liability limits plus a $2,000,000 Commercial Umbrella policy, higher equipment coverage ($175,000 scheduled + $100,000 rented), and no dangerous warranties.

Travelers ($14,250) represents a strong middle-ground option, but note that it includes a $10,000 deductible on water intrusion claims resulting from installation work.

OUR RECOMMENDATION:
Option 1: Liberty Mutual for complete turnkey coverage that meets general contractor requirements and provides umbrella protection.
Option 2: Travelers, subject to negotiating down the $10,000 water deductible and adding a separate umbrella policy.

PolicyLens provides informational comparisons only. Not legal or coverage advice. Verify all details with the carrier.`,
  },
  agent_recommendation: {
    best_overall_value: 'Liberty Mutual Commercial Lines',
    best_coverage: 'Liberty Mutual Commercial Lines',
    cheapest_option: 'The Hartford Insurance Group',
    reasoning:
      'Although The Hartford is the cheapest option ($11,800), the severe Subcontractor Warranty (HG 22 19), lack of Hired/Non-Owned Auto, and Total Pollution exclusion make it an unacceptable risk for an active mechanical contractor. Liberty Mutual ($17,900) includes $2M Umbrella, $2M base limits, $100k rented equipment, and clean subcontractor wording, making it both the best coverage and best overall value for the company.',
  },
};

export const HOSPITALITY_ANALYSIS: CommercialAnalysisOutput = {
  analysis_metadata: {
    number_of_quotes: 3,
    carriers_detected: [
      'Chubb Custom Insurance',
      'CNA Commercial Insurance',
      'AmTrust Financial Services',
    ],
    analysis_date: '2026-10-03',
    warnings: [
      'CNA Quote contains an Absolute Assault & Battery Exclusion (Page 9) and completely excludes Liquor Liability (Page 7).',
      'AmTrust includes an Operating Warranty (Page 4) closing coverage after 11:00 PM and restricting live music/entertainment.',
      'Chubb imposes a $7,500 Named Storm/Windstorm Deductible (Page 5).',
      'AmTrust annual premium ($13,200) is 24.4% below the 3-carrier average ($17,466).',
    ],
  },
  carriers: [
    {
      carrier_name: 'Chubb Custom Insurance',
      policy_number: 'CHB-30911-PKG',
      quote_date: 'Not stated',
      effective_date: '12/01/2026',
      expiration_date: '12/01/2027',
      annual_premium: 22400,
      payment_terms: 'Quarterly Equal Payments ($5,600.00/qtr) or 10-Pay direct debit',
      named_insured: 'Harbor & Hearth Hospitality, LLC',
      business_description: 'Full Service Restaurant & Bar (40% alcohol receipts)',
    },
    {
      carrier_name: 'CNA Commercial Insurance',
      policy_number: 'CNA-88410-PKG',
      quote_date: 'Not stated',
      effective_date: '12/01/2026',
      expiration_date: '12/01/2027',
      annual_premium: 16800,
      payment_terms: '20% down + 8 monthly payments',
      named_insured: 'Harbor & Hearth Hospitality, LLC',
      business_description: 'Restaurant Choice Program',
    },
    {
      carrier_name: 'AmTrust Financial Services',
      policy_number: 'AMT-55102-GL',
      quote_date: 'Not stated',
      effective_date: '12/01/2026',
      expiration_date: '12/01/2027',
      annual_premium: 13200,
      payment_terms: 'Monthly EFT 12-Pay ($1,100.00/month)',
      named_insured: 'Harbor & Hearth Hospitality, LLC',
      business_description: 'Specialty Restaurant & Tavern',
    },
  ],
  comparison_table: [
    {
      coverage_line: 'Liquor Liability Limits',
      values: [
        {
          carrier_name: 'Chubb Custom Insurance',
          limit: '$1,000,000 Common Cause / $2,000,000 Aggregate',
          deductible: '$0',
          notes: 'Full dedicated liquor limits included without sublimit.',
        },
        {
          carrier_name: 'CNA Commercial Insurance',
          limit: 'EXCLUDED (Not Provided)',
          deductible: 'N/A',
          notes: 'Endorsement CG 21 55 attached. Requires separate policy or $4,200 additional fee.',
        },
        {
          carrier_name: 'AmTrust Financial Services',
          limit: '$500,000 Common Cause / $1,000,000 Aggregate',
          deductible: '$1,000',
          notes: 'Sublimited; provides half the protection of standard industry guidelines.',
        },
      ],
    },
    {
      coverage_line: 'Assault & Battery Coverage',
      values: [
        {
          carrier_name: 'Chubb Custom Insurance',
          limit: '$1,000,000 (Full Policy Limits)',
          deductible: '$0',
          notes: 'No assault & battery exclusion or restrictive sublimit.',
        },
        {
          carrier_name: 'CNA Commercial Insurance',
          limit: 'TOTAL EXCLUSION (Page 9, Endorsement EX-AB-01)',
          deductible: 'N/A',
          notes: 'Absolute exclusion covering fights, patron disputes, and security negligence.',
        },
        {
          carrier_name: 'AmTrust Financial Services',
          limit: 'Standard limits subject to 11 PM curfew',
          deductible: '$1,000',
          notes: 'Void if incident occurs after 11 PM or during live music.',
        },
      ],
    },
    {
      coverage_line: 'Food Spoilage & Contamination',
      values: [
        {
          carrier_name: 'Chubb Custom Insurance',
          limit: '$100,000',
          deductible: '$2,500',
          notes: 'High limit appropriate for fresh seafood and fine wine cellars.',
        },
        {
          carrier_name: 'CNA Commercial Insurance',
          limit: '$25,000',
          deductible: '$2,500',
          notes: 'Moderate limit.',
        },
        {
          carrier_name: 'AmTrust Financial Services',
          limit: '$5,000',
          deductible: '$2,500',
          notes: 'Extremely inadequate sublimit for a restaurant with perishable walk-in inventory.',
        },
      ],
    },
    {
      coverage_line: 'Business Income & Extra Expense',
      values: [
        {
          carrier_name: 'Chubb Custom Insurance',
          limit: 'Actual Loss Sustained (12 Months)',
          deductible: '72-Hour Waiting Period',
          notes: 'Best-in-class coverage without arbitrary dollar cap.',
        },
        {
          carrier_name: 'CNA Commercial Insurance',
          limit: '$250,000 Capped',
          deductible: '72-Hour Waiting Period',
          notes: 'Fixed dollar ceiling may not cover lengthy post-fire restoration.',
        },
        {
          carrier_name: 'AmTrust Financial Services',
          limit: 'Not stated',
          deductible: 'Not stated',
          notes: 'Omitted from dec page summary.',
        },
      ],
    },
    {
      coverage_line: 'Windstorm / Hail / Named Storm Deductible',
      values: [
        {
          carrier_name: 'Chubb Custom Insurance',
          limit: 'Subject to $7,500 coastal deductible',
          deductible: '$7,500 (Named Storm)',
          notes: 'Deductible flagged above $5,000 threshold.',
        },
        {
          carrier_name: 'CNA Commercial Insurance',
          limit: '$2,500 All Perils',
          deductible: '$2,500',
          notes: 'Standard property deductible.',
        },
        {
          carrier_name: 'AmTrust Financial Services',
          limit: '$2,500 All Perils',
          deductible: '$2,500',
          notes: 'Standard property deductible.',
        },
      ],
    },
  ],
  key_differences: [
    {
      topic: 'Liquor Liability & Alcohol Protection',
      explanation:
        'CNA completely excludes Liquor Liability (CG 21 55). Chubb provides full $1M/$2M coverage with $0 deductible. AmTrust provides sublimited $500k/$1M coverage.',
      carriers_affected: ['CNA Commercial Insurance', 'Chubb Custom Insurance', 'AmTrust Financial Services'],
      why_it_matters:
        'With 40% alcohol sales, operating without liquor liability or with severe sublimits exposes the restaurant owners to personal bankruptcy in the event of an intoxicated driver or patron incident.',
    },
    {
      topic: 'Absolute Assault & Battery Exclusion',
      explanation:
        'CNA attaches Endorsement EX-AB-01, excluding any physical altercation, bouncer actions, or negligent security claims. Chubb includes full $1M protection.',
      carriers_affected: ['CNA Commercial Insurance'],
      why_it_matters:
        'Late-night dining and bar altercations are one of the most frequent commercial liability claims in hospitality.',
    },
  ],
  missing_coverages: [
    {
      coverage: 'Liquor Liability',
      present_in: ['Chubb Custom Insurance', 'AmTrust Financial Services'],
      missing_in: ['CNA Commercial Insurance'],
      risk_level: 'High',
      recommendation:
        'CNA cannot be considered unless liquor liability is added back via endorsement (quoted at $4,200 additional).',
    },
    {
      coverage: 'Adequate Food Spoilage Limit',
      present_in: ['Chubb Custom Insurance', 'CNA Commercial Insurance'],
      missing_in: ['AmTrust Financial Services'],
      risk_level: 'High',
      recommendation:
        'AmTrust $5,000 limit is insufficient to cover a single power outage on a walk-in freezer holding craft meats and raw bar inventory.',
    },
  ],
  red_flags: [
    {
      carrier_name: 'CNA Commercial Insurance',
      issue: 'Absolute Assault & Battery Exclusion (EX-AB-01)',
      page_reference: 'CNA Quote, Page 9',
      severity: 'High',
      explanation:
        'Completely removes defense and indemnity for bar fights, patron injuries, and security guard allegations.',
    },
    {
      carrier_name: 'AmTrust Financial Services',
      issue: '11:00 PM Operating Curfew & Music Warranty (AMT-CLS-99)',
      page_reference: 'AmTrust Quote, Page 4',
      severity: 'High',
      explanation:
        'Policy is completely void for any loss occurring after 11 PM or during live musical entertainment.',
    },
    {
      carrier_name: 'Chubb Custom Insurance',
      issue: 'Elevated $7,500 Named Storm / Wind Deductible',
      page_reference: 'Chubb Quote, Page 5',
      severity: 'Medium',
      explanation:
        'Exceeds $5,000 agency deductible threshold for coastal Portsmouth location.',
    },
  ],
  premium_analysis: {
    average_premium: 17466,
    highest_premium: {
      carrier: 'Chubb Custom Insurance',
      amount: 22400,
    },
    lowest_premium: {
      carrier: 'AmTrust Financial Services',
      amount: 13200,
    },
    percentage_difference: 69.7,
    commentary:
      'Chubb is the highest premium at $22,400 (28.2% above average), reflecting premier hospitality terms: $1M/$2M Liquor Liability, $100k Spoilage, and full Assault & Battery. CNA is $16,800 but adding Liquor ($4,200) brings it to $21,000 while still retaining a dangerous Assault & Battery exclusion. AmTrust is cheap at $13,200 (24.4% below average) but imposes a fatal 11 PM operating curfew.',
  },
  questions_for_underwriter: [
    {
      carrier_name: 'CNA Commercial Insurance',
      question:
        'What is the premium to delete Endorsement EX-AB-01 (Assault & Battery Exclusion) and include Liquor Liability on the main package?',
      reason:
        'A restaurant with 40% bar sales cannot accept an unendorsed assault & battery exclusion or missing liquor coverage.',
    },
    {
      carrier_name: 'Chubb Custom Insurance',
      question:
        'Can the coastal wind/hail deductible be bought down from $7,500 to $2,500 or $5,000?',
      reason:
        'Client seeks to minimize out-of-pocket exposure during hurricane/nor’easter season.',
    },
  ],
  client_summary_email: {
    subject: 'Hospitality Insurance Quote Comparison - Harbor & Hearth Hospitality, LLC',
    body: `Dear Harbor & Hearth Management,

We have analyzed the 3 renewal quotes received from Chubb, CNA, and AmTrust for your restaurant and tavern.

KEY FINDINGS:
1. CNA ($16,800): Excludes Liquor Liability entirely and includes an Absolute Assault & Battery Exclusion. For a restaurant with a bustling bar, this leaves you exposed to your largest liability risks.
2. AmTrust ($13,200): Looks attractive on price, but contains a severe restriction: coverage is void if your restaurant stays open past 11:00 PM or hosts live music. Furthermore, food spoilage is capped at only $5,000.
3. Chubb ($22,400): Delivers complete, unrestricted protection with full $1M/$2M Liquor Liability, full Assault & Battery coverage, $100,000 Food Spoilage, and 12-Month Actual Loss Sustained business interruption. Note the $7,500 wind/hail deductible.

OUR RECOMMENDATION:
Chubb is by far the safest carrier for your operation. Binding AmTrust or CNA would leave your business severely exposed.

PolicyLens provides informational comparisons only. Not legal or coverage advice. Verify all details with the carrier.`,
  },
  agent_recommendation: {
    best_overall_value: 'Chubb Custom Insurance',
    best_coverage: 'Chubb Custom Insurance',
    cheapest_option: 'AmTrust Financial Services',
    reasoning:
      'Chubb is the only carrier that provides full Liquor Liability and Assault & Battery coverage with realistic property limits. AmTrust’s 11 PM curfew warranty and CNA’s total exclusion of liquor and assault & battery make both quotes fundamentally unfit for a full-service restaurant.',
  },
};

export const TECH_ANALYSIS: CommercialAnalysisOutput = {
  analysis_metadata: {
    number_of_quotes: 3,
    carriers_detected: [
      'Hiscox Insurance Company',
      'The Hanover Insurance Company',
      'Philadelphia Insurance Companies (PHLY)',
    ],
    analysis_date: '2026-10-03',
    warnings: [
      'PHLY sets the E&O Retroactive Date to 01/15/2027 (Inception Only), which strips coverage for all software developed since the firm was founded in 2021.',
      'The Hanover imposes an elevated $10,000 E&O and Cyber deductible (Page 4).',
      'PHLY premium ($7,100) is 26.8% below the 3-carrier average ($9,700).',
    ],
  },
  carriers: [
    {
      carrier_name: 'Hiscox Insurance Company',
      policy_number: 'HIS-67210-EO',
      quote_date: 'Not stated',
      effective_date: '01/15/2027',
      expiration_date: '01/15/2028',
      annual_premium: 9600,
      payment_terms: 'Annual in full or 4 quarterly payments of $2,400.00',
      named_insured: 'Vertex Digital Health Systems, Inc.',
      business_description: 'Telehealth Software Provider / Medical IT',
    },
    {
      carrier_name: 'The Hanover Insurance Company',
      policy_number: 'HAN-44120-TECH',
      quote_date: 'Not stated',
      effective_date: '01/15/2027',
      expiration_date: '01/15/2028',
      annual_premium: 12400,
      payment_terms: '10-Pay direct bill ($1,240.00/mo)',
      named_insured: 'Vertex Digital Health Systems, Inc.',
      business_description: 'Technology Services & Software Program',
    },
    {
      carrier_name: 'Philadelphia Insurance Companies (PHLY)',
      policy_number: 'PHL-90234-PI',
      quote_date: 'Not stated',
      effective_date: '01/15/2027',
      expiration_date: '01/15/2028',
      annual_premium: 7100,
      payment_terms: 'Single Pay or 2-Pay ($3,550.00 x 2)',
      named_insured: 'Vertex Digital Health Systems, Inc.',
      business_description: 'Miscellaneous E&O and Cyber Security',
    },
  ],
  comparison_table: [
    {
      coverage_line: 'Technology Errors & Omissions (E&O)',
      values: [
        {
          carrier_name: 'Hiscox Insurance Company',
          limit: '$2,000,000 Claim / $2,000,000 Aggregate',
          deductible: '$5,000',
          notes: 'Full Prior Acts retro date; includes contractual liability indemnification.',
        },
        {
          carrier_name: 'The Hanover Insurance Company',
          limit: '$3,000,000 Claim / $3,000,000 Aggregate',
          deductible: '$10,000',
          notes: 'Higher $3M limit; deductible flagged above $5,000 threshold.',
        },
        {
          carrier_name: 'Philadelphia Insurance Companies (PHLY)',
          limit: '$1,000,000 Claim / $1,000,000 Aggregate',
          deductible: '$2,500',
          notes: 'Dangerously restricted by Inception-Only retroactive date.',
        },
      ],
    },
    {
      coverage_line: 'Information Security & Cyber Liability',
      values: [
        {
          carrier_name: 'Hiscox Insurance Company',
          limit: '$1,000,000 Privacy & Regulatory (HIPAA)',
          deductible: '$5,000',
          notes: 'Includes forensics, notification, and $500k extortion.',
        },
        {
          carrier_name: 'The Hanover Insurance Company',
          limit: '$2,000,000 Cyber Aggregate',
          deductible: '$10,000',
          notes: 'High limit; $10k retention.',
        },
        {
          carrier_name: 'Philadelphia Insurance Companies (PHLY)',
          limit: '$250,000 Sublimited',
          deductible: '$2,500',
          notes: 'Severe sublimit inadequate for HIPAA healthcare data breach notification costs.',
        },
      ],
    },
    {
      coverage_line: 'Retroactive Date Continuity',
      values: [
        {
          carrier_name: 'Hiscox Insurance Company',
          limit: 'Full Prior Acts',
          deductible: 'N/A',
          notes: 'Covers acts dating back to company formation.',
        },
        {
          carrier_name: 'The Hanover Insurance Company',
          limit: '01/15/2021 (Historical Inception)',
          deductible: 'N/A',
          notes: 'Preserves 6 years of past software release liability.',
        },
        {
          carrier_name: 'Philadelphia Insurance Companies (PHLY)',
          limit: '01/15/2027 (INCEPTION ONLY)',
          deductible: 'N/A',
          notes: 'FATAL TRAP: Forfeits coverage for all prior work and historical software deployments.',
        },
      ],
    },
  ],
  key_differences: [
    {
      topic: 'Retroactive Date Trap on Claims-Made E&O',
      explanation:
        'PHLY quotes a retroactive date of 01/15/2027 (Inception Only). Hiscox gives Full Prior Acts, and Hanover dates back to 2021.',
      carriers_affected: ['Philadelphia Insurance Companies (PHLY)'],
      why_it_matters:
        'In claims-made policies, work performed before the retroactive date is uninsured even if the claim is filed today. PHLY effectively destroys 6 years of historical protection.',
    },
    {
      topic: 'HIPAA & Healthcare Cyber Sublimit Disparity',
      explanation:
        'PHLY provides only $250,000 in Cyber coverage. Hiscox provides $1,000,000, and Hanover provides $2,000,000.',
      carriers_affected: ['Philadelphia Insurance Companies (PHLY)'],
      why_it_matters:
        'A single healthcare ransomware breach averages $2.4M in forensic, legal, and HIPAA notification expenses.',
    },
  ],
  missing_coverages: [
    {
      coverage: 'Prior Acts Historical Coverage',
      present_in: ['Hiscox Insurance Company', 'The Hanover Insurance Company'],
      missing_in: ['Philadelphia Insurance Companies (PHLY)'],
      risk_level: 'High',
      recommendation:
        'Never accept an inception-only retroactive date for an existing software business. Require PHLY to backdate to 2021 or eliminate from consideration.',
    },
  ],
  red_flags: [
    {
      carrier_name: 'Philadelphia Insurance Companies (PHLY)',
      issue: 'Inception-Only Retroactive Date (01/15/2027)',
      page_reference: 'PHLY Quote, Page 7',
      severity: 'High',
      explanation:
        'Erases coverage for all software code and services delivered over the past 6 years since 2021.',
    },
    {
      carrier_name: 'The Hanover Insurance Company',
      issue: 'Elevated $10,000 E&O and Cyber Retention',
      page_reference: 'Hanover Quote, Page 4',
      severity: 'Medium',
      explanation:
        'Deductible is double the agency $5,000 threshold, increasing out-of-pocket exposure on small disputes.',
    },
    {
      carrier_name: 'Philadelphia Insurance Companies (PHLY)',
      issue: 'Premium 26.8% below peer average ($7,100 vs $9,700 avg)',
      page_reference: 'PHLY Quote, Page 1',
      severity: 'Low',
      explanation:
        'The discount is deceptive because the policy eliminates prior acts coverage and caps cyber at $250k.',
    },
  ],
  premium_analysis: {
    average_premium: 9700,
    highest_premium: {
      carrier: 'The Hanover Insurance Company',
      amount: 12400,
    },
    lowest_premium: {
      carrier: 'Philadelphia Insurance Companies (PHLY)',
      amount: 7100,
    },
    percentage_difference: 74.65,
    commentary:
      'PHLY appears to be a bargain at $7,100, but is artificially cheap because it offers zero retroactive coverage and severely sublimits cyber to $250k. Hiscox at $9,600 provides Full Prior Acts, $2M E&O, and $1M Cyber with a manageable $5,000 deductible, offering the highest value per dollar.',
  },
  questions_for_underwriter: [
    {
      carrier_name: 'Philadelphia Insurance Companies (PHLY)',
      question:
        'Can the retroactive date be amended to 01/15/2021 (with proof of prior continuous coverage), and what is the additional premium?',
      reason:
        'An inception retroactive date leaves the client completely unprotected against past work.',
    },
    {
      carrier_name: 'The Hanover Insurance Company',
      question:
        'Can the $10,000 Tech E&O deductible be reduced to $5,000, and does Hanover offer a 1st-dollar defense endorsement?',
      reason:
        'To reduce client out-of-pocket defense expense on unfounded client disputes.',
    },
  ],
  client_summary_email: {
    subject: 'Tech E&O & Cyber Insurance Proposal - Vertex Digital Health Systems, Inc.',
    body: `Dear Vertex Digital Health Executive Team,

We have completed our technical comparative analysis of your 2027 Technology Errors & Omissions and Cyber Liability renewal options from Hiscox, The Hanover, and PHLY.

CRITICAL ALERT:
Please beware of the PHLY quote ($7,100). While it is the cheapest option, it contains a critical flaw: an "Inception Only" retroactive date. This means PHLY will NOT cover any claims arising from code written or services performed prior to January 15, 2027—leaving 6 years of your historical product deployments completely unprotected. Furthermore, their cyber coverage is capped at just $250,000, which is dangerously inadequate for a telehealth company handling protected health information (PHI).

RECOMMENDATION:
We recommend Hiscox ($9,600). It includes Full Prior Acts coverage, $2,000,000 in Tech E&O, $1,000,000 in Cyber Liability (including HIPAA defense), and a reasonable $5,000 deductible.

The Hanover ($12,400) is also solid with $3M limits, but carries a high $10,000 deductible and a 50/50 settlement hammer clause.

PolicyLens provides informational comparisons only. Not legal or coverage advice. Verify all details with the carrier.`,
  },
  agent_recommendation: {
    best_overall_value: 'Hiscox Insurance Company',
    best_coverage: 'The Hanover Insurance Company',
    cheapest_option: 'Philadelphia Insurance Companies (PHLY)',
    reasoning:
      'PHLY’s inception-only retro date creates an unacceptable liability black hole for an established SaaS company. Hiscox strikes the ideal balance with Full Prior Acts, robust $2M limits, and comprehensive HIPAA cyber protection at $9,600.',
  },
};

export const PRESET_ANALYSES_MAP: Record<string, CommercialAnalysisOutput> = {
  'contractor-hvac': CONTRACTOR_ANALYSIS,
  'hospitality-restaurant': HOSPITALITY_ANALYSIS,
  'technology-saas': TECH_ANALYSIS,
};
