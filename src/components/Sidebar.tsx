import React from 'react';
import {
  LayoutDashboard,
  Building2,
  AlertTriangle,
  GitFork,
  Activity,
  SearchCode,
  FileCheck,
  FileSpreadsheet,
  History,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Scale
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  pendingReviewsCount: number;
  totalFindingsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isCollapsed,
  setIsCollapsed,
  pendingReviewsCount,
  totalFindingsCount
}) => {
  const navItems = [
    {
      id: 'overview',
      name: 'Overview',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'cses',
      name: 'CSE Assessments',
      icon: Building2,
      badge: '7 Entities'
    },
    {
      id: 'findings',
      name: 'Findings',
      icon: AlertTriangle,
      badge: pendingReviewsCount > 0 ? `${pendingReviewsCount} Pending` : `${totalFindingsCount}`
    },
    {
      id: 'gaps',
      name: 'Execution Gaps',
      icon: GitFork,
      badge: '6 Categories'
    },
    {
      id: 'alerts',
      name: 'Alert Analysis',
      icon: Activity,
      badge: null
    },
    {
      id: 'investigations',
      name: 'Investigation Analysis',
      icon: SearchCode,
      badge: '4 Cases'
    },
    {
      id: 'evidence',
      name: 'Evidence Repository',
      icon: FileCheck,
      badge: null
    },
    {
      id: 'reports',
      name: 'Assessment Reports',
      icon: FileSpreadsheet,
      badge: null
    },
    {
      id: 'audit',
      name: 'Audit Trail',
      icon: History,
      badge: null
    }
  ];

  return (
    <aside
      className={`bg-[#FFFFFF] border-r border-[#E4E4E7] flex flex-col justify-between transition-all duration-300 z-20 shrink-0 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div>
        {/* Sidebar Header toggle */}
        <div className="p-3.5 border-b border-[#E4E4E7] flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-2 text-xs font-semibold text-[#4F46E5] uppercase tracking-wider pl-2">
              <Scale className="w-3.5 h-3.5" />
              <span>Supervisory Desk</span>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg text-[#71717A] hover:text-[#09090B] hover:bg-[#F4F4F5] transition mx-auto"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                title={isCollapsed ? item.name : undefined}
                className={`w-full flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-colors group relative ${
                  isActive
                    ? 'bg-indigo-50 text-[#4F46E5] border-l-4 border-[#4F46E5] font-semibold'
                    : 'text-[#71717A] hover:bg-[#F4F4F5] hover:text-[#09090B]'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-[#4F46E5]' : 'text-[#71717A] group-hover:text-[#09090B]'
                  } ${!isCollapsed ? 'mr-3' : 'mx-auto'}`}
                />
                {!isCollapsed && (
                  <span className="flex-1 text-left truncate">{item.name}</span>
                )}
                {!isCollapsed && item.badge && (
                  <span
                    className={`ml-2 text-[10px] px-1.5 py-0.5 rounded-md font-mono font-medium ${
                      item.id === 'findings' && pendingReviewsCount > 0
                        ? 'bg-[#EA580C] text-white font-bold'
                        : 'bg-[#F4F4F5] text-[#71717A] border border-[#E4E4E7]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Human In The Loop Regulatory Notice at Bottom */}
      <div className="p-3 border-t border-[#E4E4E7]">
        {!isCollapsed ? (
          <div className="bg-[#F4F4F5] rounded-xl p-3 border border-[#E4E4E7] text-[11px] text-[#71717A] leading-relaxed">
            <div className="flex items-center space-x-1.5 text-[#059669] font-semibold mb-1">
              <ShieldAlert className="w-3.5 h-3.5 text-[#059669]" />
              <span>Human-in-the-Loop</span>
            </div>
            <p className="text-[#71717A] text-[11px]">
              SAT-SA surfaces execution-gap signals. The NCIIPC supervisor evaluates underlying evidence and records official determinations.
            </p>
          </div>
        ) : (
          <div className="flex justify-center" title="Human-in-the-loop Statutory Mandate">
            <ShieldAlert className="w-5 h-5 text-[#059669]" />
          </div>
        )}
      </div>
    </aside>
  );
};
