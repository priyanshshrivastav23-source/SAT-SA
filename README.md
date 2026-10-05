# SAT-SA: Supervisory Analytics Tool for SOC Assessment

**Smart India Hackathon 2026**  
**Problem Statement:** SIH26157 — NTRO / NCIIPC  
**Core Concept:** *The Claim-vs-Reality Engine* — *"Do SOC operations match what is reported?"*

---

## 1. Executive Overview

SAT-SA is an evidence-backed supervisory analytics system designed for **NTRO / NCIIPC** examiners assessing Critical Sector Entity (CSE) Security Operations Centers (SOCs).

### The Core Problem
A CSE submits quarterly compliance reports displaying healthy top-level KPIs:
- **Critical Alerts Within SLA:** `99.2%`
- **Critical Closure Compliance:** `98.4%`
- **Reported SOC Health:** `Healthy`

### The SAT-SA Solution
SAT-SA inspects the underlying operational telemetry records to uncover discrepancies:
1. **Unusually Fast Critical Closures:** Median closure time of 3 minutes vs. national peer median of 47 minutes (-93.6% gap).
2. **Abnormally Low Escalation:** Only 1.8% of critical alerts escalated to Tier-2 vs. 14.2% peer baseline.
3. **Repetitive Investigation Notes:** 84% template similarity across disparate threat categories.
4. **Silent Critical Assets:** High-value database clusters (e.g. `PAYMENT-DB-01`) producing 0 alerts across 47 consecutive days.
5. **Missing Telemetry Categories:** Complete absence of ransomware or lateral movement telemetry.
6. **Cross-Signal Claim-vs-Reality Concern:** Multiple weak signals fuse into an evidence-backed finding recommending examiner inquiry.

### Critical Design Principle: Examiner Assistance, Not Autonomous Sanctions
SAT-SA **never** outputs accusatory verdicts like *"Fraud detected"* or *"Guilty"*. It outputs:
> *"Potential mismatch between reported operational performance and supporting evidence. Review recommended."*

The tool supports human examiner judgment, making on-site and remote reviews faster, sharper, and evidence-driven.

---

## 2. Technology Stack

- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS (warm light government theme), Lucide Icons, Framer Motion, Recharts.
- **Backend:** Python, FastAPI, SQLite / in-memory analytics.
- **Data & Security:** 100% offline & air-gapped capable; local synthetic SOC dataset; local SHA-256 cryptographic evidence ledger with Merkle root verification.
- **Zero External API Dependencies:** No external cloud services, OpenAI API, Firebase, or Supabase required.

---

## 3. Installation & Setup

### Prerequisites
- Node.js (v18+ or v20+)
- Python (v3.9+)

### Frontend Setup

```bash
# Clone repository
git clone https://github.com/priyanshshrivastav23-source/SAT-SA.git
cd SAT-SA

# Install frontend dependencies
npm install

# Start development server
# (Default port 3000, or port 3002 if 3000 is occupied by another application)
npm run dev -- -p 3002
```

Access the frontend at: `http://localhost:3002` (or `http://localhost:3000`).

### Backend Setup (FastAPI)

```bash
cd backend

# Create virtual environment (optional)
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server
uvicorn app.main:app --reload --port 8000
```

Access API Documentation at: `http://localhost:8000/docs`

---

## 4. Offline DEMO MODE

SAT-SA includes an integrated, zero-latency **DEMO MODE**:
- When the backend is offline or during an air-gapped presentation, the frontend automatically falls back to local high-fidelity synthetic data.
- The top-right badge displays `● DEMO MODE`.
- Clicking **"Run Analysis"** in the top bar launches an interactive 7-stage analytical execution modal:
  1. *Data ingested across 5 CSE entities*
  2. *Data quality validated (94% confidence score)*
  3. *Local evidence ledger created with SHA-256 Merkle root*
  4. *Execution gaps analysed (rapid closure & low escalation)*
  5. *Negative space analysed (silent asset void detected)*
  6. *Peer benchmark completed against national baseline*
  7. *Findings generated (37 findings, 8 high priority)*

---

## 5. Main Application Structure

| Route | Page | Purpose |
|---|---|---|
| `/dashboard` | **Supervisory Overview** | Top metric cards, Claim-vs-Reality hero card, Priority Findings table. |
| `/entities` | **Entity Directory** | Multi-CSE directory with supervisory indicators and risk levels. |
| `/entities/cse-alpha` | **Entity Assessment** | 8 capability indicators, 30-day activity chart with anomaly spike, 6 execution gap cards. |
| `/findings/F-1024` | **Finding Details** | Why flagged, animated cross-signal reasoning chain, counterfactual, evidence table, SHA-256 ledger. |
| `/negative-space` | **Negative Space Radar** | Silent critical assets, missing categories, expected vs. observed activity chart. |
| `/peer-benchmark` | **Peer Benchmark** | CSE Alpha vs. national peer percentiles (closure time, escalation, similarity). |
| `/review-planner` | **Examiner Review Planner** | 6 sampling cards, review queue, "Generate Review Pack" modal with CISO interview questions. |
| `/evidence` | **Evidence Repository** | Forensic raw SOC record viewer with SHA-256 verification and statutory 65B notices. |
| `/audit` | **Supervisory Audit Timeline** | 08:32–08:37 statutory chronology, model/data/rule governance versioning. |

---

## 6. Transparent Heuristic Evidence Fusion

Rather than using an opaque black-box machine learning model for this supervisory MVP, SAT-SA utilizes an explainable, inspectable weighted fusion engine:

```python
WEIGHTS = {
    "fast_closure": 0.20,              # Discrepancy vs. 47 min peer median
    "low_escalation": 0.20,            # Discrepancy vs. 14.2% peer baseline
    "investigation_similarity": 0.20,  # Cosine note similarity (84% vs 28%)
    "silent_asset": 0.20,              # Telemetry silence on critical assets (47 days)
    "missing_remediation": 0.20        # Absence of verifiable fix artifacts (88%)
}

composite_score = sum(signals[k] * WEIGHTS[k] for k in WEIGHTS)
confidence = raw_confidence * (data_confidence / 100.0)
```

### Data Confidence Score (94%)
Evaluates underlying log quality prior to signal fusion:
- **Completeness:** `97%`
- **Consistency:** `93%`
- **Timestamp Integrity:** `92%`

---

## 7. Local Cryptographic Evidence Ledger

To comply with the admissibility requirements of **Section 65B of the Indian Evidence Act / IT Act**:
- Each operational SOC record is hashed with `SHA-256`.
- Hashes are organized into local batches and sealed with a deterministic `Merkle Root`.
- Example for Finding F-1024:
  - **Record ID:** `ALT-98213`
  - **SHA-256:** `8f3a9d20c5e14b8a221f7e3d1c8b9a4f6e2d1c0b8a7f6e5d4c3b2a1f0e9d8c7b`
  - **Merkle Root:** `7b82f091de4c5531d2b8e3a092c4b7f8e1a3c5d7e9b0d2f4a6c8e0b2d4f6a8c0`
  - **Status:** *Cryptographically verified*

---

## 8. 2–3 Minute SIH Demo Walkthrough Script

1. **Dashboard (`/dashboard`):**
   - Point out top metric cards: 5 CSEs, 125,430 records, 37 findings, 8 high priority, 94% data confidence.
   - Show the **Claim vs Reality Hero Card**: Highlight reported 99% SLA compliance vs. observed 3-minute closures and 47-day silent assets.
2. **Entity Assessment (`/entities/cse-alpha`):**
   - Click *CSE Alpha* in the Priority Findings table.
   - Present the **Supervisory Indicator (72/100)** and the 8 capability indicators.
   - Show the 30-Day Operational Activity chart highlighting the Days 18-22 batch closure anomaly.
   - Point out the 6 **Execution Gap Signals** (e.g. Fast Closure at -93.6% vs. peer baseline).
3. **Finding Details (`/findings/F-1024`):**
   - Click on Finding `F-1024`.
   - Explain *"Why Was This Flagged?"* (3 min median vs. 47 min peer baseline).
   - Walk through the **Cross-Signal Reasoning Chain** (`w: 0.20` transparent weights).
   - Read the **Counterfactual** and *"Why NOT Automatically Classified"* disclaimer.
   - Click *"View Source Record"* to inspect the raw SOC record.
   - Click *"Verify Batch Integrity"* on the Local Cryptographic Evidence Ledger.
4. **Examiner Review Planner (`/review-planner`):**
   - Navigate to Review Planner.
   - Review the 6 sampling stratification cards (Total: 125,430, Sample: 120, Control: 20, High priority: 35, Diverse: 45, Critical: 20).
   - Click **"Generate Review Pack"** to open the on-site inspection docket with suggested CISO interview questions.

---

## 9. Contributors

- **Yash Barfa** ([@YashBarfa0603](https://github.com/YashBarfa0603))
- **Priyansh Shrivastav** ([@priyanshshrivastav23-source](https://github.com/priyanshshrivastav23-source))
