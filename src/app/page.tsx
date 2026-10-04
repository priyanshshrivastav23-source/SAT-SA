'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  Database,
  AlertTriangle,
  Flame,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  Activity,
  FileText,
  Clock,
  Layers,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { satSaService } from '@/services/satSaService';
import { EntitySummary, Finding } from '@/types/sat-sa';

import { MeridianOrbitalHorizon } from '@/components/meridian/MeridianOrbitalHorizon';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const data = await satSaService.getDashboardSummary();
      setSummary(data);
      setLoading(false);
    }
    load();
  }, []);

  if (loading || !summary) {
    return (
      <div className="p-12 text-center text-warm-500 font-mono text-xs">
        Loading Meridian supervisory telemetry...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ThreeUI Meridian Atmospheric Orbital Horizon Hero */}
      <MeridianOrbitalHorizon />

      {/* ThreeUI Browse Bar: 6 Supervisory Lenses Quick Filter Strip */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        <span className="text-[10px] font-mono font-bold uppercase text-warm-400 shrink-0 mr-1">
          Lenses:
        </span>
        <Link href="/findings" className="threeui-pill threeui-pill-active shrink-0">
          All System Findings (7)
        </Link>
        <Link href="/findings?category=Execution+Gap" className="threeui-pill shrink-0">
          Execution Gap (2)
        </Link>
        <Link href="/negative-space" className="threeui-pill shrink-0">
          Negative Space Radar (1)
        </Link>
        <Link href="/benchmarks" className="threeui-pill shrink-0">
          Peer Benchmark (1)
        </Link>
        <Link href="/findings?category=Goodhart+Lens" className="threeui-pill shrink-0">
          Goodhart Lens (1)
        </Link>
        <Link href="/data-quality" className="threeui-pill shrink-0">
          Data Quality (1)
        </Link>
        <Link href="/integrity" className="threeui-pill shrink-0">
          Evidence Integrity (1)
        </Link>
      </div>

      {/* 6 Core KPI Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Card 1: Total Entities */}
        <div className="threeui-card p-4 relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-warm-400 group-hover:h-1.5 transition-all"></div>
          <div className="flex items-center justify-between text-warm-500 text-xs">
            <span className="font-medium">Total Entities</span>
            <Building2 className="w-4 h-4 text-warm-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-warm-900 tracking-tight">
            {summary.totalEntities}
          </div>
          <div className="mt-1 text-[10px] text-warm-500 font-medium">
            7 Core Critical Nodes
          </div>
        </div>

        {/* Card 2: Records Processed */}
        <div className="threeui-card p-4 relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-600 group-hover:h-1.5 transition-all"></div>
          <div className="flex items-center justify-between text-warm-500 text-xs">
            <span className="font-medium">Records Ingested</span>
            <Database className="w-4 h-4 text-warm-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-warm-900 tracking-tight">
            {(summary.totalRecords / 1000000).toFixed(1)}M
          </div>
          <div className="mt-1 text-[10px] text-emerald-700 font-medium">
            Raw Telemetry Stream
          </div>
        </div>

        {/* Card 3: Findings for Review */}
        <div className="threeui-card p-4 relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500 group-hover:h-1.5 transition-all"></div>
          <div className="flex items-center justify-between text-warm-500 text-xs">
            <span className="font-medium">Active Findings</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-amber-700 tracking-tight">
            {summary.findingsRequiringReview}
          </div>
          <div className="mt-1 text-[10px] text-warm-500 font-medium">
            Awaiting Examiner Action
          </div>
        </div>

        {/* Card 4: High-Priority Cases */}
        <div className="threeui-card p-4 relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-orange-600 group-hover:h-1.5 transition-all"></div>
          <div className="flex items-center justify-between text-warm-500 text-xs">
            <span className="font-medium">High Priority</span>
            <Flame className="w-4 h-4 text-orange-600" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-orange-700 tracking-tight">
            {summary.highPriorityCases}
          </div>
          <div className="mt-1 text-[10px] text-warm-500 font-medium">
            Critical Observations
          </div>
        </div>

        {/* Card 5: Data Quality */}
        <div className="threeui-card p-4 relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-warm-600 group-hover:h-1.5 transition-all"></div>
          <div className="flex items-center justify-between text-warm-500 text-xs">
            <span className="font-medium">Data Quality</span>
            <Layers className="w-4 h-4 text-warm-600" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-warm-800 tracking-tight">
            {summary.dataQualityIssues.toLocaleString()}
          </div>
          <div className="mt-1 text-[10px] text-warm-500 font-medium">
            Warnings & Rejections
          </div>
        </div>

        {/* Card 6: Integrity Status */}
        <div className="threeui-card p-4 relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-700 group-hover:h-1.5 transition-all"></div>
          <div className="flex items-center justify-between text-warm-500 text-xs">
            <span className="font-medium">Evidence Integrity</span>
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold font-mono text-warm-900 tracking-tight">
              {summary.integrityValidRate || '99.8%'}
            </span>
            <span className="text-[10px] font-bold font-mono text-amber-800 bg-amber-100/90 px-1.5 py-0.5 rounded border border-amber-300/80">
              {summary.integrityAnomaliesCount || 1} Flag
            </span>
          </div>
          <div className="mt-1 text-[10px] text-warm-500 font-medium truncate" title="Merkle Root Verified">
            Merkle Root Corroborated
          </div>
        </div>
      </div>

      {/* Reported KPI vs Supporting Evidence Comparison Card */}
      <div className="bg-white p-6 rounded-2xl border border-warm-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-warm-200/80 pb-3">
          <div>
            <h2 className="text-sm font-bold text-warm-900 flex items-center space-x-2 font-serif">
              <Activity className="w-4 h-4 text-emerald-700" />
              <span>Reported KPI vs. Supporting Evidence Comparison</span>
            </h2>
            <p className="text-xs text-warm-500 mt-0.5">
              Evaluating self-reported SLA claims against empirical sensor telemetry and observed closure patterns.
            </p>
          </div>
          <span className="text-[11px] font-mono text-warm-700 bg-warm-100 px-2.5 py-1 rounded-md border border-warm-200 font-medium">
            Discrepancy Index Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Dimension 1 */}
          <div className="p-4 rounded-xl bg-warm-50/80 border border-warm-200/90 hover:border-warm-300 transition-colors">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-warm-800">Triage Velocity Comparison</span>
              <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-100/90 px-2 py-0.5 rounded-full border border-amber-300/70">
                Deviation 140x
              </span>
            </div>
            <div className="mt-3 flex items-baseline justify-between bg-white p-3 rounded-lg border border-warm-200/80">
              <div>
                <span className="text-[11px] text-warm-500 block font-medium">Reported Mean</span>
                <span className="text-lg font-bold font-mono text-warm-800">38 min</span>
              </div>
              <span className="text-xs text-warm-400 font-medium">vs</span>
              <div className="text-right">
                <span className="text-[11px] text-warm-500 block font-medium">Observed Batch</span>
                <span className="text-lg font-bold font-mono text-orange-700">0.29 sec</span>
              </div>
            </div>
            <p className="text-[11px] text-warm-600 mt-2.5 leading-relaxed">
              Batch closures at shift turnaround suggest metric-gaming or automated clearing scripts rather than genuine investigative review.
            </p>
          </div>

          {/* Dimension 2 */}
          <div className="p-4 rounded-xl bg-warm-50/80 border border-warm-200/90 hover:border-warm-300 transition-colors">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-warm-800">Ingestion Availability</span>
              <span className="text-[10px] font-mono font-bold text-orange-800 bg-orange-100/90 px-2 py-0.5 rounded-full border border-orange-300/70">
                38h Void
              </span>
            </div>
            <div className="mt-3 flex items-baseline justify-between bg-white p-3 rounded-lg border border-warm-200/80">
              <div>
                <span className="text-[11px] text-warm-500 block font-medium">Reported Ingest</span>
                <span className="text-lg font-bold font-mono text-warm-800">100.0%</span>
              </div>
              <span className="text-xs text-warm-400 font-medium">vs</span>
              <div className="text-right">
                <span className="text-[11px] text-warm-500 block font-medium">Corroborated</span>
                <span className="text-lg font-bold font-mono text-warm-900">78.5%</span>
              </div>
            </div>
            <p className="text-[11px] text-warm-600 mt-2.5 leading-relaxed">
              Extended unmonitored interval observed on Substation Gateway SGW-400kV without alert generation or failover tickets.
            </p>
          </div>

          {/* Dimension 3 */}
          <div className="p-4 rounded-xl bg-warm-50/80 border border-warm-200/90 hover:border-warm-300 transition-colors">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-warm-800">Correlation Rule Coverage</span>
              <span className="text-[10px] font-mono font-bold text-violet-800 bg-violet-100/90 px-2 py-0.5 rounded-full border border-violet-300/70">
                3 Disabled
              </span>
            </div>
            <div className="mt-3 flex items-baseline justify-between bg-white p-3 rounded-lg border border-warm-200/80">
              <div>
                <span className="text-[11px] text-warm-500 block font-medium">Reported Rules</span>
                <span className="text-lg font-bold font-mono text-warm-800">142 Active</span>
              </div>
              <span className="text-xs text-warm-400 font-medium">vs</span>
              <div className="text-right">
                <span className="text-[11px] text-warm-500 block font-medium">Effective Rules</span>
                <span className="text-lg font-bold font-mono text-violet-800">139 Active</span>
              </div>
            </div>
            <p className="text-[11px] text-warm-600 mt-2.5 leading-relaxed">
              High-severity detection rules toggled off during peak volume periods without Change Advisory Board (CAB) approval.
            </p>
          </div>
        </div>
      </div>

      {/* Visual Analytics Grid: Trends & Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Ingestion & Triage Velocity Trend */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-warm-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-warm-200/70 pb-3">
            <div>
              <h3 className="text-sm font-bold text-warm-900 font-serif">
                Weekly Alert Ingress, Closure & Discrepancy Index
              </h3>
              <p className="text-xs text-warm-500 mt-0.5">
                Correlation between alert volume surges and escalation drop-offs across monitored entities
              </p>
            </div>
            <div className="flex items-center space-x-2 shrink-0">
              <span className="text-[10px] font-mono font-medium text-warm-600 bg-warm-100 px-2.5 py-1 rounded-md border border-warm-200">
                Peak: 142k/day
              </span>
              <span className="text-[10px] font-mono font-medium text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                Mean DI: 18.4
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={summary.trends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0EFEA" />
                <XAxis dataKey="day" stroke="#78716C" fontSize={11} tickLine={false} />
                <YAxis stroke="#78716C" fontSize={11} tickLine={false} />
                <Tooltip
                  content={({ active, payload, label }: any) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-warm-900 text-warm-50 p-3 rounded-xl shadow-lg border border-warm-800 text-xs font-mono space-y-1.5 min-w-[200px]">
                          <div className="text-[11px] text-warm-400 font-bold border-b border-warm-800 pb-1 flex justify-between">
                            <span>{label}</span>
                            <span className="text-[10px] text-warm-400">TELEMETRY</span>
                          </div>
                          {payload.map((entry: any, index: number) => (
                            <div key={`item-${index}`} className="flex items-center justify-between text-xs">
                              <span className="flex items-center space-x-2 text-warm-300">
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.stroke || entry.color }} />
                                <span>{entry.name}</span>
                              </span>
                              <span className="font-bold text-warm-50">{entry.value.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area
                  type="monotone"
                  dataKey="alertsGenerated"
                  name="Alerts Generated"
                  stroke="#57534E"
                  strokeWidth={2}
                  fill="#F5F5F4"
                  fillOpacity={0.7}
                />
                <Area
                  type="monotone"
                  dataKey="closedWithinSLA"
                  name="Closed within SLA"
                  stroke="#059669"
                  strokeWidth={2}
                  fill="#D1FAE5"
                  fillOpacity={0.4}
                />
                <Area
                  type="monotone"
                  dataKey="discrepancyIndex"
                  name="Discrepancy Index"
                  stroke="#D97706"
                  strokeWidth={2}
                  fill="#FEF3C7"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Findings by Category Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-warm-200 shadow-xs space-y-3.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-warm-900 font-serif">
                Findings by Category
              </h3>
              <Link href="/findings" className="text-xs text-emerald-800 hover:text-emerald-900 font-semibold hover:underline">
                View All →
              </Link>
            </div>
            <p className="text-xs text-warm-500 mt-0.5">
              Distribution across the 6 supervisory evaluation lenses
            </p>

            <div className="space-y-3 pt-3">
              {summary.categoryDistribution.map((cat: any) => (
                <div key={cat.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }}></span>
                      <span className="text-warm-800 font-medium">{cat.name}</span>
                    </div>
                    <span className="font-mono text-xs font-bold text-warm-700">{cat.count}</span>
                  </div>
                  <div className="w-full bg-warm-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.max(12, (cat.count / 6) * 100)}%`,
                        backgroundColor: cat.color
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-warm-50 rounded-xl border border-warm-200 text-[11px] text-warm-600 leading-relaxed">
            <span className="font-semibold text-warm-900">Supervisory Observation:</span> Execution Gap and Goodhart Lens findings represent 60% of all critical reviews this cycle.
          </div>
        </div>
      </div>

      {/* Entities Requiring Attention & Recent Findings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Entities Requiring Immediate Attention */}
        <div className="bg-white p-6 rounded-2xl border border-warm-200 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between border-b border-warm-200/70 pb-3">
            <div className="flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-amber-700" />
              <h3 className="text-sm font-bold text-warm-900 font-serif">
                Entities Requiring Supervisory Attention
              </h3>
            </div>
            <Link href="/entities" className="text-xs text-emerald-800 hover:text-emerald-900 font-semibold hover:underline flex items-center space-x-1">
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <p className="text-xs text-warm-500">
            Strategic entities displaying acute discrepancy scores or uncorroborated SLA performance claims
          </p>

          <div className="divide-y divide-warm-100/90 pt-1">
            {summary.entitiesRequiringAttention.map((entity: EntitySummary) => (
              <div key={entity.id} className="py-3 flex items-center justify-between group hover:bg-warm-50/60 px-2 rounded-lg transition-colors">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-warm-900 bg-warm-100 px-1.5 py-0.5 rounded border border-warm-200">
                      {entity.code}
                    </span>
                    <span className="text-xs font-semibold text-warm-900 truncate max-w-[200px]">{entity.name}</span>
                  </div>
                  <div className="text-[11px] text-warm-500 mt-1">
                    Sector: {entity.sector} • Tier-1 National Node
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <span className="text-[11px] font-mono font-bold text-orange-800 bg-orange-100/90 px-2 py-0.5 rounded border border-orange-300/70">
                      DI: {entity.evidenceMetrics.discrepancyIndex}
                    </span>
                    <div className="text-[10px] text-warm-500 mt-0.5 font-medium">
                      {entity.findingCount} Findings ({entity.criticalFindingCount} Critical)
                    </div>
                  </div>
                  <Link
                    href={`/entities/${entity.id}`}
                    className="p-1.5 rounded-lg text-warm-400 group-hover:text-warm-900 group-hover:bg-warm-200 transition"
                    title="View Entity Assessment"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Findings and Examiner Activity */}
        <div className="bg-white p-6 rounded-2xl border border-warm-200 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between border-b border-warm-200/70 pb-3">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-emerald-700" />
              <h3 className="text-sm font-bold text-warm-900 font-serif">
                Recent Supervisory Findings & Signals
              </h3>
            </div>
            <Link href="/findings" className="text-xs text-emerald-800 hover:text-emerald-900 font-semibold hover:underline flex items-center space-x-1">
              <span>All Findings</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <p className="text-xs text-warm-500">
            Latest empirical signals flagged across the 6 supervisory analysis lenses
          </p>

          <div className="divide-y divide-warm-100/90 pt-1">
            {summary.recentFindings.map((finding: Finding) => (
              <div key={finding.id} className="py-2.5 flex items-center justify-between group hover:bg-warm-50/60 px-2 rounded-lg transition-colors">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-warm-800 bg-warm-100 px-1.5 py-0.5 rounded border border-warm-200">
                      {finding.id}
                    </span>
                    <span className="text-xs font-semibold text-warm-900 truncate max-w-[240px]">
                      {finding.title}
                    </span>
                  </div>
                  <div className="text-[11px] text-warm-500 flex items-center space-x-2">
                    <span className="font-medium text-warm-700">{finding.entityCode}</span>
                    <span>•</span>
                    <span className="font-mono text-[10px] text-warm-500">{finding.category}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      finding.priority === 'Critical'
                        ? 'bg-orange-100 text-orange-800 border border-orange-300/80'
                        : 'bg-amber-100 text-amber-800 border border-amber-300/80'
                    }`}
                  >
                    {finding.priority}
                  </span>
                  <Link
                    href={`/findings/${finding.id}`}
                    className="px-2.5 py-1 text-[11px] rounded-lg bg-warm-100 hover:bg-warm-200 text-warm-800 font-semibold transition border border-warm-200"
                  >
                    Inspect
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Governance & Verification Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        <div className="p-4 bg-warm-100/90 rounded-xl border border-warm-200 flex items-center justify-between text-xs">
          <div>
            <div className="font-bold text-warm-900 font-serif">Data Quality & Ingestion Status</div>
            <p className="text-warm-600 mt-0.5">184.5k records evaluated • 2,350 rejected on schema parsing.</p>
          </div>
          <Link href="/data-quality" className="px-3 py-1.5 bg-white border border-warm-200 rounded-lg text-warm-800 font-semibold hover:bg-warm-50 transition shadow-xs">
            Inspect Ingestion
          </Link>
        </div>

        <div className="p-4 bg-warm-100/90 rounded-xl border border-warm-200 flex items-center justify-between text-xs">
          <div>
            <div className="font-bold text-warm-900 font-serif">Cryptographic Evidence Integrity</div>
            <p className="text-warm-600 mt-0.5">4 Evidence Batches checked • 1 Merkle Node divergence flagged.</p>
          </div>
          <Link href="/integrity" className="px-3 py-1.5 bg-white border border-warm-200 rounded-lg text-warm-800 font-semibold hover:bg-warm-50 transition shadow-xs">
            View Merkle Tree
          </Link>
        </div>
      </div>
    </div>
  );
}
