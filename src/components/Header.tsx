import React from 'react';
import { Shield, Search, UserCheck, Bell, Award } from 'lucide-react';
import { FilterState } from '../types';

interface HeaderProps {
  filterState: FilterState;
  setFilterState: React.Dispatch<React.SetStateAction<FilterState>>;
  pendingReviewsCount: number;
  onNavigateTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  filterState,
  setFilterState,
  pendingReviewsCount,
  onNavigateTab
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#FFFFFF] text-[#09090B] border-b border-[#E4E4E7]">
      {/* Top Government Official Header Bar */}
      <div className="px-6 py-2 bg-[#F4F4F5] border-b border-[#E4E4E7] flex items-center justify-between text-xs tracking-wider font-mono">
        <div className="flex items-center space-x-3 text-[#71717A]">
          <span className="font-semibold text-[#0F172A]">GOVERNMENT OF INDIA</span>
          <span className="text-[#E4E4E7]">|</span>
          <span className="text-[#27272A] font-medium">NATIONAL CRITICAL INFORMATION INFRASTRUCTURE PROTECTION CENTRE (NCIIPC)</span>
          <span className="hidden md:inline text-[#E4E4E7]">|</span>
          <span className="hidden md:inline text-[#71717A]">NTRO CYBER SUPERVISORY WING</span>
        </div>
        <div className="flex items-center space-x-4 text-[#27272A]">
          <span className="flex items-center space-x-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-[#059669] animate-pulse"></span>
            <span className="text-[#059669] font-medium">SEC-70A IT ACT STATUTORY OVERSIGHT</span>
          </span>
          <span className="hidden lg:inline text-[#EA580C] font-semibold">HUMAN-IN-THE-LOOP MANDATE ACTIVE</span>
        </div>
      </div>

      {/* Main Bar */}
      <div className="px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigateTab('overview')}>
          <div className="w-10 h-10 rounded-xl bg-[#F4F4F5] border border-[#E4E4E7] flex items-center justify-center">
            <Shield className="w-5 h-5 text-[#4F46E5]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg text-[#09090B] tracking-tight">SAT-SA</span>
              <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-md bg-indigo-50 text-[#4F46E5] border border-indigo-200">
                v2.6 SIH26157
              </span>
            </div>
            <p className="text-xs text-[#71717A] font-medium">
              Supervisory Analytics Tool for SOC Assessment
            </p>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-xl mx-4 relative hidden sm:block">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 transform -translate-y-1/2 text-[#71717A]" />
          <input
            type="text"
            placeholder="Search across CSEs (CSE-17, SOC-04), signal rules, alert types, evidence..."
            value={filterState.searchQuery}
            onChange={(e) => setFilterState(prev => ({ ...prev, searchQuery: e.target.value }))}
            className="w-full bg-[#FFFFFF] border border-[#E4E4E7] rounded-xl pl-9 pr-4 py-2 text-sm text-[#09090B] placeholder-[#71717A] focus:outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] transition-all"
          />
          {filterState.searchQuery && (
            <button
              onClick={() => setFilterState(prev => ({ ...prev, searchQuery: '' }))}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-[#71717A] hover:text-[#09090B]"
            >
              Clear
            </button>
          )}
        </div>

        {/* Supervisor Profile & Action Badges */}
        <div className="flex items-center space-x-3">
          {/* Pending Reviews Pill Button */}
          <button
            onClick={() => {
              setFilterState(prev => ({ ...prev, selectedStatus: 'Pending Review' }));
              onNavigateTab('findings');
            }}
            title="View pending supervisory reviews"
            className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#FAFAFA] hover:bg-[#F4F4F5] border border-amber-300 text-[#D97706] text-xs font-semibold transition"
          >
            <Bell className="w-3.5 h-3.5 text-[#D97706]" />
            <span>Pending Reviews</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full bg-[#EA580C] text-white font-bold text-[11px]">
              {pendingReviewsCount}
            </span>
          </button>

          {/* Supervisor Card */}
          <div className="flex items-center space-x-2.5 pl-3 border-l border-[#E4E4E7]">
            <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#059669]">
              <UserCheck className="w-4 h-4 text-[#059669]" />
            </div>
            <div className="hidden md:block text-left text-xs">
              <div className="font-semibold text-[#09090B] flex items-center space-x-1">
                <span>R. Rao, Dy. Director</span>
                <Award className="w-3 h-3 text-[#D97706] inline" />
              </div>
              <div className="text-[11px] text-[#71717A]">
                NCIIPC Supervisory Desk (ID: 409)
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
