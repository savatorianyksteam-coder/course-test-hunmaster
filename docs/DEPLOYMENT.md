# HunMaster Courses Deployment

HunMaster Courses is a client of the shared HunMaster backend. It must use the
same Supabase project as HunMaster Admin:

- Supabase project: `HunMaster`
- Project ref: `lthzuqejupoanyblalmy`
- Database: shared PostgreSQL database for Admin and Courses

Do not create a second Supabase project or duplicate course tables for Courses.
The shared schema includes `profiles`, `courses`, `course_sections`, `lessons`,
`lesson_blocks`, `enrollments`, and `lesson_progress`.

## Environment Variables

Client-side variables:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Server-only variables used by TanStack Start server functions:

```env
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

`SUPABASE_SERVICE_ROLE_KEY` must stay server-side only. Never prefix it with
`VITE_`, never commit it to Git, and never expose it in browser code.

## Build

The project uses TanStack Start through Vite.

```bash
pnpm run build
```

The existing GitHub `main` branch is the deployment source. Vercel deployment is
handled by the existing GitHub integration, so repository changes must be pushed
to `main`.

## Auth And Access

Registration creates a Supabase Auth user and a shared `profiles` row with
`role = student`. Username login is resolved in a server function so private
emails are not exposed to public browser clients.

Course and lesson access is enforced by shared RLS. Students can read published
course content only through active, non-expired `enrollments`. Lesson progress is
stored in `lesson_progress` and is visible to HunMaster Admin through the same
database.
