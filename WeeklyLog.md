# Weekly Log (What I did, What I will do, Blockers)
---------------------------------------------------

## Week 14
**What I did this week:**
- Implemented job expiry feature in backend (added `expiresAt` field in Job entity).
- Updated frontend to display job expiry date clearly in employer view.
- Adjusted job status logic to reflect expiry (OPEN vs EXPIRED).
- Began integrating expiry handling into existing job lifecycle.

**What to do next week:**
- Improve employee application tracking interface.
- Implement better status visibility for applications.

**Blockers:**
- Some inconsistencies between job status and expiry logic during display.

---------------------------------------------------

## Week 15
**What I did this week:**
- Improved “My Applications” page on employee side.
- Implemented application withdrawal functionality.
- Started building application timeline UI (submitted, under review, etc.).
- Connected timeline display with backend timestamps.

**What to do next week:**
- Fix missing or incorrect timeline data.
- Ensure all status timestamps are correctly stored and returned.

**Blockers:**
- Timeline only showing partial data due to missing fields in database.

---------------------------------------------------

## Week 16
**What I did this week:**
- Fixed DTO issues where application fields were not returning properly.
- Debugged and corrected timeline logic (old vs new status conflicts).
- Resolved incorrect timestamps being displayed on frontend.
- Fixed parameter issues causing errors (e.g. undefined IDs in requests).
- Improved consistency between backend response and frontend rendering.

**What to do next week:**
- Finalise application flow and improve employer review features.
- Ensure document handling works for both employee and employer.

**Blockers:**
- Data inconsistency between old and newly introduced fields required debugging.

---------------------------------------------------

## Week 17 (Current)
**What I did this week:**
- Fixed employer-side document download issues (aligned with employee download logic).
- Extended employer access to view more applicant documents, not just CV.
- Updated application flow to support job-specific inputs (e.g. why good fit, expected salary).
- Refined validation logic (e.g. expected salary must be valid).
- Verified end-to-end flow: apply → review → status update → document access.

**What to do next week:**
- Begin full system testing (functional, integration, and user testing).
- Start writing testing chapter and evaluation for dissertation.

**Blockers:**
- Some data may not exist in database yet, affecting testing of full timeline scenarios.
- Finish writing testing chapter and documentation.

**Blockers:**
- None.
