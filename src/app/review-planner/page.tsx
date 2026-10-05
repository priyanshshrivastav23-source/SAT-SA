'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ClipboardList,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  FileSpreadsheet,
  Download,
  Printer,
  Sparkles,
  Info,
  Scale,
  X,
  FileText,
  HelpCircle,
  Shield,
  Layers,
  ExternalLink
} from 'lucide-react';
import { satSaService } from '@/services/satSaService';
import { ReviewQueueItem } from '@/types/sat-sa';

export default function ReviewPlannerPage() {
  const [queueItems, setQueueItems] = useState<ReviewQueueItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<ReviewQueueItem | null>(null);
  const [showPackModal, setShowPackModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  useEffect(() => {
    async function load() {
      const data = await satSaService.getReviewQueueItems();
      setQueueItems(data);
      if (data.length > 0) {
        setSelectedItem(data[0]);
      }
    }
    load();
  }, []);

  const openReviewPack = (item?: ReviewQueueItem) => {
    if (item) {
      setSelectedItem(item);
    }
    setShowPackModal(true);
  };

  const filteredItems = queueItems.filter((item) => {
    if (activeTab === 'high') return item.priority === 'HIGH';
    if (activeTab === 'medium') return item.priority === 'MEDIUM';
    if (activeTab === 'low') return item.priority === 'LOW';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-warm-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-mono">
              Examiner Assistance
            </span>
            <span className="text-[10px] font-mono bg-warm-100 text-warm-700 px-2 py-0.5 rounded">
              Supervisory Sampling & Inquiry Docket
            </span>
          </div>
          <h1 className="text-xl font-bold text-warm-900 mt-1">
            Examiner Review Planner
          </h1>
          <p className="text-xs text-warm-600 mt-0.5">
            Algorithmic prioritization of high-entropy entities and processes for structured human supervisory inspection.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => openReviewPack()}
            className="px-4 py-2 bg-warm-900 hover:bg-warm-800 text-warm-50 text-xs font-semibold rounded-xl flex items-center space-x-2 transition shadow-sm"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Generate Review Pack</span>
          </button>
        </div>
      </div>

      {/* Section 20: Top 6 Sampling Stratification Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-xl border border-warm-200 shadow-sm">
          <div className="text-[10px] uppercase font-bold text-warm-500 tracking-wider">
            Total records
          </div>
          <div className="text-2xl font-bold text-warm-900 mt-1 font-mono">
            125,430
          </div>
          <div className="text-[11px] text-warm-500 mt-0.5">Across 5 CSEs</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-200 bg-emerald-50/30 shadow-sm">
          <div className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">
            Recommended review sample
          </div>
          <div className="text-2xl font-bold text-emerald-900 mt-1 font-mono">
            120
          </div>
          <div className="text-[11px] text-emerald-700 mt-0.5">Statistically powered</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-warm-200 shadow-sm">
          <div className="text-[10px] uppercase font-bold text-warm-500 tracking-wider">
            Random control sample
          </div>
          <div className="text-2xl font-bold text-warm-900 mt-1 font-mono">
            20
          </div>
          <div className="text-[11px] text-warm-500 mt-0.5">Unbiased baseline</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-orange-200 bg-orange-50/30 shadow-sm">
          <div className="text-[10px] uppercase font-bold text-orange-800 tracking-wider">
            High priority
          </div>
          <div className="text-2xl font-bold text-orange-900 mt-1 font-mono">
            35
          </div>
          <div className="text-[11px] text-orange-700 mt-0.5">Execution & silent voids</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-warm-200 shadow-sm">
          <div className="text-[10px] uppercase font-bold text-warm-500 tracking-wider">
            Diverse findings
          </div>
          <div className="text-2xl font-bold text-warm-900 mt-1 font-mono">
            45
          </div>
          <div className="text-[11px] text-warm-500 mt-0.5">Cross-sector variance</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-warm-200 shadow-sm">
          <div className="text-[10px] uppercase font-bold text-warm-500 tracking-wider">
            Critical assets
          </div>
          <div className="text-2xl font-bold text-warm-900 mt-1 font-mono">
            20
          </div>
          <div className="text-[11px] text-warm-500 mt-0.5">Tier-1 infrastructure</div>
        </div>
      </div>

      {/* Sampling Methodology Guidance Box */}
      <div className="p-4 bg-warm-100 border border-warm-200 rounded-xl text-xs text-warm-700 flex items-start space-x-3">
        <Info className="w-4 h-4 text-warm-500 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-warm-900 block">Supervisory Examiner Principle:</span>
          <p className="text-warm-600 mt-0.5 leading-relaxed">
            SAT-SA does not issue automated administrative sanctions. The Review Planner assembles risk-weighted evidence dossiers, peer baselines, and targeted interview inquiries to accelerate independent human examiner determinations during on-site inspections.
          </p>
        </div>
      </div>

      {/* Review Queue Table */}
      <div className="bg-white rounded-2xl border border-warm-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-warm-100 border-b border-warm-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-warm-900 uppercase tracking-wider">
              Prioritized Review Queue
            </span>
            <span className="text-xs text-warm-500 font-mono">
              ({queueItems.length} Docket Items)
            </span>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="text-warm-500 font-medium">Filter Severity:</span>
            <div className="inline-flex rounded-lg border border-warm-200 bg-white p-0.5">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${
                  activeTab === 'all'
                    ? 'bg-warm-900 text-warm-50'
                    : 'text-warm-600 hover:text-warm-900'
                }`}
              >
                All ({queueItems.length})
              </button>
              <button
                onClick={() => setActiveTab('high')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${
                  activeTab === 'high'
                    ? 'bg-warm-900 text-warm-50'
                    : 'text-warm-600 hover:text-warm-900'
                }`}
              >
                High
              </button>
              <button
                onClick={() => setActiveTab('medium')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${
                  activeTab === 'medium'
                    ? 'bg-warm-900 text-warm-50'
                    : 'text-warm-600 hover:text-warm-900'
                }`}
              >
                Medium
              </button>
              <button
                onClick={() => setActiveTab('low')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${
                  activeTab === 'low'
                    ? 'bg-warm-900 text-warm-50'
                    : 'text-warm-600 hover:text-warm-900'
                }`}
              >
                Low
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-warm-50 text-warm-500 uppercase tracking-wider text-[10px] border-b border-warm-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Priority</th>
                <th className="py-3 px-4 font-semibold">Finding</th>
                <th className="py-3 px-4 font-semibold">Entity</th>
                <th className="py-3 px-4 font-semibold">Reason</th>
                <th className="py-3 px-4 font-semibold">Evidence</th>
                <th className="py-3 px-4 font-semibold">Suggested Action</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-100">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-warm-50/70 transition">
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`text-[10px] px-2.5 py-1 rounded-full font-bold font-mono uppercase ${
                        item.priority === 'HIGH'
                          ? 'bg-orange-100 text-orange-800 border border-orange-200'
                          : item.priority === 'MEDIUM'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-warm-100 text-warm-700 border border-warm-200'
                      }`}
                    >
                      {item.priority}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-medium">
                    <Link
                      href={`/findings/${item.findingId}`}
                      className="font-bold text-warm-900 hover:text-emerald-700 hover:underline flex items-center space-x-1"
                    >
                      <span className="font-mono text-emerald-800 mr-1.5">{item.findingId}</span>
                      <span>{item.findingTitle}</span>
                    </Link>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <Link
                      href={`/entities/${item.entityId}`}
                      className="text-warm-800 hover:text-emerald-700 hover:underline font-semibold"
                    >
                      {item.entity}
                    </Link>
                  </td>

                  <td className="py-3.5 px-4 max-w-xs text-warm-700 leading-relaxed">
                    {item.reason}
                  </td>

                  <td className="py-3.5 px-4 max-w-[200px] text-warm-600 font-mono text-[11px]">
                    {item.evidence}
                  </td>

                  <td className="py-3.5 px-4 max-w-xs text-warm-800 font-medium leading-relaxed">
                    {item.suggestedAction}
                  </td>

                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => openReviewPack(item)}
                      className="px-3 py-1.5 bg-warm-100 hover:bg-warm-200 text-warm-800 rounded-lg text-xs font-semibold border border-warm-200 transition"
                    >
                      Review Pack
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Pack Modal */}
      {showPackModal && selectedItem && (
        <div className="fixed inset-0 z-50 bg-warm-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-warm-200 shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-warm-200 flex items-start justify-between bg-warm-50 rounded-t-2xl">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-mono">
                    Supervisory Review Pack
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-100 text-orange-800 border border-orange-200 font-bold">
                    PRIORITY: {selectedItem.priority}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-warm-900 mt-1">
                  Examiner On-Site Inspection Dossier — {selectedItem.findingId}
                </h2>
                <p className="text-xs text-warm-600 mt-0.5">
                  Target Entity: <span className="font-semibold text-warm-800">{selectedItem.entity}</span> • Target Finding: {selectedItem.findingTitle}
                </p>
              </div>

              <button
                onClick={() => setShowPackModal(false)}
                className="p-1.5 text-warm-400 hover:text-warm-700 rounded-lg hover:bg-warm-200/50 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Finding Summary */}
              <div className="space-y-2">
                <div className="text-[11px] uppercase font-bold text-warm-500 tracking-wider flex items-center space-x-1.5">
                  <FileText className="w-3.5 h-3.5 text-warm-700" />
                  <span>1. Finding Summary</span>
                </div>
                <div className="p-4 bg-warm-50 rounded-xl border border-warm-200 space-y-2">
                  <div className="text-xs font-bold text-warm-900">
                    {selectedItem.findingTitle} ({selectedItem.findingId})
                  </div>
                  <p className="text-xs text-warm-700 leading-relaxed">
                    {selectedItem.reason}
                  </p>
                  <div className="text-[11px] text-warm-600 font-mono pt-1 border-t border-warm-200/60">
                    <strong>Supervisory Status:</strong> Potential mismatch between reported SLA metrics and underlying operational evidence. Human inquiry recommended.
                  </div>
                </div>
              </div>

              {/* Supporting Evidence */}
              <div className="space-y-2">
                <div className="text-[11px] uppercase font-bold text-warm-500 tracking-wider flex items-center space-x-1.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-700" />
                  <span>2. Supporting Evidence Extract</span>
                </div>
                <div className="p-4 bg-warm-50 rounded-xl border border-warm-200 space-y-2">
                  <div className="text-xs text-warm-800 font-semibold">
                    Synthesized Operational Artifacts:
                  </div>
                  <p className="text-xs text-warm-700 font-mono bg-white p-2.5 rounded-lg border border-warm-200">
                    {selectedItem.evidence}
                  </p>
                  <div className="text-[11px] text-warm-600 flex items-center justify-between">
                    <span>Cryptographic Evidence Ledger Status: Verified SHA-256 Merkle root</span>
                    <Link
                      href={`/findings/${selectedItem.findingId}`}
                      className="text-emerald-700 hover:underline font-semibold flex items-center space-x-1"
                    >
                      <span>Explore Raw Records</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Peer Context */}
              <div className="space-y-2">
                <div className="text-[11px] uppercase font-bold text-warm-500 tracking-wider flex items-center space-x-1.5">
                  <Layers className="w-3.5 h-3.5 text-blue-700" />
                  <span>3. Sector Peer Context</span>
                </div>
                <div className="p-4 bg-blue-50/30 rounded-xl border border-blue-200 text-xs text-warm-800 leading-relaxed">
                  {selectedItem.peerContext}
                </div>
              </div>

              {/* Suggested Examiner Questions */}
              <div className="space-y-2">
                <div className="text-[11px] uppercase font-bold text-warm-500 tracking-wider flex items-center space-x-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
                  <span>4. Suggested Examiner Interview Inquiries</span>
                </div>
                <div className="bg-warm-50 rounded-xl border border-warm-200 p-4 space-y-3">
                  <p className="text-[11px] text-warm-600 italic">
                    Formulated for senior supervisory examiners during SOC lead / CISO inquiries:
                  </p>
                  <ul className="space-y-2">
                    {selectedItem.suggestedQuestions.map((q, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-warm-900 bg-white p-3 rounded-lg border border-warm-200 flex items-start space-x-2.5 shadow-2xs"
                      >
                        <span className="font-mono font-bold text-emerald-800 shrink-0">
                          Q{idx + 1}.
                        </span>
                        <span className="leading-relaxed font-medium">{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-warm-200 bg-warm-50 rounded-b-2xl flex items-center justify-between">
              <span className="text-[11px] text-warm-500 font-mono">
                Docket ID: {selectedItem.id} • Statutory IT Act Supervisory Record
              </span>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-white hover:bg-warm-100 text-warm-800 text-xs font-semibold rounded-lg border border-warm-200 flex items-center space-x-1.5 transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Pack</span>
                </button>
                <button
                  onClick={() => setShowPackModal(false)}
                  className="px-4 py-1.5 bg-warm-900 hover:bg-warm-800 text-warm-50 text-xs font-semibold rounded-lg transition"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
