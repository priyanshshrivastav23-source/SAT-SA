'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  History,
  Search,
  Filter,
  UserCheck,
  ShieldCheck,
  FileCheck2,
  AlertTriangle,
  Layers,
  Clock,
  CheckCircle2,
  Calendar,
  Code2,
  GitBranch,
  Terminal,
  Database
} from 'lucide-react';
import { satSaService } from '@/services/satSaService';
import { AuditEvent } from '@/types/sat-sa';

const CORE_AUDIT_TIMELINE = [
  {
    time: '08:32',
    timestamp: '2026-10-05 08:32:14 IST',
    title: 'Dataset imported',
    description: '125,430 SOC operational records ingested across 5 CSE entities (CSE Alpha, Beta, Gamma, Delta, Epsilon).',
    actor: 'ETL Air-Gapped Ingestion Daemon',
    status: 'COMPLETED',
    icon: Database,
    color: 'emerald'
  },
  {
    time: '08:33',
    timestamp: '2026-10-05 08:33:40 IST',
    title: 'Data quality validation completed',
    description: 'Data Confidence evaluated at 94% (Completeness: 97%, Consistency: 93%, Timestamp Integrity: 92%).',
    actor: 'Supervisory Data Quality Engine',
    status: 'COMPLETED',
    icon: ShieldCheck,
    color: 'emerald'
  },
  {
    time: '08:34',
    timestamp: '2026-10-05 08:34:22 IST',
    title: 'Evidence ledger generated',
    description: 'Cryptographic SHA-256 hashes generated for 1,120 sample evidence records and sealed with Merkle Root 7b82f091de4c5531.',
    actor: 'Local Cryptographic Evidence Ledger',
    status: 'SEALED',
    icon: FileCheck2,
    color: 'emerald'
  },
  {
    time: '08:35',
    timestamp: '2026-10-05 08:35:10 IST',
    title: 'Analytics completed',
    description: 'Execution Gap Engine, Negative Space Radar, and Peer Benchmark baseline pipelines processed 125,430 events.',
    actor: 'SAT-SA Heuristic-Fusion Engine',
    status: 'COMPLETED',
    icon: Layers,
    color: 'emerald'
  },
  {
    time: '08:36',
    timestamp: '2026-10-05 08:36:04 IST',
    title: 'Finding F-1024 generated',
    description: 'Claim-vs-Reality concern identified for CSE Alpha: Fast critical closures (median 3 min) and low escalation (1.8%). Confidence: 92%.',
    actor: 'Supervisory Finding Generator',
    status: 'FLAGGED',
    icon: AlertTriangle,
    color: 'orange'
  },
  {
    time: '08:37',
    timestamp: '2026-10-05 08:37:48 IST',
    title: 'Examiner opened finding',
    description: 'Examiner R. Rao accessed Finding F-1024 docket, reviewed cross-signal reasoning, and verified cryptographic hash integrity.',
    actor: 'Examiner R. Rao (Supervisory Desk)',
    status: 'INSPECTED',
    icon: UserCheck,
    color: 'blue'
  }
];

export default function AuditPage() {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function load() {
      const data = await satSaService.getAuditEvents();
      setEvents(data);
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-warm-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-mono">
              Immutable Governance Trail
            </span>
            <span className="text-[10px] font-mono bg-warm-100 text-warm-700 px-2 py-0.5 rounded">
              Statutory Supervisory Audit
            </span>
          </div>
          <h1 className="text-xl font-bold text-warm-900 mt-1">
            Supervisory Audit Timeline
          </h1>
          <p className="text-xs text-warm-600 mt-0.5">
            Transparent sequential log of data ingestion, evidence hashing, algorithmic finding generation, and examiner access.
          </p>
        </div>

        <div className="p-3 bg-warm-50 rounded-xl border border-warm-200 text-xs text-warm-700 flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <div>
            <span className="font-semibold block text-warm-900">Audit Trail Integrity</span>
            <span className="text-[11px] text-warm-500 font-mono">Local Cryptographic Append-Only Ledger</span>
          </div>
        </div>
      </div>

      {/* Section 21: Model, Rule, and Dataset Governance Block */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-warm-200 shadow-sm">
          <div className="text-[10px] uppercase font-bold text-warm-500 tracking-wider flex items-center space-x-1.5">
            <Database className="w-3.5 h-3.5 text-warm-600" />
            <span>Data Version</span>
          </div>
          <div className="text-sm font-bold text-warm-900 mt-1 font-mono">
            v2.4-SYNTHETIC
          </div>
          <div className="text-[11px] text-warm-500 mt-0.5">125,430 records • 5 CSEs</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-warm-200 shadow-sm">
          <div className="text-[10px] uppercase font-bold text-warm-500 tracking-wider flex items-center space-x-1.5">
            <Code2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Model Version</span>
          </div>
          <div className="text-sm font-bold text-warm-900 mt-1 font-mono">
            Heuristic-Fusion-1.0
          </div>
          <div className="text-[11px] text-warm-500 mt-0.5">Transparent 5-signal weights</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-warm-200 shadow-sm">
          <div className="text-[10px] uppercase font-bold text-warm-500 tracking-wider flex items-center space-x-1.5">
            <GitBranch className="w-3.5 h-3.5 text-emerald-600" />
            <span>Rule Version</span>
          </div>
          <div className="text-sm font-bold text-warm-900 mt-1 font-mono">
            2026.3-NTRO-NCIIPC
          </div>
          <div className="text-[11px] text-warm-500 mt-0.5">SIH26157 specifications</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-warm-200 shadow-sm">
          <div className="text-[10px] uppercase font-bold text-warm-500 tracking-wider flex items-center space-x-1.5">
            <Clock className="w-3.5 h-3.5 text-warm-600" />
            <span>Analysis Timestamp</span>
          </div>
          <div className="text-sm font-bold text-warm-900 mt-1 font-mono">
            08:35:10 IST
          </div>
          <div className="text-[11px] text-warm-500 mt-0.5">2026-10-05 (Deterministic)</div>
        </div>
      </div>

      {/* Section 21: Simple Audit Timeline Sequence */}
      <div className="bg-white rounded-2xl border border-warm-200 shadow-sm p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-warm-200 pb-3">
          <div>
            <h2 className="text-base font-bold text-warm-900">
              Statutory Supervisory Pipeline Chronology
            </h2>
            <p className="text-xs text-warm-500 mt-0.5">
              Verified chronological execution sequence from data load through examiner review
            </p>
          </div>
          <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full font-bold">
            6 STEPS LOGGED
          </span>
        </div>

        <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2.5 sm:before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-warm-200">
          {CORE_AUDIT_TIMELINE.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div key={idx} className="relative flex items-start gap-4">
                {/* Timeline node icon */}
                <div
                  className={`absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center border-2 bg-white ${
                    item.color === 'emerald'
                      ? 'border-emerald-600 text-emerald-700'
                      : item.color === 'orange'
                      ? 'border-orange-500 text-orange-600'
                      : 'border-blue-600 text-blue-700'
                  }`}
                >
                  <IconComponent className="w-3.5 h-3.5" />
                </div>

                {/* Content */}
                <div className="bg-warm-50 border border-warm-200 rounded-xl p-4 w-full space-y-1.5 hover:bg-warm-100/60 transition">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-sm font-bold text-warm-900 bg-warm-200 px-2 py-0.5 rounded">
                        {item.time}
                      </span>
                      <h3 className="text-sm font-bold text-warm-900">
                        {item.title}
                      </h3>
                    </div>
                    <span className="text-[11px] font-mono text-warm-500">
                      {item.timestamp}
                    </span>
                  </div>

                  <p className="text-xs text-warm-700 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-warm-200/60 text-[11px]">
                    <span className="text-warm-600">
                      Actor: <strong className="text-warm-800">{item.actor}</strong>
                    </span>
                    <span
                      className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded ${
                        item.status === 'FLAGGED'
                          ? 'bg-orange-100 text-orange-800'
                          : item.status === 'INSPECTED'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Extended Event Journal */}
      <div className="bg-white rounded-2xl border border-warm-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 bg-warm-100 border-b border-warm-200 flex justify-between items-center text-xs text-warm-600">
          <span className="font-semibold text-warm-900">
            Historical System Events Journal
          </span>
          <span className="text-[11px] font-mono text-warm-500">
            Append-only journal signed by supervisory auditor key
          </span>
        </div>

        <div className="divide-y divide-warm-100">
          {events.slice(0, 5).map((evt) => (
            <div key={evt.id} className="p-4 hover:bg-warm-50/70 transition flex items-start justify-between gap-4">
              <div className="space-y-1 max-w-2xl">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold text-warm-900">{evt.id}</span>
                  <span className="text-xs text-warm-400">•</span>
                  <span className="text-xs font-bold text-warm-800">{evt.eventType}</span>
                  <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-warm-200 text-warm-800">
                    {evt.entityCode}
                  </span>
                </div>

                <div className="text-xs text-warm-800 font-semibold">
                  Target: {evt.targetRecord}
                </div>

                <p className="text-xs text-warm-600 leading-relaxed">
                  <strong>Outcome / Result:</strong> {evt.result}
                </p>

                <div className="text-[11px] text-warm-400 flex items-center space-x-2 pt-0.5">
                  <Clock className="w-3 h-3 text-warm-400" />
                  <span>{evt.timestamp}</span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-xs font-semibold text-warm-900">{evt.actor}</div>
                <div className="text-[10px] text-warm-500">{evt.actorRole}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
