import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type WeekPoint = { day: string; minutes: number; words: number };
export type LearningStats = {
  lessonsCompleted: number;
  lessonsTotal: number;
  courseProgress: number;
  wordsLearned: number;
  streak: number;
  minutesSpent: number;
  accuracy: number | null;
  perfectLessons: number;
  hasData: boolean;
  completedLessonIds: string[];
  weeklyActivity: WeekPoint[];
  weeklyWords: { week: string; words: number }[];
  activityCalendar: { date: string; level: number }[];
};

const DAY_LABELS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

function dayKey(d: Date) {
  return d.toISOString().slice(0, 10);
}

/** Authenticated: every learning metric shown in the UI is derived here from real rows. */
export const getLearningStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<LearningStats> => {
    const { a1LessonIds } = await import("@/data/hunmaster");
    const { data, error } = await context.supabase
      .from("lesson_progress")
      .select("lesson_id, completed, score, words_learned, duration_seconds, completed_at")
      .eq("user_id", context.userId)
      .eq("completed", true);
    if (error) throw new Error(error.message);

    const rows = data ?? [];
    const lessonsTotal = a1LessonIds.length;
    const lessonsCompleted = rows.length;
    const wordsLearned = rows.reduce((sum, r) => sum + (r.words_learned ?? 0), 0);
    const secondsSpent = rows.reduce((sum, r) => sum + (r.duration_seconds ?? 0), 0);
    const scored = rows.filter((r) => typeof r.score === "number");
    const accuracy = scored.length
      ? Math.round(scored.reduce((s, r) => s + (r.score ?? 0), 0) / scored.length)
      : null;

    // Streak: consecutive days with at least one completed lesson, ending today or yesterday.
    const days = new Set(
      rows.filter((r) => r.completed_at).map((r) => dayKey(new Date(r.completed_at!))),
    );
    let streak = 0;
    const cursor = new Date();
    if (!days.has(dayKey(cursor))) cursor.setDate(cursor.getDate() - 1);
    while (days.has(dayKey(cursor))) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }

    // Last 7 days activity.
    const weeklyActivity: WeekPoint[] = [];
    for (let i = 6; i >= 0; i -= 1) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = dayKey(d);
      const dayRows = rows.filter((r) => r.completed_at && dayKey(new Date(r.completed_at)) === key);
      weeklyActivity.push({
        day: DAY_LABELS[(d.getDay() + 6) % 7]!,
        minutes: Math.round(dayRows.reduce((s, r) => s + (r.duration_seconds ?? 0), 0) / 60),
        words: dayRows.reduce((s, r) => s + (r.words_learned ?? 0), 0),
      });
    }

    // Last 4 weeks of new words.
    const weeklyWords = [3, 2, 1, 0].map((offset) => {
      const end = new Date();
      end.setDate(end.getDate() - offset * 7);
      const start = new Date(end);
      start.setDate(start.getDate() - 6);
      const words = rows
        .filter((r) => {
          if (!r.completed_at) return false;
          const t = new Date(r.completed_at).getTime();
          return t >= start.setHours(0, 0, 0, 0) && t <= end.getTime();
        })
        .reduce((s, r) => s + (r.words_learned ?? 0), 0);
      return { week: `${4 - offset} нед.`, words };
    });

    const activityCalendar: { date: string; level: number }[] = [];
    for (let i = 90; i >= 0; i -= 1) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = dayKey(d);
      const count = rows.filter(
        (r) => r.completed_at && dayKey(new Date(r.completed_at)) === key,
      ).length;
      activityCalendar.push({ date: key, level: Math.min(count, 4) });
    }

    return {
      lessonsCompleted,
      lessonsTotal,
      courseProgress: lessonsTotal ? Math.round((lessonsCompleted / lessonsTotal) * 100) : 0,
      wordsLearned,
      streak,
      minutesSpent: Math.round(secondsSpent / 60),
      accuracy,
      perfectLessons: rows.filter((r) => r.score === 100).length,
      hasData: lessonsCompleted > 0,
      completedLessonIds: rows.map((r) => r.lesson_id),
      weeklyActivity,
      weeklyWords,
      activityCalendar,
    };
  });

/** Authenticated + access-checked: protected lesson content never leaves the server without access. */
export const getLessonContent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ lessonId: z.string().min(1) }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: allowed, error } = await context.supabase.rpc("current_user_has_course_access");
    if (error) throw new Error(error.message);
    if (!allowed) return { allowed: false as const, steps: [] };

    const { getStepsForLesson } = await import("@/content/lessons.server");
    return { allowed: true as const, steps: getStepsForLesson(data.lessonId) };
  });

/** Authenticated + access-checked: records a real completion. */
export const completeLesson = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        lessonId: z.string().min(1).max(64),
        correct: z.number().int().min(0).max(500),
        total: z.number().int().min(1).max(500),
        durationSeconds: z.number().int().min(0).max(60 * 60 * 4),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { data: allowed, error: accessError } = await context.supabase.rpc(
      "current_user_has_course_access",
    );
    if (accessError) throw new Error(accessError.message);
    if (!allowed) return { ok: false as const, reason: "no_access" as const };

    const { a1LessonIds } = await import("@/data/hunmaster");
    if (!a1LessonIds.includes(data.lessonId)) return { ok: false as const, reason: "unknown_lesson" as const };

    const { countWordSteps } = await import("@/content/lessons.server");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: course } = await supabaseAdmin
      .from("courses")
      .select("id")
      .eq("slug", "a1")
      .maybeSingle();

    const score = Math.max(0, Math.min(100, Math.round((data.correct / data.total) * 100)));

    const { error: upsertError } = await supabaseAdmin.from("lesson_progress").upsert(
      {
        user_id: context.userId,
        course_id: course?.id ?? null,
        lesson_id: data.lessonId,
        completed: true,
        score,
        words_learned: countWordSteps(data.lessonId),
        duration_seconds: data.durationSeconds,
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,lesson_id" },
    );
    if (upsertError) throw new Error(upsertError.message);

    if (course?.id) {
      const { count } = await supabaseAdmin
        .from("lesson_progress")
        .select("id", { count: "exact", head: true })
        .eq("user_id", context.userId)
        .eq("completed", true);
      const completed = count ?? 0;
      await supabaseAdmin.from("course_progress").upsert(
        {
          user_id: context.userId,
          course_id: course.id,
          lessons_completed: completed,
          progress_percent: Math.round((completed / a1LessonIds.length) * 100),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,course_id" },
      );
    }

    return { ok: true as const, score };
  });