import React, { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { SupervisorDrawer } from './components/SupervisorDrawer';
import { OverviewTab } from './components/tabs/OverviewTab';
import { CSEAssessmentsTab } from './components/tabs/CSEAssessmentsTab';
import { FindingsTab } from './components/tabs/FindingsTab';
import { ExecutionGapsTab } from './components/tabs/ExecutionGapsTab';
import { AlertAnalysisTab } from './components/tabs/AlertAnalysisTab';
import { InvestigationAnalysisTab } from './components/tabs/InvestigationAnalysisTab';
import { EvidenceTab } from './components/tabs/EvidenceTab';
import { AssessmentReportsTab } from './components/tabs/AssessmentReportsTab';
import { AuditTrailTab } from './components/tabs/AuditTrailTab';

import {
  INITIAL_CSE_ENTITIES,
  INITIAL_FINDINGS,
  INITIAL_EVIDENCE_ITEMS,
  INITIAL_AUDIT_TRAIL
} from './data/mockData';
import { Finding, CSEEntity, EvidenceItem, AuditLogEntry, FilterState, AssessmentStatus } from './types';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  // Core Data State
  const [entities, setEntities] = useState<CSEEntity[]>(INITIAL_CSE_ENTITIES);
  const [findings, setFindings] = useState<Finding[]>(INITIAL_FINDINGS);
  const [evidenceItems, setEvidenceItems] = useState<EvidenceItem[]>(INITIAL_EVIDENCE_ITEMS);
  const [auditTrail, setAuditTrail] = useState<AuditLogEntry[]>(INITIAL_AUDIT_TRAIL);

  // Global Filters
  const [filterState, setFilterState] = useState<FilterState>({
    searchQuery: '',
    selectedSector: 'ALL',
    selectedPriority: 'ALL',
    selectedStatus: 'ALL',
    selectedCSE: 'ALL'
  });

  // Drawer State
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string | null>(null);

  // Handler: Open Supervisor Drawer for a finding
  const handleSelectFinding = (finding: Finding) => {
    setSelectedFinding(finding);
    setIsDrawerOpen(true);
  };

  // Handler: Save Supervisor Assessment (Human-in-the-Loop determination)
  const handleSaveAssessment = (
    findingId: string,
    status: AssessmentStatus,
    remarks: string,
    reviewer: string
  ) => {
    const now = new Date();
    const formattedTimestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')} IST`;

    // 1. Update Finding state
    let targetFinding: Finding | undefined;
    setFindings(prevFindings =>
      prevFindings.map(f => {
        if (f.id === findingId) {
          targetFinding = f;
          return {
            ...f,
            status,
            supervisorRemarks: remarks,
            reviewedBy: reviewer,
            reviewedAt: formattedTimestamp
          };
        }
        return f;
      })
    );

    // 2. Update entity counts if status changed
    if (targetFinding) {
      const cseCode = targetFinding.cseCode;
      setEntities(prevEntities =>
        prevEntities.map(ent => {
          if (ent.code === cseCode) {
            const confirmedDelta = status === 'Confirmed Concern' ? 1 : 0;
            return {
              ...ent,
              unreviewedSignals: Math.max(0, ent.unreviewedSignals - 1),
              confirmedConcerns: ent.confirmedConcerns + confirmedDelta,
              supervisorStatus: status === 'Confirmed Concern' ? 'Action Required' : ent.supervisorStatus
            };
          }
          return ent;
        })
      );

      // 3. Create Audit Trail Entry
      const newAuditEntry: AuditLogEntry = {
        id: `AUD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: formattedTimestamp,
        supervisorId: 'SUPV-NCIIPC-409',
        supervisorName: reviewer,
        action: 'Assessed Finding',
        targetType: 'Finding',
        targetId: findingId,
        entityCode: cseCode,
        statusAssigned: status,
        comments: remarks
      };
      setAuditTrail(prev => [newAuditEntry, ...prev]);
    }
  };

  // Navigation shortcuts
  const handleSelectCSEForFilter = (cseCode: string) => {
    setFilterState(prev => ({ ...prev, selectedCSE: cseCode }));
    setActiveTab('findings');
  };

  const handleSelectEvidenceById = (evidenceId: string) => {
    setSelectedEvidenceId(evidenceId);
    setActiveTab('evidence');
  };

  const handleOpenFindingByEvidence = (findingId: string) => {
    const match = findings.find(f => f.id === findingId);
    if (match) {
      setSelectedFinding(match);
      setIsDrawerOpen(true);
    }
  };

  const pendingReviewsCount = findings.filter(f => f.status === 'Pending Review').length;

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#09090B] flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Header */}
      <Header
        filterState={filterState}
        setFilterState={setFilterState}
        pendingReviewsCount={pendingReviewsCount}
        onNavigateTab={(tab) => setActiveTab(tab)}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Persistent Collapsible Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => setActiveTab(tab)}
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
          pendingReviewsCount={pendingReviewsCount}
          totalFindingsCount={findings.length}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-[#FAFAFA]">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'overview' && (
              <OverviewTab
                findings={findings}
                entities={entities}
                onSelectFinding={handleSelectFinding}
                onNavigateTab={(tab) => setActiveTab(tab)}
              />
            )}

            {activeTab === 'cses' && (
              <CSEAssessmentsTab
                entities={entities}
                onSelectCSEForFilter={handleSelectCSEForFilter}
                onNavigateTab={(tab) => setActiveTab(tab)}
              />
            )}

            {activeTab === 'findings' && (
              <FindingsTab
                findings={findings}
                filterState={filterState}
                setFilterState={setFilterState}
                onSelectFinding={handleSelectFinding}
              />
            )}

            {activeTab === 'gaps' && (
              <ExecutionGapsTab
                onNavigateTab={(tab) => setActiveTab(tab)}
              />
            )}

            {activeTab === 'alerts' && (
              <AlertAnalysisTab />
            )}

            {activeTab === 'investigations' && (
              <InvestigationAnalysisTab
                onSelectEvidenceById={handleSelectEvidenceById}
                onNavigateTab={(tab) => setActiveTab(tab)}
              />
            )}

            {activeTab === 'evidence' && (
              <EvidenceTab
                evidenceItems={evidenceItems}
                findings={findings}
                onOpenFindingByEvidence={handleOpenFindingByEvidence}
                selectedEvidenceId={selectedEvidenceId}
              />
            )}

            {activeTab === 'reports' && (
              <AssessmentReportsTab
                findings={findings}
                entities={entities}
              />
            )}

            {activeTab === 'audit' && (
              <AuditTrailTab
                auditLogs={auditTrail}
              />
            )}
          </div>
        </main>
      </div>

      {/* Slide-over Supervisor Assessment Drawer */}
      <SupervisorDrawer
        finding={selectedFinding}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        evidenceItems={evidenceItems}
        onSaveAssessment={handleSaveAssessment}
      />
    </div>
  );
}

export default App;
