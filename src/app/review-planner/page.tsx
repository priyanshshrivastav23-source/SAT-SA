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
  Scale
} from 'lucide-react';
import { satSaService } from '@/services/satSaService';
import { ReviewSampleItem } from '@/types/sat-sa';

export default function ReviewPlannerPage() {
  const [samples, setSamples] = useState<ReviewSampleItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>(['RS-001', 'RS-002']);
  const [showPackPreview, setShowPackPreview] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await satSaService.getReviewSamples();
      setSamples(data);
    }
    load();
  }, []);

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectedItems = samples.filter((s) => selectedIds.includes(s.id));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-warm-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-mono">
              Risk-Weighted Docket
            </span>
            <span className="text-[10px] font-mono bg-warm-100 text-warm-700 px-2 py-0.5 rounded">
              Supervisory Sampling Engine
            </span>
          </div>
          <h1 className="text-xl font-bold text-warm-900 mt-1">
            Examiner Review Prioritization & Sampling Planner
          </h1>
          <p className="text-xs text-warm-600 mt-0.5">
            Algorithmic prioritization of high-entropy entities and processes for structured human supervisory inspection.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowPackPreview(!showPackPreview)}
            className="px-3.5 py-1.5 bg-warm-900 hover:bg-warm-800 text-warm-50 text-xs font-semibold rounded-xl flex items-center space-x-1.5 transition shadow-sm"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>{showPackPreview ? 'Hide Review Pack' : `Generate Docket (${selectedIds.length})`}</span>
          </button>
        </div>
      </div>

      {/* Sampling Methodology Guidance Box */}
      <div className="p-4 bg-warm-100 border border-warm-200 rounded-xl text-xs text-warm-700 flex items-start space-x-3">
        <Info className="w-4 h-4 text-warm-500 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-warm-900 block">Methodological Disclaimer:</span>
          <p className="text-warm-600 mt-0.5 leading-relaxed">
            The proposed review sample below is prioritized based on <strong>risk-weighted discrepancy index</strong>, high-entropy shift transitions, and cross-sector stratification. This sample is targeted for supervisory inquiry and should not be construed as a statistically uniform randomized sample.
          </p>
        </div>
      </div>

      {/* Generated Review-Pack Modal / Preview Section */}
      {showPackPreview && (
        <div className="bg-white p-6 rounded-2xl border-2 border-emerald-700 shadow-lg space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-warm-200 pb-3">
            <div>
              <div className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">
                Official Examination Docket Preview
              </div>
              <h2 className="text-base font-bold text-warm-900">
                Proposed Supervisory On-Site / Remote Inspection Pack ({selectedItems.length} Targets)
              </h2>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => window.print()}
                className="px-3 py-1 bg-warm-100 hover:bg-warm-200 text-warm-800 text-xs font-semibold rounded-lg border border-warm-200 flex items-center space-x-1"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Docket</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-warm-50 text-warm-500 uppercase tracking-wider text-[10px] border-b border-warm-200">
                <tr>
                  <th className="py-2.5 px-3">Docket Item</th>
                  <th className="py-2.5 px-3">Target Identifier</th>
                  <th className="py-2.5 px-3">Selection Method</th>
                  <th className="py-2.5 px-3">Priority Score</th>
                  <th className="py-2.5 px-3">Assigned Examiner</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warm-100">
                {selectedItems.map((item) => (
                  <tr key={item.id}>
                    <td className="py-2 px-3 font-mono font-bold text-warm-900">{item.id}</td>
                    <td className="py-2 px-3 font-medium text-warm-800">{item.targetIdentifier}</td>
                    <td className="py-2 px-3 text-warm-600">{item.samplingMethod}</td>
                    <td className="py-2 px-3 font-mono font-bold text-orange-700">{item.priorityScore}/100</td>
                    <td className="py-2 px-3 text-warm-700">{item.assignedExaminer}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Prioritized Review Candidates List */}
      <div className="bg-white rounded-2xl border border-warm-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-warm-100 border-b border-warm-200 flex items-center justify-between text-xs text-warm-600">
          <span className="font-semibold text-warm-900">
            Ranked Review Candidates ({samples.length})
          </span>
          <span className="text-[11px] font-mono text-warm-500">
            Check box to include target in official examination docket
          </span>
        </div>

        <div className="divide-y divide-warm-100">
          {samples.map((item) => {
            const isChecked = selectedIds.includes(item.id);
            return (
              <div key={item.id} className="p-4 hover:bg-warm-50/80 transition flex items-start justify-between gap-4">
                <div className="flex items-start space-x-3 max-w-2xl">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleToggleSelect(item.id)}
                    className="mt-1 h-4 w-4 rounded border-warm-300 text-warm-900 focus:ring-warm-500 accent-warm-900 cursor-pointer"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-warm-900">{item.id}</span>
                      <span className="text-xs text-warm-500">•</span>
                      <span className="text-xs font-bold text-warm-800">{item.targetIdentifier}</span>
                      <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-warm-100 text-warm-600 border border-warm-200">
                        {item.targetType}
                      </span>
                    </div>

                    <p className="text-xs text-warm-700 leading-relaxed">
                      <strong>Selection Rationale:</strong> {item.reviewReason}
                    </p>

                    <div className="text-[11px] text-warm-500 flex flex-wrap items-center gap-3 pt-1">
                      <span>Sampling Method: <strong className="text-warm-800">{item.samplingMethod}</strong></span>
                      <span>•</span>
                      <span>Diversity Rationale: {item.diverseSampleRationale}</span>
                      <span>•</span>
                      <span>Related Signals: {item.relatedFindingsCount}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end space-y-2 shrink-0">
                  <span className="text-base font-bold font-mono text-orange-700">
                    Priority: {item.priorityScore}/100
                  </span>
                  <span className="text-[11px] text-warm-500 font-medium">
                    {item.assignedExaminer}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      item.status === 'Examiner Accepted'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-warm-100 text-warm-700 border border-warm-200'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
