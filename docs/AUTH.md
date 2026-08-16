# HunMaster Courses Auth

HunMaster Courses does not create a separate Supabase backend. It connects to
the same Supabase project and PostgreSQL database used by HunMaster Admin.

## Environment Variables

Client-side:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Server-only TanStack Start functions:

```env
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

The service-role key is never imported into route components or browser code.

## Registration

The registration form collects:

- name
- username
- email
- password
- password confirmation

Passwords are handled only by Supabase Auth email/password. Email confirmation is
expected to be disabled in Supabase Auth for this phase.

The server function creates a Supabase Auth user and upserts a shared
`profiles` row:

```text
id = auth.users.id
email
username
full_name
role = student
account_status = pending
is_active = true
```

The frontend never accepts or forwards an elevated role during signup.

## Username

Usernames are stored in `profiles.username`.

Rules:

- required during registration
- 3-30 characters
- lowercase letters, digits, and `_`
- no spaces
- unique case-insensitively through `profiles_username_lower_unique`

The helper RPC `username_available(username)` exposes only availability, not the
private email behind a username.

## Login

The login form accepts `Email или логин` plus password.

Supabase Auth still signs in with email/password. If the user enters a username,
a server function resolves the email using the server-only Supabase admin client,
then performs the password grant with the anon key. The resolved email is never
returned to the browser.

## Sessions

The Supabase browser client keeps sessions in local storage with
`persistSession` and `autoRefreshToken` enabled. `AuthProvider` restores the
current session, loads the current profile, exposes loading state, and supports
logout.

## Protected Routes

The dashboard and authenticated route group redirect unauthenticated users to
`/login`. Signed-in users can open the shell, but course content is still gated
by active enrollments.

## Course Access

Course access is driven by the shared `enrollments` table:

```text
user_id
course_id
status = active
expires_at is null or in the future
```

Courses shows only published courses with an active, unexpired enrollment for the
current user. Revoking access in HunMaster Admin immediately removes access in
Courses without manual sync.

## Lessons And Progress

Lessons are loaded from:

- `course_sections`
- `lessons`
- `lesson_blocks`

Completing or advancing a lesson upserts `lesson_progress` for the current user:

```text
user_id
lesson_id
progress
completed
completed_at
updated_at
```

HunMaster Admin can read the same `lesson_progress` rows.

## RLS

The Courses migration tightens public read policies so students can read lesson
content, quizzes, and assignments only for courses with active enrollment.

Users can read their own profile, enrollments, progress, quiz attempts, and
submissions. Admin/owner role changes remain managed by HunMaster Admin and
protected by database policies/triggers.
