# DreamCrafters — Feature Split (5 Members)

> Only features with **both frontend and backend fully implemented** (11 total).

---

## 👤 Member 1 — **Content & Learning** (2 features)

| # | Feature | What to Explain |
|---|---------|-----------------|
| 1 | **Interactive Resource Library** | ContentLibrary.jsx — search, type/difficulty filters, bookmarks, progress tracking, recommended view. Backend: Content CRUD APIs via careerPathController.js. Supports video, article, quiz, ebook types. |
| 2 | **Expert-Led Webinars** | Student view (Webinars.jsx) + Educator view (educator/Webinars.jsx). Backend: webinarController.js. Full CRUD — create, edit, delete, register, cancel, join links, max participants, scheduling. |

---

## 👤 Member 2 — **AI Study Planning** (2 features)

| # | Feature | What to Explain |
|---|---------|-----------------|
| 3 | **AI Study Planner** | StudyPlanner.jsx + StudyPlanDetail.jsx. Backend: studyPlannerController.js. Uses Gemini/Groq AI to generate daily/weekly plans. Full CRUD + progress tracking + weekly/daily summaries. |
| 4 | **Adaptive Scheduling** | Auto-reschedule missed tasks via `autoReschedule` + `rescheduleSession` endpoints. Frontend has "Auto-Reschedule Missed" button. Reschedule history logged in StudySessionReschedule model. |

---

## 👤 Member 3 — **AI Chatbot & RAG** (2 features)

| # | Feature | What to Explain |
|---|---------|-----------------|
| 5 | **Smart Chatbot Interface** | ChatBot.jsx with session management, message bubbles, quick replies, starter chips. Backend: chatController.js + llmService.js. Full conversational AI assistant. |
| 6 | **RAG Document System** | Upload documents → chunk → embed → vector search. Backend: ragController.js + ragService.js + embeddingService.js. Frontend: RagPanel for upload & manage. Enhances chatbot with document context. |

---

## 👤 Member 4 — **Mentorship & Access Control** (2 features)

| # | Feature | What to Explain |
|---|---------|-----------------|
| 7 | **Mentorship Module** | Students browse mentors & send requests (Mentors.jsx). Educators accept/reject (Requests.jsx). Backend: mentorRequestController.js. Schema: MentorSession + MentorFeedback models. |
| 8 | **Role-Based Access Control** | ProtectedRoute component with allowedRoles. Backend: auth.js middleware (protect + restrictTo). Separate dashboards & sidebar navigation for Student, Educator, Admin roles. |

---

## 👤 Member 5 — **Authentication System** (3 features)

| # | Feature | What to Explain |
|---|---------|-----------------|
| 9 | **Student Auth** | Signup with email OTP verification, login, password reset. Backend: studentAuth.js + OTP email service. Frontend: Login, Register, ForgotPassword pages. |
| 10 | **Educator/Mentor Auth** | Separate signup & login flow. Backend: educatorAuth.js. Frontend: EducatorLogin, EducatorSignup pages. |
| 11 | **Admin Auth** | Admin login flow. Backend: adminAuth.js. Frontend: AdminLogin + AdminDashboard pages. |

> 💡 All three share the same JWT-based auth pattern with the `protect` middleware — explain the common architecture once, then highlight how each role differs.

---

## Quick Reference

| Member | Theme | Features |
|--------|-------|----------|
| 1 | Content & Learning | Interactive Resource Library, Expert-Led Webinars |
| 2 | AI Study Planning | AI Study Planner, Adaptive Scheduling |
| 3 | AI Chatbot & RAG | Smart Chatbot, RAG Document System |
| 4 | Mentorship & Access Control | Mentorship Module, Role-Based Access Control |
| 5 | Authentication System | Student Auth, Educator Auth, Admin Auth |
