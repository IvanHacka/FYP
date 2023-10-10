# A Support System for Job Advertising against employer-defined skills



## Overview
### Role-based Job Board System with Skill-Based Matching
This is a full stack job board application that connects employer and employees through a skill-based matching system.
This system improves employee's confident by calculating a match

## Tech Stack
- Frontend: React.js, Axios
- Backend: Spring Boot, Spring Security, JPA
- Database: MySQL

## Key Features
Register, Login
### Employee
- Manage profile (documents, skills, experiences)
- Browse and search jobs with filters
- Show job cards with:
   - Application status
   - Employer notes
   - Reviewed time
   - match score
   - required skills
- Save jobs to WatchList
- Apply Jobs with preferences
- View application history

### Employer
- Create and manage job posts
- Add required skills to the job
- Update job status
- Set job expiry date
- View applicants (Current applications/per job)
- Access to applicant details
- Can reject or shortlist applicants
- Add notes for applicants

## To run the project
1. Clone the project from github
   ```bash
   git clone https://github.com/IvanHacka/FYP
   cd JobBoard
   ```
2. Configure application.properties
3. Run project backend
4. To start frontend
   ```bash
   cd frontend
   npm install
   npm start
   ```
```