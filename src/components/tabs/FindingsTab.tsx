import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  AlertOctagon,
  HelpCircle,
  Clock,
  FileCheck2,
  ArrowUpDown,
  ExternalLink,
  Scale
} from 'lucide-react';
import { Finding, Priority, AssessmentStatus, FilterState } from '../../types';

interface FindingsTabProps {
  findings: Finding[];
  filterState: FilterState;
  setFilterState: React.Dispatch<React.SetStateAction<FilterState>>;
  onSelectFinding: (finding: Finding) => void;
}

export const FindingsTab: React.FC<FindingsTabProps> = ({
  findings,
  filterState,
  setFilterState,
  onSelectFinding
}) => {
  const [sortField, setSortField] = useState<'signalScore' | 'detectedAt' | 'priority'>('signalScore');
  const [sortAsc, setSortAsc] = useState(false);

  const priorities: Priority[] = ['Critical', 'High', 'Medium', 'Low'];
  const statuses: AssessmentStatus[] = ['Pending Review', 'Confirmed Concern', 'Not a Concern', 'Requires Information'];

  const filteredFindings = findings.filter(f => {
    const matchesSearch =
      f.title.toLowerCase().includes(filterState.searchQuery.toLowerCase()) ||
      f.cseCode.toLowerCase().includes(filterState.searchQuery.toLowerCase()) ||
      f.cseName.toLowerCase().includes(filterState.searchQuery.toLowerCase()) ||
      f.ruleId.toLowerCase().includes(filterState.searchQuery.toLowerCase()) ||
      f.category.toLowerCase().includes(filterState.searchQuery.toLowerCase());

    const matchesPriority =
      filterState.selectedPriority === '' || filterState.selectedPriority === 'ALL' || f.priority === filterState.selectedPriority;

    const matchesStatus =
      filterState.selectedStatus === '' || filterState.selectedStatus === 'ALL' || f.status === filterState.selectedStatus;

    const matchesCSE =
      filterState.selectedCSE === '' || filterState.selectedCSE === 'ALL' || f.cseCode === filterState.selectedCSE;

    return matchesSearch && matchesPriority && matchesStatus && matchesCSE;
  }).sort((a, b) => {
    if (sortField === 'signalScore') {
      return sortAsc ? a.signalScore - b.signalScore : b.signalScore - a.signalScore;
    }
    return 0;
  });

  const getPriorityBadgeClass = (priority: Priority) => {
    switch (priority) {
      case 'Critical':
        return 'bg-orange-50 text-[#EA580C] border border-orange-200 font-bold';
      case 'High':
        return 'bg-amber-50 text-[#D97706] border border-amber-200 font-bold';
      case 'Medium':
        return 'bg-indigo-50 text-[#4F46E5] border border-indigo-200 font-semibold';
      case 'Low':
        return 'bg-[#F4F4F5] text-[#71717A] border border-[#E4E4E7] font-medium';
    }
  };

  const getStatusBadge = (status: AssessmentStatus) => {
    switch (status) {
      case 'Confirmed Concern':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-50 text-[#EA580C] border border-orange-200">
            <AlertOctagon className="w-3 h-3 text-[#EA580C]" />
            <span>Confirmed Concern</span>
          </span>
        );
      case 'Not a Concern':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-[#059669] border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-[#059669]" />
            <span>Not a Concern</span>
          </span>
        );
      case 'Requires Information':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-[#4F46E5] border border-indigo-200">
            <HelpCircle className="w-3 h-3 text-[#4F46E5]" />
            <span>Requires Info</span>
          </span>
        );
      case 'Pending Review':
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-[#D97706] border border-amber-200">
            <Clock className="w-3 h-3 text-[#D97706]" />
            <span>Pending Review</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Tab Header with Human-in-the-Loop Banner */}
      <div className="bg-[#FFFFFF] p-6 rounded-xl border border-[#E4E4E7] space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-bold text-[#09090B]">
              Supervisory Findings & Execution-Gap Signals
            </h1>
            <p className="text-xs text-[#71717A] mt-0.5">
              Review and record official determinations on system-flagged SOC execution gaps and telemetry lapses
            </p>
          </div>
          <div className="bg-[#F4F4F5] border border-[#E4E4E7] rounded-xl px-3 py-1.5 text-xs text-[#059669] flex items-center space-x-2">
            <Scale className="w-4 h-4 text-[#059669] shrink-0" />
            <span>
              <strong className="text-[#09090B]">{findings.filter(f => f.status === 'Pending Review').length}</strong> findings awaiting human assessment
            </span>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-4 border-t border-[#E4E4E7]">
          {/* Priority filter */}
          <div>
            <label className="text-[11px] font-bold text-[#71717A] uppercase tracking-wider block mb-1">
              Priority Filter
            </label>
            <select
              value={filterState.selectedPriority}
              onChange={(e) => setFilterState(prev => ({ ...prev, selectedPriority: e.target.value }))}
              className="w-full bg-[#FAFAFA] border border-[#E4E4E7] rounded-xl px-2.5 py-1.5 text-xs text-[#09090B] focus:outline-none focus:border-[#4F46E5]"
            >
              <option value="ALL">All Priorities</option>
              {priorities.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Status filter */}
          <div>
            <label className="text-[11px] font-bold text-[#71717A] uppercase tracking-wider block mb-1">
              Supervisory Status
            </label>
            <select
              value={filterState.selectedStatus}
              onChange={(e) => setFilterState(prev => ({ ...prev, selectedStatus: e.target.value }))}
              className="w-full bg-[#FAFAFA] border border-[#E4E4E7] rounded-xl px-2.5 py-1.5 text-xs text-[#09090B] focus:outline-none focus:border-[#4F46E5]"
            >
              <option value="ALL">All Statuses</option>
              {statuses.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Entity filter */}
          <div>
            <label className="text-[11px] font-bold text-[#71717A] uppercase tracking-wider block mb-1">
              Filter by Entity (CSE)
            </label>
            <select
              value={filterState.selectedCSE}
              onChange={(e) => setFilterState(prev => ({ ...prev, selectedCSE: e.target.value }))}
              className="w-full bg-[#FAFAFA] border border-[#E4E4E7] rounded-xl px-2.5 py-1.5 text-xs text-[#09090B] focus:outline-none focus:border-[#4F46E5] font-mono"
            >
              <option value="ALL">All Entities</option>
              <option value="CSE-17">CSE-17 (PowerGrid)</option>
              <option value="SOC-04">SOC-04 (NPCI Payments)</option>
              <option value="CAC-02">CAC-02 (Civil Aviation)</option>
              <option value="CSE-29">CSE-29 (Railways FOIS)</option>
              <option value="SOC-08">SOC-08 (IOCL Pipeline)</option>
              <option value="SOC-11">SOC-11 (BSNL Telecom)</option>
              <option value="CSE-05">CSE-05 (Nuclear Telemetry)</option>
            </select>
          </div>

          {/* Reset Filters button */}
          <div className="flex items-end">
            <button
              onClick={() => setFilterState({
                searchQuery: '',
                selectedSector: 'ALL',
                selectedPriority: 'ALL',
                selectedStatus: 'ALL',
                selectedCSE: 'ALL'
              })}
              className="w-full py-1.5 px-3 bg-[#FAFAFA] hover:bg-[#F4F4F5] text-[#71717A] hover:text-[#09090B] border border-[#E4E4E7] rounded-xl text-xs font-semibold transition"
            >
              Reset All Filters
            </button>
          </div>
        </div>
      </div>

      {/* Findings Table List */}
      <div className="bg-[#FFFFFF] rounded-xl border border-[#E4E4E7] overflow-hidden">
        <div className="px-5 py-3.5 bg-[#FAFAFA] border-b border-[#E4E4E7] flex items-center justify-between text-xs text-[#71717A]">
          <span className="font-semibold text-[#09090B]">
            Showing {filteredFindings.length} of {findings.length} registered signals
          </span>
          <span className="text-[#71717A] hidden sm:inline">
            Click any row to inspect underlying evidence and record supervisor determination
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F4F4F5] text-[#71717A] font-semibold uppercase tracking-wider text-[11px] border-b border-[#E4E4E7]">
              <tr>
                <th className="py-3 px-4">Finding ID</th>
                <th className="py-3 px-4">Critical Entity</th>
                <th className="py-3 px-4">Observed Execution Gap</th>
                <th className="py-3 px-4">Priority</th>
                <th
                  className="py-3 px-4 cursor-pointer hover:text-[#4F46E5]"
                  onClick={() => {
                    setSortField('signalScore');
                    setSortAsc(!sortAsc);
                  }}
                >
                  <div className="flex items-center space-x-1">
                    <span>Signal Score</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4">Evidence</th>
                <th className="py-3 px-4">Supervisory Determination</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E4E7]">
              {filteredFindings.map((finding) => (
                <tr
                  key={finding.id}
                  onClick={() => onSelectFinding(finding)}
                  className="hover:bg-[#F4F4F5]/60 cursor-pointer transition group"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-[#4F46E5] whitespace-nowrap">
                    {finding.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-[#09090B] flex items-center space-x-1.5">
                      <span className="font-mono text-[#4F46E5]">{finding.cseCode}</span>
                    </div>
                    <div className="text-[11px] text-[#71717A] truncate max-w-[160px]">
                      {finding.sector}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 max-w-md">
                    <div className="font-semibold text-[#09090B] line-clamp-1 group-hover:text-[#4F46E5] transition">
                      {finding.title}
                    </div>
                    <div className="text-[11px] text-[#71717A] font-mono mt-0.5">
                      {finding.category} • Rule: {finding.ruleId}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] ${getPriorityBadgeClass(finding.priority)}`}>
                      {finding.priority}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-sm text-[#09090B] whitespace-nowrap">
                    {finding.signalScore}
                    <span className="text-[10px] text-[#71717A] font-normal">/100</span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center space-x-1 text-xs text-[#4F46E5] font-medium bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                      <FileCheck2 className="w-3 h-3 text-[#4F46E5]" />
                      <span>{finding.evidenceCount} artifacts</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {getStatusBadge(finding.status)}
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectFinding(finding);
                      }}
                      className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-[#FAFAFA] text-[#71717A] group-hover:bg-[#4F46E5] group-hover:text-white border border-[#E4E4E7] transition flex items-center space-x-1 ml-auto"
                    >
                      <span>Assess</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredFindings.length === 0 && (
          <div className="p-12 text-center text-[#71717A] space-y-2">
            <AlertTriangle className="w-8 h-8 text-[#71717A] mx-auto" />
            <p className="text-sm font-medium">No findings match the selected criteria.</p>
            <button
              onClick={() => setFilterState({
                searchQuery: '',
                selectedSector: 'ALL',
                selectedPriority: 'ALL',
                selectedStatus: 'ALL',
                selectedCSE: 'ALL'
              })}
              className="text-xs text-[#4F46E5] font-bold underline"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
