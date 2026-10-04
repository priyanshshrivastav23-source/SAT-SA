import React, { useState } from 'react';
import { FileCheck, Search, Copy, Check, ShieldCheck, AlertCircle } from 'lucide-react';
import { EvidenceItem, Finding } from '../../types';

interface EvidenceTabProps {
  evidenceItems: EvidenceItem[];
  findings: Finding[];
  onOpenFindingByEvidence: (findingId: string) => void;
  selectedEvidenceId?: string | null;
}

export const EvidenceTab: React.FC<EvidenceTabProps> = ({
  evidenceItems,
  findings,
  onOpenFindingByEvidence,
  selectedEvidenceId
}) => {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredEvidence = evidenceItems.filter(item => {
    const matchesSearch =
      item.id.toLowerCase().includes(search.toLowerCase()) ||
      item.cseCode.toLowerCase().includes(search.toLowerCase()) ||
      item.summary.toLowerCase().includes(search.toLowerCase()) ||
      item.sha256Checksum.toLowerCase().includes(search.toLowerCase()) ||
      item.rawPayloadSnippet.toLowerCase().includes(search.toLowerCase());

    const matchesType = selectedType === 'ALL' || item.artifactType === selectedType;
    return matchesSearch && matchesType;
  });

  const handleCopyHash = (hash: string, id: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-[#FFFFFF] p-6 rounded-xl border border-[#E4E4E7]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-bold text-[#09090B] flex items-center space-x-2">
              <FileCheck className="w-5 h-5 text-[#4F46E5]" />
              <span>National Telemetry Evidence Repository</span>
            </h1>
            <p className="text-xs text-[#71717A] mt-0.5">
              Forensic artifacts, raw protocol payload dumps, and cryptographically signed chain-of-custody logs
            </p>
          </div>
          <div className="bg-[#F4F4F5] border border-[#E4E4E7] rounded-xl px-3 py-1.5 text-xs text-[#059669] font-mono flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-[#059669]" />
            <span>IT Act Sec 65B Forensically Admissible</span>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-3 border-t border-[#E4E4E7]">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#71717A]" />
            <input
              type="text"
              placeholder="Search by evidence ID (EVD-901), hash, IP, or payload snippet..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#FAFAFA] border border-[#E4E4E7] rounded-xl pl-9 pr-3 py-2 text-xs text-[#09090B] placeholder-[#71717A] focus:outline-none focus:border-[#4F46E5]"
            />
          </div>

          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full bg-[#FAFAFA] border border-[#E4E4E7] rounded-xl px-3 py-2 text-xs text-[#09090B] focus:outline-none focus:border-[#4F46E5]"
            >
              <option value="ALL">All Artifact Types</option>
              <option value="PCAP Flow Sample">PCAP Flow Sample</option>
              <option value="SIEM Query Log">SIEM Query Log</option>
              <option value="SOC Analyst Shift Log">SOC Analyst Shift Log</option>
              <option value="Rule Configuration Diff">Rule Configuration Diff</option>
              <option value="Firewall Syslog Extract">Firewall Syslog Extract</option>
            </select>
          </div>
        </div>
      </div>

      {/* Evidence Items List */}
      <div className="space-y-4">
        {filteredEvidence.map((ev) => {
          const isHighlighted = selectedEvidenceId === ev.id;
          const linkedFinding = findings.find(f => f.id === ev.findingId);

          return (
            <div
              key={ev.id}
              className={`bg-[#FFFFFF] rounded-xl border transition overflow-hidden ${
                isHighlighted
                  ? 'border-2 border-[#4F46E5] ring-2 ring-indigo-200'
                  : 'border-[#E4E4E7] hover:border-indigo-300'
              }`}
            >
              {/* Artifact Header */}
              <div className="bg-[#FAFAFA] px-5 py-3 border-b border-[#E4E4E7] flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-2.5">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-[#4F46E5] border border-indigo-200">
                    {ev.id}
                  </span>
                  <span className="font-bold text-xs text-[#09090B]">
                    {ev.cseCode}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#FFFFFF] text-[#4F46E5] border border-[#E4E4E7]">
                    {ev.artifactType}
                  </span>
                </div>
                <div className="flex items-center space-x-3 text-xs text-[#71717A]">
                  <span>Timestamp: <strong className="font-mono text-[#09090B]">{ev.timestamp}</strong></span>
                  {linkedFinding && (
                    <button
                      onClick={() => onOpenFindingByEvidence(linkedFinding.id)}
                      className="px-2.5 py-1 text-xs font-bold rounded-xl bg-[#4F46E5] hover:bg-indigo-700 text-white transition"
                    >
                      Assess in Finding {linkedFinding.id}
                    </button>
                  )}
                </div>
              </div>

              {/* Artifact Body */}
              <div className="p-5 space-y-4">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#71717A] mb-1">
                    Forensic Summary & Anomaly Rationale
                  </h3>
                  <p className="text-xs text-[#27272A] leading-relaxed font-sans">
                    {ev.summary}
                  </p>
                  <div className="mt-2 text-xs text-[#EA580C] flex items-center space-x-1.5 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>Flagged Operational Defect: {ev.flaggedAnomalyReason}</span>
                  </div>
                </div>

                {/* Metadata & Source/Target */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  {ev.sourceIp && (
                    <div className="bg-[#FAFAFA] p-2.5 rounded-xl border border-[#E4E4E7]">
                      <span className="text-[#71717A] text-[10px] uppercase font-bold block">Origin IP / Workstation</span>
                      <span className="font-mono font-bold text-[#4F46E5] mt-0.5 block">{ev.sourceIp}</span>
                    </div>
                  )}
                  {ev.targetAsset && (
                    <div className="bg-[#FAFAFA] p-2.5 rounded-xl border border-[#E4E4E7]">
                      <span className="text-[#71717A] text-[10px] uppercase font-bold block">Target Critical Asset</span>
                      <span className="font-mono font-bold text-[#09090B] mt-0.5 block">{ev.targetAsset}</span>
                    </div>
                  )}
                  <div className="bg-[#FAFAFA] p-2.5 rounded-xl border border-[#E4E4E7] sm:col-span-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[#71717A] text-[10px] uppercase font-bold">SHA-256 Checksum</span>
                      <button
                        onClick={() => handleCopyHash(ev.sha256Checksum, ev.id)}
                        className="text-[10px] text-[#4F46E5] hover:text-indigo-700 font-medium flex items-center space-x-0.5"
                      >
                        {copiedId === ev.id ? (
                          <>
                            <Check className="w-3 h-3 text-[#059669]" />
                            <span className="text-[#059669]">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                    <span className="font-mono text-[10px] text-[#27272A] truncate block mt-0.5" title={ev.sha256Checksum}>
                      {ev.sha256Checksum}
                    </span>
                  </div>
                </div>

                {/* Raw Snippet Box */}
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#71717A] block mb-1">
                    Raw Telemetry Snippet / Audit Diff
                  </span>
                  <div className="bg-[#F4F4F5] text-[#27272A] p-3.5 rounded-xl font-mono text-[11px] overflow-x-auto border border-[#E4E4E7] leading-relaxed">
                    <pre className="whitespace-pre-wrap">{ev.rawPayloadSnippet}</pre>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredEvidence.length === 0 && (
        <div className="p-12 text-center bg-[#FFFFFF] rounded-xl border border-[#E4E4E7] text-[#71717A]">
          <FileCheck className="w-8 h-8 text-[#71717A] mx-auto mb-2" />
          <p className="text-sm font-medium">No evidentiary artifacts match the query.</p>
        </div>
      )}

    </div>
  );
};
