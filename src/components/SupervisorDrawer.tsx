import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, AlertOctagon, HelpCircle, FileText, Hash, ShieldCheck, Clock, Building, Scale, ArrowRight } from 'lucide-react';
import { Finding, EvidenceItem, AssessmentStatus } from '../types';

interface SupervisorDrawerProps {
  finding: Finding | null;
  isOpen: boolean;
  onClose: () => void;
  evidenceItems: EvidenceItem[];
  onSaveAssessment: (
    findingId: string,
    status: AssessmentStatus,
    remarks: string,
    reviewer: string
  ) => void;
}

export const SupervisorDrawer: React.FC<SupervisorDrawerProps> = ({
  finding,
  isOpen,
  onClose,
  evidenceItems,
  onSaveAssessment
}) => {
  const [selectedStatus, setSelectedStatus] = useState<AssessmentStatus>('Confirmed Concern');
  const [remarks, setRemarks] = useState('');
  const [reviewerName, setReviewerName] = useState('Shri Rajeshwar Rao (Dy. Director, NCIIPC)');
  const [verifiedEvidence, setVerifiedEvidence] = useState<string[]>([]);
  const [showSavedFeedback, setShowSavedFeedback] = useState(false);

  useEffect(() => {
    if (finding) {
      setSelectedStatus(finding.status === 'Pending Review' ? 'Confirmed Concern' : finding.status);
      setRemarks(finding.supervisorRemarks || '');
      setVerifiedEvidence(finding.evidenceIds || []);
      setShowSavedFeedback(false);
    }
  }, [finding]);

  if (!isOpen || !finding) return null;

  const findingEvidences = evidenceItems.filter(e => finding.evidenceIds.includes(e.id));

  const handleToggleEvidence = (id: string) => {
    setVerifiedEvidence(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!remarks.trim()) {
      alert('Please provide supervisory remarks and rationale before recording your official assessment.');
      return;
    }
    onSaveAssessment(finding.id, selectedStatus, remarks, reviewerName);
    setShowSavedFeedback(true);
    setTimeout(() => {
      setShowSavedFeedback(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#FFFFFF] text-[#09090B] h-full shadow-2xl flex flex-col border-l border-[#E4E4E7] overflow-y-auto">
        
        {/* Drawer Header */}
        <div className="bg-[#FAFAFA] text-[#09090B] p-5 sticky top-0 z-10 border-b border-[#E4E4E7]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded-md text-xs font-mono font-bold bg-indigo-50 text-[#4F46E5] border border-indigo-200">
                {finding.id}
              </span>
              <span className="text-xs uppercase tracking-wider text-[#71717A] font-semibold">
                Supervisory Case Review
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#71717A] hover:text-[#09090B] hover:bg-[#F4F4F5] transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <h2 className="text-lg font-bold text-[#09090B] mt-2 leading-snug">
            {finding.title}
          </h2>
          <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-[#71717A]">
            <span className="flex items-center space-x-1">
              <Building className="w-3.5 h-3.5 text-[#4F46E5]" />
              <strong className="text-[#4F46E5]">{finding.cseCode}</strong>: {finding.cseName}
            </span>
            <span className="text-[#E4E4E7]">•</span>
            <span className="bg-[#F4F4F5] px-2 py-0.5 rounded-md text-[#27272A] border border-[#E4E4E7]">
              {finding.sector}
            </span>
            <span className="text-[#E4E4E7]">•</span>
            <span className="flex items-center space-x-1 text-[#71717A]">
              <Clock className="w-3.5 h-3.5 text-[#71717A]" />
              <span>{finding.detectedAt}</span>
            </span>
          </div>
        </div>

        {/* Drawer Content */}
        <div className="p-6 space-y-6 flex-1 bg-[#FFFFFF]">
          
          {/* Statutory Mandate Notice */}
          <div className="bg-amber-50 border-l-4 border-amber-500 p-3.5 rounded-xl text-xs text-[#27272A] leading-relaxed flex items-start space-x-2.5">
            <Scale className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-800">Human-in-the-Loop Supervisory Protocol</p>
              <p className="text-amber-700 mt-0.5">
                The parameters below represent <strong className="text-amber-900">preliminary telemetry signals</strong> surfaced by SAT-SA algorithms. Final regulatory determination rests solely with the designated NCIIPC supervisory officer based on forensic evidence verification.
              </p>
            </div>
          </div>

          {/* Signal Diagnostics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[#FAFAFA] p-3 rounded-xl border border-[#E4E4E7]">
              <span className="text-[11px] uppercase tracking-wider text-[#71717A] block font-medium">Priority Level</span>
              <span className="font-bold text-sm text-[#EA580C] mt-0.5 block">{finding.priority}</span>
            </div>
            <div className="bg-[#FAFAFA] p-3 rounded-xl border border-[#E4E4E7]">
              <span className="text-[11px] uppercase tracking-wider text-[#71717A] block font-medium">Signal Score</span>
              <span className="font-bold text-sm text-[#4F46E5] mt-0.5 block font-mono">{finding.signalScore}/100</span>
            </div>
            <div className="bg-[#FAFAFA] p-3 rounded-xl border border-[#E4E4E7]">
              <span className="text-[11px] uppercase tracking-wider text-[#71717A] block font-medium">Rule Identifier</span>
              <span className="font-bold text-xs text-[#09090B] mt-0.5 block font-mono">{finding.ruleId}</span>
            </div>
            <div className="bg-[#FAFAFA] p-3 rounded-xl border border-[#E4E4E7]">
              <span className="text-[11px] uppercase tracking-wider text-[#71717A] block font-medium">Current Status</span>
              <span className="font-bold text-xs text-[#09090B] mt-0.5 block">{finding.status}</span>
            </div>
          </div>

          {/* System Observation & Potential Impact */}
          <div className="space-y-4">
            <div className="bg-[#FAFAFA] p-4 rounded-xl border border-[#E4E4E7]">
              <h3 className="text-xs uppercase tracking-wider font-bold text-[#4F46E5] mb-2 flex items-center space-x-1.5">
                <FileText className="w-3.5 h-3.5 text-[#4F46E5]" />
                <span>Automated Execution-Gap Signal Observation</span>
              </h3>
              <p className="text-sm text-[#27272A] leading-relaxed">
                {finding.systemObservation}
              </p>
            </div>

            <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-200">
              <h3 className="text-xs uppercase tracking-wider font-bold text-[#EA580C] mb-1.5 flex items-center space-x-1.5">
                <AlertOctagon className="w-3.5 h-3.5 text-[#EA580C]" />
                <span>Potential Operational Impact on Critical Infrastructure</span>
              </h3>
              <p className="text-sm text-[#27272A] leading-relaxed">
                {finding.potentialImpact}
              </p>
            </div>
          </div>

          {/* Underlying Evidentiary Artifacts */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs uppercase tracking-wider font-bold text-[#09090B] flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-[#059669]" />
                <span>Corroborating Telemetry Evidence ({findingEvidences.length})</span>
              </h3>
              <span className="text-[11px] text-[#71717A]">Select evidence checked during review</span>
            </div>

            <div className="space-y-3">
              {findingEvidences.length === 0 ? (
                <p className="text-xs text-[#71717A] italic bg-[#FAFAFA] p-3 rounded-xl border border-[#E4E4E7]">
                  No linked raw artifacts found for this finding ID.
                </p>
              ) : (
                findingEvidences.map((ev) => (
                  <div
                    key={ev.id}
                    className={`p-3.5 rounded-xl border transition ${
                      verifiedEvidence.includes(ev.id)
                        ? 'bg-[#FAFAFA] border-indigo-300 ring-1 ring-indigo-200'
                        : 'bg-[#FAFAFA] border-[#E4E4E7]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start space-x-2.5">
                        <input
                          type="checkbox"
                          id={`ev-${ev.id}`}
                          checked={verifiedEvidence.includes(ev.id)}
                          onChange={() => handleToggleEvidence(ev.id)}
                          className="mt-1 h-4 w-4 rounded border-[#E4E4E7] text-[#4F46E5] focus:ring-[#4F46E5] accent-[#4F46E5] cursor-pointer"
                        />
                        <div>
                          <label htmlFor={`ev-${ev.id}`} className="text-xs font-bold text-[#09090B] cursor-pointer flex items-center space-x-2">
                            <span>{ev.id}</span>
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-indigo-50 text-[#4F46E5] border border-indigo-200">
                              {ev.artifactType}
                            </span>
                          </label>
                          <p className="text-xs text-[#71717A] mt-1 leading-normal">
                            {ev.summary}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-[#71717A] shrink-0">
                        {ev.timestamp.split(' ')[1]}
                      </span>
                    </div>

                    {/* Raw payload snippet */}
                    <div className="mt-2.5 bg-[#F4F4F5] text-[#27272A] p-2.5 rounded-lg font-mono text-[11px] overflow-x-auto border border-[#E4E4E7]">
                      <div className="flex items-center justify-between text-[10px] text-[#71717A] mb-1 border-b border-[#E4E4E7] pb-1">
                        <span className="flex items-center space-x-1">
                          <Hash className="w-3 h-3 text-[#4F46E5]" />
                          <span>SHA-256: {ev.sha256Checksum.slice(0, 16)}...</span>
                        </span>
                        <span className="text-[#059669] font-semibold">Asset: {ev.targetAsset}</span>
                      </div>
                      <pre className="whitespace-pre-wrap">{ev.rawPayloadSnippet}</pre>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Official Supervisor Review Form */}
          <form onSubmit={handleSubmit} className="bg-[#FAFAFA] p-5 rounded-xl border border-[#E4E4E7] space-y-4">
            <div className="flex items-center space-x-2 border-b border-[#E4E4E7] pb-3">
              <Scale className="w-5 h-5 text-[#059669]" />
              <div>
                <h3 className="font-bold text-sm text-[#09090B]">
                  Official NCIIPC Supervisory Assessment Record
                </h3>
                <p className="text-[11px] text-[#71717A]">
                  Under Section 70A, Information Technology Act, 2000
                </p>
              </div>
            </div>

            {/* Assessment Option Pills */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#71717A] block mb-2">
                Supervisory Determination (Human Judgment)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedStatus('Confirmed Concern')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center space-x-1.5 transition ${
                    selectedStatus === 'Confirmed Concern'
                      ? 'bg-[#EA580C] text-white border-[#EA580C]'
                      : 'bg-[#FFFFFF] text-[#71717A] border-[#E4E4E7] hover:text-[#09090B]'
                  }`}
                >
                  <AlertOctagon className="w-4 h-4 shrink-0" />
                  <span>Confirmed Concern</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedStatus('Not a Concern')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center space-x-1.5 transition ${
                    selectedStatus === 'Not a Concern'
                      ? 'bg-[#059669] text-white border-[#059669]'
                      : 'bg-[#FFFFFF] text-[#71717A] border-[#E4E4E7] hover:text-[#09090B]'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Not a Concern</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedStatus('Requires Information')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center space-x-1.5 transition ${
                    selectedStatus === 'Requires Information'
                      ? 'bg-[#4F46E5] text-white border-[#4F46E5] font-bold'
                      : 'bg-[#FFFFFF] text-[#71717A] border-[#E4E4E7] hover:text-[#09090B]'
                  }`}
                >
                  <HelpCircle className="w-4 h-4 shrink-0" />
                  <span>Requires Info</span>
                </button>
              </div>
            </div>

            {/* Reviewer Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-[#71717A] block mb-1">
                  Supervisory Officer
                </label>
                <input
                  type="text"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  className="w-full bg-[#FFFFFF] border border-[#E4E4E7] rounded-xl px-3 py-1.5 text-xs text-[#09090B] font-medium focus:outline-none focus:border-[#4F46E5]"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#71717A] block mb-1">
                  Action Authority
                </label>
                <div className="bg-[#FFFFFF] border border-[#E4E4E7] rounded-xl px-3 py-1.5 text-xs text-[#4F46E5] font-mono font-medium">
                  NCIIPC/OPS/SUPV/2026/S-409
                </div>
              </div>
            </div>

            {/* Remarks / Rationale */}
            <div>
              <label className="text-xs font-bold text-[#71717A] block mb-1">
                Official Rationale & Directive to CSE <span className="text-[#EA580C]">*</span>
              </label>
              <textarea
                rows={3}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Enter regulatory assessment, specific telemetry evidence corroborated, and mandated remediation directives for the Critical Sector Entity CISO..."
                className="w-full bg-[#FFFFFF] border border-[#E4E4E7] rounded-xl p-3 text-xs text-[#09090B] focus:outline-none focus:border-[#4F46E5] leading-relaxed placeholder-[#71717A]"
                required
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] text-[#71717A]">
                {verifiedEvidence.length} of {findingEvidences.length} evidence artifacts verified
              </span>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-2 text-xs font-medium text-[#71717A] bg-[#FFFFFF] hover:text-[#09090B] hover:bg-[#F4F4F5] border border-[#E4E4E7] rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#4F46E5] hover:bg-indigo-700 rounded-xl flex items-center space-x-1.5 transition font-bold"
                >
                  <span>Save Assessment</span>
                  <ArrowRight className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
            </div>

            {showSavedFeedback && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-300 text-[#059669] rounded-xl text-xs font-bold text-center flex items-center justify-center space-x-2 animate-in fade-in">
                <ShieldCheck className="w-4 h-4 text-[#059669]" />
                <span>Supervisory Assessment Recorded & Logged in Audit Trail!</span>
              </div>
            )}
          </form>

        </div>
      </div>
    </div>
  );
};
