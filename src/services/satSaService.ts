import {
  EntitySummary,
  Finding,
  NegativeSpaceItem,
  PeerBenchmarkMetric,
  EvidenceRecord,
  ReviewSampleItem,
  DataQualityRecord,
  EvidenceIntegrityBatch,
  AuditEvent,
  FindingStatus,
  CapabilityIndicator,
  ExecutionGapSignal,
  ReviewQueueItem
} from '../types/sat-sa';
import {
  ENTITIES,
  FINDINGS,
  NEGATIVE_SPACE_ITEMS,
  PEER_BENCHMARKS,
  EVIDENCE_RECORDS,
  REVIEW_SAMPLES,
  DATA_QUALITY_METRICS,
  DATA_QUALITY_RECORDS,
  INTEGRITY_BATCHES,
  AUDIT_EVENTS,
  DASHBOARD_TRENDS,
  CATEGORY_DISTRIBUTION,
  CAPABILITY_INDICATORS_CSE_ALPHA,
  EXECUTION_GAP_SIGNALS_CSE_ALPHA,
  REVIEW_QUEUE_ITEMS
} from '../data/mockSatSaData';

let liveFindings: Finding[] = [...FINDINGS];
let liveEntities: EntitySummary[] = [...ENTITIES];
let liveReviewSamples: ReviewSampleItem[] = [...REVIEW_SAMPLES];
let liveAuditEvents: AuditEvent[] = [...AUDIT_EVENTS];

export const ANALYSIS_STEPS = [
  'Data ingested across 5 CSE entities',
  'Data quality validated (94% confidence score)',
  'Local evidence ledger created with SHA-256 Merkle root',
  'Execution gaps analysed (rapid closure & low escalation)',
  'Negative space analysed (silent asset void detected)',
  'Peer benchmark completed against national baseline',
  'Findings generated (37 findings, 8 high priority)'
];

export const satSaService = {
  async getDashboardSummary() {
    const totalEntities = liveEntities.length;
    const totalRecords = liveEntities.reduce((acc, curr) => acc + curr.evidenceMetrics.rawEventsIngested, 0);
    const findingsRequiringReview = liveFindings.filter(f => f.status === 'New' || f.status === 'Under Review').length;
    const highPriorityCases = liveFindings.filter(f => f.priority === 'Critical').length;
    const dataQualityIssues = DATA_QUALITY_METRICS.rejectedErrors + DATA_QUALITY_METRICS.withWarnings;
    const integrityBatchesWithIssues = INTEGRITY_BATCHES.filter(b => b.verificationStatus === 'Merkle Node Divergence');
    const integrityStatus = integrityBatchesWithIssues.length === 0 ? 'All Valid' : `${integrityBatchesWithIssues.length} Anomaly Flagged`;

    return {
      totalEntities,
      totalRecords,
      findingsRequiringReview,
      highPriorityCases,
      dataQualityIssues,
      integrityStatus,
      integrityValidRate: '99.8%',
      integrityAnomaliesCount: integrityBatchesWithIssues.length,
      trends: DASHBOARD_TRENDS,
      categoryDistribution: CATEGORY_DISTRIBUTION,
      recentFindings: liveFindings.slice(0, 5),
      entitiesRequiringAttention: liveEntities.filter(e => e.criticalFindingCount > 0 || e.reviewStatus === 'Flagged for Escalation')
    };
  },

  async getEntities(): Promise<EntitySummary[]> {
    return [...liveEntities];
  },

  async getEntityById(id: string): Promise<EntitySummary | undefined> {
    return liveEntities.find(e => e.id === id || e.code === id);
  },

  async getFindings(): Promise<Finding[]> {
    return [...liveFindings];
  },

  async getFindingById(id: string): Promise<Finding | undefined> {
    return liveFindings.find(f => f.id === id);
  },

  async updateFindingStatus(findingId: string, status: FindingStatus, examinerNotes?: string): Promise<Finding> {
    const index = liveFindings.findIndex(f => f.id === findingId);
    if (index === -1) throw new Error(`Finding ${findingId} not found`);

    const updated = {
      ...liveFindings[index],
      status,
      examinerNotes: examinerNotes !== undefined ? examinerNotes : liveFindings[index].examinerNotes
    };

    liveFindings[index] = updated;

    const now = new Date();
    const formattedDate = `${now.toISOString().split('T')[0]} ${now.toTimeString().split(' ')[0]} IST`;
    const newAudit: AuditEvent = {
      id: `AUD-MUT-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: formattedDate,
      actor: 'R. Rao (Supervisory Desk)',
      actorRole: 'Senior Supervisory Examiner',
      eventType: 'Examiner Decision Recorded',
      targetRecord: `${updated.id} (${updated.title})`,
      entityCode: updated.entityCode,
      result: `Status marked as "${status}". Notes updated.`
    };
    liveAuditEvents = [newAudit, ...liveAuditEvents];

    return updated;
  },

  async getNegativeSpaceItems(): Promise<NegativeSpaceItem[]> {
    return [...NEGATIVE_SPACE_ITEMS];
  },

  async getPeerBenchmarks(): Promise<PeerBenchmarkMetric[]> {
    return [...PEER_BENCHMARKS];
  },

  async getEvidenceRecords(): Promise<EvidenceRecord[]> {
    return [...EVIDENCE_RECORDS];
  },

  async getEvidenceById(id: string): Promise<EvidenceRecord | undefined> {
    return EVIDENCE_RECORDS.find(e => e.id === id);
  },

  async getReviewSamples(): Promise<ReviewSampleItem[]> {
    return [...liveReviewSamples];
  },

  async toggleSampleAcceptance(sampleId: string): Promise<ReviewSampleItem> {
    const item = liveReviewSamples.find(s => s.id === sampleId);
    if (!item) throw new Error(`Sample ${sampleId} not found`);
    item.status = item.status === 'Examiner Accepted' ? 'Proposed Sample' : 'Examiner Accepted';
    return { ...item };
  },

  async getDataQualitySummary() {
    return {
      metrics: DATA_QUALITY_METRICS,
      records: [...DATA_QUALITY_RECORDS]
    };
  },

  async getIntegrityBatches(): Promise<EvidenceIntegrityBatch[]> {
    return [...INTEGRITY_BATCHES];
  },

  async getAuditEvents(): Promise<AuditEvent[]> {
    return [...liveAuditEvents];
  },

  async getCapabilityIndicators(entityId: string): Promise<CapabilityIndicator[]> {
    return [...CAPABILITY_INDICATORS_CSE_ALPHA];
  },

  async getExecutionGapSignals(entityId: string): Promise<ExecutionGapSignal[]> {
    return [...EXECUTION_GAP_SIGNALS_CSE_ALPHA];
  },

  async getReviewQueueItems(): Promise<ReviewQueueItem[]> {
    return [...REVIEW_QUEUE_ITEMS];
  },

  async runAnalysis(onStep?: (stepIndex: number, stepText: string) => void): Promise<{ success: boolean; message: string }> {
    for (let i = 0; i < ANALYSIS_STEPS.length; i++) {
      if (onStep) {
        onStep(i, ANALYSIS_STEPS[i]);
      }
      await new Promise(r => setTimeout(r, 650));
    }
    const now = new Date();
    const formatted = `${now.toISOString().split('T')[0]} ${now.toTimeString().split(' ')[0]} IST`;
    liveAuditEvents = [
      {
        id: `AUD-ANL-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: formatted,
        actor: 'Interactive Analysis Runner',
        actorRole: 'Examiner Initiated',
        eventType: 'Assessment Generated',
        targetRecord: 'Claim-vs-Reality Multi-Lens Pipeline',
        entityCode: 'ALL',
        result: 'Full analytical rerun completed: 37 findings, 8 high priority verified.'
      },
      ...liveAuditEvents
    ];
    return { success: true, message: 'Analysis complete across all lenses.' };
  }
};
