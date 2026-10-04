'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Database,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Search,
  Filter,
  Layers,
  FileCode,
  Info
} from 'lucide-react';
import { satSaService } from '@/services/satSaService';
import { DataQualityRecord } from '@/types/sat-sa';

export default function DataQualityPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [records, setRecords] = useState<DataQualityRecord[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [inspectedRecord, setInspectedRecord] = useState<DataQualityRecord | null>(null);

  useEffect(() => {
    async function load() {
      const data = await satSaService.getDataQualitySummary();
      setMetrics(data.metrics);
      setRecords(data.records);
      if (data.records.length > 0) {
        setInspectedRecord(data.records[0]);
      }
    }
    load();
  }, []);

  if (!metrics) {
    return <div className="p-8 text-center text-warm-500 font-mono text-xs">Loading data quality metrics...</div>;
  }

  const filteredRecords = records.filter((r) => {
    if (selectedStatus === 'ALL') return true;
    return r.status === selectedStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-warm-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-warm-500 font-mono">
              Telemetry Ingestion Gate
            </span>
            <span className="text-[10px] font-mono bg-warm-100 text-warm-700 px-2 py-0.5 rounded">
              Schema v2.1 Verification
            </span>
          </div>
          <h1 className="text-xl font-bold text-warm-900 mt-1">
            Data Quality & Telemetry Ingestion Audit
          </h1>
          <p className="text-xs text-warm-600 mt-0.5">
            Verifying structural compliance, clock synchronization, and payload integrity of raw operational feeds across all entities.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
            Overall Fidelity: {((metrics.processedClean / metrics.totalReceived) * 100).toFixed(1)}% Clean
          </span>
        </div>
      </div>

      {/* 4 Ingestion Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-warm-200 shadow-sm">
          <div className="flex items-center justify-between text-warm-500 text-xs">
            <span>Total Ingested</span>
            <Database className="w-4 h-4 text-warm-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-warm-900">
            {metrics.totalReceived.toLocaleString()}
          </div>
          <div className="mt-1 text-[10px] text-warm-500">Telemetry Packets Evaluated</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-warm-200 shadow-sm">
          <div className="flex items-center justify-between text-emerald-700 text-xs">
            <span>Clean / Validated</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-emerald-800">
            {metrics.processedClean.toLocaleString()}
          </div>
          <div className="mt-1 text-[10px] text-emerald-600">Conformant Schemas</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-warm-200 shadow-sm">
          <div className="flex items-center justify-between text-amber-700 text-xs">
            <span>Warning Flags</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-amber-700">
            {metrics.withWarnings.toLocaleString()}
          </div>
          <div className="mt-1 text-[10px] text-warm-500">Skew & Missing Non-Critical</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-warm-200 shadow-sm">
          <div className="flex items-center justify-between text-orange-700 text-xs">
            <span>Rejected Records</span>
            <XCircle className="w-4 h-4 text-orange-600" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-orange-700">
            {metrics.rejectedErrors.toLocaleString()}
          </div>
          <div className="mt-1 text-[10px] text-warm-500">Preserved in Error Queue</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-warm-200 pb-3">
        {['ALL', 'Clean', 'Warning', 'Rejected'].map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition ${
              selectedStatus === status
                ? 'bg-warm-900 text-warm-50'
                : 'bg-white text-warm-600 hover:bg-warm-100 border border-warm-200'
            }`}
          >
            {status} Records
          </button>
        ))}
      </div>

      {/* Record Inspection Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table Column */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-warm-200 shadow-sm overflow-hidden">
          <div className="p-3.5 bg-warm-100 border-b border-warm-200 flex justify-between items-center text-xs text-warm-600">
            <span className="font-semibold text-warm-900">
              Sample Audited Records ({filteredRecords.length})
            </span>
            <span className="text-[11px] font-mono text-warm-500">
              Rejected records are preserved for forensic review
            </span>
          </div>

          <div className="divide-y divide-warm-100">
            {filteredRecords.map((r) => {
              const isSelected = inspectedRecord?.id === r.id;
              return (
                <div
                  key={r.id}
                  onClick={() => setInspectedRecord(r)}
                  className={`p-3.5 cursor-pointer transition flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-warm-100/90 border-l-4 border-warm-900 pl-3'
                      : 'hover:bg-warm-50/70'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-warm-900">{r.id}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-warm-200 text-warm-800">
                        {r.entityCode}
                      </span>
                      <span className="text-xs font-semibold text-warm-800">{r.issueType}</span>
                    </div>
                    <p className="text-xs text-warm-600 line-clamp-1">{r.details}</p>
                    <div className="text-[10px] text-warm-400 font-mono">
                      Type: {r.recordType} • {r.timestamp}
                    </div>
                  </div>

                  <span
                    className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold shrink-0 ${
                      r.status === 'Clean'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : r.status === 'Warning'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-orange-50 text-orange-700 border border-orange-200'
                    }`}
                  >
                    {r.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payload Detail Column */}
        <div className="bg-white p-5 rounded-2xl border border-warm-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-warm-100 pb-3">
            <h3 className="text-sm font-bold text-warm-900 flex items-center space-x-1.5">
              <FileCode className="w-4 h-4 text-warm-600" />
              <span>Record-Level Raw Inspector</span>
            </h3>
            {inspectedRecord && (
              <span className="font-mono text-xs font-bold text-warm-900">
                {inspectedRecord.id}
              </span>
            )}
          </div>

          {inspectedRecord ? (
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] font-bold text-warm-400 uppercase tracking-wider block">
                  Diagnosis Details
                </span>
                <p className="text-warm-800 font-medium leading-relaxed mt-0.5">
                  {inspectedRecord.details}
                </p>
              </div>

              <div className="p-3 bg-warm-50 rounded-xl border border-warm-200 text-[11px] font-mono space-y-1">
                <div>Entity: <strong className="text-warm-900">{inspectedRecord.entityCode}</strong></div>
                <div>Status: <strong className="text-warm-900">{inspectedRecord.status}</strong></div>
                <div>Classification: <strong className="text-warm-900">{inspectedRecord.issueType}</strong></div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-warm-400 uppercase tracking-wider block mb-1">
                  Preserved Original Submitted Payload
                </span>
                <pre className="bg-warm-900 text-warm-100 p-3 rounded-xl font-mono text-[11px] overflow-x-auto max-h-48 whitespace-pre-wrap leading-snug">
                  {inspectedRecord.originalPayloadSnippet}
                </pre>
              </div>
            </div>
          ) : (
            <p className="p-6 text-center text-xs text-warm-500 italic">
              Select a record to view raw schema parsing diagnostics.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
