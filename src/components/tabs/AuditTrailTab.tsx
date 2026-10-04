import React, { useState } from 'react';
import { History, ShieldCheck, Search, UserCheck } from 'lucide-react';
import { AuditLogEntry } from '../../types';

interface AuditTrailTabProps {
  auditLogs: AuditLogEntry[];
}

export const AuditTrailTab: React.FC<AuditTrailTabProps> = ({ auditLogs }) => {
  const [search, setSearch] = useState('');
  const [selectedAction, setSelectedAction] = useState('ALL');

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch =
      log.targetId.toLowerCase().includes(search.toLowerCase()) ||
      log.entityCode.toLowerCase().includes(search.toLowerCase()) ||
      log.comments.toLowerCase().includes(search.toLowerCase()) ||
      log.supervisorName.toLowerCase().includes(search.toLowerCase());

    const matchesAction = selectedAction === 'ALL' || log.action === selectedAction;
    return matchesSearch && matchesAction;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-[#FFFFFF] p-6 rounded-xl border border-[#E4E4E7]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-bold text-[#09090B] flex items-center space-x-2">
              <History className="w-5 h-5 text-[#4F46E5]" />
              <span>Immutable Supervisory Audit Trail & Accountability Log</span>
            </h1>
            <p className="text-xs text-[#71717A] mt-0.5">
              Automated timestamped logging of every human determination, rationale modification, and supervisory inquiry
            </p>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-1.5 text-xs text-[#059669] font-mono flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-[#059669]" />
            <span>Cryptographic Integrity Log Active</span>
          </div>
        </div>

        {/* Search & Action Filter Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-3 border-t border-[#E4E4E7]">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#71717A]" />
            <input
              type="text"
              placeholder="Search by target ID (FND-2026-0809), entity (SOC-04), or officer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#FAFAFA] border border-[#E4E4E7] rounded-xl pl-9 pr-3 py-2 text-xs text-[#09090B] placeholder-[#71717A] focus:outline-none focus:border-[#4F46E5]"
            />
          </div>

          <div>
            <select
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
              className="w-full bg-[#FAFAFA] border border-[#E4E4E7] rounded-xl px-3 py-2 text-xs text-[#09090B] focus:outline-none focus:border-[#4F46E5]"
            >
              <option value="ALL">All Action Types</option>
              <option value="Assessed Finding">Assessed Finding</option>
              <option value="Requested Clarification">Requested Clarification</option>
              <option value="Exported Sector Report">Exported Sector Report</option>
              <option value="Initiated CSE Review">Initiated CSE Review</option>
            </select>
          </div>
        </div>
      </div>

      {/* Audit Log Timeline Table */}
      <div className="bg-[#FFFFFF] rounded-xl border border-[#E4E4E7] overflow-hidden">
        <div className="p-4 bg-[#FAFAFA] border-b border-[#E4E4E7] flex items-center justify-between text-xs text-[#71717A]">
          <span className="font-semibold text-[#09090B]">
            Logged Actions ({filteredLogs.length})
          </span>
          <span className="text-[#71717A]">
            All records permanently stored pursuant to CERT-In Log Retention Rules
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F4F4F5] text-[#71717A] font-semibold uppercase tracking-wider text-[11px] border-b border-[#E4E4E7]">
              <tr>
                <th className="py-3 px-4">Audit ID</th>
                <th className="py-3 px-4">Timestamp (IST)</th>
                <th className="py-3 px-4">Supervisory Officer</th>
                <th className="py-3 px-4">Action Taken</th>
                <th className="py-3 px-4">Target / Entity</th>
                <th className="py-3 px-4">Determination</th>
                <th className="py-3 px-4">Recorded Rationale & Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E4E7]">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#FAFAFA] transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#4F46E5] whitespace-nowrap">
                    {log.id}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[#71717A] whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="font-semibold text-[#09090B] flex items-center space-x-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-[#059669]" />
                      <span>{log.supervisorName}</span>
                    </div>
                    <div className="text-[10px] text-[#71717A] font-mono">{log.supervisorId}</div>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-[#4F46E5] border border-indigo-200">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="font-bold text-[#09090B] font-mono">{log.targetId}</div>
                    <div className="text-[10px] text-[#4F46E5] font-mono">{log.entityCode}</div>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {log.statusAssigned ? (
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        log.statusAssigned === 'Confirmed Concern' ? 'bg-orange-50 text-[#EA580C] border border-orange-200' :
                        log.statusAssigned === 'Not a Concern' ? 'bg-emerald-50 text-[#059669] border border-emerald-200' :
                        'bg-indigo-50 text-[#4F46E5] border border-indigo-200'
                      }`}>
                        {log.statusAssigned}
                      </span>
                    ) : (
                      <span className="text-[#A1A1AA]">—</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-[#27272A] leading-normal max-w-md">
                    {log.comments}
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
