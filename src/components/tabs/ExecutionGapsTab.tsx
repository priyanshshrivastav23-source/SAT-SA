import React, { useState } from 'react';
import { GitFork, BookOpen, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { EXECUTION_GAP_CATEGORIES, SECTOR_GAP_CHART_DATA } from '../../data/mockData';
import { ExecutionGapCategory } from '../../types';

interface ExecutionGapsTabProps {
  onNavigateTab: (tab: string) => void;
}

export const ExecutionGapsTab: React.FC<ExecutionGapsTabProps> = ({ onNavigateTab }) => {
  const [selectedGap, setSelectedGap] = useState<ExecutionGapCategory>(EXECUTION_GAP_CATEGORIES[0]);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-[#FFFFFF] p-6 rounded-xl border border-[#E4E4E7]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-bold text-[#09090B] flex items-center space-x-2">
              <GitFork className="w-5 h-5 text-[#4F46E5]" />
              <span>SOC Execution-Gap Taxonomy & Root-Cause Surveillance</span>
            </h1>
            <p className="text-xs text-[#71717A] mt-0.5">
              Structural patterns where SOC operational execution diverges from national baseline security guidelines
            </p>
          </div>
          <div className="bg-[#F4F4F5] border border-[#E4E4E7] rounded-xl px-3 py-1.5 text-xs text-[#4F46E5] font-mono font-medium">
            <span>Framework: NCIIPC Guidelines Sec 5 & CERT-In Sec 70B</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Category Cards and Selected Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: 6 Gap Category Selector Cards */}
        <div className="lg:col-span-1 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#71717A] px-1">
            Execution Gap Categories ({EXECUTION_GAP_CATEGORIES.length})
          </h2>
          {EXECUTION_GAP_CATEGORIES.map((gap) => {
            const isSelected = selectedGap.id === gap.id;
            return (
              <div
                key={gap.id}
                onClick={() => setSelectedGap(gap)}
                className={`p-4 rounded-xl border cursor-pointer transition ${
                  isSelected
                    ? 'bg-indigo-50/50 border-[#4F46E5] ring-1 ring-[#4F46E5]'
                    : 'bg-[#FFFFFF] border-[#E4E4E7] hover:bg-[#FAFAFA]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-bold text-[#4F46E5]">
                    {gap.id}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      gap.severity === 'Critical'
                        ? 'bg-orange-50 text-[#EA580C] border border-orange-200'
                        : gap.severity === 'High'
                        ? 'bg-amber-50 text-[#D97706] border border-amber-200'
                        : 'bg-indigo-50 text-[#4F46E5] border border-indigo-200'
                    }`}
                  >
                    {gap.severity}
                  </span>
                </div>
                <h3 className="font-bold text-xs text-[#09090B] mt-1.5">
                  {gap.name}
                </h3>
                <div className="mt-2 flex items-center justify-between text-[11px] text-[#71717A] pt-2 border-t border-[#E4E4E7]">
                  <span>Detected Instances:</span>
                  <strong className="font-mono text-[#EA580C]">{gap.detectedInstances} cases</strong>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Detailed Analysis & Analytics */}
        <div className="lg:col-span-2 space-y-5">
          
          {/* Active Category Detail Panel */}
          <div className="bg-[#FFFFFF] p-6 rounded-xl border border-[#E4E4E7] space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-[#4F46E5] bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-200">
                  {selectedGap.id} Root-Cause Analysis
                </span>
                <h2 className="text-base font-bold text-[#09090B] mt-2">
                  {selectedGap.name}
                </h2>
              </div>
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  selectedGap.severity === 'Critical'
                    ? 'bg-orange-50 text-[#EA580C] border border-orange-200'
                    : 'bg-amber-50 text-[#D97706] border border-amber-200'
                }`}
              >
                {selectedGap.severity} Severity
              </span>
            </div>

            <p className="text-xs text-[#27272A] leading-relaxed bg-[#FAFAFA] p-4 rounded-xl border border-[#E4E4E7]">
              {selectedGap.description}
            </p>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-[#FAFAFA] p-3.5 rounded-xl border border-[#E4E4E7]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#71717A] block">
                  Affected Critical Entities
                </span>
                <span className="text-xl font-bold font-mono text-[#09090B] mt-1 block">
                  {selectedGap.affectedEntities} CSEs
                </span>
                <span className="text-[10px] text-[#71717A]">Active Sector Nodes</span>
              </div>
              <div className="bg-[#FAFAFA] p-3.5 rounded-xl border border-[#E4E4E7]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#71717A] block">
                  Avg Operational Delay
                </span>
                <span className="text-xl font-bold font-mono text-[#EA580C] mt-1 block">
                  {selectedGap.avgResolutionDelayHours} hrs
                </span>
                <span className="text-[10px] text-[#71717A]">Beyond SLA Baseline</span>
              </div>
              <div className="bg-[#FAFAFA] p-3.5 rounded-xl border border-[#E4E4E7]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#71717A] block">
                  Detection Trend
                </span>
                <span className="text-sm font-bold text-[#4F46E5] mt-1.5 block capitalize flex items-center space-x-1">
                  <TrendingUp className="w-4 h-4 text-[#D97706]" />
                  <span>{selectedGap.trend} (Q3 2026)</span>
                </span>
              </div>
            </div>

            {/* Regulatory Standard Reference */}
            <div className="bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-200 flex items-start space-x-2.5">
              <BookOpen className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#059669]">
                  Mandatory Statutory Reference
                </span>
                <p className="text-xs text-[#27272A] mt-0.5 font-medium">
                  {selectedGap.regulatoryStandard}
                </p>
              </div>
            </div>

            {/* Quick action to filtered findings */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => onNavigateTab('findings')}
                className="px-4 py-2 bg-[#4F46E5] hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition"
              >
                Inspect All {selectedGap.name} Signals in Findings
              </button>
            </div>
          </div>

          {/* Recharts Chart: Cross-Sectoral Gap Intensity */}
          <div className="bg-[#FFFFFF] p-5 rounded-xl border border-[#E4E4E7]">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-xs font-bold text-[#09090B] uppercase tracking-wider">
                  Comparative Cross-Sector Execution-Gap Incidents
                </h3>
                <p className="text-[11px] text-[#71717A]">
                  Aggregated telemetry audit across Power, Banking, Telecom, Aviation, Oil & Rail
                </p>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={SECTOR_GAP_CHART_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E7" />
                  <XAxis dataKey="sector" stroke="#71717A" fontSize={11} tickLine={false} />
                  <YAxis stroke="#71717A" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderColor: '#E4E4E7',
                      borderRadius: '12px',
                      color: '#09090B',
                      fontSize: '12px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', color: '#27272A' }} />
                  <Bar dataKey="stagnation" name="Triage Stagnation" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="prematureClose" name="Premature Closure" fill="#334155" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="logBlindspots" name="Log Blindspots" fill="#D97706" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="ruleTampering" name="Rule Tampering" fill="#EA580C" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
