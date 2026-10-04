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
  CartesianGrid
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
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-warm-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-violet-700 bg-violet-50 px-2 py-0.5 rounded border border-violet-200 font-mono">
              Negative Space Surveillance
            </span>
            <span className="text-[10px] font-mono bg-warm-100 text-warm-700 px-2 py-0.5 rounded">
              Silent Telemetry Void Detection
            </span>
          </div>
          <h1 className="text-xl font-bold text-warm-900 mt-1">
            Negative Space Radar & Telemetry Absence Analysis
          </h1>
          <p className="text-xs text-warm-600 mt-0.5">
            Detecting critical infrastructure assets exhibiting unexplained silences, missing expected alert categories, and off-hours telemetry drop-offs.
          </p>
        </div>

        <div className="p-3 bg-warm-50 rounded-xl border border-warm-200 text-xs">
          <span className="font-semibold text-warm-900 block">Methodology Note:</span>
          <span className="text-warm-500 text-[11px]">
            Absence of evidence is correlated with historical baseline event density.
          </span>
        </div>
      </div>

      {/* Silence Duration Distribution Chart */}
      <div className="bg-white p-5 rounded-2xl border border-warm-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-warm-900">
              Unexplained Ingestion Silence Duration by Asset (Hours)
            </h3>
            <p className="text-xs text-warm-500">
              Consecutive hours with zero telemetry packets from critical assets
            </p>
          </div>
          <span className="text-[10px] font-mono text-warm-500 bg-warm-100 px-2 py-0.5 rounded">
            NCIIPC 4.0h Deadman Benchmark
          </span>
        </div>

        <div className="h-56 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" />
              <XAxis dataKey="name" stroke="#78716C" fontSize={11} />
              <YAxis stroke="#78716C" fontSize={11} unit="h" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#E7E5E4',
                  borderRadius: '0.75rem',
                  fontSize: '11px'
                }}
              />
              <Bar dataKey="silenceHours" name="Silence Duration (Hours)" fill="#7C3AED" radius={[4, 4, 0, 0]} />
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

      {/* Negative Space Radar Items Table */}
      <div className="bg-white rounded-2xl border border-warm-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 bg-warm-100 border-b border-warm-200 flex items-center justify-between text-xs text-warm-600">
          <span className="font-semibold text-warm-900">
            Identified Telemetry Voids ({filteredItems.length})
          </span>
          <span className="text-[11px] font-mono text-warm-500">
            Confirmed missing feeds are differentiated from unexplained low activity
          </span>
        </div>

        <div className="divide-y divide-warm-100">
          {filteredItems.map((item) => (
            <div key={item.id} className="p-4 hover:bg-warm-50/80 transition flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold text-warm-900">{item.assetId}</span>
                  <span className="text-xs text-warm-500">•</span>
                  <span className="font-mono text-xs text-warm-700 font-semibold">{item.entityCode}</span>
                  <span className="text-xs text-warm-500">•</span>
                  <span className="text-[10px] px-2 py-0.2 rounded font-bold bg-amber-50 text-amber-800 border border-amber-200">
                    {item.criticality}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-warm-900">{item.assetName}</h4>
                <p className="text-xs text-warm-600 leading-relaxed">
                  <strong className="text-warm-800">Observed Potential Cause:</strong> {item.potentialRootCause}
                </p>
                <div className="text-[11px] text-warm-400 flex items-center space-x-3 pt-0.5">
                  <span>Anomaly: <strong className="text-violet-700">{item.anomalyType}</strong></span>
                  <span>•</span>
                  <span>Last Heartbeat: {item.lastHeartbeat}</span>
                </div>
              </div>

              <div className="flex items-center space-x-4 shrink-0">
                <div className="text-right font-mono">
                  <div className="text-base font-bold text-violet-800">{item.silencePeriodHours} hrs</div>
                  <div className="text-[10px] text-warm-500">{item.observedAlertsPeriod} of {item.expectedAlertsPerDay} exp/day</div>
                </div>

                <div className="space-y-1 text-right">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      item.confirmationStatus === 'Confirmed Ingestion Failure'
                        ? 'bg-orange-50 text-orange-700 border border-orange-200'
                        : item.confirmationStatus === 'Unexplained Low Activity'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-warm-100 text-warm-700 border border-warm-200'
                    }`}
                  >
                    {item.confirmationStatus}
                  </span>
                  <div>
                    <Link
                      href={`/entities/${item.entityCode}`}
                      className="text-[11px] text-emerald-700 hover:underline inline-flex items-center space-x-1"
                    >
                      <span>Entity Dossier</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
