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

export default function FindingsPage() {
  const [findings, setFindings] = useState<Finding[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedEntity, setSelectedEntity] = useState<string>('ALL');

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
      <div className="bg-white p-6 rounded-2xl border border-warm-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-warm-500 font-mono">
              Central Supervisory Register
            </span>
            <span className="text-[10px] font-mono bg-warm-100 text-warm-700 px-2 py-0.5 rounded">
              {findings.length} Active System Observations
            </span>
          </div>
          <h1 className="text-xl font-bold text-warm-900 mt-1">
            Supervisory Findings & Evidence-Backed Observations
          </h1>
          <p className="text-xs text-warm-600 mt-0.5">
            System-surfaced operational patterns requiring human examiner review across the 6 supervisory evaluation categories.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            href="/review-planner"
            className="px-3.5 py-1.5 bg-warm-900 text-warm-50 text-xs font-semibold rounded-xl hover:bg-warm-800 transition"
          >
            Review Planning Docket
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-warm-200 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Search Input */}
        <div>
          <label className="text-[10px] font-bold text-warm-500 uppercase tracking-wider block mb-1">
            Search Findings
          </label>
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 transform -translate-y-1/2 text-warm-400" />
            <input
              type="text"
              placeholder="Search keyword or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-warm-50 border border-warm-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-warm-900 focus:outline-none focus:border-warm-400"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <label className="text-[10px] font-bold text-warm-500 uppercase tracking-wider block mb-1">
            Finding Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-warm-50 border border-warm-200 rounded-xl px-2.5 py-1.5 text-xs text-warm-900 focus:outline-none focus:border-warm-400"
          >
            <option value="ALL">All Categories (6)</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Priority Filter */}
        <div>
          <label className="text-[10px] font-bold text-warm-500 uppercase tracking-wider block mb-1">
            Severity / Priority
          </label>
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="w-full bg-warm-50 border border-warm-200 rounded-xl px-2.5 py-1.5 text-xs text-warm-900 focus:outline-none focus:border-warm-400"
          >
            <option value="ALL">All Priorities</option>
            {priorities.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        {/* Review Status Filter */}
        <div>
          <label className="text-[10px] font-bold text-warm-500 uppercase tracking-wider block mb-1">
            Workflow Status
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full bg-warm-50 border border-warm-200 rounded-xl px-2.5 py-1.5 text-xs text-warm-900 focus:outline-none focus:border-warm-400"
          >
            <option value="ALL">All Workflow States</option>
            {statuses.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Reset Filters */}
        <div className="flex items-end">
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('ALL');
              setSelectedPriority('ALL');
              setSelectedStatus('ALL');
              setSelectedEntity('ALL');
            }}
            className="w-full py-1.5 px-3 bg-warm-100 hover:bg-warm-200 text-warm-700 rounded-xl text-xs font-semibold transition border border-warm-200"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Findings Table List */}
      <div className="bg-white rounded-2xl border border-warm-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 bg-warm-100 border-b border-warm-200 flex items-center justify-between text-xs text-warm-600">
          <span className="font-semibold text-warm-900">
            Showing {filteredFindings.length} of {findings.length} registered supervisory findings
          </span>
          <span className="text-[11px] font-mono text-warm-500 hidden sm:inline">
            Status changes reflect examiner review workflow, not automatic guilt determination
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-warm-50 text-warm-500 uppercase tracking-wider text-[10px] border-b border-warm-200 font-semibold">
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
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-warm-100 text-warm-700 border border-warm-200">
                      {f.category}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        f.priority === 'Critical'
                          ? 'bg-orange-50 text-orange-700 border border-orange-200'
                          : f.priority === 'High'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
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
                          ? 'bg-orange-50 text-orange-700 border border-orange-200'
                          : f.status === 'Under Review'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : f.status === 'Resolved'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-warm-100 text-warm-700 border border-warm-200'
                      }`}
                    >
                      <span>{f.status}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      href={`/findings/${f.id}`}
                      className="px-2.5 py-1 text-[11px] rounded-lg bg-warm-900 hover:bg-warm-800 text-warm-50 font-semibold inline-flex items-center space-x-1 transition"
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
    </div>
  );
}
