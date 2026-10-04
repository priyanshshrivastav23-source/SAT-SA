export type FindingCategory =
  | 'Execution Gap'
  | 'Negative Space'
  | 'Peer & Anomaly'
  | 'Goodhart Lens'
  | 'Data Quality'
  | 'Evidence Integrity';

export type FindingPriority = 'Critical' | 'High' | 'Medium' | 'Low';

export type FindingStatus =
  | 'New'
  | 'Under Review'
  | 'Confirmed for Follow-up'
  | 'Rejected'
  | 'Resolved';

export type ReviewStatus = 'Pending Review' | 'In Assessment' | 'Completed' | 'Flagged for Escalation';

export type Sector =
  | 'Power & Energy'
  | 'Banking & Finance'
  | 'Civil Aviation'
  | 'Railways & Transport'
  | 'Telecom & IT'
  | 'Petroleum & Gas'
  | 'Strategic & Defence';

export interface ReportedKPIs {
  mttdMinutes: number;
  mttrMinutes: number;
  dailyAlertVolume: number;
  closureRatePercent: number;
  falsePositiveRatePercent: number;
}

export interface SupportingEvidenceMetrics {
  rawEventsIngested: number;
  verifiedEvidenceCount: number;
  telemetryCompletenessPercent: number;
  discrepancyIndex: number; // 0-100 calculated deviation between reported & evidence
}

export interface EntitySummary {
  id: string;
  code: string;
  name: string;
  sector: Sector;
  tier: 'Tier-1 (National Core)' | 'Tier-2 (Critical Sectoral)';
  socType: string;
  siemPlatform: string;
  lastPeriod: string;
  reviewStatus: ReviewStatus;
  dataQualityScore: number; // 0-100
  reportedKpis: ReportedKPIs;
  evidenceMetrics: SupportingEvidenceMetrics;
  findingCount: number;
  criticalFindingCount: number;
  negativeSpaceScore: number; // 0-100 indicator of potential silence
  location: string;
  nodalOfficer: string;
}

export interface Finding {
  id: string;
  title: string;
  category: FindingCategory;
  priority: FindingPriority;
  entityId: string;
  entityCode: string;
  entityName: string;
  sector: Sector;
  detectionDate: string;
  explanation: string;
  patternSummary: string;
  whyFlagged: string;
  supportingEvidenceCount: number;
  evidenceIds: string[];
  relevantKpiComparison: {
    reportedValue: string;
    observedValue: string;
    varianceLabel: string;
  };
  peerContext?: {
    peerAvg: string;
    deviationPercent: string;
    contextNote: string;
  };
  evidenceStrength: 'Strong' | 'Moderate' | 'Preliminary';
  recommendedReviewSteps: string[];
  examinerNotes?: string;
  status: FindingStatus;
  auditEvents: string[];
}

export interface NegativeSpaceItem {
  id: string;
  assetId: string;
  assetName: string;
  entityCode: string;
  entityName: string;
  sector: Sector;
  criticality: 'Crown Jewel Asset' | 'Core Industrial Gateway' | 'Production Switch' | 'Telemetry Ingest Node';
  silencePeriodHours: number;
  expectedAlertsPerDay: number;
  observedAlertsPeriod: number;
  anomalyType: 'Unexplained Telemetry Silence' | 'Missing Alert Category' | 'Off-Hours Activity Cliff' | 'Log Ingestion Gap';
  confirmationStatus: 'Confirmed Ingestion Failure' | 'Unexplained Low Activity' | 'Under Investigation';
  lastHeartbeat: string;
  potentialRootCause: string;
}

export interface PeerBenchmarkMetric {
  metricId: string;
  name: string;
  unit: string;
  description: string;
  sectorAvg: number;
  peerRangeMin: number;
  peerRangeMax: number;
  entitiesData: {
    entityCode: string;
    entityName: string;
    value: number;
    percentile: number;
    flagAnomaly: boolean;
    anomalyNote?: string;
  }[];
}

export interface EvidenceRecord {
  id: string;
  entityCode: string;
  entityName: string;
  recordType:
    | 'Alert Telemetry Sample'
    | 'Case Closure Log'
    | 'Analyst Shift Record'
    | 'Escalation Flow Dump'
    | 'Remediation Artifact'
    | 'Asset Heartbeat Dump'
    | 'SLA Verification Log';
  timestamp: string;
  sourceSystem: string;
  sha256Hash: string;
  integrityStatus: 'Verified Valid' | 'Pending Reference Check' | 'Hash Discrepancy';
  summary: string;
  rawPayloadSnippet: string;
  relatedFindingId?: string;
  targetAsset?: string;
  fileSizeBytes: number;
}

export interface ReviewSampleItem {
  id: string;
  targetType: 'Entity Deep-Dive' | 'Process Execution Audit' | 'Incident Timeline Inspection';
  targetIdentifier: string;
  entityCode: string;
  entityName: string;
  priorityScore: number; // 0-100
  reviewReason: string;
  relatedFindingsCount: number;
  diverseSampleRationale: string;
  assignedExaminer: string;
  status: 'Proposed Sample' | 'Examiner Accepted' | 'Audit Completed';
  samplingMethod: 'Risk-Weighted Discrepancy Sample' | 'Stratified Sector Representation' | 'High-Entropy Boundary Sample';
}

export interface DataQualityRecord {
  id: string;
  entityCode: string;
  timestamp: string;
  recordType: string;
  status: 'Clean' | 'Warning' | 'Rejected';
  issueType: 'Valid Schema' | 'Missing Non-Critical Field' | 'Invalid Timestamp Skew' | 'Duplicate Event Key' | 'Critical Schema Violation';
  details: string;
  originalPayloadSnippet: string;
}

export interface EvidenceIntegrityBatch {
  batchId: string;
  timestamp: string;
  entityCode: string;
  recordsCount: number;
  merkleRoot: string;
  verificationStatus: 'Verified Reference Match' | 'Merkle Node Divergence' | 'Integrity Verified';
  simulatedDisclaimer: string;
  mismatchCount: number;
  signatureAlgorithm: string;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  eventType:
    | 'Data Import'
    | 'Validation Completed'
    | 'Assessment Generated'
    | 'Finding Created'
    | 'Evidence Viewed'
    | 'Examiner Decision Recorded'
    | 'Review Sample Generated'
    | 'Integrity Verification Performed';
  targetRecord: string;
  entityCode: string;
  result: string;
}
