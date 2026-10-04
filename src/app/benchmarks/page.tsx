'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BarChart3,
  ArrowRight,
  Info,
  Scale,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Building2
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
import { PeerBenchmarkMetric, EntitySummary } from '@/types/sat-sa';

export default function PeerBenchmarkPage() {
  const [metrics, setMetrics] = useState<PeerBenchmarkMetric[]>([]);
  const [entities, setEntities] = useState<EntitySummary[]>([]);
  const [selectedMetricId, setSelectedMetricId] = useState('mttd');
  const [entityA, setEntityA] = useState('CSE-17');
  const [entityB, setEntityB] = useState('SOC-04');

  useEffect(() => {
    async function load() {
      const bMarks = await satSaService.getPeerBenchmarks();
      const ents = await satSaService.getEntities();
      setMetrics(bMarks);
      setEntities(ents);
    }
    load();
  }, []);

  const activeMetric = metrics.find((m) => m.metricId === selectedMetricId) || metrics[0];

  const entAData = entities.find((e) => e.code === entityA);
  const entBData = entities.find((e) => e.code === entityB);

  const comparisonChartData = activeMetric
    ? activeMetric.entitiesData.map((ed) => ({
        code: ed.entityCode,
        value: ed.value,
        sectorAvg: activeMetric.sectorAvg,
        flag: ed.flagAnomaly
      }))
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-warm-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-mono">
              National Cross-Sector Baseline
            </span>
            <span className="text-[10px] font-mono bg-warm-100 text-warm-700 px-2 py-0.5 rounded">
              Comparable Peer Groups
            </span>
          </div>
          <h1 className="text-xl font-bold text-warm-900 mt-1">
            Peer Benchmark & Cross-Sectoral Analysis
          </h1>
          <p className="text-xs text-warm-600 mt-0.5">
            Statistical comparisons across comparable SOC operational groups to highlight systemic performance deviations and triage variations.
          </p>
        </div>

        <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 max-w-sm">
          <span className="font-semibold block">Regulatory Guidance:</span>
          <span className="text-[11px] text-amber-800 leading-snug">
            Deviations from peer averages indicate areas requiring contextual examiner review, rather than automatic non-compliance.
          </span>
        </div>
      </div>

      {/* Metric Selector Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-warm-200 pb-3">
        {metrics.map((m) => (
          <button
            key={m.metricId}
            onClick={() => setSelectedMetricId(m.metricId)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
              selectedMetricId === m.metricId
                ? 'bg-warm-900 text-warm-50 shadow-sm'
                : 'bg-white text-warm-600 hover:bg-warm-100 border border-warm-200'
            }`}
          >
            {m.name}
          </button>
        ))}
      </div>

      {/* Main Benchmark Chart */}
      {activeMetric && (
        <div className="bg-white p-5 rounded-2xl border border-warm-200 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-warm-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-warm-900">
                {activeMetric.name} ({activeMetric.unit}) Across Monitored Entities
              </h2>
              <p className="text-xs text-warm-500">{activeMetric.description}</p>
            </div>
            <div className="text-right text-xs font-mono">
              <span className="text-warm-500">Sector Baseline Average: </span>
              <strong className="text-emerald-800 font-bold">{activeMetric.sectorAvg} {activeMetric.unit}</strong>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" />
                <XAxis dataKey="code" stroke="#78716C" fontSize={11} />
                <YAxis stroke="#78716C" fontSize={11} unit={` ${activeMetric.unit}`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E7E5E4',
                    borderRadius: '0.75rem',
                    fontSize: '11px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="value" name="Entity Metric" fill="#52796F" radius={[4, 4, 0, 0]} />
                <Bar dataKey="sectorAvg" name="Sector Baseline Average" fill="#D97706" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Head-to-Head Entity Comparator */}
      <div className="bg-white p-5 rounded-2xl border border-warm-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-warm-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-warm-900">
              Direct Peer Head-to-Head Comparison
            </h3>
            <p className="text-xs text-warm-500">
              Select any two entities to compare operational profiles over the active reporting period.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={entityA}
              onChange={(e) => setEntityA(e.target.value)}
              className="bg-warm-50 border border-warm-200 rounded-xl px-2.5 py-1 text-xs text-warm-900 font-mono font-semibold"
            >
              {entities.map((ent) => (
                <option key={ent.code} value={ent.code}>{ent.code} ({ent.name.slice(0, 18)}...)</option>
              ))}
            </select>
            <span className="text-xs text-warm-400 font-semibold">vs</span>
            <select
              value={entityB}
              onChange={(e) => setEntityB(e.target.value)}
              className="bg-warm-50 border border-warm-200 rounded-xl px-2.5 py-1 text-xs text-warm-900 font-mono font-semibold"
            >
              {entities.map((ent) => (
                <option key={ent.code} value={ent.code}>{ent.code} ({ent.name.slice(0, 18)}...)</option>
              ))}
            </select>
          </div>
        </div>

        {entAData && entBData && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-warm-50 rounded-xl border border-warm-200 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-mono text-xs font-bold text-warm-900">{entAData.code}</span>
                <span className="text-[11px] text-warm-500">{entAData.sector}</span>
              </div>
              <h4 className="text-xs font-bold text-warm-800">{entAData.name}</h4>
              <div className="space-y-1.5 text-xs text-warm-600 pt-2 border-t border-warm-200/60 font-mono">
                <div className="flex justify-between">
                  <span>MTTD:</span>
                  <strong>{entAData.reportedKpis.mttdMinutes} min</strong>
                </div>
                <div className="flex justify-between">
                  <span>MTTR:</span>
                  <strong>{entAData.reportedKpis.mttrMinutes} min</strong>
                </div>
                <div className="flex justify-between">
                  <span>Discrepancy Index:</span>
                  <strong className="text-orange-700">{entAData.evidenceMetrics.discrepancyIndex}/100</strong>
                </div>
                <div className="flex justify-between">
                  <span>Data Quality:</span>
                  <strong className="text-emerald-800">{entAData.dataQualityScore}%</strong>
                </div>
              </div>
            </div>

            <div className="p-4 bg-warm-50 rounded-xl border border-warm-200 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-mono text-xs font-bold text-warm-900">{entBData.code}</span>
                <span className="text-[11px] text-warm-500">{entBData.sector}</span>
              </div>
              <h4 className="text-xs font-bold text-warm-800">{entBData.name}</h4>
              <div className="space-y-1.5 text-xs text-warm-600 pt-2 border-t border-warm-200/60 font-mono">
                <div className="flex justify-between">
                  <span>MTTD:</span>
                  <strong>{entBData.reportedKpis.mttdMinutes} min</strong>
                </div>
                <div className="flex justify-between">
                  <span>MTTR:</span>
                  <strong>{entBData.reportedKpis.mttrMinutes} min</strong>
                </div>
                <div className="flex justify-between">
                  <span>Discrepancy Index:</span>
                  <strong className="text-orange-700">{entBData.evidenceMetrics.discrepancyIndex}/100</strong>
                </div>
                <div className="flex justify-between">
                  <span>Data Quality:</span>
                  <strong className="text-emerald-800">{entBData.dataQualityScore}%</strong>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
