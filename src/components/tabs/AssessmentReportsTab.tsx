import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Printer,
  Download,
  Shield,
  Scale
} from 'lucide-react';
import { Finding, CSEEntity } from '../../types';

interface AssessmentReportsTabProps {
  findings: Finding[];
  entities: CSEEntity[];
}

export const AssessmentReportsTab: React.FC<AssessmentReportsTabProps> = ({
  findings,
  entities
}) => {
  const [selectedEntityCode, setSelectedEntityCode] = useState<string>('ALL');

  const filteredFindings = findings.filter(f =>
    selectedEntityCode === 'ALL' ? true : f.cseCode === selectedEntityCode
  );

  const confirmedConcerns = filteredFindings.filter(f => f.status === 'Confirmed Concern');
  const notConcerns = filteredFindings.filter(f => f.status === 'Not a Concern');
  const pendingReview = filteredFindings.filter(f => f.status === 'Pending Review');
  const requiresInfo = filteredFindings.filter(f => f.status === 'Requires Information');

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCSV = () => {
    const headers = ['Finding_ID', 'Entity', 'Sector', 'Title', 'Priority', 'Signal_Score', 'Supervisory_Status', 'Supervisor_Remarks', 'Reviewed_By', 'Date'];
    const rows = filteredFindings.map(f => [
      f.id,
      f.cseCode,
      `"${f.sector}"`,
      `"${f.title.replace(/"/g, '""')}"`,
      f.priority,
      f.signalScore,
      f.status,
      `"${(f.supervisorRemarks || 'Pending Review').replace(/"/g, '""')}"`,
      `"${f.reviewedBy || 'N/A'}"`,
      `"${f.reviewedAt || f.detectedAt}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SAT-SA_Supervisory_Report_${selectedEntityCode}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Control Action Bar */}
      <div className="bg-[#FFFFFF] p-6 rounded-xl border border-[#E4E4E7] no-print flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-[#09090B] flex items-center space-x-2">
            <FileSpreadsheet className="w-5 h-5 text-[#4F46E5]" />
            <span>Official NCIIPC Supervisory SOC Assessment Report</span>
          </h1>
          <p className="text-xs text-[#71717A] mt-0.5">
            Statutory report for submission under Section 70A, Information Technology Act, 2000
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-[#71717A] font-medium">Scope:</span>
            <select
              value={selectedEntityCode}
              onChange={(e) => setSelectedEntityCode(e.target.value)}
              className="bg-[#FAFAFA] border border-[#E4E4E7] rounded-xl px-3 py-1.5 text-xs text-[#09090B] font-mono focus:outline-none focus:border-[#4F46E5]"
            >
              <option value="ALL">All Monitored Critical Entities (National Summary)</option>
              {entities.map(e => (
                <option key={e.code} value={e.code}>{e.code} - {e.name}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleDownloadCSV}
            className="px-3.5 py-1.5 bg-[#FAFAFA] hover:bg-[#F4F4F5] text-[#27272A] text-xs font-semibold rounded-xl border border-[#E4E4E7] flex items-center space-x-1.5 transition"
          >
            <Download className="w-3.5 h-3.5 text-[#4F46E5]" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-1.5 bg-[#4F46E5] hover:bg-indigo-700 text-[#FFFFFF] text-xs font-bold rounded-xl flex items-center space-x-1.5 transition shadow-sm"
          >
            <Printer className="w-3.5 h-3.5 text-white" />
            <span>Print Official Report</span>
          </button>
        </div>
      </div>

      {/* Printable Report Document Card */}
      <div className="bg-[#FFFFFF] p-8 rounded-xl border border-[#E4E4E7] printable-area space-y-6 max-w-5xl mx-auto">
        
        {/* Government Emblem / Header Banner */}
        <div className="border-b border-[#E4E4E7] pb-5 flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="w-14 h-14 rounded-xl bg-indigo-50 text-[#4F46E5] flex items-center justify-center font-bold text-2xl border border-indigo-200 shrink-0">
              <Shield className="w-8 h-8 text-[#4F46E5]" />
            </div>
            <div>
              <div className="text-[11px] font-mono tracking-widest uppercase font-bold text-[#4F46E5]">
                Government of India • National Technical Research Organisation (NTRO)
              </div>
              <h2 className="text-xl font-bold text-[#09090B] mt-1">
                National Critical Information Infrastructure Protection Centre
              </h2>
              <div className="text-xs text-[#71717A] mt-0.5">
                Cyber Supervisory Assessment & SOC Operational Integrity Evaluation Record
              </div>
            </div>
          </div>

          <div className="text-right text-xs font-mono text-[#71717A] shrink-0">
            <div><strong className="text-[#09090B]">Report Ref:</strong> NCIIPC/SAT-SA/2026/Q3-09</div>
            <div><strong className="text-[#09090B]">Date of Issue:</strong> {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
            <div className="text-[#EA580C] font-bold">RESTRICTED (SEC-70A)</div>
          </div>
        </div>

        {/* Executive Supervisory Assessment Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-4 bg-[#FAFAFA] rounded-xl border border-[#E4E4E7]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#71717A] block">
              Total Signals Evaluated
            </span>
            <span className="text-2xl font-bold font-mono text-[#09090B] mt-1 block">
              {filteredFindings.length}
            </span>
          </div>

          <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#EA580C] block">
              Confirmed Concerns
            </span>
            <span className="text-2xl font-bold font-mono text-[#EA580C] mt-1 block">
              {confirmedConcerns.length}
            </span>
          </div>

          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#059669] block">
              Dismissed / Benign
            </span>
            <span className="text-2xl font-bold font-mono text-[#059669] mt-1 block">
              {notConcerns.length}
            </span>
          </div>

          <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#4F46E5] block">
              Information Requested
            </span>
            <span className="text-2xl font-bold font-mono text-[#4F46E5] mt-1 block">
              {requiresInfo.length + pendingReview.length}
            </span>
          </div>
        </div>

        {/* Regulatory Observation Narrative */}
        <div className="p-4 bg-[#FAFAFA] rounded-xl border border-[#E4E4E7] text-xs leading-relaxed space-y-2">
          <h3 className="font-bold text-[#0F172A] text-sm flex items-center space-x-2">
            <Scale className="w-4 h-4 text-[#4F46E5]" />
            <span>Supervisory Findings & Compliance Directives</span>
          </h3>
          <p className="text-[#27272A]">
            This supervisory record consolidates operational telemetric execution gaps identified across designated Critical Sector Entities (CSEs). Under Section 70A(2) of the Information Technology Act, 2000, Critical Sector Entities are legally mandated to maintain continuous 24x7 SOC readiness, prevent unauthorized triage bypass, and verify all high-priority correlation signals with forensic evidentiary backing.
          </p>
          <p className="text-[#71717A]">
            The determinations below reflect the official human review performed by the NCIIPC Cyber Supervisory Wing based on examination of underlying PCAP packet flows, SIEM ingest rates, and analyst shift activity logs.
          </p>
        </div>

        {/* Detailed Itemized Findings Table */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#71717A] mb-3">
            Itemized Supervisory Determinations ({filteredFindings.length} Items)
          </h3>

          <div className="overflow-x-auto border border-[#E4E4E7] rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F4F4F5] text-[#71717A] font-bold uppercase tracking-wider text-[10px] border-b border-[#E4E4E7]">
                <tr>
                  <th className="py-2.5 px-3">Finding Ref</th>
                  <th className="py-2.5 px-3">Entity</th>
                  <th className="py-2.5 px-3">Execution Gap</th>
                  <th className="py-2.5 px-3">Priority</th>
                  <th className="py-2.5 px-3">Human Determination</th>
                  <th className="py-2.5 px-3">Official Remarks & Directive</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E4E7]">
                {filteredFindings.map((f) => (
                  <tr key={f.id} className="hover:bg-[#FAFAFA] transition">
                    <td className="py-2.5 px-3 font-mono font-bold text-[#4F46E5] whitespace-nowrap">
                      {f.id}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span className="font-bold text-[#09090B]">{f.cseCode}</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-[#09090B]">{f.title}</div>
                      <div className="text-[10px] text-[#71717A]">{f.category}</div>
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                        f.priority === 'Critical' ? 'bg-red-50 text-red-600 border border-red-200' :
                        f.priority === 'High' ? 'bg-orange-50 text-[#EA580C] border border-orange-200' :
                        'bg-amber-50 text-[#D97706] border border-amber-200'
                      }`}>
                        {f.priority}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        f.status === 'Confirmed Concern' ? 'bg-orange-50 text-[#EA580C] border border-orange-200' :
                        f.status === 'Not a Concern' ? 'bg-emerald-50 text-[#059669] border border-emerald-200' :
                        f.status === 'Requires Information' ? 'bg-indigo-50 text-[#4F46E5] border border-indigo-200' :
                        'bg-amber-50 text-[#D97706] border border-amber-200'
                      }`}>
                        {f.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-[#71717A] text-[11px] max-w-xs">
                      {f.supervisorRemarks || (
                        <span className="text-[#A1A1AA] italic">Pending supervisory evaluation</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Human-in-the-Loop Sign-off & Authority Stamp */}
        <div className="pt-6 border-t border-[#E4E4E7] flex flex-col sm:flex-row justify-between items-end gap-6 text-xs">
          <div className="space-y-1">
            <div className="text-[#4F46E5] font-semibold uppercase tracking-wider text-[11px]">
              SUPERVISORY VERIFICATION MANDATE
            </div>
            <p className="text-[#71717A] max-w-sm text-[11px]">
              All determinations recorded herein are authenticated with the official digital signature of the designated supervisory officer pursuant to NCIIPC guidelines.
            </p>
          </div>

          <div className="text-right border-l border-[#E4E4E7] pl-6 space-y-1">
            <div className="font-bold text-sm text-[#09090B]">
              Shri Rajeshwar Rao
            </div>
            <div className="text-xs text-[#059669] font-semibold">
              Deputy Director, Cyber Supervisory Wing
            </div>
            <div className="text-[11px] font-mono text-[#71717A]">
              NCIIPC / NTRO, Block-III, CGO Complex, New Delhi
            </div>
            <div className="inline-block mt-2 px-3 py-1 bg-indigo-50 border border-indigo-200 text-[10px] font-mono text-[#4F46E5] font-bold rounded-lg">
              SEAL: NCIIPC-SUPV-VERIFIED-2026
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
