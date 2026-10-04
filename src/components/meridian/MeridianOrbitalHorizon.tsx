'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Shield,
  Activity,
  Radio,
  ArrowRight,
  ExternalLink,
  Radar,
  AlertTriangle,
  CheckCircle2,
  Database
} from 'lucide-react';

interface OrbitNode {
  code: string;
  name: string;
  sector: string;
  xPercent: number; // Position on orbital arc (0 to 100)
  yOffset: number; // Vertical offset
  status: 'Critical' | 'Warning' | 'Healthy';
  discrepancyIndex: number;
  recordsIngested: string;
  telemetryHealth: string;
}

const NODES: OrbitNode[] = [
  {
    code: 'NRLDC',
    name: 'Northern Regional Load Despatch Centre',
    sector: 'Power & Energy',
    xPercent: 14,
    yOffset: 48,
    status: 'Critical',
    discrepancyIndex: 68,
    recordsIngested: '1.2M logs',
    telemetryHealth: '38h Void on SGW-400kV'
  },
  {
    code: 'NPCI',
    name: 'National Payments Corporation of India',
    sector: 'Banking & Finance',
    xPercent: 28,
    yOffset: 26,
    status: 'Warning',
    discrepancyIndex: 42,
    recordsIngested: '2.8M logs',
    telemetryHealth: 'Batch Cleared @ 0.29s'
  },
  {
    code: 'AAI',
    name: 'Airports Authority of India (Air Traffic)',
    sector: 'Civil Aviation',
    xPercent: 44,
    yOffset: 16,
    status: 'Healthy',
    discrepancyIndex: 12,
    recordsIngested: '840k logs',
    telemetryHealth: '100% Ingest Corroborated'
  },
  {
    code: 'CRIS',
    name: 'Centre for Railway Information Systems',
    sector: 'Railways & Transport',
    xPercent: 58,
    yOffset: 18,
    status: 'Critical',
    discrepancyIndex: 61,
    recordsIngested: '1.6M logs',
    telemetryHealth: '3 Rules Suppressed'
  },
  {
    code: 'IOCL',
    name: 'Indian Oil Corporation (Pipeline SCADA)',
    sector: 'Petroleum & Gas',
    xPercent: 73,
    yOffset: 30,
    status: 'Warning',
    discrepancyIndex: 38,
    recordsIngested: '920k logs',
    telemetryHealth: 'Shift Handover Anomaly'
  },
  {
    code: 'BSNL',
    name: 'Bharat Sanchar Nigam Limited (Core Backbone)',
    sector: 'Telecom & IT',
    xPercent: 88,
    yOffset: 52,
    status: 'Healthy',
    discrepancyIndex: 18,
    recordsIngested: '1.9M logs',
    telemetryHealth: 'Telemetry Parity Active'
  }
];

export function MeridianOrbitalHorizon() {
  const [activeNode, setActiveNode] = useState<OrbitNode | null>(NODES[0]);

  return (
    <div className="relative overflow-hidden rounded-3xl meridian-canvas meridian-grid border border-white/10 p-6 md:p-8 text-stone-100 shadow-2xl">
      {/* Top Atmospheric Horizon Ambient Corona Glow */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[120%] h-64 bg-radial from-emerald-500/25 via-emerald-700/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute -top-24 right-1/4 w-96 h-48 bg-radial from-amber-500/20 via-amber-600/5 to-transparent blur-2xl pointer-events-none" />

      {/* Top Metadata Header Strip */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />
              Meridian Telemetry Radar
            </span>
            <span className="font-mono text-[11px] text-stone-400 bg-stone-900/80 px-2 py-0.5 rounded border border-white/5">
              CYCLE: Q3 2026 ACTIVE
            </span>
            <span className="font-mono text-[11px] text-stone-400 hidden sm:inline">
              GEO-ORBIT: 77.2°E • 7 STRATEGIC CSES
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-stone-50 mt-2 tracking-tight font-serif">
            Supervisory Analytics & Orbital Oversight
          </h1>
          <p className="text-xs md:text-sm text-stone-400 mt-1 max-w-2xl leading-relaxed">
            Continuous empirical surveillance of national SOC operational records, silent telemetry voids, and algorithmic execution integrity under Section 70A.
          </p>
        </div>

        {/* Quick Review Actions */}
        <div className="flex items-center space-x-2.5 shrink-0">
          <Link
            href="/review-planner"
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-stone-950 text-xs font-bold font-mono uppercase tracking-wider flex items-center space-x-1.5 transition shadow-lg shadow-emerald-900/30"
          >
            <span>Review Docket</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/findings"
            className="px-4 py-2 rounded-xl bg-stone-900/80 hover:bg-stone-800 text-stone-200 text-xs font-bold font-mono transition border border-white/10"
          >
            Findings (7)
          </Link>
        </div>
      </div>

      {/* Meridian Atmospheric Orbital Arc Visualizer */}
      <div className="relative z-10 my-6 pt-4 pb-2">
        <div className="relative w-full h-44 sm:h-52">
          {/* Orbital Curvature Line (SVG) */}
          <svg
            className="absolute inset-0 w-full h-full overflow-visible pointer-events-none"
            preserveAspectRatio="none"
            viewBox="0 0 1000 200"
          >
            <defs>
              <linearGradient id="orbitalGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#059669" stopOpacity="0.1" />
                <stop offset="25%" stopColor="#10B981" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#34D399" stopOpacity="1" />
                <stop offset="75%" stopColor="#D97706" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#059669" stopOpacity="0.1" />
              </linearGradient>
              <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Earth Orbital Arc */}
            <path
              d="M 20 180 Q 500 20 980 180"
              fill="none"
              stroke="url(#orbitalGlow)"
              strokeWidth="2.5"
              filter="url(#glowFilter)"
            />
            {/* Secondary faint atmospheric ray */}
            <path
              d="M 20 190 Q 500 35 980 190"
              fill="none"
              stroke="#10B981"
              strokeOpacity="0.15"
              strokeWidth="6"
              strokeDasharray="4 8"
            />
          </svg>

          {/* Orbiting CSE Nodes */}
          {NODES.map((node) => {
            const isSelected = activeNode?.code === node.code;
            return (
              <div
                key={node.code}
                onClick={() => setActiveNode(node)}
                style={{
                  left: `${node.xPercent}%`,
                  top: `${node.yOffset}%`
                }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
              >
                {/* Node Beacon */}
                <div className="relative flex flex-col items-center">
                  {/* Ping Rings */}
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-emerald-500/30 ring-2 ring-emerald-400 scale-125'
                        : 'bg-stone-900/80 border border-white/20 group-hover:scale-110'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        node.status === 'Critical'
                          ? 'bg-orange-400 animate-ping'
                          : node.status === 'Warning'
                          ? 'bg-amber-400'
                          : 'bg-emerald-400'
                      }`}
                    />
                  </div>

                  {/* Node Label Pill */}
                  <div
                    className={`mt-2 px-2 py-0.5 rounded-md font-mono text-[10px] font-bold tracking-wider transition-all whitespace-nowrap ${
                      isSelected
                        ? 'bg-emerald-500 text-stone-950 font-black shadow-lg shadow-emerald-500/30'
                        : 'bg-stone-900/90 text-stone-300 border border-white/10 group-hover:text-white group-hover:border-emerald-500/50'
                    }`}
                  >
                    {node.code}
                  </div>

                  <span className="text-[9px] font-mono text-stone-400 mt-0.5 hidden sm:block">
                    DI: {node.discrepancyIndex}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Node Telemetry Banner */}
        {activeNode && (
          <div className="mt-2 p-4 rounded-2xl bg-stone-900/90 border border-white/10 backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xl">
            <div className="flex items-center space-x-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs font-mono shrink-0 ${
                  activeNode.status === 'Critical'
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                    : activeNode.status === 'Warning'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}
              >
                <Radio className="w-4 h-4 animate-pulse" />
              </div>

              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-sm text-stone-50 font-mono">{activeNode.code}</span>
                  <span className="text-xs text-stone-400">•</span>
                  <span className="text-xs text-stone-300 font-medium">{activeNode.name}</span>
                </div>
                <div className="text-[11px] text-stone-400 font-mono mt-0.5 flex flex-wrap items-center gap-x-3">
                  <span>Sector: <strong className="text-stone-200">{activeNode.sector}</strong></span>
                  <span>Ingested: <strong className="text-stone-200">{activeNode.recordsIngested}</strong></span>
                  <span className={activeNode.status === 'Critical' ? 'text-orange-400' : 'text-amber-400'}>
                    Flag: {activeNode.telemetryHealth}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 self-end sm:self-auto shrink-0">
              <div className="text-right">
                <span className="text-[10px] uppercase font-mono tracking-wider text-stone-400 block">
                  Discrepancy Score
                </span>
                <span
                  className={`font-mono text-base font-extrabold ${
                    activeNode.discrepancyIndex > 50
                      ? 'text-orange-400'
                      : activeNode.discrepancyIndex > 30
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {activeNode.discrepancyIndex} / 100
                </span>
              </div>

              <Link
                href={`/entities`}
                className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-100 text-xs font-semibold inline-flex items-center space-x-1 border border-white/10 transition"
              >
                <span>Full Audit</span>
                <ExternalLink className="w-3 h-3 text-stone-400" />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Meridian Metrics Bar */}
      <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-white/10 text-xs font-mono">
        <div className="p-3 rounded-xl bg-stone-900/60 border border-white/5">
          <span className="text-[10px] text-stone-400 block uppercase">Telemetry Volume</span>
          <span className="text-lg font-bold text-stone-100 mt-1 block">2.4M Records</span>
        </div>
        <div className="p-3 rounded-xl bg-stone-900/60 border border-white/5">
          <span className="text-[10px] text-stone-400 block uppercase">Continuous Ingest</span>
          <span className="text-lg font-bold text-emerald-400 mt-1 block">100% Corroborated</span>
        </div>
        <div className="p-3 rounded-xl bg-stone-900/60 border border-white/5">
          <span className="text-[10px] text-stone-400 block uppercase">Merkle Verification</span>
          <span className="text-lg font-bold text-stone-100 mt-1 block">99.8% Root Valid</span>
        </div>
        <div className="p-3 rounded-xl bg-stone-900/60 border border-white/5">
          <span className="text-[10px] text-stone-400 block uppercase">Active System Flags</span>
          <span className="text-lg font-bold text-amber-400 mt-1 block">7 Observations</span>
        </div>
      </div>
    </div>
  );
}
