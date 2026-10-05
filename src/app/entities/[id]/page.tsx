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
              Overall Supervisory Indicator
            </span>
            <span className="text-xl font-bold font-mono text-orange-700 block mt-0.5">
              {entity.code === 'CSE Alpha' ? '72 / 100' : `${Math.round(100 - entity.evidenceMetrics.discrepancyIndex * 0.4)} / 100`}
            </span>
            <span className="text-[10px] text-warm-500 font-sans">Examiner Decision Support</span>
          </div>

          <div className="p-3 bg-warm-50 rounded-xl border border-warm-200">
            <span className="text-[10px] font-bold text-warm-500 uppercase tracking-wider block">
              Supervisory Status
            </span>
            <span className="text-sm font-bold text-orange-700 block mt-1.5 font-sans">
              Review Recommended
            </span>
            <span className="text-[10px] text-warm-500">Non-autonomous flag</span>
          </div>

          <div className="p-3 bg-warm-50 rounded-xl border border-warm-200">
            <span className="text-[10px] font-bold text-warm-500 uppercase tracking-wider block">
              Data Confidence
            </span>
            <span className="text-xl font-bold font-mono text-emerald-800 block mt-0.5">
              {entity.dataQualityScore}%
            </span>
            <span className="text-[10px] text-warm-500">Completeness & Consistency</span>
          </div>

          <div className="p-3 bg-warm-50 rounded-xl border border-warm-200">
            <span className="text-[10px] font-bold text-warm-500 uppercase tracking-wider block">
              Priority Finding
            </span>
            <Link href="/findings/F-1024" className="text-sm font-bold text-warm-900 block mt-1.5 hover:underline font-mono">
              F-1024 (Inspect) →
            </Link>
            <span className="text-[10px] text-warm-500">Claim-vs-Reality Mismatch</span>
          </div>
        </div>
      </div>

      {/* Eight Capability Indicators (Section 10) */}
      <div className="bg-white p-6 rounded-2xl border border-warm-200 shadow-sm space-y-4">
        <div className="border-b border-warm-100 pb-3">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Supervisory Baseline Framework
            </span>
            <span className="text-[10px] font-mono bg-warm-100 text-warm-700 px-2 py-0.5 rounded">
              8 Core Dimensions
            </span>
          </div>
          <h2 className="text-base font-bold text-warm-900 mt-1 font-serif">
            Supervisory Capability Indicators — {entity.name}
          </h2>
          <p className="text-xs text-warm-500 mt-0.5">
            Empirical capability ratings across 8 functional cybersecurity domains. Designed to support examiner judgement, not an automated verdict.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {[
            { name: 'Threat Detection', score: 81, avg: 78, status: 'Healthy' },
            { name: 'Investigation', score: 58, avg: 76, status: 'Review Recommended' },
            { name: 'Escalation', score: 52, avg: 74, status: 'Review Recommended' },
            { name: 'Incident Response', score: 64, avg: 75, status: 'Review Recommended' },
            { name: 'Security Operations', score: 76, avg: 79, status: 'Healthy' },
            { name: 'Governance & Oversight', score: 79, avg: 80, status: 'Healthy' },
            { name: 'Operational Discipline', score: 61, avg: 77, status: 'Review Recommended' },
            { name: 'Cyber Resilience', score: 74, avg: 75, status: 'Healthy' },
          ].map((cap) => (
            <div key={cap.name} className="p-3.5 rounded-xl bg-warm-50/70 border border-warm-200/90 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-warm-900">{cap.name}</span>
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-bold text-warm-900">{cap.score}/100</span>
                  <span
                    className={`text-[10px] px-2 py-0.2 rounded-full font-semibold ${
                      cap.status === 'Healthy'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {cap.status}
                  </span>
                </div>
              </div>
              <div className="w-full bg-warm-200/80 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    cap.score < 65 ? 'bg-orange-600' : cap.score < 75 ? 'bg-amber-500' : 'bg-emerald-600'
                  }`}
                  style={{ width: `${cap.score}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[10px] text-warm-500 font-mono">
                <span>Sector Peer Median: {cap.avg}/100</span>
                <span>Delta: {cap.score - cap.avg > 0 ? `+${cap.score - cap.avg}` : `${cap.score - cap.avg}`}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Operational Activity — Last 30 Days (Section 11) */}
      <div className="bg-white p-6 rounded-2xl border border-warm-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-warm-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-warm-900 font-serif">
              Operational Activity — Last 30 Days
            </h3>
            <p className="text-xs text-warm-500 mt-0.5">
              Continuous monitoring of alert ingress, closure volume, and escalation frequency. Note the abnormal triage spike and escalation collapse on Days 18–22.
            </p>
          </div>
          <span className="text-[11px] font-mono text-orange-800 bg-orange-50 px-2.5 py-1 rounded-md border border-orange-200 font-bold self-start sm:self-auto">
            Telemetry Anomaly Flagged (Days 18-22)
          </span>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={[
                { day: 'D1-3', alerts: 1420, closures: 1390, escalations: 180 },
                { day: 'D4-6', alerts: 1560, closures: 1510, escalations: 210 },
                { day: 'D7-9', alerts: 1380, closures: 1340, escalations: 190 },
                { day: 'D10-12', alerts: 1490, closures: 1460, escalations: 200 },
                { day: 'D13-15', alerts: 1620, closures: 1580, escalations: 220 },
                { day: 'D16-17', alerts: 1580, closures: 1550, escalations: 195 },
                { day: 'D18-20', alerts: 3840, closures: 3820, escalations: 12 },
                { day: 'D21-22', alerts: 3410, closures: 3390, escalations: 15 },
                { day: 'D23-25', alerts: 1520, closures: 1480, escalations: 190 },
                { day: 'D26-28', alerts: 1440, closures: 1410, escalations: 185 },
                { day: 'D29-30', alerts: 1390, closures: 1370, escalations: 175 }
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" />
              <XAxis dataKey="day" stroke="#78716C" fontSize={11} />
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
              <Bar dataKey="alerts" name="Alert Volume" fill="#78716C" radius={[4, 4, 0, 0]} />
              <Bar dataKey="closures" name="Closure Volume" fill="#059669" radius={[4, 4, 0, 0]} />
              <Bar dataKey="escalations" name="Escalation Volume" fill="#D97706" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Execution Gap Signals Section (Section 12) */}
      <div className="bg-white p-6 rounded-2xl border border-warm-200 shadow-sm space-y-4">
        <div className="border-b border-warm-100 pb-3">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Algorithmic Detection Lens
            </span>
            <span className="text-[10px] font-mono bg-warm-100 text-warm-700 px-2 py-0.5 rounded">
              Execution Gap Engine
            </span>
          </div>
          <h3 className="text-base font-bold text-warm-900 mt-1 font-serif">
            Execution Gap Signals
          </h3>
          <p className="text-xs text-warm-500 mt-0.5">
            Empirically identified deviations where observed SOC operational evidence diverges from expected execution baseline.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
          {[
            {
              signal: 'Fast High-Severity Closure',
              desc: 'Critical cases are being closed much faster than peer baseline.',
              observed: '3 min median',
              baseline: '47 min median',
              diff: '-93.6%',
              confidence: 91,
              evidence: 184
            },
            {
              signal: 'Critical Without Escalation',
              desc: 'Critical alerts reached closure without expected escalation evidence.',
              observed: '1.2% escalated',
              baseline: '14.8% escalated',
              diff: '-91.9%',
              confidence: 93,
              evidence: 92
            },
            {
              signal: 'Shallow Investigation',
              desc: 'Investigation records exist but show limited operational activity.',
              observed: '48 chars/note',
              baseline: '420 chars/note',
              diff: '-88.6%',
              confidence: 89,
              evidence: 114
            },
            {
              signal: 'Recurrence Without Remediation',
              desc: 'Repeated alerts exist without corresponding remediation evidence.',
              observed: '68% recurrence',
              baseline: '12% recurrence',
              diff: '+466.0%',
              confidence: 87,
              evidence: 64
            },
            {
              signal: 'Template-Driven Investigation',
              desc: 'Investigation notes show unusually high similarity across cases.',
              observed: '84% template match',
              baseline: '18% template match',
              diff: '+366.7%',
              confidence: 92,
              evidence: 156
            },
            {
              signal: 'Alert-to-Action Dead End',
              desc: 'Expected downstream workflow activity (ticketing, containment) is missing.',
              observed: '71% dead-end rate',
              baseline: '9% dead-end rate',
              diff: '+688.9%',
              confidence: 90,
              evidence: 88
            }
          ].map((gap) => (
            <div key={gap.signal} className="p-4 rounded-xl bg-warm-50/80 border border-warm-200/90 space-y-3 flex flex-col justify-between hover:border-warm-300 transition-colors">
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-warm-900 leading-tight">{gap.signal}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200 font-bold shrink-0 ml-1">
                    {gap.diff}
                  </span>
                </div>
                <p className="text-[11px] text-warm-600 mt-1.5 leading-relaxed">{gap.desc}</p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-warm-200/60 font-mono text-[11px]">
                <div className="flex justify-between text-warm-700">
                  <span className="font-sans text-warm-500">Observed:</span>
                  <strong className="text-orange-700">{gap.observed}</strong>
                </div>
                <div className="flex justify-between text-warm-700">
                  <span className="font-sans text-warm-500">Peer Baseline:</span>
                  <span>{gap.baseline}</span>
                </div>
                <div className="flex justify-between text-warm-700 pt-1 border-t border-warm-200/40">
                  <span className="font-sans text-warm-500">Confidence:</span>
                  <span className="text-emerald-800 font-bold">{gap.confidence}%</span>
                </div>
                <div className="flex justify-between text-warm-700">
                  <span className="font-sans text-warm-500">Evidence Count:</span>
                  <span className="text-warm-900 font-bold">{gap.evidence} cases</span>
                </div>
              </div>
            </div>
          ))}
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
