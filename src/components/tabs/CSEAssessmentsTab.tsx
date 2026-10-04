import React, { useState } from 'react';
import { Building, Search, ArrowRight, MapPin, User } from 'lucide-react';
import { CSEEntity, Sector } from '../../types';

interface CSEAssessmentsTabProps {
  entities: CSEEntity[];
  onSelectCSEForFilter: (cseCode: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const CSEAssessmentsTab: React.FC<CSEAssessmentsTabProps> = ({
  entities,
  onSelectCSEForFilter,
  onNavigateTab
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  const sectors: Sector[] = [
    'Power & Energy',
    'Banking & Finance',
    'Civil Aviation',
    'Railways & Transport',
    'Telecom & IT',
    'Petroleum & Gas',
    'Strategic & Defence'
  ];

  const filteredEntities = entities.filter(entity => {
    const matchesSearch =
      entity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entity.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entity.nodalOfficer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entity.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSector = selectedSector === 'ALL' || entity.sector === selectedSector;
    const matchesStatus = selectedStatus === 'ALL' || entity.supervisorStatus === selectedStatus;

    return matchesSearch && matchesSector && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Header and Filter Toolbar */}
      <div className="bg-[#FFFFFF] p-6 rounded-xl border border-[#E4E4E7]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E4E4E7] pb-4">
          <div>
            <h1 className="text-lg font-bold text-[#09090B]">
              Critical Sector Entities (CSE) Supervision Registry
            </h1>
            <p className="text-xs text-[#71717A] mt-0.5">
              Statutory oversight of SOC operational health across designated critical sectors under NCIIPC mandate
            </p>
          </div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#4F46E5] bg-[#F4F4F5] px-3 py-1.5 rounded-xl border border-[#E4E4E7]">
            <span>Active Supervisory Scope:</span>
            <strong className="text-[#09090B]">{entities.length} Strategic Nodes</strong>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#71717A]" />
            <input
              type="text"
              placeholder="Search by code (CSE-17), name, location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#FAFAFA] border border-[#E4E4E7] rounded-xl pl-9 pr-3 py-2 text-xs text-[#09090B] placeholder-[#71717A] focus:outline-none focus:border-[#4F46E5]"
            />
          </div>

          <div>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="w-full bg-[#FAFAFA] border border-[#E4E4E7] rounded-xl px-3 py-2 text-xs text-[#09090B] focus:outline-none focus:border-[#4F46E5]"
            >
              <option value="ALL">All Critical Sectors ({sectors.length})</option>
              {sectors.map(sec => (
                <option key={sec} value={sec}>{sec}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-[#FAFAFA] border border-[#E4E4E7] rounded-xl px-3 py-2 text-xs text-[#09090B] focus:outline-none focus:border-[#4F46E5]"
            >
              <option value="ALL">All Supervisory Statuses</option>
              <option value="Action Required">Action Required</option>
              <option value="Under Investigation">Under Investigation</option>
              <option value="Pending Evidence">Pending Evidence</option>
              <option value="Compliant">Compliant</option>
            </select>
          </div>
        </div>
      </div>

      {/* Entities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredEntities.map((entity) => {
          const hasActionRequired = entity.supervisorStatus === 'Action Required';
          const isCompliant = entity.supervisorStatus === 'Compliant';

          return (
            <div
              key={entity.id}
              className={`bg-[#FFFFFF] rounded-xl border transition flex flex-col justify-between ${
                hasActionRequired
                  ? 'border-orange-300 hover:border-orange-400'
                  : 'border-[#E4E4E7] hover:border-indigo-300'
              }`}
            >
              <div className="p-5">
                {/* Top entity tag & status */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-[#4F46E5] border border-indigo-200">
                    {entity.code}
                  </span>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      hasActionRequired
                        ? 'bg-orange-50 text-[#EA580C] border border-orange-200'
                        : isCompliant
                        ? 'bg-emerald-50 text-[#059669] border border-emerald-200'
                        : 'bg-amber-50 text-[#D97706] border border-amber-200'
                    }`}
                  >
                    {entity.supervisorStatus}
                  </span>
                </div>

                {/* Entity Name & Sector */}
                <h2 className="font-bold text-sm text-[#09090B] leading-snug line-clamp-2">
                  {entity.name}
                </h2>
                <div className="mt-1 flex items-center space-x-1.5 text-xs text-[#71717A]">
                  <span>{entity.sector}</span>
                  <span className="text-[#E4E4E7]">•</span>
                  <span className="font-medium text-[#4F46E5]">{entity.criticalityTier}</span>
                </div>

                {/* Technical Parameters */}
                <div className="mt-4 p-3 bg-[#FAFAFA] rounded-xl border border-[#E4E4E7] space-y-2 text-xs">
                  <div className="flex justify-between items-center text-[#27272A]">
                    <span className="text-[#71717A]">SOC Model:</span>
                    <span className="font-semibold text-[#09090B]">{entity.socType}</span>
                  </div>
                  <div className="flex justify-between items-center text-[#27272A]">
                    <span className="text-[#71717A]">SIEM Tech:</span>
                    <span className="font-mono text-[#09090B]">{entity.siemPlatform}</span>
                  </div>
                  <div className="flex justify-between items-center text-[#27272A]">
                    <span className="text-[#71717A]">Daily Volume:</span>
                    <span className="font-mono font-bold text-[#4F46E5]">
                      {(entity.dailyAlertVolume / 1000).toFixed(1)}k alerts/day
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[#27272A]">
                    <span className="text-[#71717A]">Last Audited:</span>
                    <span className="text-[#71717A]">{entity.lastAuditDate}</span>
                  </div>
                </div>

                {/* Signals Counter Cards */}
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="bg-orange-50/60 p-2.5 rounded-xl border border-orange-200 text-center">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#EA580C] block">
                      Execution Signals
                    </span>
                    <span className="text-lg font-bold font-mono text-[#EA580C]">
                      {entity.unreviewedSignals}
                    </span>
                  </div>
                  <div className="bg-indigo-50/60 p-2.5 rounded-xl border border-indigo-200 text-center">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#4F46E5] block">
                      Confirmed Concerns
                    </span>
                    <span className="text-lg font-bold font-mono text-[#09090B]">
                      {entity.confirmedConcerns}
                    </span>
                  </div>
                </div>

                {/* Nodal Officer Contact */}
                <div className="mt-4 pt-3 border-t border-[#E4E4E7] text-[11px] text-[#71717A] space-y-1">
                  <div className="flex items-center space-x-1.5 truncate">
                    <User className="w-3 h-3 text-[#4F46E5] shrink-0" />
                    <span className="truncate">{entity.nodalOfficer}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 truncate">
                    <MapPin className="w-3 h-3 text-[#71717A] shrink-0" />
                    <span className="truncate">{entity.location}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Card Action */}
              <div className="p-3 bg-[#FAFAFA] border-t border-[#E4E4E7] flex items-center justify-between">
                <button
                  onClick={() => {
                    onSelectCSEForFilter(entity.code);
                    onNavigateTab('findings');
                  }}
                  className="w-full py-2 bg-[#FFFFFF] hover:bg-[#F4F4F5] hover:text-[#4F46E5] text-[#27272A] text-xs font-semibold rounded-xl flex items-center justify-center space-x-2 transition border border-[#E4E4E7]"
                >
                  <span>View Findings for {entity.code}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#4F46E5]" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredEntities.length === 0 && (
        <div className="bg-[#FFFFFF] p-12 text-center rounded-xl border border-[#E4E4E7] text-[#71717A] space-y-2">
          <Building className="w-8 h-8 text-[#71717A] mx-auto" />
          <p className="text-sm font-medium">No Critical Sector Entities match the current filters.</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedSector('ALL');
              setSelectedStatus('ALL');
            }}
            className="text-xs text-[#4F46E5] font-bold underline"
          >
            Reset Filters
          </button>
        </div>
      )}

    </div>
  );
};
