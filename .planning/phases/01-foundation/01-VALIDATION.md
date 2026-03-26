---
phase: 1
slug: foundation
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-26
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None — test infrastructure explicitly out of scope per REQUIREMENTS.md |
| **Config file** | none |
| **Quick run command** | `npm run build` |
| **Full suite command** | `npm run build && grep -r "base44" src/; test $? -eq 1` |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run build`
- **After every plan wave:** Run `npm run build && grep -r "base44" src/; test $? -eq 1`
- **Before `/gsd:verify-work`:** All 5 success criteria from ROADMAP.md checked
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 01-01-01 | 01 | 1 | BUILD-02 | smoke | `npm run build` | N/A | ⬜ pending |
| 01-01-02 | 01 | 1 | BUILD-04 | smoke | `npm run build` | N/A | ⬜ pending |
| 01-01-03 | 01 | 1 | BUILD-05 | smoke | `npm run build` | N/A | ⬜ pending |
| 01-02-01 | 02 | 1 | AUTH-01 | grep | `grep -r "AuthProvider\|AuthContext" src/; test $? -eq 1` | N/A | ⬜ pending |
| 01-02-02 | 02 | 1 | AUTH-02 | grep | `grep -r "AuthProvider\|AuthContext" src/; test $? -eq 1` | N/A | ⬜ pending |
| 01-02-03 | 02 | 1 | AUTH-03 | grep | `grep -r "base44Client" src/; test $? -eq 1` | N/A | ⬜ pending |
| 01-02-04 | 02 | 1 | AUTH-04 | grep | `grep -r "app-param" src/; test $? -eq 1` | N/A | ⬜ pending |
| 01-03-01 | 03 | 2 | BUILD-01 | smoke | `npm run build` | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements. No test framework needed — Phase 1 validation relies on build success (`npm run build`) and grep-based verification (`grep -r "base44" src/`).

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| App renders without login screen | AUTH-01 | Visual UI check | Run `npm run dev`, open browser, verify no auth spinner or login form |
| shadcn components load | BUILD-04 | Visual rendering | Verify Toaster renders without console errors |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
