'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  AlertTriangle,
  Radar,
  BarChart3,
  FileCheck2,
  ClipboardList,
  Database,
  ShieldCheck,
  History,
  Search,
  ChevronLeft,
  ChevronRight,
  Shield,
  UserCheck,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavGroup {
  groupName: string;
  items: {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }[];
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('Q3 2026 (Jul - Sep)');

  const navGroups: NavGroup[] = [
    {
      groupName: 'Overview',
      items: [
        { name: 'Dashboard', href: '/', icon: LayoutDashboard }
      ]
    },
    {
      groupName: 'Assessment',
      items: [
        { name: 'Entities', href: '/entities', icon: Building2 },
        { name: 'Findings', href: '/findings', icon: AlertTriangle, badge: '7' },
        { name: 'Negative Space Radar', href: '/negative-space', icon: Radar },
        { name: 'Peer Benchmark', href: '/benchmarks', icon: BarChart3 }
      ]
    },
    {
      groupName: 'Investigation',
      items: [
        { name: 'Evidence Explorer', href: '/evidence', icon: FileCheck2 },
        { name: 'Review Planner', href: '/review-planner', icon: ClipboardList, badge: '5' }
      ]
    },
    {
      groupName: 'Governance',
      items: [
        { name: 'Data Quality', href: '/data-quality', icon: Database },
        { name: 'Evidence Integrity', href: '/integrity', icon: ShieldCheck },
        { name: 'Audit View', href: '/audit', icon: History }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-warm-50 text-warm-900 flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* Top Banner: Statutory Oversight Bar */}
      <div className="bg-warm-100 border-b border-warm-200 px-6 py-1.5 flex items-center justify-between text-xs tracking-wider font-mono">
        <div className="flex items-center space-x-3 text-warm-500">
          <span className="font-semibold text-warm-900">GOVERNMENT OF INDIA</span>
          <span>|</span>
          <span className="font-medium text-warm-700">NCIIPC CYBER SUPERVISORY DESK</span>
          <span className="hidden md:inline">|</span>
          <span className="hidden md:inline text-warm-500">SECTION 70A IT ACT</span>
        </div>
        <div className="flex items-center space-x-3">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
            Supervisory Ingestion Active
          </span>
          <span className="text-[10px] text-warm-500 font-mono bg-warm-200/60 px-2 py-0.5 rounded">
            SYNTHETIC DEMO DATA
          </span>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header className="sticky top-0 z-30 bg-warm-50/95 backdrop-blur-md border-b border-warm-200 px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Logo & Platform Name */}
        <Link href="/" className="flex items-center space-x-3 group cursor-pointer">
          <div className="w-9 h-9 rounded-xl bg-warm-900 text-warm-50 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform duration-150">
            <Shield className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg text-warm-900 tracking-tight font-serif">SAT-SA</span>
              <span className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider rounded-md bg-warm-200 text-warm-800 border border-warm-300/80">
                Supervisory Core
              </span>
            </div>
            <p className="text-[11px] text-warm-500 font-medium hidden sm:block">
              Supervisory Analytics Tool for SOC Assessment
            </p>
          </div>
        </Link>

        {/* Global Search and Context Filters */}
        <div className="flex-1 max-w-lg mx-4 relative hidden md:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-warm-400" />
          <input
            type="text"
            placeholder="Search entities (CSE-17), finding IDs, evidence hashes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-warm-100/90 border border-warm-200/90 rounded-xl pl-9 pr-12 py-1.5 text-xs text-warm-900 placeholder-warm-400 focus:outline-none focus:ring-1 focus:ring-warm-400 focus:border-warm-400 focus:bg-white transition-all shadow-xs"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 font-mono text-[10px] text-warm-400 bg-warm-200/80 px-1.5 py-0.5 rounded border border-warm-300/60 pointer-events-none">
            ⌘K
          </kbd>
        </div>

        {/* Period Selector & Examiner Profile */}
        <div className="flex items-center space-x-3 shrink-0">
          <div className="relative">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="bg-warm-100/90 border border-warm-200 rounded-xl px-2.5 py-1.5 text-xs text-warm-800 font-medium focus:outline-none focus:ring-1 focus:ring-warm-400 focus:border-warm-400 transition cursor-pointer"
            >
              <option value="Q3 2026 (Jul - Sep)">Period: Q3 2026 (Jul - Sep)</option>
              <option value="Q2 2026 (Apr - Jun)">Period: Q2 2026 (Apr - Jun)</option>
              <option value="Q1 2026 (Jan - Mar)">Period: Q1 2026 (Jan - Mar)</option>
            </select>
          </div>

          {/* Examiner Profile Card */}
          <div className="flex items-center space-x-2.5 pl-3 border-l border-warm-200/80">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-warm-200 text-warm-800 border border-warm-300 flex items-center justify-center font-bold text-xs shadow-xs">
                <UserCheck className="w-4 h-4 text-emerald-800" />
              </div>
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-white"></span>
            </div>
            <div className="hidden lg:block text-left text-xs">
              <div className="font-semibold text-warm-900 leading-tight">R. Rao, Dy. Director</div>
              <div className="text-[10px] text-warm-500 font-mono">NCIIPC-409 • Lead Examiner</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Body: Sidebar + Dynamic Route Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Navigation Sidebar */}
        <aside
          className={cn(
            "bg-warm-50 border-r border-warm-200 flex flex-col justify-between transition-all duration-200 shrink-0 z-20",
            isCollapsed ? "w-16" : "w-60"
          )}
        >
          <div className="overflow-y-auto py-3">
            {/* Collapse / Expand Toggle */}
            <div className="px-3 pb-2 mb-2 border-b border-warm-200 flex items-center justify-between">
              {!isCollapsed && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-warm-400 px-2">
                  Navigation
                </span>
              )}
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-1 rounded-lg text-warm-400 hover:text-warm-800 hover:bg-warm-100 transition mx-auto"
                title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
              >
                {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>
            </div>

            {/* Navigation Groups */}
            <nav className="space-y-4 px-2">
              {navGroups.map((group) => (
                <div key={group.groupName}>
                  {!isCollapsed && (
                    <div className="px-2.5 mb-1 text-[10px] font-bold uppercase tracking-wider text-warm-400">
                      {group.groupName}
                    </div>
                  )}
                  <div className="space-y-0.5">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          title={isCollapsed ? item.name : undefined}
                          className={cn(
                            "flex items-center px-2.5 py-1.5 rounded-xl text-xs font-medium transition-colors group relative",
                            isActive
                              ? "bg-warm-200/80 text-warm-900 font-semibold border-l-2 border-emerald-600 pl-2"
                              : "text-warm-600 hover:bg-warm-100 hover:text-warm-900"
                          )}
                        >
                          <Icon
                            className={cn(
                              "w-4 h-4 shrink-0 transition-colors",
                              isActive ? "text-emerald-700" : "text-warm-400 group-hover:text-warm-700",
                              !isCollapsed ? "mr-2.5" : "mx-auto"
                            )}
                          />
                          {!isCollapsed && (
                            <span className="flex-1 truncate">{item.name}</span>
                          )}
                          {!isCollapsed && item.badge && (
                            <span className="ml-2 text-[10px] px-1.5 py-0.2 rounded-full font-mono bg-warm-200 text-warm-700">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>
          </div>

          {/* Footer Operational Status */}
          <div className="p-3 border-t border-warm-200">
            {!isCollapsed ? (
              <div className="p-2.5 bg-warm-100 rounded-xl border border-warm-200 text-xs">
                <div className="flex items-center justify-between text-warm-700 font-medium">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="text-[11px]">SOC Telemetry Active</span>
                  </div>
                  <span className="font-mono text-[10px] text-warm-400">Q3</span>
                </div>
                <p className="text-[10px] text-warm-500 mt-1 leading-snug">
                  Section 70A IT Act Oversight Desk
                </p>
              </div>
            ) : (
              <div className="flex justify-center" title="SOC Telemetry Active">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>
            )}
          </div>
        </aside>

        {/* Content Workspace */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-warm-50">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
