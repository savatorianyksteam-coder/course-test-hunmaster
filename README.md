# HunMaster Courses

Student-facing course app for HunMaster. The app uses the same Supabase project,
PostgreSQL database, Auth users, RLS policies, and course tables as HunMaster Admin.

## Environment

Set these values from the existing HunMaster Admin Supabase project:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

`SUPABASE_SERVICE_ROLE_KEY` is server-only and is used by TanStack Start server
functions for signup/profile creation and secure username login. Never expose it
to browser code.

## Development

```sh
npm install
npm run dev
```

Useful checks:

```sh
npm run lint
npm run build
npx tsc --noEmit
```

## Backend Contract

Courses reads the shared HunMaster tables managed by Admin:

- `profiles`
- `courses`
- `course_sections`
- `lessons`
- `lesson_blocks`
- `enrollments`
- `lesson_progress`
- `quizzes`
- `assignments`

See [docs/AUTH.md](docs/AUTH.md) for authentication, username login, RLS, and
course-access behavior.
