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
  CapabilityIndicator,
  ExecutionGapSignal,
  ReviewQueueItem
} from '../types/sat-sa';

export const CAPABILITY_INDICATORS_CSE_ALPHA: CapabilityIndicator[] = [
  { name: 'Threat Detection', score: 81, benchmarkAverage: 78, status: 'Healthy', description: 'Core correlation and signature coverage is operational across perimeter nodes.' },
  { name: 'Investigation', score: 58, benchmarkAverage: 76, status: 'Review Recommended', description: 'Unusually high note similarity (84% template match) and brief dwell duration (median 3 min).' },
  { name: 'Escalation', score: 52, benchmarkAverage: 74, status: 'Review Recommended', description: 'Escalation rate of 1.8% is significantly lower than peer baseline of 14.2%.' },
  { name: 'Incident Response', score: 64, benchmarkAverage: 75, status: 'Review Recommended', description: 'Critical alert containment claimed but downstream verification artifacts are sparse.' },
  { name: 'Security Operations', score: 76, benchmarkAverage: 79, status: 'Healthy', description: '24/7 continuous shift staffing and raw ingestion throughput meet standard criteria.' },
  { name: 'Governance & Oversight', score: 79, benchmarkAverage: 80, status: 'Healthy', description: 'Quarterly compliance and executive review attestations submitted on schedule.' },
  { name: 'Operational Discipline', score: 61, benchmarkAverage: 77, status: 'Review Recommended', description: 'Batch closures clustered near shift boundaries indicate quota-clearing patterns.' },
  { name: 'Cyber Resilience', score: 74, benchmarkAverage: 75, status: 'Healthy', description: 'Secondary backup pipelines and redundant monitoring nodes active.' }
];

export const EXECUTION_GAP_SIGNALS_CSE_ALPHA: ExecutionGapSignal[] = [
  {
    signal: 'Fast High-Severity Closure',
    description: 'Critical cases are being closed much faster than peer baseline.',
    observedValue: '3 min median',
    peerBaseline: '47 min median',
    difference: '-93.6%',
    confidence: 91,
    evidenceCount: 184
  },
  {
    signal: 'Critical Without Escalation',
    description: 'Critical alerts reached closure without expected escalation evidence.',
    observedValue: '1.2% escalated',
    peerBaseline: '14.8% escalated',
    difference: '-91.9%',
    confidence: 93,
    evidenceCount: 92
  },
  {
    signal: 'Shallow Investigation',
    description: 'Investigation records exist but show limited operational activity.',
    observedValue: '48 chars/note',
    peerBaseline: '420 chars/note',
    difference: '-88.6%',
    confidence: 89,
    evidenceCount: 114
  },
  {
    signal: 'Recurrence Without Remediation',
    description: 'Repeated alerts exist without corresponding remediation evidence.',
    observedValue: '68% recurrence',
    peerBaseline: '12% recurrence',
    difference: '+466.0%',
    confidence: 87,
    evidenceCount: 64
  },
  {
    signal: 'Template-Driven Investigation',
    description: 'Investigation notes show unusually high similarity across disparate cases.',
    observedValue: '84% template match',
    peerBaseline: '18% template match',
    difference: '+366.7%',
    confidence: 92,
    evidenceCount: 156
  },
  {
    signal: 'Alert-to-Action Dead End',
    description: 'Expected downstream workflow activity (ticketing, containment, patching) is missing.',
    observedValue: '71% dead-end rate',
    peerBaseline: '9% dead-end rate',
    difference: '+688.9%',
    confidence: 90,
    evidenceCount: 88
  }
];

export const ENTITIES: EntitySummary[] = [
  {
    id: 'cse-alpha',
    code: 'CSE Alpha',
    name: 'CSE Alpha (Primary Demonstration Entity)',
    sector: 'Banking & Finance',
    tier: 'Tier-1 (National Core)',
    socType: 'Hybrid Centralized SOC',
    siemPlatform: 'Splunk Cloud ES v9.2',
    lastPeriod: 'Q3 2026',
    reviewStatus: 'Flagged for Escalation',
    dataQualityScore: 94,
    reportedKpis: {
      mttdMinutes: 8,
      mttrMinutes: 3,
      dailyAlertVolume: 4210,
      closureRatePercent: 99.0,
      falsePositiveRatePercent: 92.4
    },
    evidenceMetrics: {
      rawEventsIngested: 48200,
      verifiedEvidenceCount: 18,
      telemetryCompletenessPercent: 78.5,
      discrepancyIndex: 74
    },
    findingCount: 14,
    criticalFindingCount: 4,
    negativeSpaceScore: 78,
    location: 'New Delhi, India',
    nodalOfficer: 'Shri A. K. Sharma (CISO)'
  },
  {
    id: 'cse-beta',
    code: 'CSE Beta',
    name: 'CSE Beta (Power Grid Operations)',
    sector: 'Power & Energy',
    tier: 'Tier-1 (National Core)',
    socType: 'Internal 24/7 SOC',
    siemPlatform: 'IBM QRadar v7.5',
    lastPeriod: 'Q3 2026',
    reviewStatus: 'In Assessment',
    dataQualityScore: 91,
    reportedKpis: {
      mttdMinutes: 14,
      mttrMinutes: 42,
      dailyAlertVolume: 3100,
      closureRatePercent: 97.4,
      falsePositiveRatePercent: 89.2
    },
    evidenceMetrics: {
      rawEventsIngested: 28400,
      verifiedEvidenceCount: 9,
      telemetryCompletenessPercent: 91.0,
      discrepancyIndex: 38
    },
    findingCount: 8,
    criticalFindingCount: 1,
    negativeSpaceScore: 32,
    location: 'Mumbai, Maharashtra',
    nodalOfficer: 'Dr. S. Nair (Head of SecOps)'
  },
  {
    id: 'cse-gamma',
    code: 'CSE Gamma',
    name: 'CSE Gamma (Civil Aviation Radar Feed)',
    sector: 'Civil Aviation',
    tier: 'Tier-1 (National Core)',
    socType: 'Air-Gapped SOC',
    siemPlatform: 'Elastic Security v8.14',
    lastPeriod: 'Q3 2026',
    reviewStatus: 'Pending Review',
    dataQualityScore: 96,
    reportedKpis: {
      mttdMinutes: 18,
      mttrMinutes: 48,
      dailyAlertVolume: 1950,
      closureRatePercent: 96.8,
      falsePositiveRatePercent: 87.5
    },
    evidenceMetrics: {
      rawEventsIngested: 19800,
      verifiedEvidenceCount: 6,
      telemetryCompletenessPercent: 88.5,
      discrepancyIndex: 26
    },
    findingCount: 6,
    criticalFindingCount: 1,
    negativeSpaceScore: 41,
    location: 'Bengaluru, Karnataka',
    nodalOfficer: 'Capt. R. Deshmukh (Director, Cybersecurity)'
  },
  {
    id: 'cse-delta',
    code: 'CSE Delta',
    name: 'CSE Delta (Telecom Core Gateway)',
    sector: 'Telecom & IT',
    tier: 'Tier-2 (Critical Sectoral)',
    socType: 'Managed MSSP SOC',
    siemPlatform: 'Microsoft Sentinel',
    lastPeriod: 'Q3 2026',
    reviewStatus: 'In Assessment',
    dataQualityScore: 82,
    reportedKpis: {
      mttdMinutes: 22,
      mttrMinutes: 65,
      dailyAlertVolume: 2200,
      closureRatePercent: 94.2,
      falsePositiveRatePercent: 85.0
    },
    evidenceMetrics: {
      rawEventsIngested: 16400,
      verifiedEvidenceCount: 5,
      telemetryCompletenessPercent: 68.0,
      discrepancyIndex: 58
    },
    findingCount: 6,
    criticalFindingCount: 1,
    negativeSpaceScore: 65,
    location: 'Hyderabad, Telangana',
    nodalOfficer: 'Smt. P. Verma (CISO)'
  },
  {
    id: 'cse-epsilon',
    code: 'CSE Epsilon',
    name: 'CSE Epsilon (Sovereign Infrastructure)',
    sector: 'Strategic & Defence',
    tier: 'Tier-1 (National Core)',
    socType: 'Air-Gapped Sovereign SOC',
    siemPlatform: 'Custom In-House SIEM',
    lastPeriod: 'Q3 2026',
    reviewStatus: 'Completed',
    dataQualityScore: 98,
    reportedKpis: {
      mttdMinutes: 12,
      mttrMinutes: 44,
      dailyAlertVolume: 1420,
      closureRatePercent: 98.1,
      falsePositiveRatePercent: 89.0
    },
    evidenceMetrics: {
      rawEventsIngested: 12630,
      verifiedEvidenceCount: 4,
      telemetryCompletenessPercent: 98.2,
      discrepancyIndex: 12
    },
    findingCount: 3,
    criticalFindingCount: 0,
    negativeSpaceScore: 14,
    location: 'Chandigarh, India',
    nodalOfficer: 'Col. V. Mehta (Retd.)'
  },
  {
    id: 'ent-2',
    code: 'SOC-04',
    name: 'National Unified Payments Switch (NPCI Core Switching)',
    sector: 'Banking & Finance',
    tier: 'Tier-1 (National Core)',
    socType: 'Hybrid Centralized SOC',
    siemPlatform: 'IBM QRadar Cloud v7.5',
    lastPeriod: 'Q3 2026',
    reviewStatus: 'In Assessment',
    dataQualityScore: 92,
    reportedKpis: {
      mttdMinutes: 8,
      mttrMinutes: 24,
      dailyAlertVolume: 89400,
      closureRatePercent: 99.1,
      falsePositiveRatePercent: 94.6
    },
    evidenceMetrics: {
      rawEventsIngested: 84500000,
      verifiedEvidenceCount: 11,
      telemetryCompletenessPercent: 88.2,
      discrepancyIndex: 44
    },
    findingCount: 4,
    criticalFindingCount: 1,
    negativeSpaceScore: 38,
    location: 'BKC, Mumbai, Maharashtra',
    nodalOfficer: 'Smt. Radhika Subramanian (Head of InfoSec)'
  },
  {
    id: 'ent-3',
    code: 'CAC-02',
    name: 'Air Traffic Flow Management & Radar Feed Network (AAI)',
    sector: 'Civil Aviation',
    tier: 'Tier-1 (National Core)',
    socType: 'Internal SOC (Air-Gapped Telemetry)',
    siemPlatform: 'Elastic Security Cluster v8.12',
    lastPeriod: 'Q3 2026',
    reviewStatus: 'Pending Review',
    dataQualityScore: 79,
    reportedKpis: {
      mttdMinutes: 19,
      mttrMinutes: 45,
      dailyAlertVolume: 18500,
      closureRatePercent: 97.2,
      falsePositiveRatePercent: 88.0
    },
    evidenceMetrics: {
      rawEventsIngested: 16100000,
      verifiedEvidenceCount: 5,
      telemetryCompletenessPercent: 82.0,
      discrepancyIndex: 59
    },
    findingCount: 3,
    criticalFindingCount: 1,
    negativeSpaceScore: 64,
    location: 'IGI Airport Operational Complex, New Delhi',
    nodalOfficer: 'Wg Cdr (Retd.) Prakash Nambiar'
  },
  {
    id: 'ent-4',
    code: 'CSE-29',
    name: 'Freight Operations Information System (FOIS - CRIS)',
    sector: 'Railways & Transport',
    tier: 'Tier-2 (Critical Sectoral)',
    socType: 'Managed MSSP Provider',
    siemPlatform: 'Microsoft Sentinel (Gov Cloud)',
    lastPeriod: 'Q3 2026',
    reviewStatus: 'In Assessment',
    dataQualityScore: 88,
    reportedKpis: {
      mttdMinutes: 28,
      mttrMinutes: 72,
      dailyAlertVolume: 22100,
      closureRatePercent: 95.8,
      falsePositiveRatePercent: 86.4
    },
    evidenceMetrics: {
      rawEventsIngested: 19800000,
      verifiedEvidenceCount: 4,
      telemetryCompletenessPercent: 91.0,
      discrepancyIndex: 32
    },
    findingCount: 2,
    criticalFindingCount: 0,
    negativeSpaceScore: 28,
    location: 'Chanakyapuri, New Delhi',
    nodalOfficer: 'Dr. Meenakshi Sundaram (Chief Systems Engineer)'
  },
  {
    id: 'ent-5',
    code: 'SOC-08',
    name: 'SCADA Telemetry & Pipeline Automation (IOCL Western)',
    sector: 'Petroleum & Gas',
    tier: 'Tier-1 (National Core)',
    socType: 'Internal OT-SOC',
    siemPlatform: 'Splunk Industrial OT Add-on',
    lastPeriod: 'Q3 2026',
    reviewStatus: 'Flagged for Escalation',
    dataQualityScore: 71,
    reportedKpis: {
      mttdMinutes: 22,
      mttrMinutes: 52,
      dailyAlertVolume: 14800,
      closureRatePercent: 94.1,
      falsePositiveRatePercent: 82.5
    },
    evidenceMetrics: {
      rawEventsIngested: 12200000,
      verifiedEvidenceCount: 7,
      telemetryCompletenessPercent: 69.4,
      discrepancyIndex: 74
    },
    findingCount: 4,
    criticalFindingCount: 2,
    negativeSpaceScore: 81,
    location: 'Panipat Refinery Complex, Haryana',
    nodalOfficer: 'Shri Vikramjit Singh (GM - Automation & Cyber)'
  },
  {
    id: 'ent-6',
    code: 'SOC-11',
    name: 'Tier-1 Internet Core Routing & Mobile Core (BSNL)',
    sector: 'Telecom & IT',
    tier: 'Tier-2 (Critical Sectoral)',
    socType: 'Hybrid MSSP',
    siemPlatform: 'FortiSIEM Dedicated Appliance',
    lastPeriod: 'Q3 2026',
    reviewStatus: 'Pending Review',
    dataQualityScore: 85,
    reportedKpis: {
      mttdMinutes: 35,
      mttrMinutes: 94,
      dailyAlertVolume: 58200,
      closureRatePercent: 92.4,
      falsePositiveRatePercent: 79.1
    },
    evidenceMetrics: {
      rawEventsIngested: 51000000,
      verifiedEvidenceCount: 6,
      telemetryCompletenessPercent: 84.7,
      discrepancyIndex: 48
    },
    findingCount: 3,
    criticalFindingCount: 0,
    negativeSpaceScore: 42,
    location: 'Statesman House, New Delhi',
    nodalOfficer: 'Shri Devendra Prasad (DGM - Cyber Defense)'
  },
  {
    id: 'ent-7',
    code: 'CSE-05',
    name: 'Strategic Telemetry Infrastructure (National Grid Control)',
    sector: 'Strategic & Defence',
    tier: 'Tier-1 (National Core)',
    socType: 'Internal SOC (Air-Gapped Telemetry)',
    siemPlatform: 'Custom Proprietary SIEM Engine',
    lastPeriod: 'Q3 2026',
    reviewStatus: 'Completed',
    dataQualityScore: 96,
    reportedKpis: {
      mttdMinutes: 5,
      mttrMinutes: 18,
      dailyAlertVolume: 9200,
      closureRatePercent: 99.8,
      falsePositiveRatePercent: 95.0
    },
    evidenceMetrics: {
      rawEventsIngested: 9150000,
      verifiedEvidenceCount: 9,
      telemetryCompletenessPercent: 98.2,
      discrepancyIndex: 12
    },
    findingCount: 1,
    criticalFindingCount: 0,
    negativeSpaceScore: 16,
    location: 'Confidential Site, NCR',
    nodalOfficer: 'Col. Sanjeev Varma (Dir - Defensive Cyber Ops)'
  }
];

export const FINDINGS: Finding[] = [
  {
    id: 'F-1024',
    title: 'Potential Claim-vs-Reality Mismatch: Anomalously Rapid Critical Closure',
    category: 'Execution Gap',
    priority: 'Critical',
    entityId: 'cse-alpha',
    entityCode: 'CSE Alpha',
    entityName: 'CSE Alpha',
    sector: 'Banking & Finance',
    detectionDate: '2026-10-05',
    confidenceScore: 92,
    explanation: 'Critical alerts were closed in a median of 3 minutes compared with a peer median of 47 minutes.',
    patternSummary: 'Underlying operational evidence indicates review-worthy inconsistencies: 99% reported SLA compliance was achieved through automated bulk closures with minimal human investigation and 1.8% escalation rate.',
    whyFlagged: 'Critical alerts were closed in a median of 3 minutes compared with a peer median of 47 minutes.',
    supportingEvidenceCount: 18,
    evidenceIds: ['EVD-9801', 'EVD-9802', 'EVD-9803', 'EVD-9804'],
    relevantKpiComparison: {
      reportedValue: '99% Within SLA (98% Closure Compliance)',
      observedValue: '3 min Median (Peer: 47 min)',
      varianceLabel: '-93.6% Investigation Dwell Time'
    },
    peerContext: {
      peerAvg: '47 min median',
      deviationPercent: '-93.6%',
      contextNote: 'Peers in critical sector maintain an investigation median of 47 min (range 22–81 min) for high-severity cases.'
    },
    evidenceStrength: 'Strong',
    recommendedReviewSteps: [
      'Inspect analyst workstation logs during high-volume batch intervals.',
      'Corroborate whether closed critical alerts received triage ticket escalation to Tier-2.',
      'Interview SOC Lead regarding automated macro usage and triage clearance quotas.'
    ],
    status: 'Under Review',
    auditEvents: ['AUD-005', 'AUD-006'],
    counterfactual: 'This signal would not trigger if the median critical closure time exceeded 22 minutes, assuming other conditions remain unchanged.',
    nonAutonomousReason: 'Fast closure may be legitimate (e.g. well-tuned automated orchestration playbooks). SAT-SA therefore presents supporting evidence and recommends examiner review rather than issuing an autonomous verdict.',
    signalWeights: [
      { name: 'Fast Closure', weight: 0.20, observedValue: '3 min (vs 47 min peer)', peerBaseline: '47 min', score: 0.94 },
      { name: 'Low Escalation', weight: 0.20, observedValue: '1.8% (vs 14.2% peer)', peerBaseline: '14.2%', score: 0.88 },
      { name: 'Repetitive Investigation', weight: 0.20, observedValue: '84% template match', peerBaseline: '18%', score: 0.86 },
      { name: 'Silent Critical Assets', weight: 0.20, observedValue: 'PAYMENT-DB-01 (47d silent)', peerBaseline: '< 24h', score: 0.85 },
      { name: 'Missing Remediation', weight: 0.20, observedValue: '68% recurrence without patch', peerBaseline: '12%', score: 0.89 }
    ],
    rawRecords: [
      {
        record_id: 'ALT-98213',
        timestamp: '10:03:14 IST',
        entity_id: 'CSE Alpha',
        asset_id: 'PAYMENT-GW-01',
        severity: 'Critical',
        case_id: 'CAS-4401',
        workflow_state: 'Closed - Resolved',
        escalation: 'No',
        investigation: 'Minimal (42 chars)',
        remediation: 'None documented',
        sha256_hash: '8f3a8b27c9e0411a78912d8a56f0c39128f7d934bb7e203498cb0e21a92c0192'
      },
      {
        record_id: 'ALT-98219',
        timestamp: '11:12:02 IST',
        entity_id: 'CSE Alpha',
        asset_id: 'CORE-SWITCH-02',
        severity: 'Critical',
        case_id: 'CAS-4408',
        workflow_state: 'Closed - False Positive',
        escalation: 'No',
        investigation: 'Minimal (38 chars)',
        remediation: 'None documented',
        sha256_hash: '3d91f28b7e40a12c890123ef4567890abcdef1234567890abcdef1234567890a'
      },
      {
        record_id: 'ALT-98224',
        timestamp: '12:45:30 IST',
        entity_id: 'CSE Alpha',
        asset_id: 'DB-REPLICA-03',
        severity: 'Critical',
        case_id: 'CAS-4415',
        workflow_state: 'Closed - Resolved',
        escalation: 'No',
        investigation: 'Minimal (45 chars)',
        remediation: 'None documented',
        sha256_hash: '7b82f041b3c99021487ea310f82531cd89912a74c6e93014f31c201891de1204'
      },
      {
        record_id: 'ALT-98231',
        timestamp: '14:18:44 IST',
        entity_id: 'CSE Alpha',
        asset_id: 'HSM-AUTH-01',
        severity: 'Critical',
        case_id: 'CAS-4422',
        workflow_state: 'Closed - Suppressed',
        escalation: 'No',
        investigation: 'Minimal (51 chars)',
        remediation: 'None documented',
        sha256_hash: '5a41c2e98710fa4312de8901bcae5678901234567890abcdef1234567890abcd'
      }
    ],
    evidenceLedger: {
      recordHash: '8f3a8b27c9e0411a78912d8a56f0c39128f7d934bb7e203498cb0e21a92c0192',
      merkleRoot: '7b82f041b3c99021487ea310f82531cd89912a74c6e93014f31c201891de1204',
      previousBatchHash: '4c1a792df91024bc68102a39158c301bbfa931045e72fb418902cfa0184b9102',
      verificationStatus: 'Cryptographically verified'
    }
  },
  {
    id: 'F-1027',
    title: 'Silent Critical Asset: Complete Telemetry Void on Crown Jewel PAYMENT-DB-01',
    category: 'Negative Space',
    priority: 'Critical',
    entityId: 'cse-alpha',
    entityCode: 'CSE Alpha',
    entityName: 'CSE Alpha',
    sector: 'Banking & Finance',
    detectionDate: '2026-10-04',
    confidenceScore: 89,
    explanation: 'PAYMENT-DB-01 has produced zero security events for 47 consecutive days while peer baseline activity is 40–70 alerts/week.',
    patternSummary: 'Sensor telemetry deadman check triggered. No heartbeat or query telemetry forwarded to SIEM aggregator.',
    whyFlagged: 'Critical Tier-1 database completely silent for 47 days.',
    supportingEvidenceCount: 7,
    evidenceIds: ['EVD-9804'],
    relevantKpiComparison: {
      reportedValue: '100% Ingest Health Claimed',
      observedValue: '0 Events for 47 Days',
      varianceLabel: 'Complete Ingestion Void'
    },
    peerContext: {
      peerAvg: '40–70 alerts/week',
      deviationPercent: '-100.0%',
      contextNote: 'Core database servers in peer banking infrastructure generate regular baseline audit telemetry.'
    },
    evidenceStrength: 'Strong',
    recommendedReviewSteps: [
      'Verify physical agent connector daemon on PAYMENT-DB-01.',
      'Check local audit backlog buffers on host.',
      'Issue inquiry on unrecorded maintenance or firewall port isolation.'
    ],
    status: 'Under Review',
    auditEvents: ['AUD-002']
  },
  {
    id: 'F-1031',
    title: 'Template-Driven Investigations: High Boilerplate Frequency',
    category: 'Execution Gap',
    priority: 'High',
    entityId: 'cse-beta',
    entityCode: 'CSE Beta',
    entityName: 'CSE Beta',
    sector: 'Power & Energy',
    detectionDate: '2026-10-03',
    confidenceScore: 84,
    explanation: 'Investigation notes across 43 independent case files exhibit 84% string similarity with identical 2-line resolution comments.',
    patternSummary: 'String entropy calculation identified verbatim copy-pasting of resolution templates across distinct substation alert clusters.',
    whyFlagged: 'Template-driven investigations indicate quota clearing without substantive triage.',
    supportingEvidenceCount: 43,
    evidenceIds: ['EVD-9802'],
    relevantKpiComparison: {
      reportedValue: '42 min MTTR Reported',
      observedValue: '84% Template Similarity',
      varianceLabel: 'Repetitive Investigation Notes'
    },
    peerContext: {
      peerAvg: '18% template similarity',
      deviationPercent: '+366.7%',
      contextNote: 'Sector baseline indicates individualized analyst notes with unique artifact references.'
    },
    evidenceStrength: 'Moderate',
    recommendedReviewSteps: [
      'Sample 15 case files with identical investigation comments.',
      'Corroborate whether IP addresses investigated matched ticket notes.',
      'Review analyst training and shift quota pressure.'
    ],
    status: 'Under Review',
    auditEvents: ['AUD-001']
  },
  {
    id: 'F-1038',
    title: 'Missing Alert Category: Zero Credential Dumping & Kerberoasting Signals',
    category: 'Negative Space',
    priority: 'Medium',
    entityId: 'cse-gamma',
    entityCode: 'CSE Gamma',
    entityName: 'CSE Gamma',
    sector: 'Civil Aviation',
    detectionDate: '2026-10-02',
    confidenceScore: 81,
    explanation: 'Expected identity threat detection rules have produced zero events in 90 days despite 2,400 active domain accounts.',
    patternSummary: 'Sectoral baseline models expect 12-25 Kerberoasting or pass-the-hash telemetry events per quarter in enterprise AD environments.',
    whyFlagged: 'Missing identity attack detection telemetry compared to peer entities.',
    supportingEvidenceCount: 12,
    evidenceIds: ['EVD-9803'],
    relevantKpiComparison: {
      reportedValue: 'Full ATT&CK Matrix Covered',
      observedValue: 'Zero Identity Detections',
      varianceLabel: 'Credential Telemetry Void'
    },
    peerContext: {
      peerAvg: '18.4 detections/quarter',
      deviationPercent: '-100.0%',
      contextNote: 'All peer airports and aviation centers observe periodic AD service ticket queries.'
    },
    evidenceStrength: 'Moderate',
    recommendedReviewSteps: [
      'Inspect Windows Event Log forwarding for Event IDs 4768 and 4769.',
      'Check Domain Controller agent status.',
      'Verify SIEM rule mapping for MITRE ATT&CK T1558.'
    ],
    status: 'Under Review',
    auditEvents: ['AUD-004']
  },
  {
    id: 'FND-2026-104',
    title: 'Anomalous Rapid Alert Closure During Off-Hours Shift Handover',
    category: 'Goodhart Lens',
    priority: 'Critical',
    entityId: 'ent-1',
    entityCode: 'CSE-17',
    entityName: 'Northern Regional Load Despatch Centre (NRLDC)',
    sector: 'Power & Energy',
    detectionDate: '2026-10-02',
    explanation: 'Over 820 high-severity security alerts were marked closed within a 4-minute window immediately prior to scheduled shift handover, averaging 0.29 seconds per alert.',
    patternSummary: 'Batch bulk dismissal pattern detected during 05:56–06:00 IST. The triage velocity exceeds reasonable human cognitive inspection capacity by a factor of 140x.',
    whyFlagged: 'The observed triage pace suggests metric-driven quota clearance rather than substantive triage of underlying OT protocol telemetry. Potential mismatch detected; review recommended.',
    supportingEvidenceCount: 3,
    evidenceIds: ['EVD-9801', 'EVD-9802', 'EVD-9803'],
    relevantKpiComparison: {
      reportedValue: '38 min Median MTTR',
      observedValue: '0.29 sec Batch Disposal',
      varianceLabel: '820 Alerts Bulk-Cleared'
    },
    peerContext: {
      peerAvg: '11.4 min per high-tier alert',
      deviationPercent: '-99.9%',
      contextNote: 'Peers in Power & Energy maintain human inspection times between 7 and 18 minutes for substation telemetry alerts.'
    },
    evidenceStrength: 'Strong',
    recommendedReviewSteps: [
      'Inspect shift logs for 2026-10-02 05:30 to 06:15 IST.',
      'Corroborate whether closed alerts included IEC 60870-5-104 protocol anomalies.',
      'Request analyst work tickets corresponding to the batch closure timestamps.'
    ],
    examinerNotes: 'Preliminary verification shows analyst workstation scripts fired automated closure macros across Splunk queue.',
    status: 'Confirmed for Follow-up',
    auditEvents: ['AUD-001', 'AUD-002']
  },
  {
    id: 'FND-2026-105',
    title: 'Extended Ingestion Silence on Substation Telemetry Aggregator',
    category: 'Negative Space',
    priority: 'Critical',
    entityId: 'ent-1',
    entityCode: 'CSE-17',
    entityName: 'Northern Regional Load Despatch Centre (NRLDC)',
    sector: 'Power & Energy',
    detectionDate: '2026-10-01',
    explanation: 'Core Gateway Substation SGW-400kV stopped forwarding telemetry syslog feeds for 38 consecutive hours without triggering an internal SOC ingestion alert.',
    patternSummary: 'Zero alerts or heartbeat packets recorded from 2026-09-29 22:00 to 2026-10-01 12:00 IST on an asset categorized as Crown Jewel in the regulatory registry.',
    whyFlagged: 'Absence of expected baseline events in a designated critical telemetry stream. System flagged silence as potentially unmonitored operational interval.',
    supportingEvidenceCount: 2,
    evidenceIds: ['EVD-9804', 'EVD-9805'],
    relevantKpiComparison: {
      reportedValue: '100% Ingest Availability',
      observedValue: '38.0 hrs Complete Void',
      varianceLabel: 'Zero Telemetry Packets'
    },
    peerContext: {
      peerAvg: '0.2 hrs max silence before deadman alert',
      deviationPercent: '+18,900%',
      contextNote: 'National average for critical gateway outage notification is under 15 minutes.'
    },
    evidenceStrength: 'Strong',
    recommendedReviewSteps: [
      'Verify physical router state and network interface packet counters.',
      'Examine deadman monitor configuration on the SIEM forwarder daemon.',
      'Cross-check if air-gap buffer storage holds backlogged unsent logs.'
    ],
    status: 'Under Review',
    auditEvents: ['AUD-003']
  },
  {
    id: 'FND-2026-106',
    title: 'Suppression of High-Risk API Lateral Movement Detection Rules',
    category: 'Execution Gap',
    priority: 'High',
    entityId: 'ent-2',
    entityCode: 'SOC-04',
    entityName: 'National Unified Payments Switch (NPCI Core Switching)',
    sector: 'Banking & Finance',
    detectionDate: '2026-10-03',
    explanation: 'Three correlation rules tracking lateral API token traversal were deactivated in QRadar rules engine for 14 business days without documented change request.',
    patternSummary: 'Rule UUIDs Q-9812, Q-9814, Q-9815 toggled to disabled state following volume spike on 2026-09-18. Corresponding alert queue fell by 4,100 alerts.',
    whyFlagged: 'Suppression of high-priority rules directly lowers apparent backlog volume while introducing an unmonitored detection gap.',
    supportingEvidenceCount: 2,
    evidenceIds: ['EVD-9806', 'EVD-9807'],
    relevantKpiComparison: {
      reportedValue: '99.1% Alert SLA Compliance',
      observedValue: '3 Critical Rules Silenced',
      varianceLabel: 'Detection Void Introduced'
    },
    peerContext: {
      peerAvg: '1.2 days max temporary rule tuning duration',
      deviationPercent: '+1,066%',
      contextNote: 'Banking sector peers require Change Advisory Board approval for deactivations exceeding 24 hours.'
    },
    evidenceStrength: 'Strong',
    recommendedReviewSteps: [
      'Request configuration audit diff from QRadar administrative logs.',
      'Assess if bypass occurred during planned software patch or operational tuning.',
      'Verify re-activation ticket and post-incident verification tests.'
    ],
    status: 'New',
    auditEvents: ['AUD-004']
  },
  {
    id: 'FND-2026-107',
    title: 'Sustained Escalation Delay Disparity Between Internal and MSSP Shift',
    category: 'Peer & Anomaly',
    priority: 'Medium',
    entityId: 'ent-4',
    entityCode: 'CSE-29',
    entityName: 'Freight Operations Information System (FOIS - CRIS)',
    sector: 'Railways & Transport',
    detectionDate: '2026-09-30',
    explanation: 'Incident hand-off from Tier-1 MSSP queue to Tier-2 internal incident command averages 4.8 hours on weekends compared to 0.4 hours during weekday shifts.',
    patternSummary: 'Statistically significant latency divergence (12x) observed during Saturday–Sunday shifts over the past 6 assessment weeks.',
    whyFlagged: 'Operational records demonstrate recurrent staffing coverage deficit during off-peak hours.',
    supportingEvidenceCount: 1,
    evidenceIds: ['EVD-9808'],
    relevantKpiComparison: {
      reportedValue: '28 min Average MTTD',
      observedValue: '288 min Weekend Hand-off',
      varianceLabel: '+260 min Hand-off Delay'
    },
    peerContext: {
      peerAvg: '1.1 hrs weekend escalation hand-off',
      deviationPercent: '+336%',
      contextNote: 'Transport sector peers maintain continuous 24/7 level-2 presence.'
    },
    evidenceStrength: 'Moderate',
    recommendedReviewSteps: [
      'Inspect MSSP contract shift-roster SLA compliance reports.',
      'Review whether automated routing bridges exist for P1 severity incidents.'
    ],
    status: 'Under Review',
    auditEvents: ['AUD-005']
  },
  {
    id: 'FND-2026-108',
    title: 'Timestamp Drift and Clock Skew in Firewall Syslog Feeds',
    category: 'Data Quality',
    priority: 'High',
    entityId: 'ent-5',
    entityCode: 'SOC-08',
    entityName: 'SCADA Telemetry & Pipeline Automation (IOCL Western)',
    sector: 'Petroleum & Gas',
    detectionDate: '2026-10-04',
    explanation: 'Telemetry events originating from boundary firewalls show a non-linear clock skew ranging between +42 minutes and -18 minutes relative to UTC reference.',
    patternSummary: 'Over 14,200 log entries failed temporal sequence correlation because device NTP synchronization had decoupled from national stratum-1 time sources.',
    whyFlagged: 'Clock skew invalidates automated incident reconstruction and compromises evidentiary forensic integrity under Section 65B.',
    supportingEvidenceCount: 2,
    evidenceIds: ['EVD-9809', 'EVD-9810'],
    relevantKpiComparison: {
      reportedValue: 'Accurate Event Timestamps',
      observedValue: 'Up to 42 min Drift',
      varianceLabel: 'Temporal Incoherence'
    },
    evidenceStrength: 'Strong',
    recommendedReviewSteps: [
      'Verify boundary NTP server daemon logs and stratum connectivity.',
      'Re-align device syslog timestamps before forensic timeline analysis.'
    ],
    status: 'Confirmed for Follow-up',
    auditEvents: ['AUD-006']
  },
  {
    id: 'FND-2026-109',
    title: 'Evidence Batch Merkle Root Hash Mismatch in Historical Archive',
    category: 'Evidence Integrity',
    priority: 'Critical',
    entityId: 'ent-5',
    entityCode: 'SOC-08',
    entityName: 'SCADA Telemetry & Pipeline Automation (IOCL Western)',
    sector: 'Petroleum & Gas',
    detectionDate: '2026-10-04',
    explanation: 'Automated verification check identified a hash mismatch for evidentiary batch BTH-2026-09-W3 against the reference register stored at initial submission.',
    patternSummary: 'Cryptographic hash calculation for 18 telemetry samples failed verification against the stored reference digest.',
    whyFlagged: 'Integrity mismatch flags potential unrecorded modification, storage corruption, or log regeneration. Human verification required before relying on records.',
    supportingEvidenceCount: 3,
    evidenceIds: ['EVD-9811', 'EVD-9812', 'EVD-9813'],
    relevantKpiComparison: {
      reportedValue: 'Certified Unaltered Evidence',
      observedValue: '3 Hash Verification Failures',
      varianceLabel: 'Integrity Check Failed'
    },
    evidenceStrength: 'Strong',
    recommendedReviewSteps: [
      'Compare secondary backup archive with corrupted batch.',
      'Check storage media SMART health diagnostics on evidence SAN array.',
      'Execute bitwise diff to establish whether metadata or payload contents diverged.'
    ],
    status: 'New',
    auditEvents: ['AUD-007']
  },
  {
    id: 'FND-2026-110',
    title: 'Sub-Threshold Alert Suppression Pattern on Radar Feed Gateways',
    category: 'Goodhart Lens',
    priority: 'Medium',
    entityId: 'ent-3',
    entityCode: 'CAC-02',
    entityName: 'Air Traffic Flow Management & Radar Feed Network (AAI)',
    sector: 'Civil Aviation',
    detectionDate: '2026-09-28',
    explanation: 'Correlation thresholds for ADS-B spoofing alerts were systematically adjusted from 3 deviations/hr to 15 deviations/hr, causing visible drop in reported incident counts.',
    patternSummary: 'Following threshold revision, reported ADS-B anomaly tickets decreased by 84% without corresponding reduction in raw sensor anomaly telemetry.',
    whyFlagged: 'Optimization of reported metrics by redefining alert generation thresholds creates an operational illusion of improved security posture.',
    supportingEvidenceCount: 1,
    evidenceIds: ['EVD-9814'],
    relevantKpiComparison: {
      reportedValue: '84% Reduction in Radar Alerts',
      observedValue: 'Sensor Telemetry Unchanged',
      varianceLabel: 'Threshold Inflation'
    },
    peerContext: {
      peerAvg: '4.2 threshold adjustments per year',
      deviationPercent: '+250%',
      contextNote: 'Aviation security baselines recommend strict adherence to ICAO threshold guidance.'
    },
    evidenceStrength: 'Moderate',
    recommendedReviewSteps: [
      'Inspect engineering rationale for ADS-B alert threshold modification.',
      'Run retrospective detection model against raw sensor feeds over past 30 days.'
    ],
    status: 'Under Review',
    auditEvents: ['AUD-008']
  }
];

export const NEGATIVE_SPACE_ITEMS: NegativeSpaceItem[] = [
  {
    id: 'NEG-101',
    assetId: 'PAYMENT-DB-01',
    assetName: 'Crown Jewel Transaction Settlement Database (PAYMENT-DB-01)',
    entityCode: 'CSE Alpha',
    entityName: 'CSE Alpha',
    sector: 'Banking & Finance',
    criticality: 'Crown Jewel Asset',
    silencePeriodHours: 1128.0, // 47 days
    expectedAlertsPerDay: 8, // 40-70 per week
    observedAlertsPeriod: 0,
    anomalyType: 'Unexplained Telemetry Silence',
    confirmationStatus: 'Confirmed Ingestion Failure',
    lastHeartbeat: '2026-08-18 04:12:00 IST',
    potentialRootCause: 'Complete ingestion void: Expected 40–70 alerts/week, observed 0 for 47 consecutive days. Risk: HIGH.'
  },
  {
    id: 'NEG-102',
    assetId: 'WEB-GATEWAY-02',
    assetName: 'Core Perimeter Application Proxy (WEB-GATEWAY-02)',
    entityCode: 'CSE Alpha',
    entityName: 'CSE Alpha',
    sector: 'Banking & Finance',
    criticality: 'Core Industrial Gateway',
    silencePeriodHours: 36.0,
    expectedAlertsPerDay: 4, // 20-40 per week
    observedAlertsPeriod: 2,
    anomalyType: 'Off-Hours Activity Cliff',
    confirmationStatus: 'Unexplained Low Activity',
    lastHeartbeat: '2026-10-04 11:20:00 IST',
    potentialRootCause: 'Expected 20–40 alerts/week, observed only 2. Silence anomaly during peak inbound traffic. Risk: HIGH.'
  },
  {
    id: 'NEG-103',
    assetId: 'SWIFT-CONNECTOR-04',
    assetName: 'Inter-Bank Financial Messaging Node (SWIFT-04)',
    entityCode: 'CSE Beta',
    entityName: 'CSE Beta',
    sector: 'Power & Energy',
    criticality: 'Crown Jewel Asset',
    silencePeriodHours: 528.0, // 22 days
    expectedAlertsPerDay: 3, // 15-30 per week
    observedAlertsPeriod: 0,
    anomalyType: 'Unexplained Telemetry Silence',
    confirmationStatus: 'Under Investigation',
    lastHeartbeat: '2026-09-12 18:00:00 IST',
    potentialRootCause: 'Expected 15–30 alerts/week, observed 0. Silence for 22 days. Risk: HIGH.'
  },
  {
    id: 'NEG-104',
    assetId: 'AUTH-CLUSTER-01',
    assetName: 'RADIUS & Kerberos Single-Sign-On Cluster (AUTH-01)',
    entityCode: 'CSE Delta',
    entityName: 'CSE Delta',
    sector: 'Telecom & IT',
    criticality: 'Production Switch',
    silencePeriodHours: 18.0,
    expectedAlertsPerDay: 15, // 80-120 per week
    observedAlertsPeriod: 14,
    anomalyType: 'Missing Alert Category',
    confirmationStatus: 'Unexplained Low Activity',
    lastHeartbeat: '2026-10-04 14:10:00 IST',
    potentialRootCause: 'Expected 80–120 alerts/week, observed 14. Silence anomaly on authentication failure events. Risk: MEDIUM.'
  },
  {
    id: 'NEG-01',
    assetId: 'GW-NRLDC-400KV',
    assetName: 'Core Gateway Substation SGW-400kV (Primary Interconnect)',
    entityCode: 'CSE-17',
    entityName: 'NRLDC PowerGrid',
    sector: 'Power & Energy',
    criticality: 'Crown Jewel Asset',
    silencePeriodHours: 38.0,
    expectedAlertsPerDay: 240,
    observedAlertsPeriod: 0,
    anomalyType: 'Unexplained Telemetry Silence',
    confirmationStatus: 'Confirmed Ingestion Failure',
    lastHeartbeat: '2026-09-29 22:00:14 IST',
    potentialRootCause: 'Syslog forwarder process halted on edge router; deadman monitor alert rule disabled.'
  },
  {
    id: 'NEG-02',
    assetId: 'SW-NPCI-HSM-01',
    assetName: 'Hardware Security Module Cluster (PIN Encryption Switch)',
    entityCode: 'SOC-04',
    entityName: 'NPCI Payments Switch',
    sector: 'Banking & Finance',
    criticality: 'Crown Jewel Asset',
    silencePeriodHours: 14.5,
    expectedAlertsPerDay: 680,
    observedAlertsPeriod: 12,
    anomalyType: 'Off-Hours Activity Cliff',
    confirmationStatus: 'Unexplained Low Activity',
    lastHeartbeat: '2026-10-04 06:12:00 IST',
    potentialRootCause: 'Cryptographic transaction volumes dropped by 96% without merchant scheduled maintenance notice.'
  },
  {
    id: 'NEG-03',
    assetId: 'RAD-AAI-PRIMARY',
    assetName: 'Monopulse Secondary Surveillance Radar Feed (MSSR North)',
    entityCode: 'CAC-02',
    entityName: 'AAI Civil Aviation Hub',
    sector: 'Civil Aviation',
    criticality: 'Core Industrial Gateway',
    silencePeriodHours: 9.0,
    expectedAlertsPerDay: 90,
    observedAlertsPeriod: 0,
    anomalyType: 'Missing Alert Category',
    confirmationStatus: 'Under Investigation',
    lastHeartbeat: '2026-10-03 18:30:22 IST',
    potentialRootCause: 'Filtering rule added during switch upgrade excluded UDP radar datagram telemetry.'
  },
  {
    id: 'NEG-04',
    assetId: 'SCADA-IOCL-VALVE-09',
    assetName: 'Automated Pressure Regulator & Emergency Valve Telemetry',
    entityCode: 'SOC-08',
    entityName: 'IOCL Pipeline Control',
    sector: 'Petroleum & Gas',
    criticality: 'Crown Jewel Asset',
    silencePeriodHours: 52.0,
    expectedAlertsPerDay: 180,
    observedAlertsPeriod: 0,
    anomalyType: 'Log Ingestion Gap',
    confirmationStatus: 'Confirmed Ingestion Failure',
    lastHeartbeat: '2026-10-01 04:00:00 IST',
    potentialRootCause: 'Modbus serial-to-IP converter port dropped; buffer filled and overwrote unforwarded logs.'
  },
  {
    id: 'NEG-05',
    assetId: 'CORE-BSNL-SGSN-03',
    assetName: 'Serving GPRS Support Node (National Data Backbone)',
    entityCode: 'SOC-11',
    entityName: 'BSNL Telecom Core',
    sector: 'Telecom & IT',
    criticality: 'Production Switch',
    silencePeriodHours: 18.0,
    expectedAlertsPerDay: 420,
    observedAlertsPeriod: 15,
    anomalyType: 'Off-Hours Activity Cliff',
    confirmationStatus: 'Unexplained Low Activity',
    lastHeartbeat: '2026-10-03 23:45:10 IST',
    potentialRootCause: 'Flow export collector sampling rate was altered from 1:1 to 1:100 without configuration ticket.'
  },
  {
    id: 'NEG-06',
    assetId: 'FOIS-CRIS-DB-SYNC',
    assetName: 'Wagon Location Replication Node (Database Telemetry)',
    entityCode: 'CSE-29',
    entityName: 'FOIS CRIS Railways',
    sector: 'Railways & Transport',
    criticality: 'Telemetry Ingest Node',
    silencePeriodHours: 6.5,
    expectedAlertsPerDay: 310,
    observedAlertsPeriod: 4,
    anomalyType: 'Unexplained Telemetry Silence',
    confirmationStatus: 'Under Investigation',
    lastHeartbeat: '2026-10-04 14:10:00 IST',
    potentialRootCause: 'Replication process stuck on locking table query.'
  }
];

export const PEER_BENCHMARKS: PeerBenchmarkMetric[] = [
  {
    metricId: 'mttd',
    name: 'Mean Time to Detect (MTTD)',
    unit: 'minutes',
    description: 'Time from first anomalous telemetry event to initial analyst alert acknowledgment.',
    sectorAvg: 18.5,
    peerRangeMin: 6.0,
    peerRangeMax: 42.0,
    entitiesData: [
      { entityCode: 'CSE-17', entityName: 'NRLDC Power', value: 14.0, percentile: 45, flagAnomaly: false },
      { entityCode: 'SOC-04', entityName: 'NPCI Payments', value: 8.0, percentile: 15, flagAnomaly: false },
      { entityCode: 'CAC-02', entityName: 'AAI Aviation', value: 19.0, percentile: 58, flagAnomaly: false },
      { entityCode: 'CSE-29', entityName: 'CRIS Rail', value: 28.0, percentile: 78, flagAnomaly: true, anomalyNote: 'Higher than sector median; MSSP triage handover latency contributes to extended MTTD.' },
      { entityCode: 'SOC-08', entityName: 'IOCL Pipeline', value: 22.0, percentile: 64, flagAnomaly: false },
      { entityCode: 'SOC-11', entityName: 'BSNL Telecom', value: 35.0, percentile: 88, flagAnomaly: true, anomalyNote: 'Significantly elevated MTTD due to large alert volume per analyst ratio.' },
      { entityCode: 'CSE-05', entityName: 'Strategic Grid', value: 5.0, percentile: 5, flagAnomaly: false }
    ]
  },
  {
    metricId: 'mttr',
    name: 'Mean Time to Resolve / Contain (MTTR)',
    unit: 'minutes',
    description: 'Duration between detection and verified execution of containment action.',
    sectorAvg: 51.0,
    peerRangeMin: 18.0,
    peerRangeMax: 110.0,
    entitiesData: [
      { entityCode: 'CSE-17', entityName: 'NRLDC Power', value: 38.0, percentile: 36, flagAnomaly: true, anomalyNote: 'Apparent rapid MTTR driven partly by batch closures during shift handovers.' },
      { entityCode: 'SOC-04', entityName: 'NPCI Payments', value: 24.0, percentile: 12, flagAnomaly: false },
      { entityCode: 'CAC-02', entityName: 'AAI Aviation', value: 45.0, percentile: 48, flagAnomaly: false },
      { entityCode: 'CSE-29', entityName: 'CRIS Rail', value: 72.0, percentile: 76, flagAnomaly: false },
      { entityCode: 'SOC-08', entityName: 'IOCL Pipeline', value: 52.0, percentile: 54, flagAnomaly: false },
      { entityCode: 'SOC-11', entityName: 'BSNL Telecom', value: 94.0, percentile: 92, flagAnomaly: true, anomalyNote: 'Substantial delay in escalation hand-off during non-business hours.' },
      { entityCode: 'CSE-05', entityName: 'Strategic Grid', value: 18.0, percentile: 4, flagAnomaly: false }
    ]
  },
  {
    metricId: 'closureRate',
    name: 'Same-Day Alert Closure Rate',
    unit: '%',
    description: 'Percentage of generated security alerts marked closed within 24 hours of generation.',
    sectorAvg: 96.2,
    peerRangeMin: 91.0,
    peerRangeMax: 99.8,
    entitiesData: [
      { entityCode: 'CSE-17', entityName: 'NRLDC Power', value: 98.4, percentile: 82, flagAnomaly: true, anomalyNote: 'Exceedingly high closure rate despite high telemetry discrepancy score.' },
      { entityCode: 'SOC-04', entityName: 'NPCI Payments', value: 99.1, percentile: 90, flagAnomaly: false },
      { entityCode: 'CAC-02', entityName: 'AAI Aviation', value: 97.2, percentile: 62, flagAnomaly: false },
      { entityCode: 'CSE-29', entityName: 'CRIS Rail', value: 95.8, percentile: 40, flagAnomaly: false },
      { entityCode: 'SOC-08', entityName: 'IOCL Pipeline', value: 94.1, percentile: 25, flagAnomaly: false },
      { entityCode: 'SOC-11', entityName: 'BSNL Telecom', value: 92.4, percentile: 10, flagAnomaly: false },
      { entityCode: 'CSE-05', entityName: 'Strategic Grid', value: 99.8, percentile: 98, flagAnomaly: false }
    ]
  },
  {
    metricId: 'escalationRate',
    name: 'Tier-1 to Tier-2 Escalation Rate',
    unit: '%',
    description: 'Proportion of initial alerts escalated to tier-2 incident responders.',
    sectorAvg: 4.8,
    peerRangeMin: 1.2,
    peerRangeMax: 12.5,
    entitiesData: [
      { entityCode: 'CSE-17', entityName: 'NRLDC Power', value: 2.1, percentile: 18, flagAnomaly: true, anomalyNote: 'Unusually low escalation rate compared to OT peer baseline of 5.4%.' },
      { entityCode: 'SOC-04', entityName: 'NPCI Payments', value: 6.2, percentile: 72, flagAnomaly: false },
      { entityCode: 'CAC-02', entityName: 'AAI Aviation', value: 5.1, percentile: 58, flagAnomaly: false },
      { entityCode: 'CSE-29', entityName: 'CRIS Rail', value: 3.8, percentile: 42, flagAnomaly: false },
      { entityCode: 'SOC-08', entityName: 'IOCL Pipeline', value: 4.5, percentile: 50, flagAnomaly: false },
      { entityCode: 'SOC-11', entityName: 'BSNL Telecom', value: 7.8, percentile: 85, flagAnomaly: false },
      { entityCode: 'CSE-05', entityName: 'Strategic Grid', value: 4.2, percentile: 48, flagAnomaly: false }
    ]
  }
];

export const EVIDENCE_RECORDS: EvidenceRecord[] = [
  {
    id: 'EVD-9801',
    entityCode: 'CSE-17',
    entityName: 'NRLDC PowerGrid',
    recordType: 'Analyst Shift Record',
    timestamp: '2026-10-02 05:58:12 IST',
    sourceSystem: 'Splunk ES Shift Tracker',
    sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    integrityStatus: 'Verified Valid',
    summary: 'Automated macro invocation log triggering bulk status change to "Closed - False Positive" across 820 pending alerts.',
    rawPayloadSnippet: `{"event_id": "SHFT-89102", "actor": "analyst_batch_macro", "action": "bulk_close", "ticket_count": 820, "disposition": "FALSE_POSITIVE", "duration_ms": 240}`,
    relatedFindingId: 'FND-2026-104',
    targetAsset: 'SPLUNK-ES-CLUSTER-01',
    fileSizeBytes: 2048
  },
  {
    id: 'EVD-9802',
    entityCode: 'CSE-17',
    entityName: 'NRLDC PowerGrid',
    recordType: 'Case Closure Log',
    timestamp: '2026-10-02 05:59:04 IST',
    sourceSystem: 'ITSM ServiceNow Connector',
    sha256Hash: 'a7c93e48110b42f1cf5b2e38c92a1548e65dbd637c35848523c9321e0582a871',
    integrityStatus: 'Verified Valid',
    summary: 'Resolution comments field contains identical whitespace-padded string across 410 consecutive records.',
    rawPayloadSnippet: `{"ticket_id": "INC0982314", "resolution_notes": "Reviewed and cleared during routine shift turnover validation.", "analyst_id": "OP_DESK_4"}`,
    relatedFindingId: 'FND-2026-104',
    targetAsset: 'NRLDC-ITSM-PROD',
    fileSizeBytes: 1420
  },
  {
    id: 'EVD-9803',
    entityCode: 'CSE-17',
    entityName: 'NRLDC PowerGrid',
    recordType: 'Alert Telemetry Sample',
    timestamp: '2026-10-02 05:57:44 IST',
    sourceSystem: 'Substation IEC-104 Telemetry',
    sha256Hash: 'f482a17cb6118d09e530b5826f428178a9c2409821437190e21a847321098274',
    integrityStatus: 'Verified Valid',
    summary: 'Raw packet payload containing uninspected invalid ASDU type identifier 0x82.',
    rawPayloadSnippet: `{"protocol": "IEC-60870-5-104", "asdu_type": "0x82", "cause_of_transmission": "spontaneous", "signal": "UNAUTHORIZED_SETPOINT_WRITE", "source_ip": "10.24.8.190"}`,
    relatedFindingId: 'FND-2026-104',
    targetAsset: 'SGW-400kV-R1',
    fileSizeBytes: 4096
  },
  {
    id: 'EVD-9804',
    entityCode: 'CSE-17',
    entityName: 'NRLDC PowerGrid',
    recordType: 'Asset Heartbeat Dump',
    timestamp: '2026-09-29 22:00:14 IST',
    sourceSystem: 'NTP Telemetry Monitor',
    sha256Hash: '91a27e3841029c5b29381e47a982b610c3829148e7182903b4172893c5019823',
    integrityStatus: 'Verified Valid',
    summary: 'Final acknowledged keep-alive packet from Substation Gateway SGW-400kV prior to 38-hour silence.',
    rawPayloadSnippet: `{"device_id": "GW-NRLDC-400KV", "state": "ONLINE", "uptime_sec": 4921029, "active_forwarders": 1, "packet_count_tx": 894102}`,
    relatedFindingId: 'FND-2026-105',
    targetAsset: 'GW-NRLDC-400KV',
    fileSizeBytes: 1024
  },
  {
    id: 'EVD-9806',
    entityCode: 'SOC-04',
    entityName: 'NPCI Payments Switch',
    recordType: 'Escalation Flow Dump',
    timestamp: '2026-09-18 14:22:10 IST',
    sourceSystem: 'QRadar Rule Management API',
    sha256Hash: '89104b28c91a384e910283c74910283749182374910293847192837491029384',
    integrityStatus: 'Verified Valid',
    summary: 'Configuration audit showing administrative rule deactivation for correlation rule Q-9812.',
    rawPayloadSnippet: `{"rule_id": "Q-9812", "action": "DISABLE", "modified_by": "secops_admin", "comment": "Suppressing high volume during core upgrade."}`,
    relatedFindingId: 'FND-2026-106',
    targetAsset: 'QRADAR-CM-PROD',
    fileSizeBytes: 2840
  },
  {
    id: 'EVD-9809',
    entityCode: 'SOC-08',
    entityName: 'IOCL Pipeline Control',
    recordType: 'SLA Verification Log',
    timestamp: '2026-10-04 08:00:00 IST',
    sourceSystem: 'Boundary Firewall Syslog',
    sha256Hash: '1928374910293847192837491029384719283749102938471928374910293847',
    integrityStatus: 'Hash Discrepancy',
    summary: 'Firewall syslog headers show mismatched timestamps (+42 min ahead of NTP reference clock).',
    rawPayloadSnippet: `{"syslog_time": "2026-10-04T08:42:19Z", "reference_utc": "2026-10-04T08:00:00Z", "skew_sec": 2539, "event": "DENY_INGRESS_SSH"}`,
    relatedFindingId: 'FND-2026-108',
    targetAsset: 'FW-SCADA-PANIPAT',
    fileSizeBytes: 3100
  },
  {
    id: 'EVD-9811',
    entityCode: 'SOC-08',
    entityName: 'IOCL Pipeline Control',
    recordType: 'Remediation Artifact',
    timestamp: '2026-10-04 11:20:00 IST',
    sourceSystem: 'Forensic Storage Archive',
    sha256Hash: '5566778899001122334455667788990011223344556677889900112233445566',
    integrityStatus: 'Hash Discrepancy',
    summary: 'Archive batch verification failed. The current checksum diverges from stored cryptographic seal.',
    rawPayloadSnippet: `{"batch_ref": "BTH-2026-09-W3", "stored_hash": "c928...41e0", "computed_hash": "5566...5566", "status": "MISMATCH_DETECTED"}`,
    relatedFindingId: 'FND-2026-109',
    targetAsset: 'SAN-EVIDENCE-POOL-02',
    fileSizeBytes: 5242880
  }
];

export const REVIEW_SAMPLES: ReviewSampleItem[] = [
  {
    id: 'RS-001',
    targetType: 'Entity Deep-Dive',
    targetIdentifier: 'CSE-17 (NRLDC PowerGrid)',
    entityCode: 'CSE-17',
    entityName: 'NRLDC PowerGrid',
    priorityScore: 92,
    reviewReason: 'Highest discrepancy index (68) combined with rapid off-hours alert batch closure and 38-hour gateway silence.',
    relatedFindingsCount: 5,
    diverseSampleRationale: 'Primary Tier-1 national core entity representing critical electricity grid telemetry.',
    assignedExaminer: 'R. Rao (Dy. Director, Supervisory Desk)',
    status: 'Examiner Accepted',
    samplingMethod: 'Risk-Weighted Discrepancy Sample'
  },
  {
    id: 'RS-002',
    targetType: 'Process Execution Audit',
    targetIdentifier: 'SOC-04 Lateral API Rule Deactivations',
    entityCode: 'SOC-04',
    entityName: 'NPCI Payments Switch',
    priorityScore: 84,
    reviewReason: '14-day rule deactivation period without recorded CAB change approval, suppressing 4,100 alerts.',
    relatedFindingsCount: 4,
    diverseSampleRationale: 'Banking & Financial sector high-volume switching infrastructure audit.',
    assignedExaminer: 'A. K. Sharma (Supervisory Examiner)',
    status: 'Proposed Sample',
    samplingMethod: 'High-Entropy Boundary Sample'
  },
  {
    id: 'RS-003',
    targetType: 'Incident Timeline Inspection',
    targetIdentifier: 'SOC-08 Clock Skew & Corrupted Batch',
    entityCode: 'SOC-08',
    entityName: 'IOCL Pipeline Control',
    priorityScore: 88,
    reviewReason: 'Cryptographic hash mismatch in historical archive accompanied by +42 min firewall timestamp drift.',
    relatedFindingsCount: 4,
    diverseSampleRationale: 'Critical petroleum SCADA pipeline infrastructure subject to strict IT Act Section 65B requirements.',
    assignedExaminer: 'Unassigned',
    status: 'Proposed Sample',
    samplingMethod: 'Risk-Weighted Discrepancy Sample'
  },
  {
    id: 'RS-004',
    targetType: 'Process Execution Audit',
    targetIdentifier: 'CSE-29 Weekend Shift Hand-off Latency',
    entityCode: 'CSE-29',
    entityName: 'CRIS Railways FOIS',
    priorityScore: 68,
    reviewReason: '12x escalation delay variance identified on weekend MSSP shift handovers.',
    relatedFindingsCount: 2,
    diverseSampleRationale: 'Stratified cross-sector coverage representing managed MSSP operational model.',
    assignedExaminer: 'Unassigned',
    status: 'Proposed Sample',
    samplingMethod: 'Stratified Sector Representation'
  },
  {
    id: 'RS-005',
    targetType: 'Incident Timeline Inspection',
    targetIdentifier: 'CAC-02 ADS-B Alert Threshold Inflation',
    entityCode: 'CAC-02',
    entityName: 'AAI Civil Aviation Hub',
    priorityScore: 74,
    reviewReason: 'Threshold inflation causing 84% artificial drop in reported radar spoofing incident reports.',
    relatedFindingsCount: 3,
    diverseSampleRationale: 'Civil aviation sector radar feed integrity check.',
    assignedExaminer: 'R. Rao (Dy. Director)',
    status: 'Proposed Sample',
    samplingMethod: 'High-Entropy Boundary Sample'
  }
];

export const DATA_QUALITY_METRICS = {
  totalReceived: 184500,
  processedClean: 168240,
  withWarnings: 13910,
  rejectedErrors: 2350,
  duplicateCount: 1420,
  schemaMismatches: 640,
  invalidTimestamps: 290
};

export const DATA_QUALITY_RECORDS: DataQualityRecord[] = [
  {
    id: 'DQR-1001',
    entityCode: 'SOC-08',
    timestamp: '2026-10-04 08:42:19 IST',
    recordType: 'Firewall Syslog',
    status: 'Warning',
    issueType: 'Invalid Timestamp Skew',
    details: 'Log entry header reports timestamp +42.3 minutes ahead of UTC ingestion clock.',
    originalPayloadSnippet: '<134>Oct 04 08:42:19 fw-panipat-01 kernel: [DENY_INGRESS] IN=eth0 OUT= SRC=185.220.101.5 DST=10.14.2.1 PROTO=TCP DPT=22'
  },
  {
    id: 'DQR-1002',
    entityCode: 'CSE-17',
    timestamp: '2026-10-02 05:58:14 IST',
    recordType: 'Analyst Incident Ticket',
    status: 'Warning',
    issueType: 'Missing Non-Critical Field',
    details: 'Resolution rationale field populated with generic boilerplate text ("resolved").',
    originalPayloadSnippet: '{"ticket_id":"TKT-991204","category":"OT_SIGNAL","status":"CLOSED","notes":"resolved"}'
  },
  {
    id: 'DQR-1003',
    entityCode: 'SOC-11',
    timestamp: '2026-10-03 14:10:02 IST',
    recordType: 'NetFlow Record',
    status: 'Rejected',
    issueType: 'Critical Schema Violation',
    details: 'Mandatory field "dst_as" and "protocol" missing from IPFIX template 302.',
    originalPayloadSnippet: 'IPFIX_TEMPLATE_302_ERROR: Malformed record chunk at byte offset 4096; missing field count 2'
  },
  {
    id: 'DQR-1004',
    entityCode: 'SOC-04',
    timestamp: '2026-10-03 21:05:44 IST',
    recordType: 'API Gateway Log',
    status: 'Clean',
    issueType: 'Valid Schema',
    details: 'Verified conformant with NCIIPC OpenTelemetry JSON schema v2.1.',
    originalPayloadSnippet: '{"event_id":"EV-98124","source":"api_gateway","ts":"2026-10-03T21:05:44Z","status":200}'
  },
  {
    id: 'DQR-1005',
    entityCode: 'CSE-29',
    timestamp: '2026-10-01 11:32:00 IST',
    recordType: 'MSSP Shift Handover Log',
    status: 'Warning',
    issueType: 'Duplicate Event Key',
    details: 'Duplicate ticket identifier TKT-FOIS-8491 submitted under two distinct analyst IDs.',
    originalPayloadSnippet: '{"ticket_id":"TKT-FOIS-8491","analyst_id":"OP_549","submit_time":"11:32:00"}'
  },
  {
    id: 'DQR-1006',
    entityCode: 'SOC-08',
    timestamp: '2026-10-04 11:20:00 IST',
    recordType: 'Historical Evidence Archive',
    status: 'Rejected',
    issueType: 'Critical Schema Violation',
    details: 'Checksum mismatch on uncompressed tarball header; block alignment failed.',
    originalPayloadSnippet: 'TAR_HEADER_CORRUPT: Computed checksum 0x7E14 does not match header declaration 0x6A02'
  }
];

export const INTEGRITY_BATCHES: EvidenceIntegrityBatch[] = [
  {
    batchId: 'BTH-2026-10-W1-A',
    timestamp: '2026-10-04 00:00:00 IST',
    entityCode: 'CSE-17',
    recordsCount: 42100,
    merkleRoot: '7d89b1c039f8214e9102837c4918237491028374910293847192837491029384',
    verificationStatus: 'Verified Reference Match',
    simulatedDisclaimer: 'Demo integrity verification executed against local synthetic reference register.',
    mismatchCount: 0,
    signatureAlgorithm: 'ECDSA-SHA256 (NCIIPC Root CA)'
  },
  {
    batchId: 'BTH-2026-10-W1-B',
    timestamp: '2026-10-04 02:00:00 IST',
    entityCode: 'SOC-04',
    recordsCount: 89400,
    merkleRoot: '3b8921e471928374910293847192837491029384719283749102938471928374',
    verificationStatus: 'Verified Reference Match',
    simulatedDisclaimer: 'Demo integrity verification executed against local synthetic reference register.',
    mismatchCount: 0,
    signatureAlgorithm: 'ECDSA-SHA256 (NCIIPC Root CA)'
  },
  {
    batchId: 'BTH-2026-09-W3-E',
    timestamp: '2026-10-04 06:00:00 IST',
    entityCode: 'SOC-08',
    recordsCount: 14800,
    merkleRoot: '9988776655443322110099887766554433221100998877665544332211009988',
    verificationStatus: 'Merkle Node Divergence',
    simulatedDisclaimer: 'Simulated verification failure for demonstration of evidentiary dispute handling.',
    mismatchCount: 3,
    signatureAlgorithm: 'ECDSA-SHA256 (Reference Invalidation)'
  },
  {
    batchId: 'BTH-2026-10-W1-C',
    timestamp: '2026-10-04 08:00:00 IST',
    entityCode: 'CAC-02',
    recordsCount: 18500,
    merkleRoot: '1122334455667788990011223344556677889900112233445566778899001122',
    verificationStatus: 'Integrity Verified',
    simulatedDisclaimer: 'Demo integrity verification executed against local synthetic reference register.',
    mismatchCount: 0,
    signatureAlgorithm: 'ECDSA-SHA256 (NCIIPC Root CA)'
  }
];

export const AUDIT_EVENTS: AuditEvent[] = [
  {
    id: 'AUD-0837',
    timestamp: '2026-10-05 08:37:12 IST',
    actor: 'R. Rao (Dy. Director, NCIIPC)',
    actorRole: 'Lead Examiner',
    eventType: 'Evidence Viewed',
    targetRecord: 'F-1024 (Claim-vs-Reality Mismatch)',
    entityCode: 'CSE Alpha',
    result: 'Examiner opened finding F-1024 and reviewed 4 cross-signal evidence items.'
  },
  {
    id: 'AUD-0836',
    timestamp: '2026-10-05 08:36:04 IST',
    actor: 'Evidence Fusion Engine',
    actorRole: 'System Daemon',
    eventType: 'Finding Created',
    targetRecord: 'F-1024 (Rapid Critical Alert Closure)',
    entityCode: 'CSE Alpha',
    result: 'Weighted signal fusion score 0.88 triggered finding F-1024 for human supervisory review.'
  },
  {
    id: 'AUD-0835',
    timestamp: '2026-10-05 08:35:10 IST',
    actor: 'Supervisory Analytics Engine',
    actorRole: 'System Daemon',
    eventType: 'Assessment Generated',
    targetRecord: 'Execution Gap & Negative Space Multi-Lens Pipeline',
    entityCode: 'ALL',
    result: 'Analytics completed across 125,430 records for 5 strategic CSE entities.'
  },
  {
    id: 'AUD-0834',
    timestamp: '2026-10-05 08:34:25 IST',
    actor: 'Local Cryptographic Ledger Daemon',
    actorRole: 'Integrity Verifier',
    eventType: 'Integrity Verification Performed',
    targetRecord: 'BTH-2026-10-W1-ALPHA (Merkle Root Sealed)',
    entityCode: 'CSE Alpha',
    result: 'Evidence ledger generated: 184 SHA-256 record hashes anchored to Merkle root 7b82...91de.'
  },
  {
    id: 'AUD-0833',
    timestamp: '2026-10-05 08:33:02 IST',
    actor: 'Data Quality Service',
    actorRole: 'ETL Pipeline',
    eventType: 'Validation Completed',
    targetRecord: 'Schema, Density, and Timestamp Skew Analyzer',
    entityCode: 'ALL',
    result: 'Data quality validation completed: 94% composite confidence score (Completeness 97%, Consistency 93%).'
  },
  {
    id: 'AUD-0832',
    timestamp: '2026-10-05 08:32:00 IST',
    actor: 'Data Ingestion Service',
    actorRole: 'ETL Pipeline',
    eventType: 'Data Import',
    targetRecord: 'INGEST-2026-Q3-CSE-MULTI',
    entityCode: 'ALL',
    result: 'Dataset imported: 125,430 records across 5 CSEs ingested with multi-format validation.'
  },
  {
    id: 'AUD-001',
    timestamp: '2026-10-04 19:45:12 IST',
    actor: 'R. Rao (Dy. Director, NCIIPC)',
    actorRole: 'Senior Supervisory Examiner',
    eventType: 'Examiner Decision Recorded',
    targetRecord: 'FND-2026-104 (NRLDC Off-Hours Batch Closure)',
    entityCode: 'CSE-17',
    result: 'Status updated to "Confirmed for Follow-up"; formal inquiry letter queued.'
  },
  {
    id: 'AUD-002',
    timestamp: '2026-10-04 18:20:00 IST',
    actor: 'Automated Integrity Daemon',
    actorRole: 'Background Verifier',
    eventType: 'Integrity Verification Performed',
    targetRecord: 'BTH-2026-09-W3-E',
    entityCode: 'SOC-08',
    result: 'Merkle tree divergence identified; 3 record hashes failed reference check.'
  },
  {
    id: 'AUD-003',
    timestamp: '2026-10-04 17:10:45 IST',
    actor: 'A. K. Sharma (Examiner)',
    actorRole: 'Technical Examiner',
    eventType: 'Evidence Viewed',
    targetRecord: 'EVD-9801 (Splunk Bulk Closure Macro)',
    entityCode: 'CSE-17',
    result: 'Payload snippet inspected and verified in sandbox environment.'
  },
  {
    id: 'AUD-004',
    timestamp: '2026-10-04 15:30:00 IST',
    actor: 'Supervisory Analytics Engine',
    actorRole: 'System Daemon',
    eventType: 'Assessment Generated',
    targetRecord: 'Q3 2026 Periodic Review Draft',
    entityCode: 'ALL',
    result: '7 Entities evaluated; 7 primary findings flagged across 6 categories.'
  },
  {
    id: 'AUD-005',
    timestamp: '2026-10-04 14:00:20 IST',
    actor: 'Supervisory Analytics Engine',
    actorRole: 'System Daemon',
    eventType: 'Finding Created',
    targetRecord: 'FND-2026-106 (NPCI Rule Suppression)',
    entityCode: 'SOC-04',
    result: 'Execution gap finding created based on 14-day rule deactivation history.'
  },
  {
    id: 'AUD-006',
    timestamp: '2026-10-04 11:15:00 IST',
    actor: 'R. Rao (Dy. Director)',
    actorRole: 'Senior Supervisory Examiner',
    eventType: 'Review Sample Generated',
    targetRecord: 'RS-001 (NRLDC PowerGrid Deep-Dive)',
    entityCode: 'CSE-17',
    result: 'Accepted proposed sample for priority on-site inspection docket.'
  },
  {
    id: 'AUD-007',
    timestamp: '2026-10-04 09:00:00 IST',
    actor: 'Data Ingestion Service',
    actorRole: 'ETL Pipeline',
    eventType: 'Data Import',
    targetRecord: 'INGEST-2026-10-04-DAILY',
    entityCode: 'ALL',
    result: '184,500 records imported; 168,240 clean, 2,350 rejected for schema errors.'
  }
];

export const DASHBOARD_TRENDS = [
  { day: 'Mon', alertsGenerated: 24200, closedWithinSLA: 23500, escalatedL2: 1200, discrepancyIndex: 42 },
  { day: 'Tue', alertsGenerated: 28400, closedWithinSLA: 27100, escalatedL2: 1450, discrepancyIndex: 44 },
  { day: 'Wed', alertsGenerated: 31200, closedWithinSLA: 29800, escalatedL2: 1600, discrepancyIndex: 48 },
  { day: 'Thu', alertsGenerated: 35600, closedWithinSLA: 33400, escalatedL2: 1720, discrepancyIndex: 56 },
  { day: 'Fri', alertsGenerated: 42100, closedWithinSLA: 39800, escalatedL2: 2100, discrepancyIndex: 64 },
  { day: 'Sat', alertsGenerated: 29800, closedWithinSLA: 28900, escalatedL2: 890, discrepancyIndex: 78 },
  { day: 'Sun', alertsGenerated: 26400, closedWithinSLA: 25800, escalatedL2: 740, discrepancyIndex: 72 }
];

export const CATEGORY_DISTRIBUTION = [
  { name: 'Execution Gap', count: 6, color: '#D97706' }, // Muted Amber
  { name: 'Negative Space', count: 4, color: '#7C3AED' }, // Subtle Purple
  { name: 'Peer & Anomaly', count: 5, color: '#059669' }, // Sage / Emerald
  { name: 'Goodhart Lens', count: 3, color: '#C2410C' }, // Warm Rust
  { name: 'Data Quality', count: 4, color: '#57534E' }, // Warm Charcoal
  { name: 'Evidence Integrity', count: 3, color: '#9333EA' } // Violet
];

export const REVIEW_QUEUE_ITEMS: ReviewQueueItem[] = [
  {
    id: 'RQ-101',
    priority: 'HIGH',
    findingId: 'F-1024',
    findingTitle: 'Fast Critical Alert Closure Without Escalation',
    entity: 'CSE Alpha',
    entityId: 'cse-alpha',
    reason: 'Critical alerts resolved in 3 min median vs peer median 47 min (-93.6% gap). 0% escalation to Tier-2 despite critical severity tag.',
    evidence: '184 records (ALT-98213, ALT-98219, ALT-98224, etc.)',
    suggestedAction: 'Request analyst terminal logs for 10:03-10:06 IST & inspect Tier-1 automated closing scripts.',
    peerContext: 'National peer median is 47 min with 14.2% escalation rate. CSE Alpha is in the bottom 1st percentile.',
    suggestedQuestions: [
      'What automated tool or script was executing under Analyst ID A-14 at 10:03–10:06 IST when multiple critical alerts were closed in under 3 minutes?',
      'Why was there zero escalation to Tier-2 incident response leads despite active Trojan/C2 payload indicators in signature ALT-98213?',
      'Has automated alert suppression been configured to artificially satisfy statutory MTTR metrics?',
      'Can the SOC produce forensic screen recordings or analyst terminal command-line logs corresponding to these closure timestamps?'
    ]
  },
  {
    id: 'RQ-102',
    priority: 'HIGH',
    findingId: 'F-1027',
    findingTitle: 'Prolonged Telemetry Silence on Critical Asset',
    entity: 'CSE Alpha',
    entityId: 'cse-alpha',
    reason: 'Zero alert telemetry received from PAYMENT-DB-01 across 47 consecutive days against an expected baseline of 40–70 alerts/week.',
    evidence: '7 periodic health heartbeats, 0 operational alerts',
    suggestedAction: 'Verify log forwarder agent status on PAYMENT-DB-01 and inspect SIEM ingestion pipeline filters.',
    peerContext: 'Comparable banking/payment database clusters across 4 peers maintain steady 45–65 alerts/week telemetry.',
    suggestedQuestions: [
      'When was the log forwarder daemon on PAYMENT-DB-01 last reconfigured or updated?',
      'Were any syslog suppression or regex exclusion filters applied at the syslog collector or SIEM forwarder level?',
      'Can the entity demonstrate live test alert generation from PAYMENT-DB-01 to confirm pipeline continuity?'
    ]
  },
  {
    id: 'RQ-103',
    priority: 'MEDIUM',
    findingId: 'F-1031',
    findingTitle: 'Template-Driven Repetitive Investigation Notes',
    entity: 'CSE Beta',
    entityId: 'cse-beta',
    reason: 'Cosine similarity of 84% across 43 critical case notes. Identical boilerplate text used across distinct threat classifications.',
    evidence: '43 case files sharing identical 14-word closing comments',
    suggestedAction: 'Audit SOC standard operating procedure on case disposition and investigate copy-paste habits.',
    peerContext: 'Peer investigation note semantic similarity averages 0.28, reflecting customized analytical investigations.',
    suggestedQuestions: [
      'Does the SOC ticketing platform utilize automated auto-fill or macro templates for alert disposition?',
      'Were actual root-cause investigations performed for cases CS-8821 through CS-8864 prior to applying the boilerplate comment?'
    ]
  },
  {
    id: 'RQ-104',
    priority: 'MEDIUM',
    findingId: 'F-1038',
    findingTitle: 'Total Absence of Ransomware / Lateral Movement Telemetry',
    entity: 'CSE Delta',
    entityId: 'cse-delta',
    reason: 'Zero records generated in Ransomware and Lateral Movement categories for 60+ days despite active Windows Domain Controller infrastructure.',
    evidence: '12 weekly reporting cycles with 0 events in category',
    suggestedAction: 'Review endpoint detection rule deployment status and inspect Windows Event ID 4624/4672 collection.',
    peerContext: 'Peer baseline averages 4.2 low-confidence lateral movement probes per week.',
    suggestedQuestions: [
      'Are Sysmon Event ID 1 (Process Creation) and Event ID 3 (Network Connection) active on Domain Controllers?',
      'Why are lateral movement correlation rules disabled in the active SIEM correlation rule pack?'
    ]
  },
  {
    id: 'RQ-105',
    priority: 'LOW',
    findingId: 'F-1042',
    findingTitle: 'Shift Handover Latency Spike During Weekend Operations',
    entity: 'CSE Beta',
    entityId: 'cse-beta',
    reason: 'Escalation response latency increases from 14 minutes on weekdays to 184 minutes during Saturday-Sunday shift transition.',
    evidence: '29 weekend escalation records across the past 4 weekends',
    suggestedAction: 'Examine weekend staffing schedules and Tier-1 MSSP escalation SLAs.',
    peerContext: 'Peer weekend escalation variance is within +35% of weekday baseline; CSE Beta exhibits +1,214% variance.',
    suggestedQuestions: [
      'Is there physical or remote Tier-2 presence during weekend shift handovers (06:00 and 18:00 IST)?',
      'What escalation notification mechanism is utilized when on-call Tier-2 personnel are off-site?'
    ]
  }
];
