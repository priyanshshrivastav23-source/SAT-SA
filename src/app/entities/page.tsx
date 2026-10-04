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
import { cn } from '@/lib/utils';

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

  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white p-6 rounded-2xl border border-warm-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-warm-500 font-mono">
              Entity Surveillance Registry
            </span>
            <span className="text-[10px] font-mono bg-warm-100 text-warm-700 px-2 py-0.5 rounded border border-warm-200">
              {entities.length} Strategic Nodes Monitored
            </span>
          </div>
          <h1 className="text-xl font-bold text-warm-900 mt-1 font-serif tracking-tight">
            Critical Sector Entity (CSE) Assessments
          </h1>
          <p className="text-xs text-warm-600 mt-0.5">
            Evaluating reported SOC performance claims against telemetry data fidelity, data quality, and negative-space indicators.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          {/* View Mode Toggle */}
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
            Review Sample
          </Link>
        </div>
      </div>

      {/* ThreeUI Browse Bar: Search & Sector Pills */}
      <div className="bg-white p-4 rounded-2xl border border-warm-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 transform -translate-y-1/2 text-warm-400" />
            <input
              type="text"
              placeholder="Search CSE code, name, or officer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-warm-50 border border-warm-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-warm-900 placeholder-warm-400 focus:outline-none focus:border-warm-400 focus:bg-white transition"
            />
          </div>

          {/* Sort Controls */}
          <div className="flex items-center space-x-2 shrink-0">
            <span className="text-[10px] font-mono font-bold uppercase text-warm-400">Sort:</span>
            <button
              onClick={() => setSortField('discrepancy')}
              className={cn(
                "threeui-pill",
                sortField === 'discrepancy' && "threeui-pill-active"
              )}
            >
              Discrepancy
            </button>
            <button
              onClick={() => setSortField('findings')}
              className={cn(
                "threeui-pill",
                sortField === 'findings' && "threeui-pill-active"
              )}
            >
              Findings
            </button>
            <button
              onClick={() => setSortField('quality')}
              className={cn(
                "threeui-pill",
                sortField === 'quality' && "threeui-pill-active"
              )}
            >
              Data Quality
            </button>
            <button
              onClick={() => setSortAsc(!sortAsc)}
              className="p-1.5 rounded-lg border border-warm-200 bg-warm-50 hover:bg-warm-100 text-warm-600 transition"
              title={sortAsc ? "Sort Ascending" : "Sort Descending"}
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ThreeUI Horizontal Sector Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5 no-scrollbar">
          <button
            onClick={() => setSelectedSector('ALL')}
            className={cn(
              "threeui-pill whitespace-nowrap",
              selectedSector === 'ALL' && "threeui-pill-active"
            )}
          >
            All Sectors ({entities.length})
          </button>
          {sectors.map((sec) => {
            const count = entities.filter(e => e.sector === sec).length;
            return (
              <button
                key={sec}
                onClick={() => setSelectedSector(sec)}
                className={cn(
                  "threeui-pill whitespace-nowrap",
                  selectedSector === sec && "threeui-pill-active"
                )}
              >
                {sec} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content: ThreeUI Cards or Table */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEntities.map((entity) => (
            <div
              key={entity.id}
              className="threeui-card p-5 flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-warm-900 bg-warm-100 px-2 py-0.5 rounded-md border border-warm-200">
                    {entity.code}
                  </span>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${
                      entity.reviewStatus === 'Flagged for Escalation'
                        ? 'bg-orange-100 text-orange-800 border border-orange-300/80'
                        : entity.reviewStatus === 'In Assessment'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300/80'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-300/80'
                    }`}
                  >
                    {entity.reviewStatus}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-warm-900 leading-snug group-hover:text-emerald-800 transition">
                    {entity.name}
                  </h3>
                  <div className="text-[11px] text-warm-500 mt-1 flex items-center space-x-1.5">
                    <span>{entity.sector}</span>
                    <span>•</span>
                    <span className="font-mono">{entity.tier}</span>
                  </div>
                </div>

                {/* Discrepancy Progress Meter */}
                <div className="bg-warm-50 p-3 rounded-xl border border-warm-200/80 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-warm-700">Discrepancy Index</span>
                    <span
                      className={`font-mono text-xs font-bold ${
                        entity.evidenceMetrics.discrepancyIndex > 60
                          ? 'text-orange-700'
                          : entity.evidenceMetrics.discrepancyIndex > 35
                          ? 'text-amber-700'
                          : 'text-emerald-700'
                      }`}
                    >
                      {entity.evidenceMetrics.discrepancyIndex} / 100
                    </span>
                  </div>
                  <div className="w-full bg-warm-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        entity.evidenceMetrics.discrepancyIndex > 60
                          ? 'bg-orange-600'
                          : entity.evidenceMetrics.discrepancyIndex > 35
                          ? 'bg-amber-500'
                          : 'bg-emerald-600'
                      }`}
                      style={{ width: `${entity.evidenceMetrics.discrepancyIndex}%` }}
                    ></div>
                  </div>
                </div>

                {/* Evidence Metrics Quick Grid */}
                <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-center">
                  <div className="p-2 bg-warm-50 rounded-lg border border-warm-200/60">
                    <span className="text-[9px] text-warm-400 block uppercase">Quality</span>
                    <span className="text-xs font-bold text-warm-800">{entity.dataQualityScore}%</span>
                  </div>
                  <div className="p-2 bg-warm-50 rounded-lg border border-warm-200/60">
                    <span className="text-[9px] text-warm-400 block uppercase">Findings</span>
                    <span className="text-xs font-bold text-warm-800">{entity.findingCount}</span>
                  </div>
                  <div className="p-2 bg-warm-50 rounded-lg border border-warm-200/60">
                    <span className="text-[9px] text-warm-400 block uppercase">Artifacts</span>
                    <span className="text-xs font-bold text-warm-800">{entity.evidenceMetrics.verifiedEvidenceCount}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-3 border-t border-warm-100 flex items-center justify-between">
                <span className="text-[10px] text-warm-400 font-mono truncate max-w-[130px]">
                  {entity.nodalOfficer}
                </span>
                <Link
                  href={`/entities/${entity.id}`}
                  className="px-3 py-1.5 bg-warm-900 hover:bg-warm-800 text-warm-50 rounded-lg text-xs font-semibold inline-flex items-center space-x-1 transition shadow-xs"
                >
                  <span>Examine Dossier</span>
                  <ExternalLink className="w-3 h-3 text-warm-300" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Entity Table View */
        <div className="bg-white rounded-2xl border border-warm-200 shadow-xs overflow-hidden">
          <div className="px-5 py-3 bg-warm-100/90 border-b border-warm-200 flex items-center justify-between text-xs text-warm-600">
            <span className="font-semibold text-warm-900">
              Showing {filteredEntities.length} of {entities.length} monitored entities
            </span>
            <span className="text-[11px] font-mono text-warm-500">
              Click any entity row to inspect full telemetry evidence dossier
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-warm-50 text-warm-500 uppercase tracking-wider text-[10px] border-b border-warm-200 font-semibold font-mono">
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
                      <div className="text-[10px] text-warm-400 font-mono">{entity.tier}</div>
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
                            ? 'bg-orange-100 text-orange-800 border border-orange-300/80'
                            : entity.evidenceMetrics.discrepancyIndex > 35
                            ? 'bg-amber-100 text-amber-800 border border-amber-300/80'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-300/80'
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
                            ? 'bg-orange-100 text-orange-800 border border-orange-300/80'
                            : entity.reviewStatus === 'In Assessment'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300/80'
                            : entity.reviewStatus === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300/80'
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
      )}
    </div>
  );
}
