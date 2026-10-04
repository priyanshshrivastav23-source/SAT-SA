export type Priority = 'Critical' | 'High' | 'Medium' | 'Low';

export type AssessmentStatus = 'Pending Review' | 'Confirmed Concern' | 'Not a Concern' | 'Requires Information';

export type Sector = 'Power & Energy' | 'Banking & Finance' | 'Civil Aviation' | 'Railways & Transport' | 'Telecom & IT' | 'Petroleum & Gas' | 'Strategic & Defence';

export interface CSEEntity {
  id: string;
  code: string;
  name: string;
  sector: Sector;
  criticalityTier: 'Tier-1 (National Core)' | 'Tier-2 (Critical Sectoral)';
  socType: 'Internal SOC' | 'Managed MSSP' | 'Hybrid Centralized' | 'Internal SOC (Air-Gapped Telemetry)';
  siemPlatform: string;
  dailyAlertVolume: number;
  unreviewedSignals: number;
  confirmedConcerns: number;
  lastAuditDate: string;
  supervisorStatus: 'Action Required' | 'Under Investigation' | 'Compliant' | 'Pending Evidence';
  location: string;
  nodalOfficer: string;
}

export interface Finding {
  id: string;
  cseId: string;
  cseCode: string;
  cseName: string;
  sector: Sector;
  title: string;
  category: 'Alert Triage Stagnation' | 'Premature False-Positive Disposal' | 'Log Ingestion Blindspot' | 'Detection Rule Deactivation' | 'Escalation Protocol Divergence' | 'Off-Hours Unmonitored Interval';
  priority: Priority;
  signalScore: number; // 0-100 system observation score
  detectedAt: string;
  ruleId: string;
  description: string;
  systemObservation: string;
  potentialImpact: string;
  evidenceCount: number;
  status: AssessmentStatus;
  supervisorRemarks?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  evidenceIds: string[];
}

export interface ExecutionGapCategory {
  id: string;
  name: string;
  severity: Priority;
  description: string;
  detectedInstances: number;
  affectedEntities: number;
  avgResolutionDelayHours: number;
  regulatoryStandard: string;
  trend: 'increasing' | 'stable' | 'decreasing';
}

export interface AlertMetric {
  id: string;
  cseCode: string;
  alertName: string;
  sourceSystem: string;
  totalGenerated: number;
  autoSuppressed: number;
  triagedWithinSLA: number;
  triagedPastSLA: number;
  prematurelyClosed: number;
  escalatedToL2: number;
  avgTriageTimeMinutes: number;
  anomalyFlag: boolean;
}

export interface InvestigationCase {
  id: string;
  cseCode: string;
  cseName: string;
  title: string;
  incidentType: string;
  assignedAnalyst: string;
  initialAlertTime: string;
  analystPickupTime: string;
  containmentTime: string;
  totalDurationHours: number;
  nciipcThresholdHours: number;
  delayReason: 'SIEM Log Incompleteness' | 'Missing EDR Agent Telemetry' | 'Off-Hours Staffing Deficit' | 'Delayed L2 Escalation Hand-off' | 'Third-Party MSSP Routing Latency';
  evidenceIds: string[];
  supervisorStatus: AssessmentStatus;
  supervisorNotes?: string;
}

export interface EvidenceItem {
  id: string;
  findingId?: string;
  cseCode: string;
  artifactType: 'PCAP Flow Sample' | 'SIEM Query Log' | 'SOC Analyst Shift Log' | 'Rule Configuration Diff' | 'Firewall Syslog Extract' | 'EDR Agent Heartbeat Dump';
  timestamp: string;
  sha256Checksum: string;
  summary: string;
  rawPayloadSnippet: string;
  sourceIp?: string;
  targetAsset?: string;
  flaggedAnomalyReason: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  supervisorId: string;
  supervisorName: string;
  action: 'Assessed Finding' | 'Overrode Assessment' | 'Requested Clarification' | 'Exported Sector Report' | 'Initiated CSE Review' | 'Flagged Critical Evidence';
  targetType: 'Finding' | 'CSE Entity' | 'Investigation Case' | 'Sector Report';
  targetId: string;
  entityCode: string;
  statusAssigned?: AssessmentStatus;
  comments: string;
}

export interface FilterState {
  searchQuery: string;
  selectedSector: string;
  selectedPriority: string;
  selectedStatus: string;
  selectedCSE: string;
}
