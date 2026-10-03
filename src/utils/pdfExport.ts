import { CommercialAnalysisOutput, ClientContext } from '../types/insurance';
import { trackEvent } from './analytics';

declare global {
  interface Window {
    jspdf?: any;
    html2canvas?: any;
  }
}

/**
 * Generates and downloads a clean, branded multi-page PDF comparison report
 * for PolicyLens using jsPDF & html2canvas or direct vector formatting.
 */
export async function exportProposalToPdf(
  analysis: CommercialAnalysisOutput,
  clientName: string,
  agencyName: string,
  clientContext?: ClientContext,
  isWatermarked: boolean = false
): Promise<void> {
  const safeClientName = (clientName || analysis.carriers[0]?.named_insured || 'Commercial_Client')
    .replace(/[^a-zA-Z0-9_-]/g, '_');
  const dateStr = new Date().toISOString().split('T')[0];
  const filename = `PolicyLens_${safeClientName}_${dateStr}.pdf`;

  trackEvent('pdf_exported', {
    client: clientName,
    quotesCount: analysis.carriers.length,
    watermarked: isWatermarked,
    filename,
  });

  const jsPDF = window.jspdf?.jsPDF;

  if (!jsPDF) {
    console.warn('jsPDF not loaded on window, triggering browser native print to PDF');
    window.print();
    return;
  }

  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'letter',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 40;
    const contentWidth = pageWidth - margin * 2;
    let y = margin;

    // Helper: Draw page header/footer and optional watermark
    const drawHeaderFooter = (pageNumber: number, totalPages: number) => {
      // Header
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(30, 58, 95); // Navy blue #1e3a5f
      doc.text('PolicyLens — 5 carrier quotes. 1 clear comparison. 60 seconds.', margin, 25);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(140, 140, 140);
      doc.text(dateStr, pageWidth - margin, 25, { align: 'right' });
      doc.setDrawColor(220, 226, 235);
      doc.setLineWidth(0.75);
      doc.line(margin, 28, pageWidth - margin, 28);

      // Watermark for Free plan users
      if (isWatermarked) {
        doc.saveGraphicsState();
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(36);
        doc.setTextColor(200, 210, 225);
        doc.text('PolicyLens Free Preview', pageWidth / 2, pageHeight / 2, {
          align: 'center',
          angle: 45,
        });
        doc.restoreGraphicsState();
      }

      // Footer
      doc.line(margin, pageHeight - 32, pageWidth - margin, pageHeight - 32);
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text(
        'PolicyLens provides informational comparisons only. Not legal or coverage advice. Verify all details with the carrier.',
        margin,
        pageHeight - 20
      );
      doc.text(`Page ${pageNumber} of ${totalPages}`, pageWidth - margin, pageHeight - 20, {
        align: 'right',
      });
    };

    // ==========================================
    // PAGE 1: COVER PAGE
    // ==========================================
    // Background accent top bar
    doc.setFillColor(30, 58, 95); // Navy #1e3a5f
    doc.rect(0, 0, pageWidth, 160, 'F');

    // Logo & Title
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(26);
    doc.text('PolicyLens', margin, 65);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(16, 185, 129); // Accent green #10b981
    doc.text('5 carrier quotes. 1 clear comparison. 60 seconds.', margin, 85);

    doc.setFontSize(12);
    doc.setTextColor(220, 230, 245);
    doc.text('Commercial Lines Comparative Insurance Proposal', margin, 115);

    y = 195;

    // Client & Proposal Details Card
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(margin, y, contentWidth, 120, 6, 6, 'FD');

    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text('PREPARED FOR:', margin + 16, y + 24);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text(clientName || analysis.carriers[0]?.named_insured || 'Commercial Client', margin + 16, y + 42);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(`Agency: ${agencyName || 'Independent Insurance Agency'}`, margin + 16, y + 62);
    if (clientContext?.businessType) {
      doc.text(`Industry / Operations: ${clientContext.businessType}`, margin + 16, y + 78);
    }
    if (clientContext?.state) {
      doc.text(`Operating State(s): ${clientContext.state}`, margin + 16, y + 94);
    }

    doc.text(`Date Generated: ${new Date().toLocaleDateString('en-US', { dateStyle: 'long' })}`, margin + 280, y + 62);
    doc.text(`Carriers Evaluated: ${analysis.carriers.length} Carrier Quotes`, margin + 280, y + 78);
    doc.text(`Engine: PolicyLens Commercial Intelligence`, margin + 280, y + 94);

    y += 140;

    // Agent Strategic Recommendation Box
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(margin, y, contentWidth, 140, 6, 6, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(30, 58, 95);
    doc.text('AGENT STRATEGIC RECOMMENDATION', margin + 16, y + 24);

    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text(`• Best Overall Value:  ${analysis.agent_recommendation.best_overall_value}`, margin + 16, y + 46);
    doc.text(`• Broadest Coverage:   ${analysis.agent_recommendation.best_coverage}`, margin + 16, y + 62);
    doc.text(`• Lowest Upfront Cost: ${analysis.agent_recommendation.cheapest_option}`, margin + 16, y + 78);

    doc.setFont('helvetica', 'bold');
    doc.text('Analyst Rationale:', margin + 16, y + 98);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    const splitReason = doc.splitTextToSize(analysis.agent_recommendation.reasoning, contentWidth - 32);
    doc.text(splitReason, margin + 16, y + 112);

    y += 160;

    // Carrier Summary Grid on Page 1
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(30, 58, 95);
    doc.text('QUOTING CARRIERS & ESTIMATED ANNUAL PREMIUMS', margin, y);
    y += 14;

    const colW = contentWidth / analysis.carriers.length;
    analysis.carriers.forEach((c, idx) => {
      const isCheapest = c.carrier_name === analysis.agent_recommendation.cheapest_option;
      const x = margin + idx * colW;
      
      doc.setFillColor(isCheapest ? 240 : 255, isCheapest ? 253 : 255, isCheapest ? 244 : 255);
      doc.setDrawColor(isCheapest ? 16 : 203, isCheapest ? 185 : 213, isCheapest ? 129 : 225);
      doc.roundedRect(x + 2, y, colW - 4, 75, 4, 4, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(15, 23, 42);
      const splitCarrier = doc.splitTextToSize(c.carrier_name, colW - 12);
      doc.text(splitCarrier[0] || c.carrier_name, x + 6, y + 16);

      doc.setFontSize(13);
      doc.setTextColor(isCheapest ? 16 : 30, isCheapest ? 185 : 58, isCheapest ? 129 : 95);
      doc.text(`$${c.annual_premium?.toLocaleString()}`, x + 6, y + 36);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text(`Policy #: ${c.policy_number}`, x + 6, y + 50);
      doc.text(`Term: ${c.effective_date} - ${c.expiration_date}`, x + 6, y + 62);
    });

    drawHeaderFooter(1, 3);

    // ==========================================
    // PAGE 2: COVERAGE COMPARISON MATRIX
    // ==========================================
    doc.addPage();
    y = margin + 10;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(30, 58, 95);
    doc.text('SIDE-BY-SIDE COVERAGE & LIMITS MATRIX', margin, y);
    y += 15;

    // Table Header
    doc.setFillColor(30, 58, 95);
    doc.rect(margin, y, contentWidth, 22, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text('Coverage Line', margin + 6, y + 14);

    const cellW = (contentWidth - 140) / analysis.carriers.length;
    analysis.carriers.forEach((c, idx) => {
      const x = margin + 140 + idx * cellW;
      const splitName = doc.splitTextToSize(c.carrier_name, cellW - 6);
      doc.text(splitName[0] || c.carrier_name, x + 4, y + 14);
    });
    y += 22;

    // Rows
    analysis.comparison_table.forEach((row, rIdx) => {
      const isAlt = rIdx % 2 === 1;
      doc.setFillColor(isAlt ? 248 : 255, isAlt ? 250 : 255, isAlt ? 252 : 255);
      doc.rect(margin, y, contentWidth, 24, 'F');
      doc.setDrawColor(226, 232, 240);
      doc.line(margin, y + 24, margin + contentWidth, y + 24);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(30, 41, 59);
      const splitLine = doc.splitTextToSize(row.coverage_line, 130);
      doc.text(splitLine[0] || row.coverage_line, margin + 6, y + 15);

      analysis.carriers.forEach((c, idx) => {
        const x = margin + 140 + idx * cellW;
        const val = row.values.find(
          (v) => v.carrier_name.toLowerCase() === c.carrier_name.toLowerCase()
        ) || row.values[idx];

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        const limitStr = val?.limit || 'Not stated';
        doc.setTextColor(limitStr.includes('Not stated') || limitStr.includes('EXCLUDED') ? 220 : 15, limitStr.includes('Not stated') ? 38 : 23, limitStr.includes('Not stated') ? 38 : 42);
        doc.text(limitStr, x + 4, y + 11);

        if (val?.deductible && val.deductible !== 'N/A') {
          doc.setFontSize(6.5);
          doc.setTextColor(100, 116, 139);
          doc.text(`Ded: ${val.deductible}`, x + 4, y + 20);
        }
      });

      y += 24;
    });

    // Red Flags Section on Page 2
    y += 20;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(185, 28, 28); // Red
    doc.text('CRITICAL RED FLAGS & EXCLUSIONS (RULE 3 & 7)', margin, y);
    y += 14;

    analysis.red_flags.slice(0, 4).forEach((flag) => {
      doc.setFillColor(254, 242, 242);
      doc.setDrawColor(254, 202, 202);
      doc.roundedRect(margin, y, contentWidth, 34, 3, 3, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(185, 28, 28);
      doc.text(`[${flag.severity} Severity] ${flag.carrier_name} — ${flag.issue}`, margin + 8, y + 12);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text(`Citation: ${flag.page_reference}`, pageWidth - margin - 120, y + 12);

      doc.setFontSize(7.5);
      doc.setTextColor(71, 85, 105);
      const splitExp = doc.splitTextToSize(flag.explanation, contentWidth - 16);
      doc.text(splitExp[0] || flag.explanation, margin + 8, y + 24);

      y += 38;
    });

    drawHeaderFooter(2, 3);

    // ==========================================
    // PAGE 3: COVERAGE GAPS, UNDERWRITING & CLIENT SUMMARY
    // ==========================================
    doc.addPage();
    y = margin + 10;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(30, 58, 95);
    doc.text('COVERAGE GAPS & COMPETING DISCREPANCIES (RULE 6)', margin, y);
    y += 14;

    analysis.missing_coverages.slice(0, 3).forEach((gap) => {
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(margin, y, contentWidth, 38, 3, 3, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(15, 23, 42);
      doc.text(`${gap.coverage} (${gap.risk_level} Risk)`, margin + 8, y + 12);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(16, 185, 129);
      doc.text(`Included in: ${gap.present_in.join(', ')}`, margin + 8, y + 23);
      doc.setTextColor(239, 68, 68);
      doc.text(`Missing in: ${gap.missing_in.join(', ')}`, margin + 180, y + 23);

      doc.setTextColor(71, 85, 105);
      doc.text(`Action: ${gap.recommendation}`, margin + 8, y + 33);

      y += 44;
    });

    y += 10;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(30, 58, 95);
    doc.text('QUESTIONS FOR UNDERWRITERS PRIOR TO BINDING', margin, y);
    y += 14;

    analysis.questions_for_underwriter.slice(0, 3).forEach((q) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(15, 23, 42);
      doc.text(`[ ] ${q.carrier_name}:`, margin, y);
      doc.setFont('helvetica', 'normal');
      const splitQ = doc.splitTextToSize(q.question, contentWidth - 100);
      doc.text(splitQ[0] || q.question, margin + 90, y);
      y += 18;
    });

    y += 15;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(30, 58, 95);
    doc.text('CLIENT SUMMARY MEMORANDUM', margin, y);
    y += 14;

    doc.setFillColor(248, 250, 252);
    doc.roundedRect(margin, y, contentWidth, 160, 4, 4, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text(`Subject: ${analysis.client_summary_email.subject}`, margin + 8, y + 16);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(51, 65, 85);
    const splitBody = doc.splitTextToSize(analysis.client_summary_email.body, contentWidth - 16);
    doc.text(splitBody.slice(0, 18), margin + 8, y + 30);

    drawHeaderFooter(3, 3);

    // Save PDF with PolicyLens filename
    doc.save(filename);
  } catch (err) {
    console.error('PDF generation error, falling back to print view:', err);
    window.print();
  }
}
