# Campus Connect — Frontend

A from-scratch, premium-styled rebuild of the campus Q&A + notice-board app —
Create React App (`react-scripts`), no backend zip was supplied for this one,
so the API contract below reflects what the previous codebase already called,
with the fixes and one addition noted inline.

## Design
Custom design system (no MUI/Bootstrap/sweetalert2) — `src/index.css` defines the
full token set (color, radius, shadow, motion) once, consumed everywhere via CSS
variables. Light/dark theme toggle in the topbar. Toasts and confirm dialogs are
custom components (`ToastContext`, `ConfirmContext`) styled to match, replacing
`sweetalert2`'s default look, which would have clashed with everything else.

## Bugs fixed from the previous version
- **Question voting hit the wrong endpoint.** `QuestionsDetails` called
  `/answer/{type}vote/{questionId}` to vote on a *question* — since answer ids
  and question ids aren't the same sequence, this could silently mutate an
  unrelated answer. Questions now have their own `questionApi.upvote/downvote`
  hitting `/question/upvote/{id}` and `/question/downvote/{id}`.
- **Two components bypassed the shared axios instance.** `Login.jsx` and
  `AddDashboard.jsx` built their own `axios.post(...)` calls with a hardcoded
  `http://localhost:8080` URL, which meant the auth token header was attached
  inconsistently. Everything now goes through the single `src/api/client.js`.
- **Dual role flags.** `localStorage` held both `TYPE` (admin) and `TYPES`
  (student) as separate keys, checked in different places. Replaced with one
  `profile.Type` field read through `AuthContext` (`isAdmin` / `isStudent`).
- **N+1 request pattern on the question list.** The old `Questions.jsx` fired
  a separate `/answer/list/{id}` call *per row* just to show a vote/answer
  count. The new list page expects `upVotes`, `downVotes`, and `answerCount`
  directly on each item from `GET /question/list` — much cheaper at scale.
  **This requires a small backend change** if the current endpoint doesn't
  already return those fields; it's the one place this rebuild asks something
  of the API rather than just consuming it.
- **Dead link to a nonexistent user-profile route.** The old question detail
  page linked to `/Users/:matricNo`, but no endpoint exists to look up another
  student's profile by matric number — removed rather than shipping a 404.

## New: registration
There was a login screen with matric number + password, but nothing to create
that account. Added `POST /register` (same request/response shape as `/login`)
and a full `RegisterPage` with faculty → department cascading selects. **This
endpoint needs to exist on the backend** — it's the one genuinely new API
surface introduced here, everything else consumes what was already being
called.

## Full endpoint list (base `REACT_APP_API_BASE_URL`, default `/api/v1`)
```
POST   /login                              { matricNumber, password } -> { token, profileDTO }
POST   /register                           { firstName, lastName, matricNumber, set, faculty, department, password } -> { token, profileDTO }

GET    /question/list                      -> Question[] (expects upVotes, downVotes, answerCount per item)
GET    /question/:id                       -> Question
POST   /question/add                       { title, content, matricNo }
DELETE /question/delete/:id
POST   /question/upvote/:id
POST   /question/downvote/:id

GET    /answer/list/:questionId            -> Answer[]
POST   /answer/add                         { questionId, content, firstName, lastName }
POST   /answer/upvote/:id
POST   /answer/downvote/:id

GET    /comment/list/:answerId             -> Comment[]
POST   /comment/add                        { answerId, content, firstName, lastName }

GET    /dashboard/main/list/Main           -> Notice[]   (general board)
GET    /dashboard/faculty/list/:faculty    -> Notice[]
GET    /dashboard/department/list/:dept   -> Notice[]
GET    /dashboard?page&size                -> Notice[] | Page<Notice>  (admin, all notices)
POST   /dashboard/add                      multipart: subject, source, mains, faculty, department, content, document
PUT    /dashboard/update/:id               multipart: same fields + date
DELETE /dashboard/delete/:id
```

## Setup
```bash
cp .env.example .env      # confirm REACT_APP_API_BASE_URL points at your backend
npm install
npm start                  # http://localhost:3000
```

`.env.example` also sets `DISABLE_ESLINT_PLUGIN=true` — react-scripts 5's bundled
ESLint webpack plugin currently crashes on a fresh install under modern npm
(unrelated to this project's code; CRA hasn't shipped a release since 2022).
Lint separately with `npx eslint src` if you want it.

## Structure
```
src/
  api/            client.js (axios + token header + 401 handling) + one file per domain
  constants/      shared faculty/department taxonomy (was duplicated inline before)
  context/        AuthContext, ThemeContext, ToastContext, ConfirmContext
  components/     Layout (topbar/nav/user menu), Avatar, VoteControl, EmptyState, Spinner, ProtectedRoute
  pages/
    auth/         LoginPage, RegisterPage
    notices/      NoticeFeedPage (general/faculty/department in one component),
                  NoticeAdminPage, NoticeFormPage, EditNoticeModal
    qa/           QuestionsListPage, AskQuestionPage, QuestionDetailPage
    profile/      ProfilePage
```

## Known gaps / next steps
- No image lightbox/zoom on notice attachments — clicking a notice image does
  nothing yet.
- Question search on `/questions` filters titles client-side only; move to a
  server-side search param if the question list ever gets large.
- `NoticeAdminPage` pagination assumes the backend either returns a flat array
  or a Spring `Page` (`{content: [...]}`) — adjust `noticeApi.listAll` if the
  real shape differs.
