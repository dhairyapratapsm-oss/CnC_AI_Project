# 🎓 Concepts & Clarity (CnC Circle)
> **Next-Gen AI Education, Board Mock Paper Compiler & Pro Study Studio**

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![SDET Tests](https://img.shields.io/badge/SDET%20Tests-135%20Passed%20(100%25)-10B981?style=flat-square)](scratch/sdet_full_test_suite.py)
[![License](https://img.shields.io/badge/License-MIT-6366F1?style=flat-square)](LICENSE)

A high-performance, textbook-grounded web application designed for CBSE, ICSE, and State Board students, educators, and coaching academies.

---

## ⚡ Key Features at a Glance

### 1. 📄 A4 Standard Board Paper & Mock Builder
- **Exact A4 Geometry (`210mm x 297mm`)**: True-to-life academic test layout with official `Roll No:` box and `@media print` clean PDF export.
- **Smart Multi-Page Pagination**:
  - Automatically distributes questions across A4 pages with zero clutter.
  - **Dynamic Controls**: `← Previous Page` disabled on Page 1; `Next Page →` disabled on the last page.
  - **Live Page Badge**: Displays `Page X / Y` status at top and bottom.
  - **Dual View Modes**: Switch between `📄 Single Page (Flip)` and `📑 Show All Pages`.
- **Dynamic Title Generator**: Test titles auto-update based on Class (9–12), Subject, and Marks.
- **Official Blueprints**: Supports 25M (Milestone), 40M (Mid-Term), and 70M/80M (Pre-Board) exams with step-by-step marking rubrics.

### 2. 🧊 360° 3D Knowledge Pipeline Cube
- **Interactive 3D Motion**: Hover and move your mouse to spin the 3D cube across 4 core stages:
  1. *Stage 1 (Front)*: Multi-Board Textbook Ingestion (NCERT / CBSE / ICSE).
  2. *Stage 2 (Right)*: Neural Formula & LaTeX Symbol Indexing.
  3. *Stage 3 (Back)*: 3D Concept Vector Mapping & Spatial Diagrams.
  4. *Stage 4 (Left)*: Step-by-Step Mark Scheme Rigor Auditor.

### 3. 🤖 Aura AI — Floating Draggable Study Companion
- **Movable HUD Widget**: Drag the chat window anywhere across your screen.
- **Smart Contextual NLP**: Instant, grounded answers for physics/chemistry/math concepts, test creator help, pricing plans, and polite out-of-scope redirection.

### 4. 📚 Class & Subject Material Studio
- **3 Synthesizer Modes** (Classes 9–12 for Physics, Chemistry, Maths):
  - 📌 **Formula Cheat Sheets**: Formulas with parameter breakdowns and SI units.
  - 📝 **Step-by-Step Solved Questions**: Model solutions with official mark allocations.
  - ⚡ **Rapid Revision Flashcards**: Click-to-flip memory cards.

### 5. 🔍 AI Step-by-Step Mistake Diagnostic Engine
- **Line-by-Line Error Detection**: Scans calculations to isolate sign mistakes, exponent calculation slips, or unit conversion errors with instant corrections.

### 6. ⚡ Searchable Formula & Identity Vault
- **Live Search**: Instant lookup across hundreds of formulas (Coulomb's Law, Nernst Equation, King's Rule, Integration by Parts) with LaTeX formatting.

### 7. 📊 Syllabus Coverage & Projected Score Analytics
- **Live Progress Tracks**: Visual completion meters and projected board score calculator based on solved questions.

### 8. 🔐 Zero-PII Anonymous Authentication & Session Tracking
- **100% Privacy-First**: No phone numbers or invasive data required.
- **1-Click Role Logins**: Instant profiles for **Student**, **Educator**, **Parent**, and **Admin**.
- **Last Login Session Tracker**: Displays the timestamp of the **previous session** for returning users, and current time only on first login.
- **Password Strength Meter**: Real-time entropy scoring and validation.

### 9. 🌓 Seamless Dark & Light Mode
- Idempotent global theme switcher with guaranteed high-contrast dark text (`#0f172a`) on printable A4 sheets.

---

## 🎯 Target Audiences & Benefits

| Audience | Key Benefits |
| :--- | :--- |
| **🧑‍🎓 Students** | • Score 95%+ with official board marking schemes.<br>• Catch calculation slips using AI Mistake Diagnostics.<br>• Rapid formula revision with flashcards. |
| **👩‍🏫 Educators & Tutors** | • Generate complete, formatted board test papers in 1 click.<br>• Save 10+ hours per week on paper setting.<br>• Print-ready A4 PDF exports with attached answer keys. |
| **🏫 Coaching Academies** | • Centralized, standardized multi-subject question bank.<br>• 100% Zero-PII compliance protecting student privacy. |

---

## 🚀 Quick Start (Local Setup)

```bash
# 1. Clone the repository
git clone https://github.com/your-username/pragya-infotech-web.git
cd pragya-infotech-web

# 2. Run local server
python -m http.server 8080

# 3. Open in browser
# Visit: http://localhost:8080/index.html
