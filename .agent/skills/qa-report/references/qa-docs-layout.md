# QA Docs Layout

The `.agent/qa/` tree is the single source of truth for manual/experiential testing.

## Directory Structure
- `journeys/`: Markdown files describing the steps of a user flow. Extracted directly from `.agent/specs/`.
- `charters/`: Mission files. A charter pairs a persona with a journey and a time-box.
- `reports/`: The actual output of executed sessions.
- `bugs/`: The durable registry of findings. 

## Rule of Thumb
Do not create bloated Excel-like test case matrices. QA in SDD is about exploring the app via personas using defined journeys.