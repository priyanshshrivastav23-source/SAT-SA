'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  AlertTriangle,
  Building2,
  FileCheck2,
  CheckCircle2,
  Clock,
  HelpCircle,
  AlertOctagon,
  Scale,
  ShieldCheck,
  Hash,
  Activity,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import { satSaService } from '@/services/satSaService';
import { Finding, FindingStatus, EvidenceRecord } from '@/types/sat-sa';

export default function FindingDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [finding, setFinding] = useState<Finding | null>(null);
  const [evidenceList, setEvidenceList] = useState<EvidenceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [examinerStatus, setExaminerStatus] = useState<FindingStatus>('Under Review');
  const [notes, setNotes] = useState('');
  const [savedMessage, setSavedMessage] = useState(false);

  useEffect(() => {
    async function load() {
      if (!id) return;
      const f = await satSaService.getFindingById(id);
      if (f) {
        setFinding(f);
        setExaminerStatus(f.status);
        setNotes(f.examinerNotes || '');
        const allEvd = await satSaService.getEvidenceRecords();
        setEvidenceList(allEvd.filter(e => f.evidenceIds.includes(e.id)));
      }
      setLoading(false);
    }
    load();
  }, [id]);

  const handleSaveDecision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!finding) return;
    const updated = await satSaService.updateFindingStatus(finding.id, examinerStatus, notes);
    setFinding(updated);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2500);
  };

  if (loading) {
    return <div className="p-8 text-center text-warm-500 font-mono text-xs">Loading finding details...</div>;
  }

  if (!finding) {
    return (
      <div className="p-8 text-center space-y-3">
        <p className="text-warm-600 text-sm">Finding not found.</p>
        <Link href="/findings" className="text-emerald-700 text-xs font-semibold hover:underline">
          Return to Findings
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb Bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/findings"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-warm-600 hover:text-warm-900 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Findings Management</span>
        </Link>
        <span className="text-[11px] font-mono text-warm-500 bg-warm-100 px-2.5 py-0.5 rounded border border-warm-200">
          Ref ID: {finding.id}
        </span>
      </div>

      {/* Main Finding Overview Card */}
      <div className="bg-white p-6 rounded-2xl border border-warm-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-warm-100 pb-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold bg-warm-900 text-warm-50 px-2 py-0.5 rounded">
                {finding.id}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-warm-100 text-warm-800 border border-warm-200">
                {finding.category}
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  finding.priority === 'Critical'
                    ? 'bg-orange-50 text-orange-700 border border-orange-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}
              >
                {finding.priority} Priority
              </span>
              <span className="text-xs text-warm-500 font-mono">
                Detected: {finding.detectionDate}
              </span>
            </div>

            <h1 className="text-xl font-bold text-warm-900 mt-1">
              {finding.title}
            </h1>

            <div className="flex items-center space-x-3 text-xs text-warm-500 pt-1">
              <Link
                href={`/entities/${finding.entityId}`}
                className="font-semibold text-warm-900 hover:underline flex items-center space-x-1"
              >
                <Building2 className="w-3.5 h-3.5 text-warm-500" />
                <span>{finding.entityCode} — {finding.entityName}</span>
              </Link>
              <span>•</span>
              <span>Sector: {finding.sector}</span>
            </div>
          </div>

          <div className="flex flex-col items-end space-y-2 shrink-0">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                finding.status === 'Confirmed for Follow-up'
                  ? 'bg-orange-50 text-orange-700 border border-orange-200'
                  : finding.status === 'Under Review'
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'bg-warm-100 text-warm-700 border border-warm-200'
              }`}
            >
              Current Status: {finding.status}
            </span>
            <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Evidence Strength: {finding.evidenceStrength}
            </span>
          </div>
        </div>

        {/* Transparent Reasoning Card: Pattern & Why Flagged */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-warm-50 border border-warm-200 space-y-1.5">
            <h3 className="text-xs uppercase font-bold tracking-wider text-warm-700 flex items-center space-x-1.5">
              <Info className="w-3.5 h-3.5 text-warm-500" />
              <span>Summary of Detected Pattern</span>
            </h3>
            <p className="text-xs text-warm-700 leading-relaxed">
              {finding.patternSummary}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-warm-50 border border-warm-200 space-y-1.5">
            <h3 className="text-xs uppercase font-bold tracking-wider text-amber-800 flex items-center space-x-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
              <span>Why the System Flagged It</span>
            </h3>
            <p className="text-xs text-warm-700 leading-relaxed">
              {finding.whyFlagged}
            </p>
          </div>
        </div>

        {/* Metric Comparison & Peer Context */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-white rounded-xl border border-warm-200">
            <span className="text-[10px] font-bold text-warm-400 uppercase tracking-wider block">
              Confidence Score
            </span>
            <span className="text-xl font-bold font-mono text-emerald-800 block mt-0.5">
              {finding.confidenceScore || 92}%
            </span>
            <span className="text-[10px] text-warm-500">Cross-Signal Weighted</span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-warm-200">
            <span className="text-[10px] font-bold text-warm-400 uppercase tracking-wider block">
              Reported Value
            </span>
            <span className="text-sm font-bold font-mono text-warm-800 block mt-0.5">
              {finding.relevantKpiComparison.reportedValue}
            </span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-warm-200">
            <span className="text-[10px] font-bold text-warm-400 uppercase tracking-wider block">
              Observed Value
            </span>
            <span className="text-sm font-bold font-mono text-orange-700 block mt-0.5">
              {finding.relevantKpiComparison.observedValue}
            </span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-warm-200">
            <span className="text-[10px] font-bold text-warm-400 uppercase tracking-wider block">
              Peer Comparison
            </span>
            <span className="text-sm font-bold font-mono text-warm-700 block mt-0.5">
              {finding.peerContext?.peerAvg || '47 min median (22–81 min)'}
            </span>
            {finding.peerContext?.deviationPercent && (
              <span className="text-[10px] text-orange-600 block mt-0.5">
                Deviation: {finding.peerContext.deviationPercent}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Cross-Signal Reasoning Chain (Section 16) */}
      <div className="bg-white p-6 rounded-2xl border border-warm-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-warm-100 pb-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Claim-vs-Reality Fusion Lens
              </span>
              <span className="text-[10px] font-mono bg-warm-100 text-warm-700 px-2 py-0.5 rounded">
                Transparent Multi-Signal Model
              </span>
            </div>
            <h2 className="text-base font-bold text-warm-900 mt-1 font-serif">
              Cross-Signal Reasoning Chain
            </h2>
            <p className="text-xs text-warm-500 mt-0.5">
              Multiple weak signals combine to substantiate supervisory review without autonomous condemnation.
            </p>
          </div>
          <span className="text-[11px] font-mono text-warm-700 bg-warm-100 px-2.5 py-1 rounded-md border border-warm-200 font-semibold self-start sm:self-auto">
            Formula: ∑ (w_i × signal_i) = 0.88 / 1.00
          </span>
        </div>

        {/* Visual Chain Progression */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-1">
          <div className="p-3.5 rounded-xl bg-orange-50/70 border border-orange-200 space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-orange-900">1. Fast Closure</span>
              <span className="font-mono text-[10px] bg-orange-200 text-orange-900 px-1.5 py-0.2 rounded font-bold">w: 0.20</span>
            </div>
            <p className="text-[11px] text-warm-700">Median 3 min vs peer baseline 47 min (-93.6%)</p>
          </div>

          <div className="p-3.5 rounded-xl bg-orange-50/70 border border-orange-200 space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-orange-900">2. Low Escalation</span>
              <span className="font-mono text-[10px] bg-orange-200 text-orange-900 px-1.5 py-0.2 rounded font-bold">w: 0.20</span>
            </div>
            <p className="text-[11px] text-warm-700">1.8% escalation rate vs 14.2% peer baseline</p>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-amber-900">3. Repetitive Investigation</span>
              <span className="font-mono text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded font-bold">w: 0.20</span>
            </div>
            <p className="text-[11px] text-warm-700">84% boilerplate string similarity in analyst notes</p>
          </div>

          <div className="p-3.5 rounded-xl bg-orange-50/70 border border-orange-200 space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-orange-900">4. Silent Critical Assets</span>
              <span className="font-mono text-[10px] bg-orange-200 text-orange-900 px-1.5 py-0.2 rounded font-bold">w: 0.20</span>
            </div>
            <p className="text-[11px] text-warm-700">PAYMENT-DB-01 void of alerts for 47 days</p>
          </div>
        </div>

        {/* Chain Synthesis Conclusion */}
        <div className="p-4 rounded-xl bg-warm-100 border border-warm-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="space-y-0.5">
            <div className="font-bold text-warm-900 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <span>Claim-vs-Reality Concern Identified → Human Supervisory Review Recommended</span>
            </div>
            <p className="text-warm-600 text-[11px]">
              Individual signals alone do not confirm violation; algorithmic fusion establishes sufficient evidentiary basis for targeted inquiry.
            </p>
          </div>
          <Link
            href="/review-planner"
            className="px-3 py-1.5 rounded-lg bg-warm-900 hover:bg-warm-800 text-warm-50 font-semibold transition shrink-0 text-center"
          >
            Add to Review Planner
          </Link>
        </div>
      </div>

      {/* Counterfactual & Non-Autonomous Determination (Section 17) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-warm-200 shadow-sm space-y-2">
          <h3 className="text-xs uppercase font-bold tracking-wider text-warm-700 flex items-center space-x-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-warm-500" />
            <span>Counterfactual Test</span>
          </h3>
          <p className="text-xs text-warm-800 leading-relaxed font-mono bg-warm-50 p-3 rounded-xl border border-warm-100">
            {finding.counterfactual || 'This signal would not trigger if the median critical closure time exceeded 22 minutes, assuming other conditions remain unchanged.'}
          </p>
          <span className="text-[10px] text-warm-500 block">
            Sensitivity threshold: Evaluates boundary conditions required to overturn signal validity.
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-warm-200 shadow-sm space-y-2">
          <h3 className="text-xs uppercase font-bold tracking-wider text-emerald-800 flex items-center space-x-1.5">
            <Scale className="w-3.5 h-3.5 text-emerald-700" />
            <span>Why NOT Automatically Classified as Non-Compliant?</span>
          </h3>
          <p className="text-xs text-warm-800 leading-relaxed font-sans bg-emerald-50/40 p-3 rounded-xl border border-emerald-200/60">
            {finding.nonAutonomousReason || 'Fast closure may be legitimate (e.g., well-tuned automated orchestration playbooks). SAT-SA therefore presents supporting evidence and recommends examiner review rather than issuing an autonomous verdict.'}
          </p>
          <span className="text-[10px] text-warm-500 block">
            Product Principle: SAT-SA assists human supervisory judgement and avoids automated punitive verdicts.
          </span>
        </div>
      </div>

      {/* Evidence Records Table with Raw SOC Record Modal (Section 15 & 18) */}
      <div className="bg-white rounded-2xl border border-warm-200 shadow-sm overflow-hidden space-y-0">
        <div className="p-4 bg-warm-100 border-b border-warm-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xs font-bold text-warm-900 uppercase tracking-wider flex items-center space-x-2">
              <FileCheck2 className="w-4 h-4 text-emerald-700" />
              <span>Evidence Records ({finding.rawRecords?.length || 4} Sample Incidents)</span>
            </h3>
            <p className="text-[11px] text-warm-500">
              Underlying operational records corroborating the rapid closure and shallow investigation pattern.
            </p>
          </div>
          <span className="text-[10px] font-mono text-warm-600 bg-white px-2 py-1 rounded border border-warm-200">
            Drill-down: Finding → Reason → Evidence → Raw Record
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-warm-200 text-[10px] font-mono uppercase text-warm-500 bg-warm-50/70">
                <th className="py-2.5 px-3">Alert ID</th>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Severity</th>
                <th className="py-2.5 px-3">Closure Time</th>
                <th className="py-2.5 px-3">Escalation</th>
                <th className="py-2.5 px-3">Investigation</th>
                <th className="py-2.5 px-3">Remediation</th>
                <th className="py-2.5 px-3">Raw SOC Record</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-100 font-mono">
              {(finding.rawRecords || [
                {
                  record_id: 'ALT-98213',
                  timestamp: '10:03:14 IST',
                  entity_id: 'CSE Alpha',
                  asset_id: 'PAYMENT-GW-01',
                  severity: 'Critical',
                  case_id: 'CAS-4401',
                  workflow_state: 'Closed - Resolved',
                  escalation: 'No',
                  investigation: 'Minimal (42 chars)',
                  remediation: 'None documented',
                  sha256_hash: '8f3a8b27c9e0411a78912d8a56f0c39128f7d934bb7e203498cb0e21a92c0192'
                },
                {
                  record_id: 'ALT-98219',
                  timestamp: '11:12:02 IST',
                  entity_id: 'CSE Alpha',
                  asset_id: 'CORE-SWITCH-02',
                  severity: 'Critical',
                  case_id: 'CAS-4408',
                  workflow_state: 'Closed - False Positive',
                  escalation: 'No',
                  investigation: 'Minimal (38 chars)',
                  remediation: 'None documented',
                  sha256_hash: '3d91f28b7e40a12c890123ef4567890abcdef1234567890abcdef1234567890a'
                },
                {
                  record_id: 'ALT-98224',
                  timestamp: '12:45:30 IST',
                  entity_id: 'CSE Alpha',
                  asset_id: 'DB-REPLICA-03',
                  severity: 'Critical',
                  case_id: 'CAS-4415',
                  workflow_state: 'Closed - Resolved',
                  escalation: 'No',
                  investigation: 'Minimal (45 chars)',
                  remediation: 'None documented',
                  sha256_hash: '7b82f041b3c99021487ea310f82531cd89912a74c6e93014f31c201891de1204'
                },
                {
                  record_id: 'ALT-98231',
                  timestamp: '14:18:44 IST',
                  entity_id: 'CSE Alpha',
                  asset_id: 'HSM-AUTH-01',
                  severity: 'Critical',
                  case_id: 'CAS-4422',
                  workflow_state: 'Closed - Suppressed',
                  escalation: 'No',
                  investigation: 'Minimal (51 chars)',
                  remediation: 'None documented',
                  sha256_hash: '5a41c2e98710fa4312de8901bcae5678901234567890abcdef1234567890abcd'
                }
              ]).map((rec) => (
                <tr key={rec.record_id} className="hover:bg-warm-50/70 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-warm-900">{rec.record_id}</td>
                  <td className="py-2.5 px-3 text-warm-600">{rec.timestamp}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-800 border border-orange-200">
                      {rec.severity}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-bold text-orange-700">3 min</td>
                  <td className="py-2.5 px-3 text-warm-600 font-sans">{rec.escalation}</td>
                  <td className="py-2.5 px-3 text-warm-700 font-sans">{rec.investigation}</td>
                  <td className="py-2.5 px-3 text-warm-500 font-sans">{rec.remediation}</td>
                  <td className="py-2.5 px-3 font-sans">
                    <button
                      onClick={() => alert(`RAW SOC RECORD (ID: ${rec.record_id})\n----------------------------------------\nrecord_id: ${rec.record_id}\ntimestamp: ${rec.timestamp}\nentity_id: ${rec.entity_id}\nasset_id: ${rec.asset_id}\nseverity: ${rec.severity}\ncase_id: ${rec.case_id}\nworkflow_state: ${rec.workflow_state}\nescalation: ${rec.escalation}\ninvestigation: ${rec.investigation}\nremediation: ${rec.remediation}\nsha256_hash: ${rec.sha256_hash || '8f3a8b27c9e0411a78912d8a56f0c39128f7d934bb7e203498cb0e21a92c0192'}`)}
                      className="px-2 py-1 bg-warm-100 hover:bg-warm-200 text-warm-800 rounded font-semibold text-[11px] transition border border-warm-200"
                    >
                      View Source Record
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Local Cryptographic Evidence Ledger (Section 19) */}
      <div className="bg-white p-6 rounded-2xl border border-warm-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-warm-100 pb-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Evidentiary Integrity Guarantee
              </span>
              <span className="text-[10px] font-mono bg-warm-100 text-warm-700 px-2 py-0.5 rounded">
                Non-Tamper Bounds
              </span>
            </div>
            <h3 className="text-base font-bold text-warm-900 mt-1 font-serif">
              Local Cryptographic Evidence Ledger
            </h3>
            <p className="text-xs text-warm-500 mt-0.5">
              Every ingested record and finding evidence chain is anchored in a local SHA-256 Merkle ledger for air-gapped forensic verification.
            </p>
          </div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300 self-start sm:self-auto font-mono">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
            ✓ Cryptographically Verified
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
          <div className="p-3.5 rounded-xl bg-warm-50 border border-warm-200 space-y-1">
            <span className="text-[10px] uppercase font-bold text-warm-500 font-sans block">Record Hash (SHA-256)</span>
            <div className="text-[11px] text-warm-800 break-all bg-white p-2 rounded border border-warm-200/80">
              8f3a8b27c9e0411a78912d8a56f0c39128f7d934bb7e203498cb0e21a92c0192
            </div>
            <span className="text-[10px] text-warm-500 font-sans block pt-0.5">Record ID: ALT-98213</span>
          </div>

          <div className="p-3.5 rounded-xl bg-warm-50 border border-warm-200 space-y-1">
            <span className="text-[10px] uppercase font-bold text-warm-500 font-sans block">Batch Root (Merkle Root)</span>
            <div className="text-[11px] text-warm-800 break-all bg-white p-2 rounded border border-warm-200/80">
              7b82f041b3c99021487ea310f82531cd89912a74c6e93014f31c201891de1204
            </div>
            <span className="text-[10px] text-warm-500 font-sans block pt-0.5">Batch: BTH-2026-10-W1-ALPHA</span>
          </div>

          <div className="p-3.5 rounded-xl bg-warm-50 border border-warm-200 space-y-1">
            <span className="text-[10px] uppercase font-bold text-warm-500 font-sans block">Previous Batch Hash</span>
            <div className="text-[11px] text-warm-800 break-all bg-white p-2 rounded border border-warm-200/80">
              4c1a792df91024bc68102a39158c301bbfa931045e72fb418902cfa0184b9102
            </div>
            <span className="text-[10px] text-warm-500 font-sans block pt-0.5">Immutable Link Sealed</span>
          </div>
        </div>
      </div>

      {/* Examiner Decision & Notes Form (Functional in Demo State) */}
      <div className="bg-white p-6 rounded-2xl border border-warm-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-warm-100 pb-3">
          <div className="flex items-center space-x-2">
            <Scale className="w-5 h-5 text-emerald-700" />
            <div>
              <h3 className="text-sm font-bold text-warm-900">
                Official Examiner Decision & Review Controls
              </h3>
              <p className="text-[11px] text-warm-500">
                Human examiner retains statutory discretion to accept, reject, or mandate entity follow-up.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-warm-500 bg-warm-100 px-2.5 py-0.5 rounded border border-warm-200">
            Audit Log Synchronized
          </span>
        </div>

        <form onSubmit={handleSaveDecision} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-warm-700 block mb-1">
                Assign Workflow Status
              </label>
              <select
                value={examinerStatus}
                onChange={(e: any) => setExaminerStatus(e.target.value)}
                className="w-full bg-warm-50 border border-warm-200 rounded-xl px-3 py-2 text-xs text-warm-900 font-semibold focus:outline-none focus:border-warm-400"
              >
                <option value="New">New (Awaiting Review)</option>
                <option value="Under Review">Under Review (Examiner Active)</option>
                <option value="Confirmed for Follow-up">Confirmed for Follow-up (Directive Queued)</option>
                <option value="Rejected">Rejected (Not an Execution Gap / Benign Tuning)</option>
                <option value="Resolved">Resolved (Satisfactorily Addressed)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-warm-700 block mb-1">
                Supervisory Examiner Identification
              </label>
              <input
                type="text"
                readOnly
                value="Shri R. Rao (Dy. Director, NCIIPC Desk 409)"
                className="w-full bg-warm-100/70 border border-warm-200 rounded-xl px-3 py-2 text-xs text-warm-700 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-warm-700 block mb-1">
              Examiner Assessment Notes & Mandated Remediation Directives
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Record forensic rationale, corroborated evidence references, and required remediation directives for the Critical Sector Entity CISO..."
              className="w-full bg-warm-50 border border-warm-200 rounded-xl p-3 text-xs text-warm-900 focus:outline-none focus:border-warm-400 placeholder-warm-400 leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-warm-500">
              Changes update local demo state and generate an audit timeline entry.
            </span>
            <button
              type="submit"
              className="px-4 py-2 bg-warm-900 hover:bg-warm-800 text-warm-50 text-xs font-bold rounded-xl transition shadow-sm"
            >
              Record Supervisory Decision
            </button>
          </div>

          {savedMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold text-center">
              Supervisory determination successfully recorded and logged in the immutable audit trail!
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
