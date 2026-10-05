# SAT-SA — Supervisory Analytics Tool for SOC Assessment

**Smart India Hackathon 2026 · SIH26157**

> **Claim-vs-Reality Engine:** Do SOC operations match what is being reported?

## Overview

SAT-SA (Supervisory Analytics Tool for SOC Assessment) is an offline-first supervisory analytics platform designed to assist human examiners in assessing Security Operations Centres (SOCs).

It brings approved SOC assessment records together and performs data-quality checks, normalization, feature engineering, multiple analytical examinations, evidence fusion, and review prioritization.

SAT-SA focuses on the gap between **reported performance** and the **available operational evidence**.

> SAT-SA identifies evidence-backed signals for human review. It does not autonomously declare fraud, misconduct, or non-compliance.

All numerical examples used by the demonstration are synthetic.

## Problem

SOC assessments can involve large volumes of fragmented information:

- Alerts
- Incidents and cases
- Investigations
- Escalations
- Asset information
- Remediation records
- SLA/KPI reports
- Analyst activity
- Investigation notes
- Telemetry information

A conventional dashboard can show what was reported, but an examiner may also need to determine whether the reported metrics are supported by the underlying operational records.

SAT-SA is designed to help answer:

> **Does the available operational evidence support what the SOC reports?**

## Core Workflow

```text
Reported Claim
      ↓
Underlying Operational Evidence
      ↓
Data Quality & Normalization
      ↓
Execution Gap / Negative Space / Peer & Anomaly / Goodhart Analysis
      ↓
Evidence Fusion
      ↓
Prioritized Review
      ↓
Human Examiner Decision
      ↓
Report / Audit Trail
```

## Key Features

### Data Ingestion

Processes approved local assessment datasets and structured SOC records such as CSV, JSON, XLSX and approved exports.

### Data Quality

Checks schema, formats, missing values, duplicates, timestamps, identifiers, source completeness and time-window coverage.

### Normalization

Converts different source formats into a consistent analytical representation.

### Feature Engineering

Derives operational features such as closure duration, escalation rate, investigation duration, workload, SLA duration, asset activity and remediation status.

## Analytical Engines

### 1. Execution Gap Analysis

Compares expected process steps or operational commitments with recorded activities.

Example:

```text
Alert → Triage → Investigation → Escalation → Resolution → Remediation
```

If expected stages are not sufficiently represented in the available evidence, the system can flag them for review.

### 2. Negative Space Analysis

Looks for expected records or activities that appear absent within a defined population and time window.

Examples include:

- Silent critical assets
- Missing telemetry categories
- Missing escalation records
- Missing remediation evidence
- Long activity gaps

Source completeness and coverage are considered before interpreting absence.

### 3. Peer & Anomaly Analysis

Compares comparable teams, entities, case categories, assets or periods to identify unusual rates, durations or distributions.

Peer differences are treated as analytical indicators, not proof of improper activity.

### 4. Goodhart Lens

Examines whether reported KPIs are consistent with the underlying operational evidence.

It can highlight situations such as unusually strong KPI performance combined with weak or inconsistent supporting activity.

## Evidence Fusion

SAT-SA combines related signals instead of relying on a single indicator.

```text
Fast Closure
     +
Low Escalation
     +
Repeated Investigation Notes
     +
Silent Asset
     +
Missing Remediation Evidence
     ↓
Evidence Fusion
     ↓
Prioritized Review Item
```

The fusion layer can retain signal type, score, source records, timestamps, data quality, related signals and analytical explanation.

The MVP can use an inspectable weighted approach:

```python
WEIGHTS = {
    "fast_closure": 0.20,
    "low_escalation": 0.20,
    "investigation_similarity": 0.20,
    "silent_asset": 0.20,
    "missing_remediation": 0.20
}

composite_score = sum(
    signals[k] * WEIGHTS[k]
    for k in WEIGHTS
)
```

These weights are demonstration configuration values and should be validated on representative data before operational use.

## Human-in-the-Loop

SAT-SA is a decision-support system.

**SAT-SA does:**

- Find patterns
- Connect evidence
- Explain signals
- Prioritize review

**The examiner does:**

- Review evidence
- Check context
- Request additional information
- Accept or dismiss findings
- Record observations
- Make the final assessment

The system therefore produces review-oriented statements such as:

> **Potential mismatch between reported operational performance and supporting evidence. Review recommended.**

It does not automatically output “Fraud Detected”, “Guilty”, or “Misconduct Confirmed”.

## System Architecture

```text
Approved SOC Data
       ↓
Data Ingestion
       ↓
Validation & Data Quality
       ↓
Normalization & Feature Engineering
       ↓
┌────────────┬──────────────┬──────────────┐
│ Execution  │ Negative     │ Peer/Anomaly │
│ Gap        │ Space        │ Analysis     │
└────────────┴──────────────┴──────────────┘
       ↓
Goodhart Lens
       ↓
Evidence Fusion
       ↓
Review Prioritization
       ↓
Human Examiner Review
       ↓
Reports / Findings / Audit
```

## Application Modules

| Route | Module | Purpose |
|---|---|---|
| `/dashboard` | Supervisory Overview | Assessment metrics and priority findings |
| `/entities` | Entity Directory | Entity-level overview |
| `/entities/cse-alpha` | Entity Assessment | Detailed operational analysis |
| `/findings/F-1024` | Finding Details | Evidence and reasoning |
| `/negative-space` | Negative Space Radar | Missing activity analysis |
| `/peer-benchmark` | Peer Benchmark | Comparative analysis |
| `/review-planner` | Examiner Review Planner | Review queue and sampling |
| `/evidence` | Evidence Repository | Source-record inspection |
| `/audit` | Supervisory Audit Timeline | Processing and review traceability |

## Technology Stack

### Frontend

- Next.js
- TypeScript
- Tailwind CSS
- Lucide Icons
- Framer Motion
- Recharts

### Backend

- Python
- FastAPI
- Uvicorn
- Pydantic

### Data & Analytics

- Polars
- Pandas
- NumPy
- scikit-learn
- statsmodels
- ruptures

### Storage

- SQLite
- Parquet
- DuckDB

### Security & Integrity

- SHA-256
- Merkle Trees
- Local evidence integrity ledger
- Audit logging

### Deployment

- Docker
- Docker Compose
- Local / Offline / Air-Gapped deployment

## Project Structure

```text
SAT-SA/
├── app/
│   ├── dashboard/
│   ├── entities/
│   ├── findings/
│   ├── negative-space/
│   ├── peer-benchmark/
│   ├── review-planner/
│   ├── evidence/
│   └── audit/
├── components/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── analytics/
│   │   ├── ingestion/
│   │   ├── evidence/
│   │   ├── models/
│   │   └── services/
│   └── requirements.txt
├── data/
│   └── synthetic/
├── public/
├── package.json
├── docker-compose.yml
└── README.md
```

# Setup

## Prerequisites

- Git
- Node.js 18+ or 20+
- npm
- Python 3.9+
- pip
- Docker Desktop (optional)

Verify:

```bash
node --version
npm --version
python3 --version
pip --version
git --version
```

## 1. Clone Repository

```bash
git clone https://github.com/priyanshshrivastav23-source/SAT-SA.git
cd SAT-SA
```

## 2. Frontend Setup

```bash
npm install
npm run dev
```

Default:

```text
http://localhost:3000
```

If port 3000 is occupied:

```bash
npm run dev -- -p 3002
```

Then open:

```text
http://localhost:3002
```

## 3. Backend Setup

Open another terminal:

```bash
cd backend
```

### macOS / Linux

```bash
python3 -m venv venv
source venv/bin/activate
```

### Windows

```powershell
python -m venv venv
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start FastAPI:

```bash
uvicorn app.main:app --reload --port 8000
```

Backend:

```text
http://localhost:8000
```

Swagger:

```text
http://localhost:8000/docs
```

ReDoc:

```text
http://localhost:8000/redoc
```

## 4. Run Complete Application

Terminal 1:

```bash
cd SAT-SA
npm run dev
```

Terminal 2:

```bash
cd SAT-SA/backend
source venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

Open the frontend at `http://localhost:3000` or `http://localhost:3002`.

## 5. Environment Variables

Frontend `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Backend `.env` if required:

```env
APP_ENV=development
DATABASE_URL=sqlite:///./sat_sa.db
```

Never commit credentials, encryption keys, private information, or real SOC datasets.

## 6. Testing

Backend:

```bash
cd backend
pytest
```

Frontend lint:

```bash
npm run lint
```

Production build:

```bash
npm run build
```

## 7. Docker

If `docker-compose.yml` is present:

```bash
docker compose up --build
```

Stop:

```bash
docker compose down
```

## 8. Production

Frontend:

```bash
npm run build
npm start
```

Backend:

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Do not use `--reload` in production.

## 9. Troubleshooting

### Port 3000 occupied

```bash
npm run dev -- -p 3002
```

### Backend dependency problems

Activate the virtual environment and reinstall:

```bash
source backend/venv/bin/activate
pip install -r backend/requirements.txt
```

### Frontend dependency problems

```bash
rm -rf node_modules
npm install
```

### Backend unavailable

Check:

```text
http://localhost:8000/docs
```

### Frontend cannot reach backend

Check:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Restart the frontend after changing environment variables.

## Offline / Air-Gapped Operation

The core SAT-SA workflow is designed to run locally without mandatory:

- Internet connectivity
- Cloud databases
- External AI APIs
- Firebase
- Supabase
- OpenAI API

The frontend, backend, analytics and storage can operate within the controlled deployment environment.

## Demo Mode

If implemented in the current build, DEMO MODE can use local synthetic data when the backend is unavailable.

Example synthetic output:

```text
5 CSE entities
125,430 records
94% data confidence
37 findings
8 high-priority findings
```

These values are for demonstration only.

## Evidence Integrity

SAT-SA can maintain a local integrity ledger:

```text
Source Record
     ↓
SHA-256
     ↓
Batch
     ↓
Merkle Tree
     ↓
Merkle Root
```

This supports technical detection of changes to referenced evidence after the integrity record is created.

Cryptographic integrity verification should not be described as independently guaranteeing legal admissibility; applicable legal and organizational requirements must be evaluated separately.

## Responsible Use

- Analytical signals are not verdicts.
- Missing records are not automatically proof of missing activity.
- Peer differences require operational context.
- Similar investigation notes may have legitimate explanations.
- KPI mismatches require human investigation.
- Final assessment remains with the authorized examiner.
- Synthetic demo data must be kept separate from real assessment data.

## Future Enhancements

- Additional SOC data connectors
- Advanced temporal analytics
- Explainable anomaly detection
- Improved peer-group construction
- NLP-based investigation-note analysis
- Semantic similarity
- MinHash-based template detection
- Advanced sampling
- Configurable supervisory rules
- Versioned analytical models
- Expanded governance and audit controls

Advanced AI/ML components should be introduced only after validation on representative datasets.

## Project Information

| Field | Details |
|---|---|
| Project | SAT-SA |
| Full Name | Supervisory Analytics Tool for SOC Assessment |
| Event | Smart India Hackathon 2026 |
| Problem Statement | SIH26157 |
| Problem Setter Context | NTRO / NCIIPC |
| Domain | Cybersecurity / SOC Assessment |
| Technology Bucket | Big Data Analysis |
| Deployment | Offline / Local / Air-Gapped |
| Core Concept | Claim-vs-Reality Engine |
| Decision Model | Human-in-the-Loop |

## Team — Final Commit

- **Yash Barfa** — https://github.com/YashBarfa0603
- **Priyansh Shrivastav** — https://github.com/priyanshshrivastav23-source

## Final Thought

> **Don't just ask what the SOC reports. Examine whether the available evidence supports the report.**

SAT-SA combines data-quality checks, execution-gap analysis, negative-space analysis, peer comparison, KPI/evidence examination, explainable evidence fusion, review prioritization, evidence integrity, and human examiner review to support a more structured and evidence-driven SOC assessment process.
