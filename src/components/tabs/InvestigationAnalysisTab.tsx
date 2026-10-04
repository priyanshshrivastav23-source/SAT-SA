import React, { useState } from 'react';
import { SearchCode, FileText } from 'lucide-react';
import { INVESTIGATION_CASES } from '../../data/mockData';
import { InvestigationCase } from '../../types';

interface InvestigationAnalysisTabProps {
  onSelectEvidenceById: (evidenceId: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const InvestigationAnalysisTab: React.FC<InvestigationAnalysisTabProps> = ({
  onSelectEvidenceById,
  onNavigateTab
}) => {
  const [selectedCase, setSelectedCase] = useState<InvestigationCase>(INVESTIGATION_CASES[0]);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-[#FFFFFF] p-6 rounded-xl border border-[#E4E4E7]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-bold text-[#09090B] flex items-center space-x-2">
              <SearchCode className="w-5 h-5 text-[#4F46E5]" />
              <span>SOC Incident Investigation Latency & Delay Root-Cause Analysis</span>
            </h1>
            <p className="text-xs text-[#71717A] mt-0.5">
              Auditing incidents exceeding the statutory 4-Hour NCIIPC Rapid Containment Threshold
            </p>
          </div>
          <div className="bg-[#F4F4F5] border border-[#E4E4E7] rounded-xl px-3 py-1.5 text-xs text-[#4F46E5] font-mono font-medium">
            <span>Standard: 4.0h Statutory Containment Cap</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Cases List and Case Timeline Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Case Cards */}
        <div className="lg:col-span-1 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#71717A] px-1">
            Audited Cases ({INVESTIGATION_CASES.length})
          </h2>
          {INVESTIGATION_CASES.map((cs) => {
            const isSelected = selectedCase.id === cs.id;
            const breachHours = (cs.totalDurationHours - cs.nciipcThresholdHours).toFixed(1);

            return (
              <div
                key={cs.id}
                onClick={() => setSelectedCase(cs)}
                className={`p-4 rounded-xl border cursor-pointer transition ${
                  isSelected
                    ? 'bg-indigo-50/50 border-[#4F46E5] ring-1 ring-[#4F46E5]'
                    : 'bg-[#FFFFFF] border-[#E4E4E7] hover:bg-[#FAFAFA]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#4F46E5]">{cs.cseCode}</span>
                  <span className="font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-orange-50 text-[#EA580C] border border-orange-200">
                    +{breachHours}h Over SLA
                  </span>
                </div>
                <h3 className="font-bold text-xs text-[#09090B] mt-1.5 line-clamp-2">
                  {cs.title}
                </h3>
                <div className="mt-2 pt-2 border-t border-[#E4E4E7] flex justify-between text-[11px] text-[#71717A]">
                  <span>Delay Factor:</span>
                  <span className="font-semibold text-[#09090B]">{cs.delayReason}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Detailed Case Timeline & Delay Factor */}
        <div className="lg:col-span-2 space-y-5">
          
          <div className="bg-[#FFFFFF] p-6 rounded-xl border border-[#E4E4E7] space-y-5">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-[#E4E4E7] pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded-md text-xs font-mono font-bold bg-indigo-50 text-[#4F46E5] border border-indigo-200">
                    {selectedCase.id}
                  </span>
                  <span className="text-xs font-bold text-[#09090B]">
                    {selectedCase.cseName} ({selectedCase.cseCode})
                  </span>
                </div>
                <h2 className="text-base font-bold text-[#09090B] mt-2 leading-snug">
                  {selectedCase.title}
                </h2>
                <div className="mt-1 text-xs text-[#71717A]">
                  Incident Type: <strong className="text-[#4F46E5] font-medium">{selectedCase.incidentType}</strong>
                </div>
              </div>

              <div className="bg-[#FAFAFA] p-3 rounded-xl border border-[#E4E4E7] text-right shrink-0">
                <span className="text-[10px] uppercase font-bold text-[#71717A] block">Total Duration</span>
                <span className="text-xl font-bold font-mono text-[#EA580C] block">
                  {selectedCase.totalDurationHours} hrs
                </span>
                <span className="text-[10px] text-[#71717A]">Threshold: 4.0h</span>
              </div>
            </div>

            {/* Visual Step-by-Step Incident Lifecycle Timeline */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#71717A] mb-3">
                Chronological Incident Progression & Execution Gap
              </h3>

              <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E4E4E7]">
                {/* Step 1: Alert Trigger */}
                <div className="relative">
                  <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-[#4F46E5] border-2 border-[#FFFFFF]" />
                  <div className="bg-[#FAFAFA] p-3.5 rounded-xl border border-[#E4E4E7]">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#09090B]">1. Telemetry Alert Generated</span>
                      <span className="font-mono text-[#71717A]">{selectedCase.initialAlertTime}</span>
                    </div>
                    <p className="text-[11px] text-[#71717A] mt-1">
                      IDS / SIEM sensor detected high-priority signature and queued ticket for analyst action.
                    </p>
                  </div>
                </div>

                {/* Step 2: Analyst Pick-up with Delay Gap Highlight */}
                <div className="relative">
                  <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-[#D97706] border-2 border-[#FFFFFF]" />
                  <div className="bg-[#FAFAFA] p-3.5 rounded-xl border border-amber-300">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#D97706]">
                        2. Analyst Pick-up (Execution Delay Window)
                      </span>
                      <span className="font-mono text-[#71717A]">{selectedCase.analystPickupTime}</span>
                    </div>
                    <div className="mt-1 text-xs text-[#27272A]">
                      Assigned Analyst: <strong className="text-[#09090B]">{selectedCase.assignedAnalyst}</strong>
                    </div>
                    <div className="mt-2 p-2 bg-[#FFFFFF] rounded-lg border border-[#E4E4E7] text-xs text-[#27272A]">
                      <strong className="text-[#EA580C]">Identified Gap Factor:</strong> {selectedCase.delayReason}
                    </div>
                  </div>
                </div>

                {/* Step 3: Containment */}
                <div className="relative">
                  <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-[#059669] border-2 border-[#FFFFFF]" />
                  <div className="bg-[#FAFAFA] p-3.5 rounded-xl border border-[#E4E4E7]">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#059669]">3. Incident Isolated & Contained</span>
                      <span className="font-mono text-[#71717A]">{selectedCase.containmentTime}</span>
                    </div>
                    <p className="text-[11px] text-[#71717A] mt-1">
                      Threat contained following manual verification. Total duration exceeded guideline by {(selectedCase.totalDurationHours - selectedCase.nciipcThresholdHours).toFixed(1)} hours.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Linked Evidentiary Records */}
            <div className="pt-3 border-t border-[#E4E4E7]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#71717A] mb-2">
                Linked Telemetry Artifacts ({selectedCase.evidenceIds.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedCase.evidenceIds.map(evId => (
                  <button
                    key={evId}
                    onClick={() => {
                      onSelectEvidenceById(evId);
                      onNavigateTab('evidence');
                    }}
                    className="px-3 py-1.5 bg-[#FAFAFA] hover:bg-[#F4F4F5] hover:text-[#4F46E5] text-[#4F46E5] border border-[#E4E4E7] rounded-xl text-xs font-mono font-medium flex items-center space-x-1.5 transition"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#4F46E5]" />
                    <span>Inspect {evId}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Supervisor Notes */}
            {selectedCase.supervisorNotes && (
              <div className="p-3.5 bg-indigo-50/50 rounded-xl border-l-4 border-[#4F46E5] text-xs space-y-1">
                <span className="font-bold text-[#4F46E5] block">Supervisory Case Assessment Note:</span>
                <p className="text-[#27272A] leading-relaxed font-sans">
                  {selectedCase.supervisorNotes}
                </p>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
