'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Building2,
  Search,
  Filter,
  ArrowUpDown,
  ExternalLink,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers
} from 'lucide-react';
import { satSaService } from '@/services/satSaService';
import { EntitySummary, Sector, ReviewStatus } from '@/types/sat-sa';

export default function EntitiesPage() {
  const [entities, setEntities] = useState<EntitySummary[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [sortField, setSortField] = useState<'discrepancy' | 'quality' | 'findings'>('discrepancy');
  const [sortAsc, setSortAsc] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await satSaService.getEntities();
      setEntities(data);
    }
    load();
  }, []);

  const sectors: Sector[] = [
    'Power & Energy',
    'Banking & Finance',
    'Civil Aviation',
    'Railways & Transport',
    'Telecom & IT',
    'Petroleum & Gas',
    'Strategic & Defence'
  ];

  const filteredEntities = entities
    .filter((e) => {
      const matchesSearch =
        e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.nodalOfficer.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSector = selectedSector === 'ALL' || e.sector === selectedSector;
      const matchesStatus = selectedStatus === 'ALL' || e.reviewStatus === selectedStatus;
      return matchesSearch && matchesSector && matchesStatus;
    })
    .sort((a, b) => {
      if (sortField === 'discrepancy') {
        const valA = a.evidenceMetrics.discrepancyIndex;
        const valB = b.evidenceMetrics.discrepancyIndex;
        return sortAsc ? valA - valB : valB - valA;
      }
      if (sortField === 'quality') {
        return sortAsc ? a.dataQualityScore - b.dataQualityScore : b.dataQualityScore - a.dataQualityScore;
      }
      if (sortField === 'findings') {
        return sortAsc ? a.findingCount - b.findingCount : b.findingCount - a.findingCount;
      }
      return 0;
    });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white p-6 rounded-2xl border border-warm-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-warm-500 font-mono">
              Entity Surveillance Registry
            </span>
            <span className="text-[10px] font-mono bg-warm-100 text-warm-700 px-2 py-0.5 rounded">
              {entities.length} Strategic Nodes Monitored
            </span>
          </div>
          <h1 className="text-xl font-bold text-warm-900 mt-1">
            Critical Sector Entity (CSE) Assessments
          </h1>
          <p className="text-xs text-warm-600 mt-0.5">
            Evaluating reported SOC performance claims against telemetry data fidelity, data quality, and negative-space indicators.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            href="/review-planner"
            className="px-3 py-1.5 bg-warm-900 text-warm-50 text-xs font-semibold rounded-xl hover:bg-warm-800 transition"
          >
            Generate Review Sample
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-warm-200 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search Input */}
        <div>
          <label className="text-[10px] font-bold text-warm-500 uppercase tracking-wider block mb-1">
            Search Entity
          </label>
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 transform -translate-y-1/2 text-warm-400" />
            <input
              type="text"
              placeholder="Search code or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-warm-50 border border-warm-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-warm-900 focus:outline-none focus:border-warm-400"
            />
          </div>
        </div>

        {/* Sector Filter */}
        <div>
          <label className="text-[10px] font-bold text-warm-500 uppercase tracking-wider block mb-1">
            Critical Sector
          </label>
          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="w-full bg-warm-50 border border-warm-200 rounded-xl px-3 py-1.5 text-xs text-warm-900 focus:outline-none focus:border-warm-400"
          >
            <option value="ALL">All Critical Sectors</option>
            {sectors.map((sec) => (
              <option key={sec} value={sec}>{sec}</option>
            ))}
          </select>
        </div>

        {/* Review Status Filter */}
        <div>
          <label className="text-[10px] font-bold text-warm-500 uppercase tracking-wider block mb-1">
            Supervisory Status
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full bg-warm-50 border border-warm-200 rounded-xl px-3 py-1.5 text-xs text-warm-900 focus:outline-none focus:border-warm-400"
          >
            <option value="ALL">All Statuses</option>
            <option value="Flagged for Escalation">Flagged for Escalation</option>
            <option value="In Assessment">In Assessment</option>
            <option value="Pending Review">Pending Review</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/* Sort Field */}
        <div>
          <label className="text-[10px] font-bold text-warm-500 uppercase tracking-wider block mb-1">
            Sort Order
          </label>
          <div className="flex space-x-2">
            <select
              value={sortField}
              onChange={(e: any) => setSortField(e.target.value)}
              className="flex-1 bg-warm-50 border border-warm-200 rounded-xl px-3 py-1.5 text-xs text-warm-900 focus:outline-none focus:border-warm-400"
            >
              <option value="discrepancy">Discrepancy Index</option>
              <option value="findings">Finding Count</option>
              <option value="quality">Data Quality Score</option>
            </select>
            <button
              onClick={() => setSortAsc(!sortAsc)}
              className="p-1.5 bg-warm-100 hover:bg-warm-200 text-warm-700 rounded-xl border border-warm-200 transition"
              title="Toggle Ascending/Descending"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Entity Table */}
      <div className="bg-white rounded-2xl border border-warm-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 bg-warm-100 border-b border-warm-200 flex items-center justify-between text-xs text-warm-600">
          <span className="font-semibold text-warm-900">
            Showing {filteredEntities.length} of {entities.length} monitored entities
          </span>
          <span className="text-[11px] font-mono text-warm-500">
            Click any entity row to inspect full telemetry evidence dossier
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-warm-50 text-warm-500 uppercase tracking-wider text-[10px] border-b border-warm-200 font-semibold">
              <tr>
                <th className="py-3 px-4">Entity Identifier</th>
                <th className="py-3 px-4">Critical Sector</th>
                <th className="py-3 px-4">Reported KPIs</th>
                <th className="py-3 px-4">Supporting Evidence</th>
                <th className="py-3 px-4 text-center">Discrepancy</th>
                <th className="py-3 px-4 text-center">Data Quality</th>
                <th className="py-3 px-4 text-center">Findings</th>
                <th className="py-3 px-4">Supervisory Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-100">
              {filteredEntities.map((entity) => (
                <tr
                  key={entity.id}
                  className="hover:bg-warm-50/80 transition cursor-pointer"
                >
                  <td className="py-3 px-4">
                    <div className="font-mono font-bold text-warm-900">{entity.code}</div>
                    <div className="text-warm-600 truncate max-w-[200px]" title={entity.name}>
                      {entity.name}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium text-warm-700">{entity.sector}</span>
                    <div className="text-[10px] text-warm-400">{entity.tier}</div>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px]">
                    <div>MTTD: {entity.reportedKpis.mttdMinutes}m • MTTR: {entity.reportedKpis.mttrMinutes}m</div>
                    <div className="text-warm-500 text-[10px]">{entity.reportedKpis.dailyAlertVolume.toLocaleString()} Daily Alerts</div>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px]">
                    <div>{entity.evidenceMetrics.telemetryCompletenessPercent}% Complete</div>
                    <div className="text-warm-500 text-[10px]">{entity.evidenceMetrics.verifiedEvidenceCount} Verified Artifacts</div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full font-mono text-[11px] font-bold ${
                        entity.evidenceMetrics.discrepancyIndex > 60
                          ? 'bg-orange-50 text-orange-700 border border-orange-200'
                          : entity.evidenceMetrics.discrepancyIndex > 35
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {entity.evidenceMetrics.discrepancyIndex}/100
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center font-mono">
                    <span className="font-semibold text-warm-800">{entity.dataQualityScore}%</span>
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-bold">
                    <span className={entity.criticalFindingCount > 0 ? 'text-orange-700' : 'text-warm-800'}>
                      {entity.findingCount}
                    </span>
                    {entity.criticalFindingCount > 0 && (
                      <span className="text-[10px] text-orange-600 block">({entity.criticalFindingCount} Crit)</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${
                        entity.reviewStatus === 'Flagged for Escalation'
                          ? 'bg-orange-50 text-orange-700 border border-orange-200'
                          : entity.reviewStatus === 'In Assessment'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : entity.reviewStatus === 'Completed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-warm-100 text-warm-700 border border-warm-200'
                      }`}
                    >
                      {entity.reviewStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      href={`/entities/${entity.id}`}
                      className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-warm-100 hover:bg-warm-200 text-warm-900 border border-warm-200 inline-flex items-center space-x-1 transition"
                    >
                      <span>Examine</span>
                      <ExternalLink className="w-3 h-3 text-warm-500" />
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
