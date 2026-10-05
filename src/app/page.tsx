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
      <div className="p-8 text-center text-warm-500 font-mono text-xs">
        Loading supervisory dashboard metrics...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-warm-100 via-warm-100/90 to-warm-50 p-5 rounded-2xl border border-warm-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full border border-emerald-300/80">
              National Oversight Desk
            </span>
            <span className="text-[11px] font-mono font-medium text-warm-600 bg-warm-200/60 px-2 py-0.5 rounded-md">
              Cycle: Q3 2026 Active
            </span>
            <span className="text-[11px] font-mono text-warm-500">
              5 Critical CSEs • 125,430 Records Ingested
            </span>
          </div>
          <h1 className="text-xl font-bold text-warm-900 mt-1.5 tracking-tight font-serif">
            Supervisory Overview
          </h1>
          <p className="text-xs text-warm-600 mt-1 max-w-2xl leading-relaxed">
            Evidence-backed analytics across submitted SOC operational records. Evaluating self-reported SLA claims against empirical sensor telemetry and execution patterns under Section 70A.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <Link
            href="/review-planner"
            className="px-3.5 py-2 rounded-xl bg-warm-900 hover:bg-warm-800 text-warm-50 text-xs font-semibold flex items-center space-x-1.5 transition shadow-xs hover:shadow-sm"
          >
            <span>Review Planner</span>
            <ArrowRight className="w-3.5 h-3.5 text-warm-300" />
          </Link>
          <Link
            href="/findings"
            className="px-3.5 py-2 rounded-xl bg-warm-200/90 hover:bg-warm-300 text-warm-900 text-xs font-semibold transition border border-warm-300/60"
          >
            All Findings (37)
          </Link>
        </div>
      </div>

      {/* Top 5 Metric Cards (Section 7) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Card 1: CSEs Analysed */}
        <div className="threeui-card p-4 relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-warm-400 group-hover:h-1.5 transition-all"></div>
          <div className="flex items-center justify-between text-warm-500 text-xs">
            <span className="font-medium">CSEs Analysed</span>
            <Building2 className="w-4 h-4 text-warm-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-warm-900 tracking-tight">
            5
          </div>
          <div className="mt-1 text-[10px] text-warm-500 font-medium">
            Strategic National Entities
          </div>
        </div>

        {/* Card 2: Records Analysed */}
        <div className="threeui-card p-4 relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-600 group-hover:h-1.5 transition-all"></div>
          <div className="flex items-center justify-between text-warm-500 text-xs">
            <span className="font-medium">Records Analysed</span>
            <Database className="w-4 h-4 text-warm-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-warm-900 tracking-tight">
            125,430
          </div>
          <div className="mt-1 text-[10px] text-emerald-700 font-medium">
            Operational Telemetry Set
          </div>
        </div>

        {/* Card 3: Findings */}
        <div className="threeui-card p-4 relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500 group-hover:h-1.5 transition-all"></div>
          <div className="flex items-center justify-between text-warm-500 text-xs">
            <span className="font-medium">Findings</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-amber-700 tracking-tight">
            37
          </div>
          <div className="mt-1 text-[10px] text-warm-500 font-medium">
            Generated Supervisory Signals
          </div>
        </div>

        {/* Card 4: High Priority */}
        <div className="threeui-card p-4 relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-orange-600 group-hover:h-1.5 transition-all"></div>
          <div className="flex items-center justify-between text-warm-500 text-xs">
            <span className="font-medium">High Priority</span>
            <Flame className="w-4 h-4 text-orange-600" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-orange-700 tracking-tight">
            8
          </div>
          <div className="mt-1 text-[10px] text-warm-500 font-medium">
            Requires Examiner Attention
          </div>
        </div>

        {/* Card 5: Data Confidence */}
        <div className="threeui-card p-4 relative overflow-hidden group col-span-2 md:col-span-1">
          <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-700 group-hover:h-1.5 transition-all"></div>
          <div className="flex items-center justify-between text-warm-500 text-xs">
            <span className="font-medium">Data Confidence</span>
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-emerald-800 tracking-tight">
            94%
          </div>
          <div className="mt-1 text-[10px] text-warm-500 font-medium truncate" title="Completeness: 97% • Consistency: 93% • Timestamps: 92%">
            Completeness 97% • Consistency 93%
          </div>
        </div>
      </div>

      {/* CLAIM vs REALITY Hero Section (Section 8) */}
      <div className="bg-white p-6 rounded-2xl border border-warm-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-warm-100 pb-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Core Supervisory Concept
              </span>
              <span className="text-[10px] font-mono bg-warm-100 text-warm-700 px-2 py-0.5 rounded">
                The Claim-vs-Reality Engine
              </span>
            </div>
            <h2 className="text-base font-bold text-warm-900 mt-1 font-serif">
              CLAIM vs REALITY
            </h2>
            <p className="text-xs text-warm-600 mt-0.5">
              Underlying evidence indicates review-worthy inconsistencies between submitted metrics and sensor records.
            </p>
          </div>
          <Link
            href="/findings/F-1024"
            className="px-4 py-2 rounded-xl bg-warm-900 hover:bg-warm-800 text-warm-50 text-xs font-semibold flex items-center space-x-2 transition shadow-sm shrink-0"
          >
            <span>View Evidence</span>
            <ArrowRight className="w-3.5 h-3.5 text-warm-300" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Column: REPORTED */}
          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-800">
                REPORTED SOC PERFORMANCE
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold">
                Status: Healthy
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="bg-white p-3 rounded-lg border border-emerald-200/60 shadow-2xs">
                <span className="text-2xl font-bold font-mono text-emerald-700">99%</span>
                <span className="text-[11px] text-warm-600 block mt-0.5 font-medium leading-tight">Critical alerts within SLA</span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-emerald-200/60 shadow-2xs">
                <span className="text-2xl font-bold font-mono text-emerald-700">98%</span>
                <span className="text-[11px] text-warm-600 block mt-0.5 font-medium leading-tight">Critical closure compliance</span>
              </div>
            </div>
            <p className="text-[11px] text-warm-600 leading-relaxed pt-1">
              High-level regulatory attestations report exemplary triage velocity and flawless SLA compliance metrics.
            </p>
          </div>

          {/* Right Column: OBSERVED */}
          <div className="p-4 rounded-xl bg-orange-50/50 border border-orange-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-orange-900">
                OBSERVED OPERATIONAL EVIDENCE
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-300 font-semibold">
                Review Recommended
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
              <div className="bg-white p-2.5 rounded-lg border border-orange-200/60 shadow-2xs">
                <span className="text-[10px] text-warm-500 uppercase block font-sans">Fast Closures</span>
                <span className="text-sm font-bold text-orange-700">3 min vs 47 min peer</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-orange-200/60 shadow-2xs">
                <span className="text-[10px] text-warm-500 uppercase block font-sans">Low Escalation</span>
                <span className="text-sm font-bold text-orange-700">1.8% vs 14.2% peer</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-orange-200/60 shadow-2xs">
                <span className="text-[10px] text-warm-500 uppercase block font-sans">Repetitive Notes</span>
                <span className="text-sm font-bold text-amber-700">84% template match</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-orange-200/60 shadow-2xs">
                <span className="text-[10px] text-warm-500 uppercase block font-sans">Silent Critical Asset</span>
                <span className="text-sm font-bold text-orange-700">47 days zero telemetry</span>
              </div>
            </div>
            <p className="text-[11px] text-warm-700 leading-relaxed font-sans pt-1">
              <strong>Supervisory Observation:</strong> Potential mismatch between reported operational performance and supporting evidence. Review recommended.
            </p>
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

        {/* Priority Findings Section (Section 9) */}
        <div className="bg-white p-6 rounded-2xl border border-warm-200 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between border-b border-warm-200/70 pb-3">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-emerald-700" />
              <h3 className="text-sm font-bold text-warm-900 font-serif">
                Priority Findings
              </h3>
            </div>
            <Link href="/findings" className="text-xs text-emerald-800 hover:text-emerald-900 font-semibold hover:underline flex items-center space-x-1">
              <span>View All 37 Findings</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <p className="text-xs text-warm-500">
            Top supervisory signals prioritized by the Claim-vs-Reality cross-signal engine
          </p>

          <div className="overflow-x-auto pt-1">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-warm-200 text-[10px] font-mono uppercase text-warm-500 bg-warm-50/70">
                  <th className="py-2.5 px-3">Finding ID</th>
                  <th className="py-2.5 px-3">Entity</th>
                  <th className="py-2.5 px-3">Finding</th>
                  <th className="py-2.5 px-3">Severity</th>
                  <th className="py-2.5 px-3">Confidence</th>
                  <th className="py-2.5 px-3">Evidence</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warm-100 font-mono">
                {/* F-1024 */}
                <tr className="hover:bg-warm-50/70 transition-colors group cursor-pointer">
                  <td className="py-3 px-3 font-bold text-warm-900">
                    <Link href="/findings/F-1024" className="hover:underline text-warm-900">F-1024</Link>
                  </td>
                  <td className="py-3 px-3 font-semibold text-warm-800 font-sans">CSE Alpha</td>
                  <td className="py-3 px-3 font-medium text-warm-800 font-sans">Fast critical closure</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-800 border border-orange-200">
                      HIGH
                    </span>
                  </td>
                  <td className="py-3 px-3 font-bold text-emerald-800">92%</td>
                  <td className="py-3 px-3 text-warm-600">18 records</td>
                  <td className="py-3 px-3 font-sans">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                      Review Recommended
                    </span>
                  </td>
                  <td className="py-3 px-3 font-sans">
                    <Link href="/findings/F-1024" className="px-2 py-1 text-[11px] rounded-lg bg-warm-900 text-warm-50 font-semibold hover:bg-warm-800 transition">
                      Inspect
                    </Link>
                  </td>
                </tr>

                {/* F-1027 */}
                <tr className="hover:bg-warm-50/70 transition-colors group cursor-pointer">
                  <td className="py-3 px-3 font-bold text-warm-900">
                    <Link href="/findings/F-1027" className="hover:underline text-warm-900">F-1027</Link>
                  </td>
                  <td className="py-3 px-3 font-semibold text-warm-800 font-sans">CSE Alpha</td>
                  <td className="py-3 px-3 font-medium text-warm-800 font-sans">Silent critical asset</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-800 border border-orange-200">
                      HIGH
                    </span>
                  </td>
                  <td className="py-3 px-3 font-bold text-emerald-800">89%</td>
                  <td className="py-3 px-3 text-warm-600">7 records</td>
                  <td className="py-3 px-3 font-sans">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                      Review Recommended
                    </span>
                  </td>
                  <td className="py-3 px-3 font-sans">
                    <Link href="/findings/F-1027" className="px-2 py-1 text-[11px] rounded-lg bg-warm-100 text-warm-800 font-semibold hover:bg-warm-200 transition border border-warm-200">
                      Inspect
                    </Link>
                  </td>
                </tr>

                {/* F-1031 */}
                <tr className="hover:bg-warm-50/70 transition-colors group cursor-pointer">
                  <td className="py-3 px-3 font-bold text-warm-900">
                    <Link href="/findings/F-1031" className="hover:underline text-warm-900">F-1031</Link>
                  </td>
                  <td className="py-3 px-3 font-semibold text-warm-800 font-sans">CSE Beta</td>
                  <td className="py-3 px-3 font-medium text-warm-800 font-sans">Template-driven investigations</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                      MEDIUM
                    </span>
                  </td>
                  <td className="py-3 px-3 font-bold text-emerald-800">84%</td>
                  <td className="py-3 px-3 text-warm-600">43 records</td>
                  <td className="py-3 px-3 font-sans">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-warm-100 text-warm-700 border border-warm-200">
                      Review
                    </span>
                  </td>
                  <td className="py-3 px-3 font-sans">
                    <Link href="/findings/F-1031" className="px-2 py-1 text-[11px] rounded-lg bg-warm-100 text-warm-800 font-semibold hover:bg-warm-200 transition border border-warm-200">
                      Inspect
                    </Link>
                  </td>
                </tr>

                {/* F-1038 */}
                <tr className="hover:bg-warm-50/70 transition-colors group cursor-pointer">
                  <td className="py-3 px-3 font-bold text-warm-900">
                    <Link href="/findings/F-1038" className="hover:underline text-warm-900">F-1038</Link>
                  </td>
                  <td className="py-3 px-3 font-semibold text-warm-800 font-sans">CSE Gamma</td>
                  <td className="py-3 px-3 font-medium text-warm-800 font-sans">Missing alert category</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                      MEDIUM
                    </span>
                  </td>
                  <td className="py-3 px-3 font-bold text-emerald-800">81%</td>
                  <td className="py-3 px-3 text-warm-600">12 records</td>
                  <td className="py-3 px-3 font-sans">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-warm-100 text-warm-700 border border-warm-200">
                      Review
                    </span>
                  </td>
                  <td className="py-3 px-3 font-sans">
                    <Link href="/findings/F-1038" className="px-2 py-1 text-[11px] rounded-lg bg-warm-100 text-warm-800 font-semibold hover:bg-warm-200 transition border border-warm-200">
                      Inspect
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
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
