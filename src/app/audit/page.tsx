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
  Clock
} from 'lucide-react';
import { satSaService } from '@/services/satSaService';
import { AuditEvent } from '@/types/sat-sa';

export default function AuditPage() {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEventType, setSelectedEventType] = useState('ALL');
  const [selectedEntity, setSelectedEntity] = useState('ALL');

  useEffect(() => {
    async function load() {
      const data = await satSaService.getAuditEvents();
      setEvents(data);
    }
    load();
  }, []);

  const eventTypes = [
    'Data Import',
    'Validation Completed',
    'Assessment Generated',
    'Finding Created',
    'Evidence Viewed',
    'Examiner Decision Recorded',
    'Review Sample Generated',
    'Integrity Verification Performed'
  ];

  const filteredEvents = events.filter((e) => {
    const matchesSearch =
      e.targetRecord.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.result.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedEventType === 'ALL' || e.eventType === selectedEventType;
    const matchesEntity = selectedEntity === 'ALL' || e.entityCode === selectedEntity;
    return matchesSearch && matchesType && matchesEntity;
  });

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
            Supervisory Audit Timeline & Accountability Ledger
          </h1>
          <p className="text-xs text-warm-600 mt-0.5">
            Cryptographically sealed sequence of data imports, algorithmic assessment passes, evidence inspections, and examiner determinations.
          </p>
        </div>

        <div className="p-3 bg-warm-50 rounded-xl border border-warm-200 text-xs text-warm-700">
          <span className="font-semibold block">Audit Integrity:</span>
          <span className="text-[11px] text-warm-500">Append-only journal signed by NCIIPC Supervisory CA</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-warm-200 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="text-[10px] font-bold text-warm-500 uppercase tracking-wider block mb-1">
            Search Events
          </label>
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 transform -translate-y-1/2 text-warm-400" />
            <input
              type="text"
              placeholder="Search target record or actor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-warm-50 border border-warm-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-warm-900 focus:outline-none focus:border-warm-400"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold text-warm-500 uppercase tracking-wider block mb-1">
            Event Action Type
          </label>
          <select
            value={selectedEventType}
            onChange={(e) => setSelectedEventType(e.target.value)}
            className="w-full bg-warm-50 border border-warm-200 rounded-xl px-2.5 py-1.5 text-xs text-warm-900 focus:outline-none focus:border-warm-400"
          >
            <option value="ALL">All Event Types ({eventTypes.length})</option>
            {eventTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[10px] font-bold text-warm-500 uppercase tracking-wider block mb-1">
            Entity Filter
          </label>
          <select
            value={selectedEntity}
            onChange={(e) => setSelectedEntity(e.target.value)}
            className="w-full bg-warm-50 border border-warm-200 rounded-xl px-2.5 py-1.5 text-xs text-warm-900 focus:outline-none focus:border-warm-400 font-mono"
          >
            <option value="ALL">All Entities</option>
            <option value="CSE-17">CSE-17 (NRLDC Power)</option>
            <option value="SOC-04">SOC-04 (NPCI Payments)</option>
            <option value="SOC-08">SOC-08 (IOCL Pipeline)</option>
            <option value="CAC-02">CAC-02 (AAI Aviation)</option>
            <option value="CSE-29">CSE-29 (CRIS Rail)</option>
          </select>
        </div>
      </div>

      {/* Audit Timeline Card */}
      <div className="bg-white rounded-2xl border border-warm-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 bg-warm-100 border-b border-warm-200 flex justify-between items-center text-xs text-warm-600">
          <span className="font-semibold text-warm-900">
            Recorded Ledger Entries ({filteredEvents.length})
          </span>
          <span className="text-[11px] font-mono text-warm-500">
            All events timestamped in Indian Standard Time (IST)
          </span>
        </div>

        <div className="divide-y divide-warm-100">
          {filteredEvents.map((evt) => (
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
