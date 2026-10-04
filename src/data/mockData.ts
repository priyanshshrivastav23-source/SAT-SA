import { CSEEntity, Finding, ExecutionGapCategory, AlertMetric, InvestigationCase, EvidenceItem, AuditLogEntry } from '../types';

export const INITIAL_CSE_ENTITIES: CSEEntity[] = [
  {
    id: 'cse-1',
    code: 'CSE-17',
    name: 'Northern Regional Load Despatch Centre (NRLDC - PowerGrid)',
    sector: 'Power & Energy',
    criticalityTier: 'Tier-1 (National Core)',
    socType: 'Internal SOC',
    siemPlatform: 'Splunk Enterprise Security v9.2',
    dailyAlertVolume: 34200,
    unreviewedSignals: 6,
    confirmedConcerns: 2,
    lastAuditDate: '2026-09-28',
    supervisorStatus: 'Action Required',
    location: 'New Delhi, NCR',
    nodalOfficer: 'Shri Arvind K. Saxena (CISO)'
  },
  {
    id: 'cse-2',
    code: 'SOC-04',
    name: 'National Unified Payments Switch (NPCI Core Switching)',
    sector: 'Banking & Finance',
    criticalityTier: 'Tier-1 (National Core)',
    socType: 'Hybrid Centralized',
    siemPlatform: 'QRadar SIEM Cloud',
    dailyAlertVolume: 89400,
    unreviewedSignals: 4,
    confirmedConcerns: 3,
    lastAuditDate: '2026-10-01',
    supervisorStatus: 'Under Investigation',
    location: 'Mumbai, Maharashtra',
    nodalOfficer: 'Smt. Radhika Subramanian (Head of Cyber Security)'
  },
  {
    id: 'cse-3',
    code: 'CAC-02',
    name: 'Air Traffic Flow Management & Radar Feed Network (AAI Hub)',
    sector: 'Civil Aviation',
    criticalityTier: 'Tier-1 (National Core)',
    socType: 'Internal SOC',
    siemPlatform: 'Elastic Security Cluster',
    dailyAlertVolume: 18500,
    unreviewedSignals: 3,
    confirmedConcerns: 1,
    lastAuditDate: '2026-09-15',
    supervisorStatus: 'Pending Evidence',
    location: 'Indira Gandhi International Airport, New Delhi',
    nodalOfficer: 'Wg Cdr (Retd.) Prakash Nambiar'
  },
  {
    id: 'cse-4',
    code: 'CSE-29',
    name: 'Freight Operations Information System (FOIS - CRIS)',
    sector: 'Railways & Transport',
    criticalityTier: 'Tier-2 (Critical Sectoral)',
    socType: 'Managed MSSP',
    siemPlatform: 'Microsoft Sentinel (Gov Cloud)',
    dailyAlertVolume: 22100,
    unreviewedSignals: 5,
    confirmedConcerns: 1,
    lastAuditDate: '2026-09-22',
    supervisorStatus: 'Action Required',
    location: 'Chanakyapuri, New Delhi',
    nodalOfficer: 'Dr. Sudheer Varma (Executive Director - IT)'
  },
  {
    id: 'cse-5',
    code: 'SOC-08',
    name: 'Hydrocarbon Cross-Country Pipeline SCADA Central SOC (IOCL)',
    sector: 'Petroleum & Gas',
    criticalityTier: 'Tier-1 (National Core)',
    socType: 'Internal SOC',
    siemPlatform: 'ArcSight ESM 7.6',
    dailyAlertVolume: 14700,
    unreviewedSignals: 2,
    confirmedConcerns: 0,
    lastAuditDate: '2026-09-30',
    supervisorStatus: 'Compliant',
    location: 'Panipat / Mathura Regional Node',
    nodalOfficer: 'Shri Devender Singhal (Chief General Manager - IS)'
  },
  {
    id: 'cse-6',
    code: 'SOC-11',
    name: 'National Core Fiber Backbone & Submarine Cable Terminal (BSNL/DoT)',
    sector: 'Telecom & IT',
    criticalityTier: 'Tier-1 (National Core)',
    socType: 'Managed MSSP',
    siemPlatform: 'Splunk Cloud Gov',
    dailyAlertVolume: 61300,
    unreviewedSignals: 7,
    confirmedConcerns: 4,
    lastAuditDate: '2026-09-19',
    supervisorStatus: 'Action Required',
    location: 'Chennai Gateway Node, Tamil Nadu',
    nodalOfficer: 'Shri K. R. Ramanathan (General Manager - Cyber Sec)'
  },
  {
    id: 'cse-7',
    code: 'CSE-05',
    name: 'Nuclear Reactor Substation Remote Telemetry Link (NPCIL)',
    sector: 'Strategic & Defence',
    criticalityTier: 'Tier-1 (National Core)',
    socType: 'Internal SOC (Air-Gapped Telemetry)',
    siemPlatform: 'Wazuh Isolated Node',
    dailyAlertVolume: 6200,
    unreviewedSignals: 1,
    confirmedConcerns: 0,
    lastAuditDate: '2026-10-02',
    supervisorStatus: 'Compliant',
    location: 'Tarapur Atomic Power Station Node',
    nodalOfficer: 'Dr. Mihir Sengupta (Director - Instrumentation & Security)'
  }
];

export const INITIAL_FINDINGS: Finding[] = [
  {
    id: 'FND-2026-0814',
    cseId: 'cse-1',
    cseCode: 'CSE-17',
    cseName: 'Northern Regional Load Despatch Centre (PowerGrid)',
    sector: 'Power & Energy',
    title: 'Repeated Bulk Closure of High-Priority SCADA Telemetry Alerts Without Payload Review',
    category: 'Premature False-Positive Disposal',
    priority: 'Critical',
    signalScore: 94,
    detectedAt: '2026-10-03 14:22:10 IST',
    ruleId: 'SAT-RUL-DISP-09',
    description: 'System detected that 47 high-severity ICS Modbus protocol anomaly alerts were closed by Shift Analyst L1-09 within an average elapsed time of 19 seconds per alert.',
    systemObservation: 'SOC Tier-1 analyst disposed of repeated Modbus function code anomalies as "Known Calibration Jitter" with generic template comments. Telemetry logs indicate no query was dispatched to the substation engineering historian.',
    potentialImpact: 'Possibility of unverified OT unauthorized command injection or reconnaissance remaining uninvestigated in the Northern Grid distribution bus.',
    evidenceCount: 4,
    status: 'Pending Review',
    evidenceIds: ['EVD-901', 'EVD-902', 'EVD-903', 'EVD-904']
  },
  {
    id: 'FND-2026-0809',
    cseId: 'cse-2',
    cseCode: 'SOC-04',
    cseName: 'National Unified Payments Switch (NPCI Core)',
    sector: 'Banking & Finance',
    title: 'Off-Hours Syslog Forwarding Cessation on HSM Cryptographic Hardware Gateway',
    category: 'Log Ingestion Blindspot',
    priority: 'Critical',
    signalScore: 91,
    detectedAt: '2026-10-02 23:40:00 IST',
    ruleId: 'SAT-RUL-INGEST-03',
    description: 'Cryptographic Hardware Security Module (HSM) syslog feed experienced a 4-hour 18-minute telemetry blackout during the Sunday night maintenance window.',
    systemObservation: 'No failover buffer received by SIEM between 01:42 and 06:00 IST. The SOC health dashboard showed the agent as disconnected, but no supervisor or on-call engineer was notified per SOP Section 4.3.',
    potentialImpact: 'Undetected key rotation tampering, credential replay attempts, or unauthorized access attempts during dark hours.',
    evidenceCount: 3,
    status: 'Confirmed Concern',
    supervisorRemarks: 'NCIIPC Directive dispatched to CISO. Ingestion gap confirmed via collector syslog heartbeat drop. Formal explanation requested within 48 hours.',
    reviewedBy: 'Rajeshwar Rao (Dy. Director, NCIIPC)',
    reviewedAt: '2026-10-03 09:15:00 IST',
    evidenceIds: ['EVD-905', 'EVD-906', 'EVD-907']
  },
  {
    id: 'FND-2026-0792',
    cseId: 'cse-6',
    cseCode: 'SOC-11',
    cseName: 'National Core Fiber Backbone (BSNL/DoT)',
    sector: 'Telecom & IT',
    title: 'Triage Queue Latency Exceeding 52 Hours on Border Gateway BGP Flapping Alerts',
    category: 'Alert Triage Stagnation',
    priority: 'Critical',
    signalScore: 88,
    detectedAt: '2026-10-01 17:15:00 IST',
    ruleId: 'SAT-RUL-TRIAGE-01',
    description: 'Over 130 BGP route leak and hijacking heuristic alerts remained in the unassigned triage pool for more than 52 consecutive hours.',
    systemObservation: 'Alert creation rate exceeded Tier-1 analyst triage capacity by 280%. The MSSP contracted provider failed to trigger surge staffing protocols as mandated by NCIIPC Guidelines 2024.',
    potentialImpact: 'Extended dwell time for malicious route diversion or nation-state adversary traffic tapping.',
    evidenceCount: 3,
    status: 'Pending Review',
    evidenceIds: ['EVD-908', 'EVD-909', 'EVD-910']
  },
  {
    id: 'FND-2026-0785',
    cseId: 'cse-3',
    cseCode: 'CAC-02',
    cseName: 'Air Traffic Radar Feed Network (AAI Hub)',
    sector: 'Civil Aviation',
    title: 'Deactivation of Correlation Rule for ADS-B Flight Plan Mismatch',
    category: 'Detection Rule Deactivation',
    priority: 'High',
    signalScore: 82,
    detectedAt: '2026-09-30 11:10:45 IST',
    ruleId: 'SAT-RUL-RULE-07',
    description: 'Correlation rule SIEM-AV-8802 (ADS-B Beacon Spoofing and Unauthorized Altitude Deviation) was disabled without documented Change Management Ticket.',
    systemObservation: 'Audit logs indicate admin account "secops_admin3" set rule state to Inactive at 22:04 IST. The internal justification field stated "Suppressing false radar reflections during runway maintenance".',
    potentialImpact: 'Lack of telemetry detection for spoofed transponder beacons or unauthorized drone telemetry interference.',
    evidenceCount: 2,
    status: 'Requires Information',
    supervisorRemarks: 'Requested formal Change Advisory Board (CAB) minutes and technical validation from AAI Directorate of Airspace Safety.',
    reviewedBy: 'Rajeshwar Rao (Dy. Director, NCIIPC)',
    reviewedAt: '2026-10-01 14:30:20 IST',
    evidenceIds: ['EVD-911', 'EVD-912']
  },
  {
    id: 'FND-2026-0771',
    cseId: 'cse-4',
    cseCode: 'CSE-29',
    cseName: 'Freight Operations Information System (FOIS - CRIS)',
    sector: 'Railways & Transport',
    title: 'Containment Delay on Ransomware Canary File Access in Zonal Server',
    category: 'Escalation Protocol Divergence',
    priority: 'High',
    signalScore: 79,
    detectedAt: '2026-09-29 04:12:00 IST',
    ruleId: 'SAT-RUL-ESCAL-04',
    description: 'Canary honeypot file modification alert in Eastern Railway rake dispatch node sat unescalated to L2 for 6 hours 45 minutes.',
    systemObservation: 'SOP mandates immediate host network quarantine within 30 minutes. Analyst instead initiated manual ping verification and did not notify the on-call incident response team.',
    potentialImpact: 'Lateral traversal of ransomware threat actors into national rolling stock scheduling database.',
    evidenceCount: 2,
    status: 'Pending Review',
    evidenceIds: ['EVD-913', 'EVD-914']
  },
  {
    id: 'FND-2026-0754',
    cseId: 'cse-1',
    cseCode: 'CSE-17',
    cseName: 'Northern Regional Load Despatch Centre (PowerGrid)',
    sector: 'Power & Energy',
    title: 'Weekend Night Shift Telemetry Gap on Substation Phasor Measurement Units (PMU)',
    category: 'Off-Hours Unmonitored Interval',
    priority: 'Medium',
    signalScore: 68,
    detectedAt: '2026-09-27 03:00:00 IST',
    ruleId: 'SAT-RUL-INGEST-08',
    description: 'Periodic 20-minute heartbeat drop on WAMS (Wide Area Measurement System) telemetry collector observed during weekend midnight hours.',
    systemObservation: 'Bandwidth throttling policy between substation WAN and central SOC caused dropped telemetry packets during scheduled backup transfer.',
    potentialImpact: 'Intermittent blind spots during low-load grid transition hours.',
    evidenceCount: 2,
    status: 'Not a Concern',
    supervisorRemarks: 'Confirmed with NRLDC that scheduled QoS prioritizing grid safety telemetry was functioning. Packets were buffered locally at RTU and forwarded upon backup completion without data loss.',
    reviewedBy: 'Rajeshwar Rao (Dy. Director, NCIIPC)',
    reviewedAt: '2026-09-29 16:45:00 IST',
    evidenceIds: ['EVD-915', 'EVD-916']
  },
  {
    id: 'FND-2026-0740',
    cseId: 'cse-5',
    cseCode: 'SOC-08',
    cseName: 'Hydrocarbon Cross-Country Pipeline SCADA (IOCL)',
    sector: 'Petroleum & Gas',
    title: 'Minor Deviation in Firewall Change Log Time Synchronization',
    category: 'Log Ingestion Blindspot',
    priority: 'Low',
    signalScore: 42,
    detectedAt: '2026-09-25 18:20:00 IST',
    ruleId: 'SAT-RUL-TIME-02',
    description: 'NTP drift of 4.2 seconds between perimeter firewall and central SIEM collector node in pipeline terminal.',
    systemObservation: 'Drift resolved automatically via secondary Stratum-1 atomic clock reference within 12 minutes.',
    potentialImpact: 'Negligible impact on event sequence correlation.',
    evidenceCount: 1,
    status: 'Not a Concern',
    supervisorRemarks: 'Self-corrected by secondary NTP server. Verified against Stratum-1 telemetry.',
    reviewedBy: 'Rajeshwar Rao (Dy. Director, NCIIPC)',
    reviewedAt: '2026-09-26 10:15:00 IST',
    evidenceIds: ['EVD-917']
  }
];

export const EXECUTION_GAP_CATEGORIES: ExecutionGapCategory[] = [
  {
    id: 'GAP-01',
    name: 'Alert Triage Stagnation',
    severity: 'Critical',
    description: 'Alerts remaining in unprocessed or unassigned SOC queues beyond the mandated 4-hour initial triage SLA threshold.',
    detectedInstances: 142,
    affectedEntities: 5,
    avgResolutionDelayHours: 26.4,
    regulatoryStandard: 'NCIIPC Guidelines Sec 5.2 (Timely Triage of High-Priority Telemetry)',
    trend: 'increasing'
  },
  {
    id: 'GAP-02',
    name: 'Premature False-Positive Disposal',
    severity: 'Critical',
    description: 'High and Critical severity alerts marked as False Positive in under 60 seconds without attached forensic log verification or PCAP validation.',
    detectedInstances: 98,
    affectedEntities: 4,
    avgResolutionDelayHours: 0.3,
    regulatoryStandard: 'NCIIPC Cyber Incident Management SOP 3.1.2 (Mandatory Corroboration)',
    trend: 'increasing'
  },
  {
    id: 'GAP-03',
    name: 'Log Ingestion Blindspots & Dropouts',
    severity: 'Critical',
    description: 'Critical CII telemetry streams (SCADA RTU, EDR, Firewall, HSM) experiencing intermittent or sustained feed silence during operational windows.',
    detectedInstances: 64,
    affectedEntities: 6,
    avgResolutionDelayHours: 8.5,
    regulatoryStandard: 'CERT-In Directive 2022 & NCIIPC CII Protection Framework Sec 4.1',
    trend: 'stable'
  },
  {
    id: 'GAP-04',
    name: 'Detection Rule Deactivation / Tampering',
    severity: 'High',
    description: 'Core correlation and behavioral detection rules disabled or threshold-diluted without approved CAB change management documentation.',
    detectedInstances: 31,
    affectedEntities: 3,
    avgResolutionDelayHours: 72.0,
    regulatoryStandard: 'NCIIPC Baseline Security Standard (BSS) Sec 7.4 (Detection Integrity)',
    trend: 'decreasing'
  },
  {
    id: 'GAP-05',
    name: 'Escalation Protocol Divergence',
    severity: 'High',
    description: 'Confirmed security incidents taking longer than 6 hours to notify NCIIPC / CERT-In national incident coordination centers.',
    detectedInstances: 19,
    affectedEntities: 3,
    avgResolutionDelayHours: 14.2,
    regulatoryStandard: 'Statutory 6-Hour Reporting Mandate under IT Act Sec 70B & Directions',
    trend: 'stable'
  },
  {
    id: 'GAP-06',
    name: 'Off-Hours Unmonitored Intervals',
    severity: 'Medium',
    description: 'Reduced analyst active presence or delayed coverage handover during graveyard shifts (00:00 - 07:00 IST) and national holidays.',
    detectedInstances: 43,
    affectedEntities: 4,
    avgResolutionDelayHours: 5.8,
    regulatoryStandard: 'NCIIPC 24x7 Continuous SOC Readiness Mandate',
    trend: 'decreasing'
  }
];

export const ALERT_METRICS: AlertMetric[] = [
  {
    id: 'ALT-MTR-01',
    cseCode: 'CSE-17',
    alertName: 'SCADA Modbus Function Code 0x05/0x06 Coil Force Attempt',
    sourceSystem: 'Substation Network IDS (Suricata)',
    totalGenerated: 248,
    autoSuppressed: 14,
    triagedWithinSLA: 122,
    triagedPastSLA: 65,
    prematurelyClosed: 47,
    escalatedToL2: 12,
    avgTriageTimeMinutes: 18.5,
    anomalyFlag: true
  },
  {
    id: 'ALT-MTR-02',
    cseCode: 'SOC-04',
    alertName: 'API Gateway Anomalous Burst on IMPS Settlement Endpoint',
    sourceSystem: 'WAF & API Shield (Cloudflare Gov)',
    totalGenerated: 890,
    autoSuppressed: 410,
    triagedWithinSLA: 420,
    triagedPastSLA: 42,
    prematurelyClosed: 18,
    escalatedToL2: 44,
    avgTriageTimeMinutes: 12.2,
    anomalyFlag: false
  },
  {
    id: 'ALT-MTR-03',
    cseCode: 'SOC-11',
    alertName: 'BGP Prefix Hijack / AS-Path Length Anomaly',
    sourceSystem: 'BGP Telemetry Engine (BMS-Core)',
    totalGenerated: 310,
    autoSuppressed: 15,
    triagedWithinSLA: 85,
    triagedPastSLA: 192,
    prematurelyClosed: 18,
    escalatedToL2: 25,
    avgTriageTimeMinutes: 74.0,
    anomalyFlag: true
  },
  {
    id: 'ALT-MTR-04',
    cseCode: 'CAC-02',
    alertName: 'ADS-B Radar Track Discontinuity & Transponder Code 7700',
    sourceSystem: 'Eurocat Air Traffic Management Cluster',
    totalGenerated: 42,
    autoSuppressed: 2,
    triagedWithinSLA: 38,
    triagedPastSLA: 2,
    prematurelyClosed: 0,
    escalatedToL2: 8,
    avgTriageTimeMinutes: 4.8,
    anomalyFlag: false
  },
  {
    id: 'ALT-MTR-05',
    cseCode: 'CSE-29',
    alertName: 'EDR LSASS Memory Dump Heuristic on Domain Controller',
    sourceSystem: 'CrowdStrike Falcon Sensor',
    totalGenerated: 16,
    autoSuppressed: 0,
    triagedWithinSLA: 8,
    triagedPastSLA: 6,
    prematurelyClosed: 2,
    escalatedToL2: 7,
    avgTriageTimeMinutes: 46.2,
    anomalyFlag: true
  },
  {
    id: 'ALT-MTR-06',
    cseCode: 'SOC-08',
    alertName: 'OPC-UA Authentication Brute Force on Valve SCADA Server',
    sourceSystem: 'Nozomi Guardian OT Sensor',
    totalGenerated: 78,
    autoSuppressed: 4,
    triagedWithinSLA: 71,
    triagedPastSLA: 3,
    prematurelyClosed: 0,
    escalatedToL2: 9,
    avgTriageTimeMinutes: 9.1,
    anomalyFlag: false
  }
];

export const INVESTIGATION_CASES: InvestigationCase[] = [
  {
    id: 'CASE-NCIIPC-2026-031',
    cseCode: 'CSE-17',
    cseName: 'PowerGrid NRLDC',
    title: 'Investigation into Uncorrelated Modbus Coil Override in Agra 765kV Substation Node',
    incidentType: 'OT SCADA Reconnaissance / Potential Unauthorized Switching Command',
    assignedAnalyst: 'Pooja Verma (SOC L2 Lead)',
    initialAlertTime: '2026-10-02 21:14:00 IST',
    analystPickupTime: '2026-10-03 01:45:00 IST',
    containmentTime: '2026-10-03 09:30:00 IST',
    totalDurationHours: 12.2,
    nciipcThresholdHours: 4.0,
    delayReason: 'SIEM Log Incompleteness',
    evidenceIds: ['EVD-901', 'EVD-902', 'EVD-904'],
    supervisorStatus: 'Confirmed Concern',
    supervisorNotes: 'Substation engineering historian logs had dropped 32 minutes of network PCAP due to disk saturation at RTU edge collector. Analyst had to request physical dispatch.'
  },
  {
    id: 'CASE-NCIIPC-2026-029',
    cseCode: 'SOC-04',
    cseName: 'NPCI Core Switching',
    title: 'HSM Cryptographic Key Manager Syslog Feed Silence During Reconciliation',
    incidentType: 'Security Appliance Telemetry Drop / Unauthorized Configuration Attempt',
    assignedAnalyst: 'Rohan Deshmukh (Crypto SecOps)',
    initialAlertTime: '2026-10-02 01:42:00 IST',
    analystPickupTime: '2026-10-02 06:15:00 IST',
    containmentTime: '2026-10-02 11:20:00 IST',
    totalDurationHours: 9.6,
    nciipcThresholdHours: 4.0,
    delayReason: 'Off-Hours Staffing Deficit',
    evidenceIds: ['EVD-905', 'EVD-906'],
    supervisorStatus: 'Confirmed Concern',
    supervisorNotes: 'Only 1 junior contractor analyst was present on physical duty floor during weekend night window. Automated PagerDuty escalation failed to reach Primary On-Call.'
  },
  {
    id: 'CASE-NCIIPC-2026-027',
    cseCode: 'SOC-11',
    cseName: 'BSNL National Core Fiber',
    title: 'BGP Route Hijack Announcement Propagating via Autonomous System AS-9812',
    incidentType: 'National Telecom Transit Path Manipulation',
    assignedAnalyst: 'Mohit Saxena (MSSP Lead Analyst)',
    initialAlertTime: '2026-10-01 11:00:00 IST',
    analystPickupTime: '2026-10-02 14:15:00 IST',
    containmentTime: '2026-10-02 21:00:00 IST',
    totalDurationHours: 34.0,
    nciipcThresholdHours: 4.0,
    delayReason: 'Third-Party MSSP Routing Latency',
    evidenceIds: ['EVD-908', 'EVD-909'],
    supervisorStatus: 'Requires Information',
    supervisorNotes: 'MSSP escalation ticket was assigned to an unmonitored general mailbox queue instead of the 24x7 Priority Telemetry Desk.'
  },
  {
    id: 'CASE-NCIIPC-2026-024',
    cseCode: 'CSE-29',
    cseName: 'CRIS Indian Railways',
    title: 'Canary Honeypot Execution on Eastern Freight Logistics Master Server',
    incidentType: 'Ransomware Pre-Execution Probe / Privilege Escalation',
    assignedAnalyst: 'Vikram Joshi (Incident Response)',
    initialAlertTime: '2026-09-29 04:12:00 IST',
    analystPickupTime: '2026-09-29 10:57:00 IST',
    containmentTime: '2026-09-29 14:30:00 IST',
    totalDurationHours: 10.3,
    nciipcThresholdHours: 4.0,
    delayReason: 'Delayed L2 Escalation Hand-off',
    evidenceIds: ['EVD-913', 'EVD-914'],
    supervisorStatus: 'Pending Review'
  }
];

export const INITIAL_EVIDENCE_ITEMS: EvidenceItem[] = [
  {
    id: 'EVD-901',
    findingId: 'FND-2026-0814',
    cseCode: 'CSE-17',
    artifactType: 'PCAP Flow Sample',
    timestamp: '2026-10-03 14:18:22 IST',
    sha256Checksum: '8f72a9b3d14e056c7104b2e88a3f89012cd4e671b938a10ef28c4109b827e8a1',
    summary: 'Wireshark dump of Modbus TCP traffic on port 502 originating from unregistered engineering workstation IP 10.244.18.92 targeting RTU controller.',
    rawPayloadSnippet: `Frame 4102: 74 bytes on wire (592 bits)
Transmission Control Protocol, Src Port: 49182, Dst Port: 502, Seq: 1, Ack: 1
Modbus/TCP
  Transaction Identifier: 0x4a12
  Protocol Identifier: 0 (Modbus)
  Length: 6
  Unit Identifier: 1
Modbus
  Function Code: 0x05 (Write Single Coil)
  Output Address: 0x0021 (Bus Tie Breaker Interlock)
  Output Value: 0xff00 (FORCED CLOSED)`,
    sourceIp: '10.244.18.92',
    targetAsset: 'RTU-AGRA-765-CB01',
    flaggedAnomalyReason: 'Forced override sent outside permitted maintenance schedule window.'
  },
  {
    id: 'EVD-902',
    findingId: 'FND-2026-0814',
    cseCode: 'CSE-17',
    artifactType: 'SOC Analyst Shift Log',
    timestamp: '2026-10-03 14:22:10 IST',
    sha256Checksum: '4a1b02cd4e78901f6543a2b1c8e9f0123456789abcdef0123456789abcdef012',
    summary: 'Shift disposition record entered by Tier-1 Analyst L1-09 in ITSM ticketing system.',
    rawPayloadSnippet: `{
  "ticket_id": "SOC-INC-991827",
  "disposition": "FALSE_POSITIVE",
  "closure_code": "ROUTINE_CALIBRATION",
  "resolution_seconds": 19,
  "analyst_id": "L1-09-ANALYST",
  "comments": "Observed calibration fluctuation on bus telemetry. No impact reported.",
  "pcap_attached": false,
  "historian_verified": false
}`,
    sourceIp: '192.168.10.45',
    targetAsset: 'NRLDC-SIEM-SOAR',
    flaggedAnomalyReason: 'Closure under 20 seconds without verifying engineering historian.'
  },
  {
    id: 'EVD-905',
    findingId: 'FND-2026-0809',
    cseCode: 'SOC-04',
    artifactType: 'SIEM Query Log',
    timestamp: '2026-10-02 01:42:00 IST',
    sha256Checksum: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    summary: 'SIEM collector heartbeat loss log showing zero ingest events from HSM cluster node.',
    rawPayloadSnippet: `[2026-10-02T01:42:15.004Z] WARN  collector-daemon: Host 'hsm-core-prod-02.npci.local' heartbeat missed (count: 3).
[2026-10-02T01:45:00.000Z] ERROR collector-daemon: Telemetry feed disconnected. Ingestion pipeline dropped to 0 EPS.
[2026-10-02T06:00:22.118Z] INFO  collector-daemon: Telemetry feed re-established. Buffer drained: 0 bytes (No local queue configured).`,
    sourceIp: '10.100.4.12',
    targetAsset: 'HSM-CLUSTER-PROD',
    flaggedAnomalyReason: '4+ hours of missing security telemetry on Tier-1 payment encryption cluster.'
  },
  {
    id: 'EVD-908',
    findingId: 'FND-2026-0792',
    cseCode: 'SOC-11',
    artifactType: 'Firewall Syslog Extract',
    timestamp: '2026-10-01 17:15:00 IST',
    sha256Checksum: '12d345e67f8901ab234cd567ef8901ab234cd567ef8901ab234cd567ef8901ab',
    summary: 'BGP daemon syslog showing unauthorized origin Autonomous System announcing national core IP blocks.',
    rawPayloadSnippet: `Oct 01 17:15:01 core-gw-chn-01 bgpd[1492]: %BGP-4-PREFIX_HIJACK: ASN 4755 detected advertising foreign subnet 103.24.8.0/22 with unvalidated RPKI ROA state 'INVALID'
Oct 01 17:15:05 core-gw-chn-01 bgpd[1492]: Route dampening threshold reached on peer 218.248.255.10`,
    sourceIp: '218.248.255.10',
    targetAsset: 'BGP-ROUTER-CHENNAI-GATEWAY',
    flaggedAnomalyReason: 'Critical national routing prefix anomaly untriaged in queue for 52 hours.'
  },
  {
    id: 'EVD-911',
    findingId: 'FND-2026-0785',
    cseCode: 'CAC-02',
    artifactType: 'Rule Configuration Diff',
    timestamp: '2026-09-30 11:10:45 IST',
    sha256Checksum: '9876543210abcdef0123456789abcdef0123456789abcdef0123456789abcdef0',
    summary: 'Audit diff in Elastic Security SIEM showing deactivation of ADS-B beacon spoofing detection rule.',
    rawPayloadSnippet: `--- rules/siem-av-8802.json (Active)
+++ rules/siem-av-8802.json (Modified by secops_admin3)
@@ -14,5 +14,5 @@
   "severity": "high",
   "risk_score": 73,
-  "enabled": true,
+  "enabled": false,
   "updated_by": "secops_admin3",
   "reason": "Suppressing false radar reflections during runway maintenance"`,
    sourceIp: '172.28.14.50',
    targetAsset: 'ELK-SEC-CLUSTER-01',
    flaggedAnomalyReason: 'Rule turned OFF without Change Advisory Board (CAB) authorization.'
  }
];

export const INITIAL_AUDIT_TRAIL: AuditLogEntry[] = [
  {
    id: 'AUD-2026-0041',
    timestamp: '2026-10-03 09:15:00 IST',
    supervisorId: 'SUPV-NCIIPC-409',
    supervisorName: 'Shri Rajeshwar Rao (Dy. Director, NCIIPC)',
    action: 'Assessed Finding',
    targetType: 'Finding',
    targetId: 'FND-2026-0809',
    entityCode: 'SOC-04',
    statusAssigned: 'Confirmed Concern',
    comments: 'Formal supervisory inquiry dispatched regarding HSM 4-hour syslog ingestion blackout.'
  },
  {
    id: 'AUD-2026-0038',
    timestamp: '2026-10-01 14:30:20 IST',
    supervisorId: 'SUPV-NCIIPC-409',
    supervisorName: 'Shri Rajeshwar Rao (Dy. Director, NCIIPC)',
    action: 'Requested Clarification',
    targetType: 'Finding',
    targetId: 'FND-2026-0785',
    entityCode: 'CAC-02',
    statusAssigned: 'Requires Information',
    comments: 'CAB approval minutes requested from AAI Directorate regarding disabled ADS-B correlation rule.'
  },
  {
    id: 'AUD-2026-0034',
    timestamp: '2026-09-29 16:45:00 IST',
    supervisorId: 'SUPV-NCIIPC-409',
    supervisorName: 'Shri Rajeshwar Rao (Dy. Director, NCIIPC)',
    action: 'Assessed Finding',
    targetType: 'Finding',
    targetId: 'FND-2026-0754',
    entityCode: 'CSE-17',
    statusAssigned: 'Not a Concern',
    comments: 'Verified with NRLDC engineering historian that PMU packets were buffered and not dropped.'
  },
  {
    id: 'AUD-2026-0029',
    timestamp: '2026-09-28 11:00:00 IST',
    supervisorId: 'SUPV-NCIIPC-409',
    supervisorName: 'Shri Rajeshwar Rao (Dy. Director, NCIIPC)',
    action: 'Exported Sector Report',
    targetType: 'Sector Report',
    targetId: 'REP-NAT-2026-Q3',
    entityCode: 'ALL-CSE',
    comments: 'Generated Quarterly NCIIPC National Supervisory SOC Evaluation for Prime Minister Office.'
  }
];

// Historical Chart Data for Sectoral Execution Gaps
export const SECTOR_GAP_CHART_DATA = [
  { sector: 'Power', stagnation: 42, prematureClose: 31, logBlindspots: 18, ruleTampering: 8 },
  { sector: 'Banking', stagnation: 28, prematureClose: 24, logBlindspots: 16, ruleTampering: 6 },
  { sector: 'Telecom', stagnation: 39, prematureClose: 19, logBlindspots: 14, ruleTampering: 11 },
  { sector: 'Aviation', stagnation: 15, prematureClose: 12, logBlindspots: 9, ruleTampering: 4 },
  { sector: 'Petroleum', stagnation: 11, prematureClose: 8, logBlindspots: 5, ruleTampering: 2 },
  { sector: 'Railways', stagnation: 17, prematureClose: 14, logBlindspots: 12, ruleTampering: 5 }
];

// Historical 30-Day Trend for Ingestion Gap Hours vs Uncorrelated Alerts
export const TELEMETRY_TREND_DATA = [
  { day: 'Sep 04', gapHours: 2.1, uncorrelatedAlerts: 14 },
  { day: 'Sep 07', gapHours: 1.8, uncorrelatedAlerts: 12 },
  { day: 'Sep 10', gapHours: 3.4, uncorrelatedAlerts: 22 },
  { day: 'Sep 13', gapHours: 2.9, uncorrelatedAlerts: 19 },
  { day: 'Sep 16', gapHours: 4.2, uncorrelatedAlerts: 31 },
  { day: 'Sep 19', gapHours: 3.8, uncorrelatedAlerts: 26 },
  { day: 'Sep 22', gapHours: 5.6, uncorrelatedAlerts: 44 },
  { day: 'Sep 25', gapHours: 4.1, uncorrelatedAlerts: 33 },
  { day: 'Sep 28', gapHours: 6.8, uncorrelatedAlerts: 58 },
  { day: 'Oct 01', gapHours: 5.2, uncorrelatedAlerts: 41 },
  { day: 'Oct 03', gapHours: 7.4, uncorrelatedAlerts: 67 }
];

// Alert Resolution Time Distribution
export const RESOLUTION_DISTRIBUTION_DATA = [
  { range: '< 1 min (Suspiciously Fast)', count: 98, flag: 'High Premature Closure Signal' },
  { range: '1 - 15 mins (Standard Triage)', count: 340, flag: 'Normal Operating Range' },
  { range: '15 - 60 mins (Detailed L1)', count: 215, flag: 'Normal Operating Range' },
  { range: '1 - 4 hrs (L2 Escalation)', count: 130, flag: 'Acceptable Escalation' },
  { range: '4 - 24 hrs (Delayed Triage)', count: 85, flag: 'SLA Breach Warning' },
  { range: '> 24 hrs (Queue Stagnation)', count: 57, flag: 'Critical Execution Gap' }
];
