'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Hash,
  Info,
  Clock,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { satSaService } from '@/services/satSaService';
import { EvidenceIntegrityBatch } from '@/types/sat-sa';

export default function EvidenceIntegrityPage() {
  const [batches, setBatches] = useState<EvidenceIntegrityBatch[]>([]);

  useEffect(() => {
    async function load() {
      const data = await satSaService.getIntegrityBatches();
      setBatches(data);
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
              Cryptographic Chain-of-Custody
            </span>
            <span className="text-[10px] font-mono bg-warm-100 text-warm-700 px-2 py-0.5 rounded">
              Merkle Tree Root Verification
            </span>
          </div>
          <h1 className="text-xl font-bold text-warm-900 mt-1">
            Evidence Integrity & Merkle Hash Verification
          </h1>
          <p className="text-xs text-warm-600 mt-0.5">
            Continuous validation of archived telemetry packets against the immutable reference digests recorded at initial submission.
          </p>
        </div>

        <div className="p-3 bg-warm-50 rounded-xl border border-warm-200 text-xs">
          <span className="font-semibold text-warm-900 block">Simulation Notice:</span>
          <span className="text-warm-500 text-[11px]">
            Demo verification results simulated locally until connected to production HSM service.
          </span>
        </div>
      </div>

      {/* Legal & Methodological Disclaimer Card */}
      <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start space-x-3">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold block">Evidence Admissibility Context:</span>
          <p className="text-amber-800 mt-0.5 leading-relaxed">
            Hash and Merkle verification confirms that a record has not been altered or corrupted since the reference hash was computed. It does not certify that the source device generated truthful data originally. Final legal determination under Section 65B requires cross-verification of upstream source certificates.
          </p>
        </div>
      </div>

      {/* Batches Table */}
      <div className="bg-white rounded-2xl border border-warm-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 bg-warm-100 border-b border-warm-200 flex items-center justify-between text-xs text-warm-600">
          <span className="font-semibold text-warm-900">
            Registered Merkle Batches ({batches.length})
          </span>
          <span className="text-[11px] font-mono text-warm-500">
            Verification executed against trusted reference seals
          </span>
        </div>

        <div className="divide-y divide-warm-100">
          {batches.map((batch) => {
            const hasFailure = batch.verificationStatus === 'Merkle Node Divergence';
            return (
              <div key={batch.batchId} className="p-5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-warm-900">{batch.batchId}</span>
                    <span className="text-xs text-warm-500">•</span>
                    <span className="font-mono text-xs font-bold text-warm-800">{batch.entityCode}</span>
                    <span className="text-xs text-warm-500">•</span>
                    <span className="text-xs text-warm-500 font-mono">{batch.recordsCount.toLocaleString()} Records</span>
                  </div>

                  <span
                    className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold ${
                      hasFailure
                        ? 'bg-orange-50 text-orange-700 border border-orange-200'
                        : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    {hasFailure ? <AlertTriangle className="w-3.5 h-3.5 text-orange-600" /> : <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                    <span>{batch.verificationStatus}</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-warm-50 p-3 rounded-xl border border-warm-200">
                  <div>
                    <span className="text-[10px] font-bold text-warm-400 uppercase tracking-wider block">
                      Merkle Root Hash
                    </span>
                    <div className="font-mono text-[10px] text-warm-800 break-all mt-0.5">
                      {batch.merkleRoot}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-warm-400 uppercase tracking-wider block">
                      Signature Algorithm & Authority
                    </span>
                    <div className="font-mono text-[11px] text-warm-700 mt-0.5">
                      {batch.signatureAlgorithm}
                    </div>
                  </div>
                </div>

                {hasFailure && (
                  <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl text-xs text-orange-900 space-y-1">
                    <div className="font-bold flex items-center space-x-1.5">
                      <ShieldAlert className="w-4 h-4 text-orange-700" />
                      <span>{batch.mismatchCount} Evidentiary Mismatches Identified in Batch</span>
                    </div>
                    <p className="text-[11px] text-orange-800 leading-snug">
                      Bitwise comparison revealed altered packet headers in historical archive subpool. Associated finding <strong>FND-2026-109</strong> has been flagged for examiner investigation.
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
