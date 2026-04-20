# Weekly Log (What I did, What I will do, Blockers)
---------------------------------------------------

## Week 1
**What I did this week:**
- Started the project and interpreted it as an **employer focused job board system**.
- Planned core features mainly around employer-side functionality.
- Designed initial system structure.

**What I plan to do :**
- Implement employer-focused features.
- Explore extracting logic.

**Blockers:**
- None.

---------------------------------------------------

## Week 2
**What I did this week:**
- Continued developing employer-centric system features.

**What I plan to do :**
- Integrate spring security and employer view.
- Expand functionality.

**Blockers:**
- Difficulty defining effective keyword extraction rules.

---------------------------------------------------

## Week 3
**What I did this week:**
- Began implementing keyword extraction logic from job titles and descriptions.
- Revisited project requirements and realised the system should support **both employees and employers**.
- Identified that current implementation was misaligned.
- Analyse what can be reused.
- Decided to **restart and redesign the system architecture**.

**What I plan to do :**
- Redesign system structure and database.
- Rebuild project with correct scope.

**Blockers:**
- Need to discard earlier implementation.

---------------------------------------------------

## Week 4
**What I did this week:**
- Redesigned database schema (User, Job, Application).
- Refine backend structure and relationships.
- Prepared system for both roles based system.

**What I plan to do :**
- Reimplement authentication system.

**Blockers:**
- None.

---------------------------------------------------

## Week 5
**What I did this week:**
- Reimplemented authentication (Spring security).
- Fixed previous login issue.
- Ensured role-based access control.

**What I plan to do :**
- Build profile features.

**Blockers:**
- None.

---------------------------------------------------

## Week 6
**What I did this week:**
- Rebuilt employee and employer profile features.
- Set up React to connect frontend with backend APIs.
- Added some validation.

**What I plan to do :**
- Implement job posting and browsing.

**Blockers:**
- None.

---------------------------------------------------

## Week 7
**What I did this week:**
- Implemented job posting.
- Built job browsing and search features.
- Integrated job cards to frontend.

**What I plan to do :**
- Improve application flow.

**Blockers:**
- None.

---------------------------------------------------

## Week 8
**What I did this week:**
- Reworked job application logic.
- Prevented duplicate applications.
- Improved backend validation.

**What I plan to do :**
- Add watch list feature.

**Blockers:**
- None.

---------------------------------------------------

## Week 9
**What I did this week:**
- Implemented watch list feature (save jobs).
- Improved employee side interaction.

**What I plan to do :**
- Implement matching system.

**Blockers:**
- None.

---------------------------------------------------

## Week 10
**What I did this week:**
- Implemented match score logic.
- Integrated scoring into application responses.

**What I plan to do :**
- Add employer job skill management.
- Added score breakdown (skills, title, location, salary, job type) not just final matchscore.

**Blockers:**
- Difficulty tuning scoring weights.
- Match score breakdown requires to rebuild backend logic.

---------------------------------------------------

## Week 11
**What I did this week:**
- Implemented job skill management for employers.
- Added create/update/delete job skills for job posts.
- Added employer notes creation and showing on employee side.
- Improved data handling with DTO.

**What I plan to do :**
- Improve application review flow.

**Blockers:**
- Data flow inconsistencies.

---------------------------------------------------

## Week 12
**What I did this week:**
- Improved data flow by adding DTO.
- Implemented application status updates (review, shortlist, reject...).
- Added employer controls for application status.
- Started building application timeline.

**What I plan to do :**
- Implement document handling.

**Blockers:**
- Parameter mismatch.

---------------------------------------------------

## Week 13
**What I did this week:**
- Implemented document download logic for employer.
- Enabled employee document download.
- Began employer document access.

**What I plan to do :**
- Fix employer document handling.

**Blockers:**
- Employer download not working correctly.

---------------------------------------------------

## Week 14
**What I did this week:**
- Fixed employer document download issues.
- Extended employer access to all applicant documents.
- Improved applicant visibility.

**What I plan to do :**
- Refine application flow.

**Blockers:**
- File handling inconsistencies.

---------------------------------------------------

## Week 15
**What I did this week:**
- Refactored application process to include job specific preferences inputs.
- Added validation for preferences input.
- Improved input handling.

**What I plan to do :**
- Implement job expiry.

**Blockers:**
- Validation errors not displaying initially.

---------------------------------------------------

## Week 16
**What I did this week:**
- Implemented job expiry feature `expiresAt`.
- Updated job lifecycle handling.
- Displayed expiry in frontend.

**What I plan to do :**
- Improve application tracking.

**Blockers:**
- Status vs expiry inconsistency.

---------------------------------------------------

## Week 17
**What I did this week:**
- Improved “My Applications” page.
- Implemented withdrawal feature.
- Built application timeline UI.

**What I plan to do :**
- Fix timeline data issues.

**Blockers:**
- Missing timestamp data.

---------------------------------------------------

## Week 18
**What I did this week:**
- Fixed DTO issues and added missing fields.
- Corrected timeline logic and added timestamps.
- Resolved frontend/backend inconsistencies.
- Verified full system workflow end-to-end.

**What I plan to do :**
- Conduct testing and begin dissertation writing.

**Blockers:**
- Some test data missing for full timeline scenarios.
