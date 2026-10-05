'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Radar,
  AlertTriangle,
  Clock,
  ShieldAlert,
  Search,
  CheckCircle2,
  ExternalLink,
  Layers,
  ArrowRight
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
import { NegativeSpaceItem } from '@/types/sat-sa';

export default function NegativeSpacePage() {
  const [items, setItems] = useState<NegativeSpaceItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');

  useEffect(() => {
    async function load() {
      const data = await satSaService.getNegativeSpaceItems();
      setItems(data);
    }
    load();
  }, []);

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.entityCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.assetId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.potentialRootCause.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'ALL' || item.confirmationStatus === selectedStatus;
    const matchesType = selectedType === 'ALL' || item.anomalyType === selectedType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const chartData = items.map((i) => ({
    name: i.assetId,
    silenceHours: i.silencePeriodHours,
    entity: i.entityCode
  }));

  return (
    <div className="space-y-6">
      {/* Header (Section 13) */}
      <div className="bg-white p-6 rounded-2xl border border-warm-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-mono">
              Negative Space Lens
            </span>
            <span className="text-[10px] font-mono bg-warm-100 text-warm-700 px-2 py-0.5 rounded">
              Supervisory Void Detection
            </span>
          </div>
          <h1 className="text-xl font-bold text-warm-900 mt-1 font-serif">
            Negative Space Radar
          </h1>
          <p className="text-xs text-warm-600 mt-0.5">
            What should have happened but is missing? Detecting silent crown jewel assets and unmonitored operational voids.
          </p>
        </div>

        <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl text-xs text-amber-900 max-w-sm">
          <span className="font-semibold block font-sans">Supervisory Principle:</span>
          <span className="text-[11px] text-amber-800 leading-snug">
            The absence of expected baseline telemetry is often more revealing than the presence of noisy benign alerts.
          </span>
        </div>
      </div>

      {/* 5 Core Negative Space Metric Cards (Section 13) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="threeui-card p-4 relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-orange-600"></div>
          <span className="text-xs font-medium text-warm-500 block">Silent Critical Assets</span>
          <span className="text-2xl font-bold font-mono text-orange-700 block mt-1">3</span>
          <span className="text-[10px] text-warm-500 mt-0.5 block">Zero telemetry &gt; 14 days</span>
        </div>

        <div className="threeui-card p-4 relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500"></div>
          <span className="text-xs font-medium text-warm-500 block">Missing Alert Categories</span>
          <span className="text-2xl font-bold font-mono text-amber-700 block mt-1">2</span>
          <span className="text-[10px] text-warm-500 mt-0.5 block">Identity & Kerberos voids</span>
        </div>

        <div className="threeui-card p-4 relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-violet-600"></div>
          <span className="text-xs font-medium text-warm-500 block">Unexplained Activity Drops</span>
          <span className="text-2xl font-bold font-mono text-violet-700 block mt-1">4</span>
          <span className="text-[10px] text-warm-500 mt-0.5 block">Off-hours activity cliffs</span>
        </div>

        <div className="threeui-card p-4 relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-warm-600"></div>
          <span className="text-xs font-medium text-warm-500 block">Ghost Records</span>
          <span className="text-2xl font-bold font-mono text-warm-800 block mt-1">7</span>
          <span className="text-[10px] text-warm-500 mt-0.5 block">Orphaned tickets without logs</span>
        </div>

        <div className="threeui-card p-4 relative overflow-hidden group col-span-2 sm:col-span-1">
          <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-600"></div>
          <span className="text-xs font-medium text-warm-500 block">Coverage Gaps</span>
          <span className="text-2xl font-bold font-mono text-emerald-800 block mt-1">5</span>
          <span className="text-[10px] text-warm-500 mt-0.5 block">Non-forwarding agents</span>
        </div>
      </div>

      {/* Expected vs Observed Activity Line Chart (Section 13) */}
      <div className="bg-white p-6 rounded-2xl border border-warm-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-warm-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-warm-900 font-serif">
              Expected Activity vs. Observed Telemetry Stream
            </h3>
            <p className="text-xs text-warm-500 mt-0.5">
              Comparison of expected statistical baseline against actual observed events across key monitoring assets.
            </p>
          </div>
          <div className="flex items-center space-x-3 text-xs font-mono">
            <span className="flex items-center space-x-1.5 text-warm-600">
              <span className="w-2.5 h-2.5 rounded-full bg-warm-400"></span>
              <span>Expected Baseline</span>
            </span>
            <span className="flex items-center space-x-1.5 text-orange-700 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-600"></span>
              <span>Observed Activity</span>
            </span>
          </div>
        </div>

        <div className="h-60 w-full pt-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={[
                { asset: 'PAYMENT-DB-01', expected: 55, observed: 0 },
                { asset: 'WEB-GATEWAY-02', expected: 30, observed: 2 },
                { asset: 'SWIFT-04', expected: 22, observed: 0 },
                { asset: 'AUTH-CLUSTER-01', expected: 100, observed: 14 },
                { asset: 'SUBSTATION-400KV', expected: 45, observed: 3 }
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" />
              <XAxis dataKey="asset" stroke="#78716C" fontSize={11} />
              <YAxis stroke="#78716C" fontSize={11} unit=" ev/w" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#E7E5E4',
                  borderRadius: '0.75rem',
                  fontSize: '11px'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Bar dataKey="expected" name="Expected Baseline (alerts/week)" fill="#A8A29E" radius={[4, 4, 0, 0]} />
              <Bar dataKey="observed" name="Observed Activity (alerts/week)" fill="#EA580C" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-warm-200 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="text-[10px] font-bold text-warm-500 uppercase tracking-wider block mb-1">
            Search Asset or Anomaly
          </label>
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 transform -translate-y-1/2 text-warm-400" />
            <input
              type="text"
              placeholder="Search asset ID or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-warm-50 border border-warm-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-warm-900 focus:outline-none focus:border-warm-400"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold text-warm-500 uppercase tracking-wider block mb-1">
            Anomaly Classification
          </label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full bg-warm-50 border border-warm-200 rounded-xl px-2.5 py-1.5 text-xs text-warm-900 focus:outline-none focus:border-warm-400"
          >
            <option value="ALL">All Anomaly Types</option>
            <option value="Unexplained Telemetry Silence">Unexplained Telemetry Silence</option>
            <option value="Missing Alert Category">Missing Alert Category</option>
            <option value="Off-Hours Activity Cliff">Off-Hours Activity Cliff</option>
            <option value="Log Ingestion Gap">Log Ingestion Gap</option>
          </select>
        </div>

        <div>
          <label className="text-[10px] font-bold text-warm-500 uppercase tracking-wider block mb-1">
            Confirmation Status
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full bg-warm-50 border border-warm-200 rounded-xl px-2.5 py-1.5 text-xs text-warm-900 focus:outline-none focus:border-warm-400"
          >
            <option value="ALL">All Confirmation States</option>
            <option value="Confirmed Ingestion Failure">Confirmed Ingestion Failure</option>
            <option value="Unexplained Low Activity">Unexplained Low Activity</option>
            <option value="Under Investigation">Under Investigation</option>
          </select>
        </div>
      </div>

      {/* Negative Space Radar Items Table (Section 13) */}
      <div className="bg-white rounded-2xl border border-warm-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 bg-warm-100 border-b border-warm-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div>
            <span className="font-bold text-warm-900 font-serif">
              Identified Telemetry Voids ({filteredItems.length} Monitored Assets)
            </span>
            <p className="text-[11px] text-warm-500">
              Correlating expected statistical baseline activity against actual observed telemetry packets.
            </p>
          </div>
          <span className="text-[10px] font-mono text-warm-600 bg-white px-2.5 py-1 rounded border border-warm-200">
            NCIIPC Ingestion Standard
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-warm-200 text-[10px] font-mono uppercase text-warm-500 bg-warm-50/70">
                <th className="py-2.5 px-3">Asset</th>
                <th className="py-2.5 px-3">Entity</th>
                <th className="py-2.5 px-3">Expected Activity</th>
                <th className="py-2.5 px-3">Observed Activity</th>
                <th className="py-2.5 px-3">Silence Duration</th>
                <th className="py-2.5 px-3">Risk</th>
                <th className="py-2.5 px-3">Evidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-100 font-mono">
              {filteredItems.map((item) => {
                const isHighRisk = item.silencePeriodHours > 24 || item.observedAlertsPeriod === 0;
                return (
                  <tr key={item.id} className="hover:bg-warm-50/70 transition-colors">
                    <td className="py-3 px-3">
                      <span className="font-bold text-warm-900 block">{item.assetId}</span>
                      <span className="text-[11px] text-warm-500 font-sans truncate max-w-[200px] block">{item.assetName}</span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-warm-800 font-sans">
                      <Link href={`/entities/${item.entityCode.toLowerCase().replace(' ', '-')}`} className="hover:underline">
                        {item.entityCode}
                      </Link>
                    </td>
                    <td className="py-3 px-3 text-warm-700">
                      {item.assetId === 'PAYMENT-DB-01' ? '40–70 alerts/wk' : item.assetId === 'WEB-GATEWAY-02' ? '20–40 alerts/wk' : `${item.expectedAlertsPerDay * 7} alerts/wk`}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`font-bold ${item.observedAlertsPeriod === 0 ? 'text-orange-700' : 'text-amber-700'}`}>
                        {item.observedAlertsPeriod === 0 ? '0 (Complete Void)' : `${item.observedAlertsPeriod} events`}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-violet-800">
                        {item.silencePeriodHours >= 24 ? `${Math.round(item.silencePeriodHours / 24)} days` : `${item.silencePeriodHours} hrs`}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-sans">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          isHighRisk
                            ? 'bg-orange-100 text-orange-800 border border-orange-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {isHighRisk ? 'HIGH' : 'MEDIUM'}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-sans">
                      <Link
                        href="/findings/F-1024"
                        className="px-2 py-1 bg-warm-100 hover:bg-warm-200 text-warm-800 rounded font-semibold text-[11px] transition border border-warm-200"
                      >
                        View Evidence
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
