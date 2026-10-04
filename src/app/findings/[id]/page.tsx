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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
              {finding.peerContext?.peerAvg || 'N/A (Specialized OT System)'}
            </span>
            {finding.peerContext?.deviationPercent && (
              <span className="text-[10px] text-orange-600 block mt-0.5">
                Deviation: {finding.peerContext.deviationPercent}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Recommended Review Steps & Supporting Evidence */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recommended Review Steps */}
        <div className="bg-white p-5 rounded-2xl border border-warm-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-warm-100 pb-2">
            <h3 className="text-sm font-bold text-warm-900 flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>Recommended Examiner Verification Steps</span>
            </h3>
            <span className="text-[10px] font-mono text-warm-500 bg-warm-100 px-2 py-0.5 rounded">
              Supervisory Guidance
            </span>
          </div>

          <ol className="space-y-2.5 text-xs text-warm-700 list-decimal list-inside leading-relaxed">
            {finding.recommendedReviewSteps.map((step, idx) => (
              <li key={idx} className="p-2 bg-warm-50 rounded-lg border border-warm-100">
                <span className="text-warm-800 font-medium">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Supporting Evidence References */}
        <div className="bg-white p-5 rounded-2xl border border-warm-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-warm-100 pb-2">
            <h3 className="text-sm font-bold text-warm-900 flex items-center space-x-1.5">
              <FileCheck2 className="w-4 h-4 text-emerald-700" />
              <span>Corroborating Evidence Artifacts ({evidenceList.length})</span>
            </h3>
            <Link href="/evidence" className="text-xs text-emerald-700 hover:underline">
              Evidence Explorer
            </Link>
          </div>

          <div className="space-y-2.5">
            {evidenceList.length === 0 ? (
              <p className="text-xs text-warm-500 italic p-4 text-center">
                Evidence references linked: {finding.evidenceIds.join(', ')}
              </p>
            ) : (
              evidenceList.map((ev) => (
                <div key={ev.id} className="p-3 rounded-xl bg-warm-50 border border-warm-200 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-warm-900">{ev.id}</span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-warm-200 text-warm-700">
                      {ev.recordType}
                    </span>
                  </div>
                  <p className="text-warm-600 text-[11px] leading-snug">{ev.summary}</p>
                  <div className="font-mono text-[10px] text-warm-500 truncate pt-1 border-t border-warm-200/60">
                    SHA-256: {ev.sha256Hash}
                  </div>
                </div>
              ))
            )}
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
