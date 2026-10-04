'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Building2,
  ArrowLeft,
  ShieldCheck,
  AlertTriangle,
  Activity,
  FileCheck2,
  Database,
  Radar,
  BarChart3,
  ExternalLink,
  Layers,
  MapPin,
  User,
  Clock,
  CheckCircle2
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { satSaService } from '@/services/satSaService';
import { EntitySummary, Finding, NegativeSpaceItem } from '@/types/sat-sa';

export default function EntityDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [entity, setEntity] = useState<EntitySummary | null>(null);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [negativeSpace, setNegativeSpace] = useState<NegativeSpaceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!id) return;
      const ent = await satSaService.getEntityById(id);
      if (ent) {
        setEntity(ent);
        const allFindings = await satSaService.getFindings();
        setFindings(allFindings.filter(f => f.entityCode === ent.code));
        const allNeg = await satSaService.getNegativeSpaceItems();
        setNegativeSpace(allNeg.filter(n => n.entityCode === ent.code));
      }
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return <div className="p-8 text-center text-warm-500 font-mono text-xs">Loading entity profile...</div>;
  }

  if (!entity) {
    return (
      <div className="p-8 text-center space-y-3">
        <p className="text-warm-600 text-sm">Entity not found.</p>
        <Link href="/entities" className="text-emerald-700 text-xs font-semibold hover:underline">
          Return to Entity Registry
        </Link>
      </div>
    );
  }

  const comparisonData = [
    { name: 'MTTD (min)', reported: entity.reportedKpis.mttdMinutes, peerAverage: 18.5 },
    { name: 'MTTR (min)', reported: entity.reportedKpis.mttrMinutes, peerAverage: 51.0 },
    { name: 'Closure Rate (%)', reported: entity.reportedKpis.closureRatePercent, peerAverage: 96.2 },
    { name: 'False Positive (%)', reported: entity.reportedKpis.falsePositiveRatePercent, peerAverage: 88.0 },
  ];

  return (
    <div className="space-y-6">
      {/* Back Navigation Bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/entities"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-warm-600 hover:text-warm-900 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Entity Registry</span>
        </Link>
        <span className="text-[11px] font-mono text-warm-500 bg-warm-100 px-2.5 py-0.5 rounded border border-warm-200">
          Assessment Cycle: Q3 2026 (Active)
        </span>
      </div>

      {/* Entity Profile Header Card */}
      <div className="bg-white p-6 rounded-2xl border border-warm-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-warm-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-bold bg-warm-900 text-warm-50 px-2 py-0.5 rounded">
                {entity.code}
              </span>
              <span className="text-xs text-warm-500 font-semibold">•</span>
              <span className="text-xs text-warm-600 font-medium">{entity.sector}</span>
              <span className="text-xs text-warm-500 font-semibold">•</span>
              <span className="text-xs text-emerald-800 bg-emerald-50 px-2 py-0.2 rounded border border-emerald-200">
                {entity.tier}
              </span>
            </div>
            <h1 className="text-xl font-bold text-warm-900 mt-1">
              {entity.name}
            </h1>
            <p className="text-xs text-warm-500 flex items-center space-x-3 pt-1">
              <span className="flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-warm-400" />
                <span>{entity.location}</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <User className="w-3.5 h-3.5 text-warm-400" />
                <span>Nodal Officer: {entity.nodalOfficer}</span>
              </span>
            </p>
          </div>

          <div className="flex flex-col items-end space-y-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                entity.reviewStatus === 'Flagged for Escalation'
                  ? 'bg-orange-50 text-orange-700 border border-orange-200'
                  : entity.reviewStatus === 'In Assessment'
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}
            >
              Status: {entity.reviewStatus}
            </span>
            <div className="text-right text-[11px] text-warm-500 font-mono">
              SIEM: {entity.siemPlatform}
            </div>
          </div>
        </div>

        {/* 4 Core Quantitative Indices */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 bg-warm-50 rounded-xl border border-warm-200">
            <span className="text-[10px] font-bold text-warm-500 uppercase tracking-wider block">
              Discrepancy Index
            </span>
            <span className="text-xl font-bold font-mono text-orange-700 block mt-0.5">
              {entity.evidenceMetrics.discrepancyIndex}/100
            </span>
            <span className="text-[10px] text-warm-500">Calculated variance</span>
          </div>

          <div className="p-3 bg-warm-50 rounded-xl border border-warm-200">
            <span className="text-[10px] font-bold text-warm-500 uppercase tracking-wider block">
              Data Quality Score
            </span>
            <span className="text-xl font-bold font-mono text-warm-800 block mt-0.5">
              {entity.dataQualityScore}%
            </span>
            <span className="text-[10px] text-warm-500">Schema & Temporal Fidelity</span>
          </div>

          <div className="p-3 bg-warm-50 rounded-xl border border-warm-200">
            <span className="text-[10px] font-bold text-warm-500 uppercase tracking-wider block">
              Negative Space Risk
            </span>
            <span className="text-xl font-bold font-mono text-violet-700 block mt-0.5">
              {entity.negativeSpaceScore}/100
            </span>
            <span className="text-[10px] text-warm-500">Potential Ingestion Gaps</span>
          </div>

          <div className="p-3 bg-warm-50 rounded-xl border border-warm-200">
            <span className="text-[10px] font-bold text-warm-500 uppercase tracking-wider block">
              Total Signals Flagged
            </span>
            <span className="text-xl font-bold font-mono text-warm-900 block mt-0.5">
              {findings.length}
            </span>
            <span className="text-[10px] text-warm-500">Requires human review</span>
          </div>
        </div>
      </div>

      {/* Reported Metrics vs Evidence Corroboration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reported Metrics Panel */}
        <div className="bg-white p-5 rounded-2xl border border-warm-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-warm-100 pb-2">
            <h3 className="text-sm font-bold text-warm-900">
              Reported Operational Claims (Self-Reported)
            </h3>
            <span className="text-[10px] font-mono text-warm-500 bg-warm-100 px-2 py-0.5 rounded">
              Entity SOC Metrics
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-warm-50">
              <span className="text-warm-600">Mean Time to Detect (MTTD):</span>
              <span className="font-mono font-bold text-warm-900">{entity.reportedKpis.mttdMinutes} minutes</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-warm-50">
              <span className="text-warm-600">Mean Time to Resolve (MTTR):</span>
              <span className="font-mono font-bold text-warm-900">{entity.reportedKpis.mttrMinutes} minutes</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-warm-50">
              <span className="text-warm-600">Daily Alert Volume (Average):</span>
              <span className="font-mono font-bold text-warm-900">{entity.reportedKpis.dailyAlertVolume.toLocaleString()} events/day</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-warm-50">
              <span className="text-warm-600">Alert Closure Rate (within 24h):</span>
              <span className="font-mono font-bold text-warm-900">{entity.reportedKpis.closureRatePercent}%</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-warm-600">Claimed False-Positive Ratio:</span>
              <span className="font-mono font-bold text-warm-900">{entity.reportedKpis.falsePositiveRatePercent}%</span>
            </div>
          </div>
        </div>

        {/* Evidence Corroboration Panel */}
        <div className="bg-white p-5 rounded-2xl border border-warm-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-warm-100 pb-2">
            <h3 className="text-sm font-bold text-warm-900">
              Supporting Evidence Metrics (System-Observed)
            </h3>
            <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Empirical Telemetry
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-warm-50">
              <span className="text-warm-600">Raw Ingested Records (Validated):</span>
              <span className="font-mono font-bold text-warm-900">{(entity.evidenceMetrics.rawEventsIngested / 1000000).toFixed(1)}M events</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-warm-50">
              <span className="text-warm-600">Telemetry Completeness Index:</span>
              <span className="font-mono font-bold text-warm-900">{entity.evidenceMetrics.telemetryCompletenessPercent}%</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-warm-50">
              <span className="text-warm-600">Verified Evidence Artifacts:</span>
              <span className="font-mono font-bold text-warm-900">{entity.evidenceMetrics.verifiedEvidenceCount} artifacts</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-warm-50">
              <span className="text-warm-600">Negative Space Risk Score:</span>
              <span className="font-mono font-bold text-violet-700">{entity.negativeSpaceScore}/100</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-warm-600">Execution Discrepancy Index:</span>
              <span className="font-mono font-bold text-orange-700">{entity.evidenceMetrics.discrepancyIndex}/100</span>
            </div>
          </div>
        </div>
      </div>

      {/* Peer Comparison Chart */}
      <div className="bg-white p-5 rounded-2xl border border-warm-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-warm-900">
              Entity vs. Sector Peer Average Comparison
            </h3>
            <p className="text-xs text-warm-500">
              Deviations indicate areas for focused examiner review, not automatic non-compliance.
            </p>
          </div>
          <Link href="/benchmarks" className="text-xs text-emerald-700 hover:underline">
            View All Benchmarks
          </Link>
        </div>

        <div className="h-56 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" />
              <XAxis dataKey="name" stroke="#78716C" fontSize={11} />
              <YAxis stroke="#78716C" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#E7E5E4',
                  borderRadius: '0.75rem',
                  fontSize: '11px'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="reported" name={`${entity.code} Reported`} fill="#D97706" radius={[4, 4, 0, 0]} />
              <Bar dataKey="peerAverage" name="Sector Peer Average" fill="#52796F" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Associated Findings Table */}
      <div className="bg-white rounded-2xl border border-warm-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-warm-100 border-b border-warm-200 flex items-center justify-between">
          <h3 className="text-xs font-bold text-warm-900 uppercase tracking-wider">
            Supervisory Findings for {entity.code} ({findings.length})
          </h3>
          <span className="text-[11px] text-warm-500">
            Click finding to inspect reasoning and recorded examiner decisions
          </span>
        </div>

        <div className="divide-y divide-warm-100">
          {findings.length === 0 ? (
            <p className="p-6 text-center text-xs text-warm-500 italic">
              No active execution gap findings flagged for this entity in the current cycle.
            </p>
          ) : (
            findings.map((f) => (
              <div key={f.id} className="p-4 hover:bg-warm-50/80 transition flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-warm-900">{f.id}</span>
                    <span className="text-xs font-semibold text-warm-900">{f.title}</span>
                  </div>
                  <p className="text-xs text-warm-600 max-w-2xl leading-relaxed">
                    {f.explanation}
                  </p>
                  <div className="text-[11px] text-warm-400 flex items-center space-x-3 pt-0.5">
                    <span>Category: <strong className="text-warm-700">{f.category}</strong></span>
                    <span>•</span>
                    <span>Detected: {f.detectionDate}</span>
                    <span>•</span>
                    <span>Evidence: {f.supportingEvidenceCount} records</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  <span
                    className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                      f.priority === 'Critical'
                        ? 'bg-orange-50 text-orange-700 border border-orange-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {f.priority}
                  </span>
                  <Link
                    href={`/findings/${f.id}`}
                    className="px-3 py-1 bg-warm-900 hover:bg-warm-800 text-warm-50 rounded-lg text-xs font-semibold transition"
                  >
                    Examine Finding
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
