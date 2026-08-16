import { createServerFn } from "@tanstack/react-start";
import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database, Json } from "@/integrations/supabase/types";

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

export type LessonBlockContent = { [key: string]: Json | undefined };
export type LessonBlock = {
  id: string;
  type: "text" | "heading" | "image" | "video" | "audio" | "vocabulary" | "exercise" | "quiz";
  content: LessonBlockContent;
  position: number;
};

export type LessonContentResult =
  | { allowed: false; reason: "not_found" | "no_access" }
  | {
      allowed: true;
      lesson: {
        id: string;
        courseId: string;
        title: string;
        description: string | null;
        position: number;
        videoUrl: string | null;
      };
      course: { id: string; title: string; slug: string };
      blocks: LessonBlock[];
      progress: number;
      completed: boolean;
    };

type AuthedLearningContext = {
  supabase: SupabaseClient<Database>;
  userId: string;
};

const DAY_LABELS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

function dayKey(d: Date) {
  return d.toISOString().slice(0, 10);
}

function isActiveEnrollment(row: { status: string; expires_at: string | null }) {
  return (
    row.status === "active" && (!row.expires_at || new Date(row.expires_at).getTime() > Date.now())
  );
}

function contentObject(value: Json): LessonBlockContent {
  if (value && typeof value === "object" && !Array.isArray(value))
    return value as LessonBlockContent;
  return {};
}

function countVocabularyWords(content: LessonBlockContent) {
  const items = content["items"];
  if (Array.isArray(items)) return items.length;
  return 0;
}

async function activeCourseIds(context: AuthedLearningContext) {
  const { data, error } = await context.supabase
    .from("enrollments")
    .select("course_id, status, expires_at")
    .eq("user_id", context.userId)
    .eq("status", "active");
  if (error) throw new Error(error.message);
  return ((data ?? []) as { course_id: string; status: string; expires_at: string | null }[])
    .filter(isActiveEnrollment)
    .map((row) => row.course_id);
}

/** Authenticated: every learning metric shown in the UI is derived from shared HunMaster rows. */
export const getLearningStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<LearningStats> => {
    const courseIds = await activeCourseIds(context);
    if (!courseIds.length) {
      return emptyStats();
    }

    const { data: lessons, error: lessonsError } = await context.supabase
      .from("lessons")
      .select("id")
      .in("course_id", courseIds)
      .eq("status", "published");
    if (lessonsError) throw new Error(lessonsError.message);

    const lessonIds = ((lessons ?? []) as { id: string }[]).map((lesson) => lesson.id);
    if (!lessonIds.length) return emptyStats();

    const { data: progress, error: progressError } = await context.supabase
      .from("lesson_progress")
      .select("lesson_id, completed, completed_at, progress")
      .eq("user_id", context.userId)
      .in("lesson_id", lessonIds);
    if (progressError) throw new Error(progressError.message);

    const { data: vocabBlocks } = await context.supabase
      .from("lesson_blocks")
      .select("content")
      .in("lesson_id", lessonIds)
      .eq("type", "vocabulary");

    const rows = (
      (progress ?? []) as {
        lesson_id: string;
        completed: boolean;
        completed_at: string | null;
        progress: number;
      }[]
    ).filter((row) => row.completed);
    const wordsLearned = ((vocabBlocks ?? []) as { content: Json }[]).reduce(
      (sum, row) => sum + countVocabularyWords(contentObject(row.content)),
      0,
    );
    const lessonsTotal = lessonIds.length;
    const lessonsCompleted = rows.length;

    const days = new Set(
      rows.filter((row) => row.completed_at).map((row) => dayKey(new Date(row.completed_at!))),
    );
    let streak = 0;
    const cursor = new Date();
    if (!days.has(dayKey(cursor))) cursor.setDate(cursor.getDate() - 1);
    while (days.has(dayKey(cursor))) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }

    const weeklyActivity: WeekPoint[] = [];
    for (let i = 6; i >= 0; i -= 1) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = dayKey(d);
      const dayRows = rows.filter(
        (row) => row.completed_at && dayKey(new Date(row.completed_at)) === key,
      );
      weeklyActivity.push({
        day: DAY_LABELS[(d.getDay() + 6) % 7]!,
        minutes: 0,
        words: dayRows.length,
      });
    }

    const weeklyWords = [3, 2, 1, 0].map((offset) => ({ week: `${4 - offset} нед.`, words: 0 }));
    const activityCalendar: { date: string; level: number }[] = [];
    for (let i = 90; i >= 0; i -= 1) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = dayKey(d);
      const count = rows.filter(
        (row) => row.completed_at && dayKey(new Date(row.completed_at)) === key,
      ).length;
      activityCalendar.push({ date: key, level: Math.min(count, 4) });
    }

    return {
      lessonsCompleted,
      lessonsTotal,
      courseProgress: lessonsTotal ? Math.round((lessonsCompleted / lessonsTotal) * 100) : 0,
      wordsLearned,
      streak,
      minutesSpent: 0,
      accuracy: null,
      perfectLessons: 0,
      hasData: lessonsCompleted > 0,
      completedLessonIds: rows.map((row) => row.lesson_id),
      weeklyActivity,
      weeklyWords,
      activityCalendar,
    };
  });

/** Authenticated + enrollment-checked: protected lesson blocks never leave the server without access. */
export const getLessonContent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ lessonId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }): Promise<LessonContentResult> => {
    const { data: lesson, error: lessonError } = await context.supabase
      .from("lessons")
      .select(
        "id, course_id, title, description, video_url, position, status, course:courses(id, title, slug, status)",
      )
      .eq("id", data.lessonId)
      .maybeSingle();
    if (lessonError) throw new Error(lessonError.message);
    if (
      !lesson ||
      lesson.status !== "published" ||
      !lesson.course ||
      lesson.course.status !== "published"
    ) {
      return { allowed: false, reason: "not_found" };
    }

    const { data: enrollment, error: enrollmentError } = await context.supabase
      .from("enrollments")
      .select("status, expires_at")
      .eq("user_id", context.userId)
      .eq("course_id", lesson.course_id)
      .eq("status", "active")
      .maybeSingle();
    if (enrollmentError) throw new Error(enrollmentError.message);
    if (!enrollment || !isActiveEnrollment(enrollment))
      return { allowed: false, reason: "no_access" };

    const { data: blocks, error: blocksError } = await context.supabase
      .from("lesson_blocks")
      .select("id, type, content, position")
      .eq("lesson_id", data.lessonId)
      .order("position", { ascending: true });
    if (blocksError) throw new Error(blocksError.message);

    const { data: progress, error: progressError } = await context.supabase
      .from("lesson_progress")
      .select("progress, completed")
      .eq("user_id", context.userId)
      .eq("lesson_id", data.lessonId)
      .maybeSingle();
    if (progressError) throw new Error(progressError.message);

    return {
      allowed: true,
      lesson: {
        id: lesson.id,
        courseId: lesson.course_id,
        title: lesson.title,
        description: lesson.description,
        position: lesson.position,
        videoUrl: lesson.video_url,
      },
      course: {
        id: lesson.course.id,
        title: lesson.course.title,
        slug: lesson.course.slug,
      },
      blocks: (
        (blocks ?? []) as {
          id: string;
          type: LessonBlock["type"];
          content: Json;
          position: number;
        }[]
      ).map((block) => ({
        id: block.id,
        type: block.type,
        content: contentObject(block.content),
        position: block.position,
      })),
      progress: progress?.progress ?? 0,
      completed: Boolean(progress?.completed),
    };
  });

/** Authenticated + enrollment-checked: records progress visible to HunMaster Admin. */
export const completeLesson = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        lessonId: z.string().uuid(),
        progress: z.number().int().min(0).max(100),
        completed: z.boolean().default(false),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { data: lesson, error: lessonError } = await context.supabase
      .from("lessons")
      .select("id, course_id, status")
      .eq("id", data.lessonId)
      .eq("status", "published")
      .maybeSingle();
    if (lessonError) throw new Error(lessonError.message);
    if (!lesson) return { ok: false as const, reason: "unknown_lesson" as const };

    const { data: enrollment, error: enrollmentError } = await context.supabase
      .from("enrollments")
      .select("status, expires_at")
      .eq("user_id", context.userId)
      .eq("course_id", lesson.course_id)
      .eq("status", "active")
      .maybeSingle();
    if (enrollmentError) throw new Error(enrollmentError.message);
    if (!enrollment || !isActiveEnrollment(enrollment)) {
      return { ok: false as const, reason: "no_access" as const };
    }

    const now = new Date().toISOString();
    const completed = data.completed || data.progress === 100;
    const { error: upsertError } = await context.supabase.from("lesson_progress").upsert(
      {
        user_id: context.userId,
        lesson_id: data.lessonId,
        progress: completed ? 100 : data.progress,
        completed,
        completed_at: completed ? now : null,
        updated_at: now,
      },
      { onConflict: "user_id,lesson_id" },
    );
    if (upsertError) throw new Error(upsertError.message);

    return { ok: true as const, progress: completed ? 100 : data.progress, completed };
  });

function emptyStats(): LearningStats {
  const weeklyActivity = DAY_LABELS.map((day) => ({ day, minutes: 0, words: 0 }));
  const weeklyWords = [1, 2, 3, 4].map((week) => ({ week: `${week} нед.`, words: 0 }));
  const activityCalendar = Array.from({ length: 91 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (90 - i));
    return { date: dayKey(d), level: 0 };
  });

  return {
    lessonsCompleted: 0,
    lessonsTotal: 0,
    courseProgress: 0,
    wordsLearned: 0,
    streak: 0,
    minutesSpent: 0,
    accuracy: null,
    perfectLessons: 0,
    hasData: false,
    completedLessonIds: [],
    weeklyActivity,
    weeklyWords,
    activityCalendar,
  };
}
