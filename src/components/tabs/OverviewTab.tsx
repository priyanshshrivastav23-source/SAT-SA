import React from 'react';
import {
  ShieldAlert,
  Building,
  Clock,
  ArrowUpRight,
  ChevronRight,
  Scale
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, AreaChart, Area, CartesianGrid } from 'recharts';
import { Finding, CSEEntity } from '../../types';
import { SECTOR_GAP_CHART_DATA, TELEMETRY_TREND_DATA } from '../../data/mockData';

interface OverviewTabProps {
  findings: Finding[];
  entities: CSEEntity[];
  onSelectFinding: (finding: Finding) => void;
  onNavigateTab: (tab: string) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  findings,
  entities,
  onSelectFinding,
  onNavigateTab
}) => {
  const pendingCount = findings.filter(f => f.status === 'Pending Review').length;
  const confirmedCount = findings.filter(f => f.status === 'Confirmed Concern').length;
  const criticalCount = findings.filter(f => f.priority === 'Critical').length;
  const totalVolume = entities.reduce((acc, curr) => acc + curr.dailyAlertVolume, 0);

  return (
    <div className="space-y-6">
      
      {/* Supervisory Executive Alert Banner */}
      <div className="bg-[#FFFFFF] text-[#09090B] p-6 rounded-xl border border-[#E4E4E7] relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-md bg-amber-50 text-[#D97706] border border-amber-200 text-xs font-bold font-mono">
                {pendingCount} SIGNALS PENDING REVIEW
              </span>
              <span className="text-xs text-[#71717A] font-mono font-medium">
                NCIIPC CYBER SUPERVISORY DESK
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-[#09090B]">
              SOC Operational Oversight & Telemetry Surveillance
            </h1>
            <p className="text-xs md:text-sm text-[#71717A] max-w-3xl leading-relaxed">
              Continuous monitoring of alert triage integrity, telemetry continuity, and operational compliance across designated Critical Sector Entities (CSEs).
            </p>
          </div>
          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={() => onNavigateTab('findings')}
              className="px-4 py-2 bg-[#4F46E5] hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition flex items-center space-x-1.5"
            >
              <span>Review Findings</span>
              <ArrowUpRight className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={() => onNavigateTab('reports')}
              className="px-4 py-2 bg-[#FAFAFA] hover:bg-[#F4F4F5] text-[#27272A] border border-[#E4E4E7] text-xs font-medium rounded-xl transition"
            >
              View Report
            </button>
          </div>
        </div>
      </div>

      {/* Top 4 Primary Supervisory Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1 */}
        <div className="bg-[#FFFFFF] p-5 rounded-xl border border-[#E4E4E7]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#71717A]">Monitored CSE Entities</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-[#4F46E5] border border-indigo-200">
              <Building className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-[#09090B]">{entities.length}</span>
            <span className="text-xs text-[#4F46E5] font-medium">Core Sectors</span>
          </div>
          <div className="mt-3 text-[11px] text-[#71717A] flex items-center justify-between border-t border-[#E4E4E7] pt-2.5">
            <span>Daily Telemetry Ingest:</span>
            <strong className="font-mono text-[#09090B]">{(totalVolume / 1000).toFixed(1)}k EPS</strong>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-[#FFFFFF] p-5 rounded-xl border border-[#E4E4E7]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#71717A]">Execution-Gap Signals</span>
            <div className="p-2 rounded-xl bg-orange-50 text-[#EA580C] border border-orange-200">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-[#EA580C]">{findings.length}</span>
            <span className="text-xs text-[#EA580C] font-semibold">({criticalCount} High Severity)</span>
          </div>
          <div className="mt-3 text-[11px] text-[#71717A] flex items-center justify-between border-t border-[#E4E4E7] pt-2.5">
            <span>Pending Supervisory Review:</span>
            <span className="font-bold text-[#D97706] font-mono">{pendingCount} signals</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-[#FFFFFF] p-5 rounded-xl border border-[#E4E4E7]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#71717A]">Confirmed Concerns</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-[#059669] border border-emerald-200">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-[#09090B]">{confirmedCount}</span>
            <span className="text-xs text-[#059669] font-medium">Validated by NCIIPC</span>
          </div>
          <div className="mt-3 text-[11px] text-[#71717A] flex items-center justify-between border-t border-[#E4E4E7] pt-2.5">
            <span>Formal Inquiries Issued:</span>
            <strong className="font-mono text-[#09090B]">{confirmedCount + 1} Directives</strong>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-[#FFFFFF] p-5 rounded-xl border border-[#E4E4E7]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#71717A]">Average Triage Latency</span>
            <div className="p-2 rounded-xl bg-amber-50 text-[#D97706] border border-amber-200">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-[#09090B]">18.4</span>
            <span className="text-xs text-[#71717A]">Hours (Target &lt; 4h)</span>
          </div>
          <div className="mt-3 text-[11px] text-[#71717A] flex items-center justify-between border-t border-[#E4E4E7] pt-2.5">
            <span>SLA Violation Rate:</span>
            <span className="font-bold text-[#D97706] font-mono">34.2%</span>
          </div>
        </div>

      </div>

      {/* Interactive Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Sectoral Breakdown of Execution Gaps */}
        <div className="bg-[#FFFFFF] p-5 rounded-xl border border-[#E4E4E7]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-[#09090B]">
                Execution-Gap Prevalence by National Critical Sector
              </h2>
              <p className="text-xs text-[#71717A]">
                Incidence of Triage Stagnation vs. Premature Closures vs. Log Blindspots
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('gaps')}
              className="text-xs text-[#4F46E5] hover:text-indigo-700 font-medium flex items-center space-x-1"
            >
              <span>Explore Gaps</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
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
                <Bar dataKey="stagnation" name="Triage Stagnation" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                <Bar dataKey="prematureClose" name="Premature Closure" fill="#334155" radius={[4, 4, 0, 0]} />
                <Bar dataKey="logBlindspots" name="Log Blindspots" fill="#D97706" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 pt-3 border-t border-[#E4E4E7] flex items-center justify-center space-x-6 text-xs text-[#27272A]">
            <span className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded bg-[#4F46E5] inline-block"></span>
              <span>Triage Stagnation (Indigo)</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded bg-[#334155] inline-block"></span>
              <span>Premature Closure (Slate)</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded bg-[#D97706] inline-block"></span>
              <span>Log Blindspots (Amber)</span>
            </span>
          </div>
        </div>

        {/* Chart 2: Telemetry Ingestion Gap Trend vs Uncorrelated Alerts */}
        <div className="bg-[#FFFFFF] p-5 rounded-xl border border-[#E4E4E7]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-[#09090B]">
                30-Day Telemetry Drop Duration vs. Uncorrelated Alerts
              </h2>
              <p className="text-xs text-[#71717A]">
                Ingestion blackout hours (Slate) directly predicting orphaned telemetry spikes (Indigo)
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('alerts')}
              className="text-xs text-[#4F46E5] hover:text-indigo-700 font-medium flex items-center space-x-1"
            >
              <span>Alert Metrics</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TELEMETRY_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAlerts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorGap" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#334155" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#334155" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E7" />
                <XAxis dataKey="day" stroke="#71717A" fontSize={11} tickLine={false} />
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
                <Area type="monotone" dataKey="uncorrelatedAlerts" name="Uncorrelated Alerts" stroke="#4F46E5" fillOpacity={1} fill="url(#colorAlerts)" />
                <Area type="monotone" dataKey="gapHours" name="Ingestion Gap Hours" stroke="#334155" fillOpacity={1} fill="url(#colorGap)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 pt-3 border-t border-[#E4E4E7] flex items-center justify-center space-x-6 text-xs text-[#27272A]">
            <span className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded bg-[#334155] inline-block"></span>
              <span>Ingestion Gap (Slate)</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded bg-[#4F46E5] inline-block"></span>
              <span>Uncorrelated Alerts (Indigo)</span>
            </span>
          </div>
        </div>

      </div>

      {/* Recent High Priority Execution-Gap Signals Table */}
      <div className="bg-[#FFFFFF] rounded-xl border border-[#E4E4E7] overflow-hidden">
        <div className="px-5 py-4 bg-[#FAFAFA] border-b border-[#E4E4E7] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-[#4F46E5]" />
            <h2 className="text-sm font-bold text-[#09090B]">
              Prioritized Execution-Gap Observations
            </h2>
            <span className="text-xs text-[#71717A] hidden sm:inline">
              (Pending Review)
            </span>
          </div>
          <button
            onClick={() => onNavigateTab('findings')}
            className="text-xs font-bold text-[#4F46E5] hover:text-indigo-700 flex items-center space-x-1"
          >
            <span>View All ({findings.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F4F4F5] text-[#71717A] font-semibold uppercase tracking-wider text-[11px] border-b border-[#E4E4E7]">
              <tr>
                <th className="py-3 px-4">Signal ID</th>
                <th className="py-3 px-4">Entity</th>
                <th className="py-3 px-4">Gap Category</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Score</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Supervisory Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E4E7]">
              {findings.slice(0, 5).map((finding) => (
                <tr
                  key={finding.id}
                  onClick={() => onSelectFinding(finding)}
                  className="hover:bg-[#F4F4F5]/60 cursor-pointer transition"
                >
                  <td className="py-3.5 px-4 font-mono font-medium text-[#4F46E5]">
                    {finding.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-[#09090B]">{finding.cseCode}</div>
                    <div className="text-[11px] text-[#71717A] truncate max-w-[180px]">{finding.cseName}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-medium text-[#27272A]">{finding.category}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        finding.priority === 'Critical'
                          ? 'bg-orange-50 text-[#EA580C] border border-orange-200'
                          : finding.priority === 'High'
                          ? 'bg-amber-50 text-[#D97706] border border-amber-200'
                          : 'bg-indigo-50 text-[#4F46E5] border border-indigo-200'
                      }`}
                    >
                      {finding.priority}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-[#09090B]">
                    {finding.signalScore}/100
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${
                        finding.status === 'Pending Review'
                          ? 'bg-amber-50 text-[#D97706] border border-amber-200'
                          : finding.status === 'Confirmed Concern'
                          ? 'bg-orange-50 text-[#EA580C] border border-orange-200'
                          : 'bg-emerald-50 text-[#059669] border border-emerald-200'
                      }`}
                    >
                      {finding.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectFinding(finding);
                      }}
                      className="px-3 py-1 text-xs font-semibold rounded-lg bg-[#FFFFFF] hover:bg-[#F4F4F5] text-[#4F46E5] border border-[#E4E4E7] transition"
                    >
                      Review Evidence
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
