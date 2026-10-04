import React, { useState } from 'react';
import { Activity, ShieldAlert } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { ALERT_METRICS, RESOLUTION_DISTRIBUTION_DATA } from '../../data/mockData';

export const AlertAnalysisTab: React.FC = () => {
  const [selectedEntity, setSelectedEntity] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMetrics = ALERT_METRICS.filter(item => {
    const matchesCSE = selectedEntity === 'ALL' || item.cseCode === selectedEntity;
    const matchesSearch =
      item.alertName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sourceSystem.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.cseCode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCSE && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-[#FFFFFF] p-6 rounded-xl border border-[#E4E4E7]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-bold text-[#09090B] flex items-center space-x-2">
              <Activity className="w-5 h-5 text-[#4F46E5]" />
              <span>SOC Alert Telemetry & Resolution Distribution Analysis</span>
            </h1>
            <p className="text-xs text-[#71717A] mt-0.5">
              Auditing triage efficiency, false-positive disposal velocity, and anomalous alert suppression patterns
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-[#71717A]">Filter Entity:</span>
            <select
              value={selectedEntity}
              onChange={(e) => setSelectedEntity(e.target.value)}
              className="bg-[#FAFAFA] border border-[#E4E4E7] rounded-xl px-3 py-1.5 text-xs text-[#09090B] font-mono focus:outline-none focus:border-[#4F46E5]"
            >
              <option value="ALL">All Monitored CSEs</option>
              <option value="CSE-17">CSE-17 (PowerGrid)</option>
              <option value="SOC-04">SOC-04 (NPCI)</option>
              <option value="SOC-11">SOC-11 (BSNL)</option>
              <option value="CAC-02">CAC-02 (AAI)</option>
              <option value="CSE-29">CSE-29 (CRIS Rail)</option>
              <option value="SOC-08">SOC-08 (IOCL)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Resolution Time Distribution Chart & Supervisory Callout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart Column (2 cols) */}
        <div className="lg:col-span-2 bg-[#FFFFFF] p-5 rounded-xl border border-[#E4E4E7]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-[#09090B]">
                Alert Triage Duration Histogram (National Aggregate)
              </h2>
              <p className="text-xs text-[#71717A]">
                Note the anomalous spike in &lt;1 min closures (premature disposal) alongside &gt;24h triage stagnation
              </p>
            </div>
            <span className="text-xs font-mono text-[#4F46E5] bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-200">
              N=925 Analyzed Alerts
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={RESOLUTION_DISTRIBUTION_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E7" />
                <XAxis dataKey="range" stroke="#71717A" fontSize={10} angle={-15} textAnchor="end" />
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
                <Bar dataKey="count" name="Alert Count" fill="#4F46E5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Callout Card (1 col) */}
        <div className="bg-[#FFFFFF] p-5 rounded-xl border border-amber-300 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-[#D97706] font-bold text-xs uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4 text-[#D97706]" />
              <span>Supervisory Alert Pattern Flag</span>
            </div>
            <h3 className="font-bold text-sm text-[#09090B]">
              Bimodal Distribution Warning
            </h3>
            <p className="text-xs text-[#71717A] leading-relaxed">
              Standard professional SOCs exhibit a unimodal Gaussian triage curve peaking between 5 to 20 minutes. SAT-SA has detected an unnatural bimodal distribution across CSE-17 and SOC-11:
            </p>
            <ul className="text-xs text-[#27272A] space-y-1.5 list-disc pl-4">
              <li>
                <strong className="text-[#4F46E5]">98 alerts (10.6%)</strong> closed in under 60 seconds (bulk false-positive shortcutting).
              </li>
              <li>
                <strong className="text-[#EA580C]">57 alerts (6.2%)</strong> languishing unresolved beyond statutory 24-hour window.
              </li>
            </ul>
          </div>

          <div className="p-3 bg-[#FAFAFA] rounded-xl border border-[#E4E4E7] text-[11px] text-[#71717A]">
            Audited against NCIIPC SOC Quality Assessment Metric Q-04.
          </div>
        </div>

      </div>

      {/* Alert Metrics Table */}
      <div className="bg-[#FFFFFF] rounded-xl border border-[#E4E4E7] overflow-hidden">
        <div className="p-4 bg-[#FAFAFA] border-b border-[#E4E4E7] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <h2 className="text-sm font-bold text-[#09090B]">
              Core Security Rule Triage Metrics by Telemetry Source
            </h2>
          </div>
          <div className="w-full sm:w-64">
            <input
              type="text"
              placeholder="Search alert name or system..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FFFFFF] border border-[#E4E4E7] rounded-xl px-3 py-1.5 text-xs text-[#09090B] placeholder-[#71717A] focus:outline-none focus:border-[#4F46E5]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F4F4F5] text-[#71717A] font-semibold uppercase tracking-wider text-[11px] border-b border-[#E4E4E7]">
              <tr>
                <th className="py-3 px-4">Entity</th>
                <th className="py-3 px-4">Alert Name / Rule</th>
                <th className="py-3 px-4">Source System</th>
                <th className="py-3 px-4 text-center">Total Ingested</th>
                <th className="py-3 px-4 text-center">Within SLA</th>
                <th className="py-3 px-4 text-center">Premature Closure</th>
                <th className="py-3 px-4 text-center">L2 Escalated</th>
                <th className="py-3 px-4 text-center">Avg Triage (min)</th>
                <th className="py-3 px-4 text-center">Signal Flag</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E4E7]">
              {filteredMetrics.map((mtr) => (
                <tr key={mtr.id} className="hover:bg-[#F4F4F5]/60 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#4F46E5]">
                    {mtr.cseCode}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-[#09090B] max-w-xs">
                    {mtr.alertName}
                  </td>
                  <td className="py-3.5 px-4 text-[#71717A]">
                    {mtr.sourceSystem}
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono font-bold text-[#09090B]">
                    {mtr.totalGenerated}
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono text-[#059669]">
                    {mtr.triagedWithinSLA}
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono font-bold text-[#EA580C]">
                    {mtr.prematurelyClosed > 0 ? mtr.prematurelyClosed : '—'}
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono text-[#09090B]">
                    {mtr.escalatedToL2}
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono font-semibold text-[#71717A]">
                    {mtr.avgTriageTimeMinutes}m
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {mtr.anomalyFlag ? (
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-50 text-[#EA580C] border border-orange-200">
                        Anomaly Detected
                      </span>
                    ) : (
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-[#059669] border border-emerald-200">
                        Normal Baseline
                      </span>
                    )}
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
