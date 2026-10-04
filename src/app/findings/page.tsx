'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  HelpCircle,
  AlertOctagon,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  FileCheck2
} from 'lucide-react';
import { satSaService } from '@/services/satSaService';
import { Finding, FindingCategory, FindingPriority, FindingStatus } from '@/types/sat-sa';

import { cn } from '@/lib/utils';

export default function FindingsPage() {
  const [findings, setFindings] = useState<Finding[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedEntity, setSelectedEntity] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  useEffect(() => {
    async function load() {
      const data = await satSaService.getFindings();
      setFindings(data);
    }
    load();
  }, []);

  const categories: FindingCategory[] = [
    'Execution Gap',
    'Negative Space',
    'Peer & Anomaly',
    'Goodhart Lens',
    'Data Quality',
    'Evidence Integrity'
  ];

  const priorities: FindingPriority[] = ['Critical', 'High', 'Medium', 'Low'];
  const statuses: FindingStatus[] = ['New', 'Under Review', 'Confirmed for Follow-up', 'Rejected', 'Resolved'];

  const filteredFindings = findings.filter((f) => {
    const matchesSearch =
      f.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.entityCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.entityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.explanation.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'ALL' || f.category === selectedCategory;
    const matchesPriority = selectedPriority === 'ALL' || f.priority === selectedPriority;
    const matchesStatus = selectedStatus === 'ALL' || f.status === selectedStatus;
    const matchesEntity = selectedEntity === 'ALL' || f.entityCode === selectedEntity;

    return matchesSearch && matchesCategory && matchesPriority && matchesStatus && matchesEntity;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-warm-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-warm-500 font-mono">
              Central Supervisory Register
            </span>
            <span className="text-[10px] font-mono bg-warm-100 text-warm-700 px-2 py-0.5 rounded border border-warm-200">
              {findings.length} Active System Observations
            </span>
          </div>
          <h1 className="text-xl font-bold text-warm-900 mt-1 font-serif tracking-tight">
            Supervisory Findings & Evidence-Backed Observations
          </h1>
          <p className="text-xs text-warm-600 mt-0.5">
            System-surfaced operational patterns requiring human examiner review across the 6 supervisory evaluation categories.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          {/* View Mode Switcher */}
          <div className="bg-warm-100 p-0.5 rounded-xl border border-warm-200 flex items-center">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                "px-2.5 py-1 text-xs font-semibold rounded-lg transition",
                viewMode === 'grid'
                  ? "bg-white text-warm-900 shadow-xs"
                  : "text-warm-500 hover:text-warm-800"
              )}
            >
              Cards
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={cn(
                "px-2.5 py-1 text-xs font-semibold rounded-lg transition",
                viewMode === 'table'
                  ? "bg-white text-warm-900 shadow-xs"
                  : "text-warm-500 hover:text-warm-800"
              )}
            >
              Table
            </button>
          </div>

          <Link
            href="/review-planner"
            className="px-3.5 py-1.5 bg-warm-900 text-warm-50 text-xs font-semibold rounded-xl hover:bg-warm-800 transition shadow-xs"
          >
            Review Planning Docket
          </Link>
        </div>
      </div>

      {/* ThreeUI Browse Bar */}
      <div className="bg-white p-4 rounded-2xl border border-warm-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 transform -translate-y-1/2 text-warm-400" />
            <input
              type="text"
              placeholder="Search finding ID, entity, keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-warm-50 border border-warm-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-warm-900 placeholder-warm-400 focus:outline-none focus:border-warm-400 focus:bg-white transition"
            />
          </div>

          {/* Quick Status / Priority Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-mono font-bold uppercase text-warm-400">Priority:</span>
            <button
              onClick={() => setSelectedPriority('ALL')}
              className={cn("threeui-pill", selectedPriority === 'ALL' && "threeui-pill-active")}
            >
              All
            </button>
            {priorities.map((p) => (
              <button
                key={p}
                onClick={() => setSelectedPriority(p)}
                className={cn("threeui-pill", selectedPriority === p && "threeui-pill-active")}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* ThreeUI 6 Supervisory Lenses Browse Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5 no-scrollbar">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={cn(
              "threeui-pill whitespace-nowrap",
              selectedCategory === 'ALL' && "threeui-pill-active"
            )}
          >
            All Lenses ({findings.length})
          </button>
          {categories.map((c) => {
            const count = findings.filter(f => f.category === c).length;
            return (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={cn(
                  "threeui-pill whitespace-nowrap",
                  selectedCategory === c && "threeui-pill-active"
                )}
              >
                {c} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content: ThreeUI Cards or Table */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFindings.map((f) => (
            <div
              key={f.id}
              className="threeui-card p-5 flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-warm-800 bg-warm-100 px-2 py-0.5 rounded-md border border-warm-200">
                    {f.id}
                  </span>
                  <div className="flex items-center space-x-1.5">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono ${
                        f.priority === 'Critical'
                          ? 'bg-orange-100 text-orange-800 border border-orange-300/80'
                          : f.priority === 'High'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300/80'
                          : 'bg-warm-100 text-warm-700 border border-warm-200'
                      }`}
                    >
                      {f.priority}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center space-x-2 text-[11px] text-warm-500 font-mono mb-1">
                    <span className="font-bold text-warm-800">{f.entityCode}</span>
                    <span>•</span>
                    <span>{f.category}</span>
                  </div>
                  <h3 className="font-bold text-sm text-warm-900 leading-snug group-hover:text-emerald-800 transition">
                    {f.title}
                  </h3>
                  <p className="text-xs text-warm-600 mt-2 line-clamp-3 leading-relaxed">
                    {f.explanation}
                  </p>
                </div>

                {/* Evidence Artifacts Badge & Workflow Status */}
                <div className="bg-warm-50 p-2.5 rounded-xl border border-warm-200/80 flex items-center justify-between text-xs">
                  <span className="inline-flex items-center space-x-1 text-emerald-800 font-mono text-[11px] font-bold">
                    <FileCheck2 className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{f.supportingEvidenceCount} Evidence Refs</span>
                  </span>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${
                      f.status === 'Confirmed for Follow-up'
                        ? 'bg-orange-100 text-orange-800 border border-orange-300/80'
                        : f.status === 'Under Review'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300/80'
                        : f.status === 'Resolved'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300/80'
                        : 'bg-warm-100 text-warm-700 border border-warm-200'
                    }`}
                  >
                    {f.status}
                  </span>
                </div>
              </div>

              <div className="pt-4 mt-3 border-t border-warm-100 flex items-center justify-between">
                <span className="text-[10px] text-warm-400 font-mono">
                  {f.entityName}
                </span>
                <Link
                  href={`/findings/${f.id}`}
                  className="px-3 py-1.5 bg-warm-900 hover:bg-warm-800 text-warm-50 rounded-lg text-xs font-semibold inline-flex items-center space-x-1 transition shadow-xs"
                >
                  <span>Reasoning Dossier</span>
                  <ArrowRight className="w-3 h-3 text-warm-300" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Findings Table List */
        <div className="bg-white rounded-2xl border border-warm-200 shadow-xs overflow-hidden">
          <div className="px-5 py-3 bg-warm-100/90 border-b border-warm-200 flex items-center justify-between text-xs text-warm-600">
            <span className="font-semibold text-warm-900">
              Showing {filteredFindings.length} of {findings.length} registered supervisory findings
            </span>
            <span className="text-[11px] font-mono text-warm-500 hidden sm:inline">
              Status changes reflect examiner review workflow, not automatic guilt determination
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-warm-50 text-warm-500 uppercase tracking-wider text-[10px] border-b border-warm-200 font-semibold font-mono">
                <tr>
                  <th className="py-3 px-4">Finding ID</th>
                  <th className="py-3 px-4">Entity</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Summary Explanation</th>
                  <th className="py-3 px-4 text-center">Evidence</th>
                  <th className="py-3 px-4">Review Status</th>
                  <th className="py-3 px-4 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warm-100">
                {filteredFindings.map((f) => (
                  <tr key={f.id} className="hover:bg-warm-50/80 transition cursor-pointer">
                    <td className="py-3 px-4 font-mono font-bold text-warm-900">
                      {f.id}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono font-semibold text-warm-900 block">{f.entityCode}</span>
                      <span className="text-[11px] text-warm-500 truncate max-w-[140px] block">{f.entityName}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-warm-100 text-warm-700 border border-warm-200 font-mono">
                        {f.category}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                          f.priority === 'Critical'
                            ? 'bg-orange-100 text-orange-800 border border-orange-300/80'
                            : f.priority === 'High'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300/80'
                            : 'bg-warm-100 text-warm-700 border border-warm-200'
                        }`}
                      >
                        {f.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4 max-w-sm">
                      <div className="font-semibold text-warm-900 line-clamp-1">{f.title}</div>
                      <div className="text-[11px] text-warm-500 line-clamp-1 mt-0.5">{f.explanation}</div>
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-[11px]">
                      <span className="inline-flex items-center space-x-1 text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-bold">
                        <FileCheck2 className="w-3 h-3 text-emerald-700" />
                        <span>{f.supportingEvidenceCount}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                          f.status === 'Confirmed for Follow-up'
                            ? 'bg-orange-100 text-orange-800 border border-orange-300/80'
                            : f.status === 'Under Review'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300/80'
                            : f.status === 'Resolved'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300/80'
                            : 'bg-warm-100 text-warm-700 border border-warm-200'
                        }`}
                      >
                        <span>{f.status}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/findings/${f.id}`}
                        className="px-2.5 py-1 text-[11px] rounded-lg bg-warm-900 hover:bg-warm-800 text-warm-50 font-semibold inline-flex items-center space-x-1 transition shadow-xs"
                      >
                        <span>Examine</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
