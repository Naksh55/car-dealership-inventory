# PROMPTS.md

This document records the AI-assisted development process for this project, using Claude (Anthropic). It is organized by engineering phase, with each phase framed by the goal it addressed and the outcome it produced. Verbatim prompts are included per the assignment's AI transparency requirement.

---

## Phase 1: Planning & Scaffolding

I asked Claude to translate the assignment spec into an execution plan, then to scaffold the backend (FastAPI, SQLAlchemy models, JWT auth) and frontend (React + Tailwind) following strict Red-Green-Refactor — a failing test written and confirmed first, then the minimum implementation to pass it, for every feature: registration, login, vehicle CRUD, search/filter, and purchase/restock logic.

*"create a detailed plan for the completion of the project. also follow each and everything mentioned in the document attached."*
*"this is very important assignment for me, so please help with all you got. lets start now"*

**My role**: I independently reran the full test suite at each checkpoint before proceeding to the next feature, rather than trusting the process was correct by assumption.

**Outcome**: 15 backend tests, 96% coverage; a working React SPA with role-based UI, wired against the live API and verified manually end-to-end.

---

## Phase 2: Commit Discipline — Pushing Back on the Default Approach

Claude's first suggestion was to commit the entire backend folder in one shot. I rejected this:

*"is it correct to add backend folder at one only. shouldn't i make folder and add files and commit individually with each file"*

This led to defining the actual grading principle at stake — one commit per meaningful Red-Green-Refactor step, not per file and not per folder — which is what the final 17-commit history reflects. I also set the rule for `Co-authored-by` trailers myself: applied only where AI meaningfully contributed, not blanket-added to every commit.

---

## Phase 3: Verifying, Not Just Trusting, the TDD Claims

Before committing to the RED→GREEN narrative in my git history, I made sure I could independently defend it:

*"how to test the failing test case, in case interviewer asked"*
*"why is this code failing the test case"* (with a specific test pasted for line-by-line verification)

**Outcome**: I can reproduce any historical RED state via `git checkout <commit>` and explain precisely why each test failed (unregistered route → 404) before its corresponding GREEN commit, independent of AI assistance.

---

## Phase 4: Environment Debugging — Solved Independently

Getting the project running on my Windows machine surfaced real issues I diagnosed and resolved myself from raw error output, with Claude as a second opinion: PowerShell execution policy blocking npm, Node not persisting to PATH, a missing import causing a `NameError`, a CORS `405` on first frontend-backend integration, and a critically low C-drive (0.17 GB free) that was silently stalling the frontend build until I found and cleared a 7GB Gradle cache.

---

## Phase 5: Design Judgment — Questioning My Own Implementation

Rather than accepting the first working version as correct, I reviewed three design decisions against the spec:

- *"what if someone want to register as an admin"* → concluded admin promotion should **not** be self-service, matching how real systems handle privilege escalation.
- *"in admin panel why is admin given option to purchase the car"* → reviewed whether admin/purchaser roles should overlap; kept it, since nothing in the spec restricts admins from also buying.
- *"here two things to note. its written Admin users which means there can be multiple admins."* → verified the data model (`is_admin` as a per-user field) already correctly supports multiple independent admins without changes.

---

## Phase 6: UI/UX — Directed Iteration Against a Specific Requirement

The assignment specifically grades "visually appealing, responsive, great UX." I used this as the explicit target for a design review rather than accepting default styling:

*"this ui is too basic"*
*"[the assignment's Design requirement, quoted directly] — this point"*

**Outcome**: category color-coding, a stats summary bar, toast notifications, skeleton loading states, and responsive layout fixes — verified by testing on a narrowed browser viewport and discussing (though not yet completing) same-network mobile testing.

---

## Summary

Claude accelerated scaffolding, boilerplate, and initial implementations significantly. Every test was run and verified by me before being trusted; every design decision above was one I pushed back on, reviewed, or made the final call on rather than accepting by default; the commit structure and its granularity were my decision, not Claude's default suggestion; and all debugging of my actual local environment was done by me interpreting real error output, with Claude used as a second opinion rather than a black box.