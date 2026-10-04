'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileCheck2,
  Search,
  Filter,
  ShieldCheck,
  Hash,
  Copy,
  Check,
  ExternalLink,
  X,
  FileCode,
  ShieldAlert
} from 'lucide-react';
import { satSaService } from '@/services/satSaService';
import { EvidenceRecord } from '@/types/sat-sa';

export default function EvidencePage() {
  const [evidenceRecords, setEvidenceRecords] = useState<EvidenceRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEntity, setSelectedEntity] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedRecord, setSelectedRecord] = useState<EvidenceRecord | null>(null);
  const [copiedHash, setCopiedHash] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await satSaService.getEvidenceRecords();
      setEvidenceRecords(data);
      if (data.length > 0) {
        setSelectedRecord(data[0]);
      }
    }
    load();
  }, []);

  const recordTypes = [
    'Alert Telemetry Sample',
    'Case Closure Log',
    'Analyst Shift Record',
    'Escalation Flow Dump',
    'Remediation Artifact',
    'Asset Heartbeat Dump',
    'SLA Verification Log'
  ];

  const filteredRecords = evidenceRecords.filter((rec) => {
    const matchesSearch =
      rec.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.entityCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.sha256Hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.sourceSystem.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEntity = selectedEntity === 'ALL' || rec.entityCode === selectedEntity;
    const matchesType = selectedType === 'ALL' || rec.recordType === selectedType;
    return matchesSearch && matchesEntity && matchesType;
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-warm-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-mono">
              National Forensic Repository
            </span>
            <span className="text-[10px] font-mono bg-warm-100 text-warm-700 px-2 py-0.5 rounded">
              Section 65B Admissible Records
            </span>
          </div>
          <h1 className="text-xl font-bold text-warm-900 mt-1">
            Corroborating Evidence Explorer & Raw Telemetry
          </h1>
          <p className="text-xs text-warm-600 mt-0.5">
            Search, inspect, and verify cryptographic chain-of-custody for raw alert samples, shift dumps, and config diffs.
          </p>
        </div>

        <Link
          href="/integrity"
          className="px-3.5 py-1.5 bg-warm-100 hover:bg-warm-200 text-warm-800 text-xs font-semibold rounded-xl border border-warm-200 transition"
        >
          View Merkle Proofs
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-warm-200 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="text-[10px] font-bold text-warm-500 uppercase tracking-wider block mb-1">
            Search Records
          </label>
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 transform -translate-y-1/2 text-warm-400" />
            <input
              type="text"
              placeholder="Search hash, record ID, asset..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-warm-50 border border-warm-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-warm-900 focus:outline-none focus:border-warm-400"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold text-warm-500 uppercase tracking-wider block mb-1">
            Filter by Entity
          </label>
          <select
            value={selectedEntity}
            onChange={(e) => setSelectedEntity(e.target.value)}
            className="w-full bg-warm-50 border border-warm-200 rounded-xl px-2.5 py-1.5 text-xs text-warm-900 focus:outline-none focus:border-warm-400 font-mono"
          >
            <option value="ALL">All Entities</option>
            <option value="CSE-17">CSE-17 (NRLDC Power)</option>
            <option value="SOC-04">SOC-04 (NPCI Payments)</option>
            <option value="CAC-02">CAC-02 (AAI Aviation)</option>
            <option value="SOC-08">SOC-08 (IOCL Pipeline)</option>
            <option value="CSE-29">CSE-29 (CRIS Rail)</option>
            <option value="SOC-11">SOC-11 (BSNL Telecom)</option>
          </select>
        </div>

        <div>
          <label className="text-[10px] font-bold text-warm-500 uppercase tracking-wider block mb-1">
            Record Type
          </label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full bg-warm-50 border border-warm-200 rounded-xl px-2.5 py-1.5 text-xs text-warm-900 focus:outline-none focus:border-warm-400"
          >
            <option value="ALL">All Record Types</option>
            {recordTypes.map((rt) => (
              <option key={rt} value={rt}>{rt}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Evidence Grid: Master List & Side Panel Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Evidence List */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-warm-200 shadow-sm overflow-hidden">
          <div className="p-3.5 bg-warm-100 border-b border-warm-200 flex justify-between items-center text-xs text-warm-600">
            <span className="font-semibold text-warm-900">
              Evidence Inventory ({filteredRecords.length})
            </span>
            <span className="text-[11px] font-mono text-warm-500">
              Click record to inspect raw telemetry payload
            </span>
          </div>

          <div className="divide-y divide-warm-100">
            {filteredRecords.map((rec) => {
              const isSelected = selectedRecord?.id === rec.id;
              return (
                <div
                  key={rec.id}
                  onClick={() => setSelectedRecord(rec)}
                  className={`p-3.5 cursor-pointer transition flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-warm-100/90 border-l-4 border-warm-900 pl-3'
                      : 'hover:bg-warm-50/70'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-warm-900">{rec.id}</span>
                      <span className="text-[10px] px-2 py-0.2 rounded font-mono bg-warm-200 text-warm-800">
                        {rec.entityCode}
                      </span>
                      <span className="text-[10px] font-mono text-warm-500">
                        {rec.recordType}
                      </span>
                    </div>
                    <p className="text-xs text-warm-700 leading-snug line-clamp-1">{rec.summary}</p>
                    <div className="text-[10px] font-mono text-warm-400">
                      Source: {rec.sourceSystem} • {rec.timestamp}
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        rec.integrityStatus === 'Verified Valid'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-orange-50 text-orange-700 border border-orange-200'
                      }`}
                    >
                      {rec.integrityStatus}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Evidence Inspection Panel */}
        <div className="bg-white p-5 rounded-2xl border border-warm-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-warm-100 pb-3">
            <div className="flex items-center space-x-2">
              <FileCode className="w-4 h-4 text-emerald-700" />
              <h3 className="text-sm font-bold text-warm-900">
                Payload Inspection Panel
              </h3>
            </div>
            {selectedRecord && (
              <span className="font-mono text-xs font-bold text-warm-900">
                {selectedRecord.id}
              </span>
            )}
          </div>

          {selectedRecord ? (
            <div className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-warm-400 uppercase tracking-wider block">
                  Summary
                </span>
                <p className="text-warm-800 font-medium leading-relaxed">
                  {selectedRecord.summary}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-warm-50 p-3 rounded-xl border border-warm-200">
                <div>
                  <span className="text-warm-400 block text-[10px]">Entity:</span>
                  <strong className="text-warm-900">{selectedRecord.entityCode}</strong>
                </div>
                <div>
                  <span className="text-warm-400 block text-[10px]">Timestamp:</span>
                  <strong className="text-warm-900">{selectedRecord.timestamp.split(' ')[1]} IST</strong>
                </div>
                <div>
                  <span className="text-warm-400 block text-[10px]">Target Asset:</span>
                  <strong className="text-warm-900">{selectedRecord.targetAsset || 'N/A'}</strong>
                </div>
                <div>
                  <span className="text-warm-400 block text-[10px]">File Size:</span>
                  <strong className="text-warm-900">{(selectedRecord.fileSizeBytes / 1024).toFixed(1)} KB</strong>
                </div>
              </div>

              {/* SHA-256 Checksum Box with Copy */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-bold text-warm-400 uppercase tracking-wider">
                    SHA-256 Reference Digest
                  </span>
                  <button
                    onClick={() => handleCopy(selectedRecord.sha256Hash)}
                    className="text-[10px] text-warm-500 hover:text-warm-800 flex items-center space-x-1"
                  >
                    {copiedHash ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedHash ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="font-mono text-[10px] text-warm-700 bg-warm-100 p-2 rounded-lg break-all border border-warm-200">
                  {selectedRecord.sha256Hash}
                </div>
              </div>

              {/* Raw JSON or Hex Payload */}
              <div>
                <span className="text-[10px] font-bold text-warm-400 uppercase tracking-wider block mb-1">
                  Raw Payload Telemetry Snippet
                </span>
                <pre className="bg-warm-900 text-warm-100 p-3 rounded-xl font-mono text-[11px] overflow-x-auto max-h-48 whitespace-pre-wrap leading-snug">
                  {selectedRecord.rawPayloadSnippet}
                </pre>
              </div>

              {selectedRecord.relatedFindingId && (
                <div className="pt-2 border-t border-warm-100 flex items-center justify-between">
                  <span className="text-[11px] text-warm-500">Related Finding:</span>
                  <Link
                    href={`/findings/${selectedRecord.relatedFindingId}`}
                    className="font-mono font-bold text-emerald-800 hover:underline"
                  >
                    {selectedRecord.relatedFindingId}
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-warm-500 italic p-6 text-center">
              Select an evidence artifact from the list to inspect details.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
