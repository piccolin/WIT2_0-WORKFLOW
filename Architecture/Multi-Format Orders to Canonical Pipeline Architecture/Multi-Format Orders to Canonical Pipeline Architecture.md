# Multi-Format Orders to Canonical Pipeline Architecture

## Purpose
Convert vendor inputs across **HTML, PDF, JSON, XML** into a **single Waverly Cabinets canonical model** using a **modular, replayable, auditable pipeline** where each step is **self-standing** and **single-responsibility**.

---

## End-to-End Flow

~~~text
                  ┌─────────────────────────────────────────────┐
                  │         Vendor Source Documents             │
                  │   HTML | PDF | JSON | XML (+metadata)       │
                  └──────────────────────┬──────────────────────┘
                                         │
                                         v
┌─────────────────────────────────────────────────────────────────────────────┐
│ [1] Generic Parser (by file type)                                           │
│  - HtmlParser | PdfParser | JsonParser | XmlParser                          │
│  - Produces ParsedDocument (typed, structured representation)               │
└────────────────────────────────────────┬────────────────────────────────────┘
                                         │
                                         v
┌─────────────────────────────────────────────────────────────────────────────┐
│ [2] Vendor Extractor (vendor-specific) -> ExtractedOrder (intermediary)     │
│  - BaseExtractor + Vendor/Format implementations                            │
│  - Pulls business fields into ExtractedOrder                                │
└────────────────────────────────────────┬────────────────────────────────────┘
                                         │
                                         v
┌─────────────────────────────────────────────────────────────────────────────┐
│ [3] Persist ExtractedOrder (checkpoint DB)                                  │
│  - Immutable snapshot for audit + replay                                    │
└────────────────────────────────────────┬────────────────────────────────────┘
                                         │
                                         v
┌─────────────────────────────────────────────────────────────────────────────┐
│ [4] Normalize  -> [5] Default Values -> [6] Calculate -> [7] Decorate       │
│  - BaseStage classes + optional vendor overrides                            │
│  - Produces a "polished intermediary" ready for canonical mapping           │
└────────────────────────────────────────┬────────────────────────────────────┘
                                         │
                                         v
┌─────────────────────────────────────────────────────────────────────────────┐
│ [8] Map to Canonical (Waverly domain model)                                 │
│  - CanonicalMapper (versioned)                                              │
└────────────────────────────────────────┬────────────────────────────────────┘
                                         │
                                         v
┌─────────────────────────────────────────────────────────────────────────────┐
│ [9] Persist Canonical (final DB)                                            │
│  - Idempotent upsert + lineage pointers                                     │
└────────────────────────────────────────┬────────────────────────────────────┘
                                         │
                                         v
                       ┌─────────────────────────────────┐
                       │ Canonical Records for Downstream│
                       │ ERP | QuickBooks | Analytics    │
                       └─────────────────────────────────┘
~~~

---

## Core Contracts

Each pipeline step follows a uniform interface so steps remain swappable, testable, and composable.

---

## Stage Responsibilities and Guarantees

### [1] Generic Parser (by file type)
**Responsibility:** Convert raw file bytes into a structured `ParsedDocument`.

**Does:**
- `HtmlParser` → DOM-like structure / nodes
- `PdfParser`  → extracted text blocks / positional tokens (as available)
- `JsonParser` → object tree
- `XmlParser`  → element tree / object model
- Produces `ParsedDocument` + parser diagnostics

**Does NOT:**
- Vendor rules, extraction logic, normalization, defaults, calculations, canonical mapping

**Guarantees:**
- Deterministic output for the same input + parser version
- Parser failures are typed and actionable

---

### [2] Vendor Extractor (vendor-specific) → `ExtractedOrder` (common intermediary)
**Responsibility:** Interpret vendor documents and extract business fields into a shared intermediary object.

**Does:**
- Vendor-specific field location and label matching
- Table extraction and row interpretation
- Produces `ExtractedOrder` (same shape across all vendors)

**Does NOT:**
- Normalization, defaulting, calculations, canonical mapping

**Guarantees:**
- Produces best-effort data plus explicit extraction warnings/flags
- Clear separation between “observed” values and “assumed” values

---

### [3] Persist `ExtractedOrder` (Checkpoint DB)
**Responsibility:** Store the extracted intermediary as an immutable or versioned snapshot for replay and audit.

**Does:**
- Persist `ExtractedOrder` + `PipelineContext` + extraction issues
- Create a durable checkpoint for downstream reprocessing

**Guarantees:**
- Strong lineage to `sourceId`, `vendorId`, and stage versions
- Supports replay of downstream stages without re-parsing/re-extracting

---

### [4] Normalize
**Responsibility:** Standardize representation (format), not meaning.

**Examples:**
- Trim whitespace, normalize casing, standardize date formats
- Normalize money strings into consistent representation
- Normalize address structures (consistent line arrays)

**Guarantees:**
- No invented values; only representation normalization
- Changes are transparent and traceable

---

### [5] Default Value Setter
**Responsibility:** Apply policy-based defaults for missing-but-required fields.

**Examples:**
- Missing shipping method → apply policy default, record the rule used
- Missing terms → apply vendor/account default, record provenance

**Guarantees:**
- Defaults are never silent; every default is auditable (what/why)

---

### [6] Calculate
**Responsibility:** Deterministic math and derived fields.

**Examples:**
- Line totals = qty × each
- Subtotal = Σ(line totals)
- Total reconciliation (subtotal + tax + freight − discount)

**Guarantees:**
- Mismatches produce flags and audit details (inputs → outputs)
- No silent corrections unless explicitly allowed by policy

---

### [7] Decorate
**Responsibility:** Add enrichment and operational metadata without changing extracted meaning.

**Examples:**
- Provenance, confidence signals, anomaly flags
- Operator notes, classification tags, routing hints
- Helpful summaries for review tooling

**Guarantees:**
- Decoration is additive; any “interpretation” is recorded and flagged

---

### [8] Map to Canonical (Waverly domain model, versioned)
**Responsibility:** Convert polished intermediary into the Waverly canonical schema.

**Does:**
- Field name/type alignment with canonical model
- Canonical validation and constraint enforcement
- Canonical version application (`canonicalVersion`)

**Guarantees:**
- Mapping is versioned and reproducible
- Canonical validation failures are explicit and actionable

---

### [9] Persist Canonical (Final DB)
**Responsibility:** Store canonical records for operational use and integrations.

**Does:**
- Idempotent upsert
- Link canonical row back to extracted checkpoint + source metadata

**Guarantees:**
- Duplicate prevention via idempotency and unique constraints
- Complete lineage and replay support

---

## Enterprise-Grade Controls

### 1) Idempotency (critical)
Use stable idempotency keys so retries and replays never create duplicates.

**Recommended keys:**
- For Step [3] (Extracted checkpoint):  
  `extractIdempotencyKey = sourceId + vednor order number + version`
- For Step [9] (Canonical):  
  `canonicalIdempotencyKey = vendorId + vednor order number + version + canonicalVersion`

**Benefits:**
- Safe retries, safe replays, predictable outcomes

---

### 2) Structured Error Taxonomy (per stage)
Each stage emits a typed error with:
- `code`    (machine readable)
- `message` (operator friendly)
- `cause`   (optional technical details)
- `context` (vendorId, sourceId, stage, versions, correlationId)

**Example codes (conceptual):**
- Parser:    `NO_FILE`, `LOAD_FAILED`, `PAGE_READ_FAILED`, `TEXT_EXTRACT_FAILED`
- Extractor: `LABEL_NOT_FOUND`, `FIELD_MISSING`, `TABLE_SHAPE_UNEXPECTED`, `AMBIGUOUS_MATCH`
- Normalize: `INVALID_DATE_FORMAT`, `INVALID_MONEY_FORMAT`
- Calculate: `TOTAL_MISMATCH`, `LINE_TOTAL_MISMATCH`
- Map:       `CANONICAL_REQUIRED_FIELD_MISSING`, `CANONICAL_VALIDATION_FAILED`

**Benefits:**
- Faster diagnosis, consistent handling, clean dashboards and alerts

---

### 3) Versioning Strategy (pipeline + canonical)
Persist the versions used to produce every record:
- `parserVersion`, `extractorVersion`
- `pipelineVersion` (overall stage composition)
- `canonicalVersion`

**Rule:** Every persisted row includes these versions and `correlationId`.

**Benefits:**
- Safe upgrades, reproducible results, controlled backfills

---

### 4) Replay / Reprocessing Model (designed-in)
Step [3] enables:
- **Replay from extracted**: re-run [4]-[9] when business rules change
- **Replay from raw**: re-run [1]-[9] when parser/extractor improves

Operational fields:
- `replayOf` (prior correlationId), `attempt`, `reason`, `initiatedBy`

**Benefits:**
- Agility without risky manual operations, consistent reprocessing workflows

---

### 5) Observability (metrics + tracing)
Emit per-stage metrics:
- Duration, throughput, error rate
- Counts: documents processed, warnings, anomalies, defaults applied
- Quality distributions: mismatch magnitude, missing-field frequency

Tracing keys:
- `correlationId`, `sourceId`, `vendorId`

**Benefits:**
- Rapid root-cause analysis, regression detection, capacity planning

---

### 6) Data Quality Gates (optional but powerful)
Define policies per vendor and per canonical version:
- Hard fail when canonical requirements are unmet
- Soft fail with warnings when non-critical fields are missing
- Quarantine for low-confidence or high-anomaly records (review queue)

**Benefits:**
- Protects canonical integrity while maintaining throughput

---

### 7) Lineage & Audit (non-negotiable for trust)
Persist pointers:
- canonical → extracted checkpoint → raw source metadata
- Record “what changed” events:
  - normalization actions
  - defaults applied (rule id)
  - calculations (inputs/outputs)
  - mapping decisions and validations

**Benefits:**
- Always answer: “Where did this value come from?” and “Why does it differ?”

---

## Benefits Summary
- **Separation of concerns:** parsing, extraction, normalization, calculation, mapping are cleanly isolated.
- **Agility:** onboarding a new vendor is primarily extractor work; core pipeline remains stable.
- **Reuse:** parsers reused across vendors; downstream stages reused across all extracted orders.
- **Testability:** unit-test each stage independently with deterministic inputs/outputs.
- **Operational resilience:** checkpoints + idempotency enable safe retries and replays.
- **Auditability:** full lineage, versioning, and structured changes make results explainable.
- **Team scalability:** different engineers can own different steps without cross-cutting changes.
