import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Difficulty = Database["public"]["Enums"]["difficulty_level"];

export type CourseSummary = {
  id: string;
  slug: string;
  code: string;
  title: string;
  description: string | null;
  coverUrl: string | null;
  difficulty: Difficulty;
  position: number;
  grantedAt: string;
  expiresAt: string | null;
  lessonsCount: number;
  sectionsCount: number;
  completedLessons: number;
  progress: number;
};

export type LessonListItem = {
  id: string;
  title: string;
  description: string | null;
  position: number;
  completed: boolean;
  progress: number;
};

export type CourseSection = {
  id: string;
  title: string;
  description: string | null;
  position: number;
  lessons: LessonListItem[];
};

export type CourseDetail = CourseSummary & {
  sections: CourseSection[];
};

type CourseRow = Database["public"]["Tables"]["courses"]["Row"];
type SectionRow = Database["public"]["Tables"]["course_sections"]["Row"];
type LessonRow = Database["public"]["Tables"]["lessons"]["Row"];
type ProgressRow = Database["public"]["Tables"]["lesson_progress"]["Row"];
type EnrollmentRow = Database["public"]["Tables"]["enrollments"]["Row"];
type EnrollmentWithCourse = EnrollmentRow & { course: CourseRow | null };

const difficultyCode: Record<Difficulty, string> = {
  beginner: "A1",
  elementary: "A2",
  intermediate: "B1",
  advanced: "B2",
};

function isActiveEnrollment(row: { status: string; expires_at: string | null }) {
  return (
    row.status === "active" && (!row.expires_at || new Date(row.expires_at).getTime() > Date.now())
  );
}

function toSummary(
  course: CourseRow,
  enrollment: { granted_at: string; expires_at: string | null },
  lessons: LessonRow[],
  sections: SectionRow[],
  progressRows: ProgressRow[],
): CourseSummary {
  const courseLessons = lessons.filter((lesson) => lesson.course_id === course.id);
  const lessonIds = new Set(courseLessons.map((lesson) => lesson.id));
  const completedLessons = progressRows.filter(
    (row) => row.completed && lessonIds.has(row.lesson_id),
  ).length;
  const lessonsCount = courseLessons.length;

  return {
    id: course.id,
    slug: course.slug,
    code: difficultyCode[course.difficulty],
    title: course.title,
    description: course.description,
    coverUrl: course.cover_url,
    difficulty: course.difficulty,
    position: course.position,
    grantedAt: enrollment.granted_at,
    expiresAt: enrollment.expires_at,
    lessonsCount,
    sectionsCount: sections.filter((section) => section.course_id === course.id).length,
    completedLessons,
    progress: lessonsCount ? Math.round((completedLessons / lessonsCount) * 100) : 0,
  };
}

async function fetchPublishedLessons(courseIds: string[]) {
  if (!courseIds.length) return [];
  const { data, error } = await supabase
    .from("lessons")
    .select(
      "id, course_id, section_id, title, slug, description, content, video_url, position, status, created_at, updated_at",
    )
    .in("course_id", courseIds)
    .eq("status", "published")
    .order("position", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as LessonRow[];
}

async function fetchSections(courseIds: string[]) {
  if (!courseIds.length) return [];
  const { data, error } = await supabase
    .from("course_sections")
    .select("id, course_id, title, description, position, created_at, updated_at")
    .in("course_id", courseIds)
    .order("position", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as SectionRow[];
}

async function fetchProgress(userId: string, lessonIds: string[]) {
  if (!lessonIds.length) return [];
  const { data, error } = await supabase
    .from("lesson_progress")
    .select("id, user_id, lesson_id, progress, completed, completed_at, updated_at")
    .eq("user_id", userId)
    .in("lesson_id", lessonIds);
  if (error) throw new Error(error.message);
  return (data ?? []) as ProgressRow[];
}

export async function fetchMyCourses(userId: string): Promise<CourseSummary[]> {
  const { data, error } = await supabase
    .from("enrollments")
    .select(
      "id, user_id, course_id, status, granted_by, granted_at, expires_at, created_at, updated_at, course:courses(id, slug, title, description, cover_url, status, price, currency, difficulty, position, created_by, created_at, updated_at)",
    )
    .eq("user_id", userId)
    .eq("status", "active")
    .order("granted_at", { ascending: true });
  if (error) throw new Error(error.message);

  const enrollments = ((data ?? []) as EnrollmentWithCourse[]).filter(isActiveEnrollment);
  const courses = enrollments
    .map((row) => row.course as CourseRow | null)
    .filter((course): course is CourseRow => Boolean(course && course.status === "published"));
  const courseIds = courses.map((course) => course.id);
  const [sections, lessons] = await Promise.all([
    fetchSections(courseIds),
    fetchPublishedLessons(courseIds),
  ]);
  const progressRows = await fetchProgress(
    userId,
    lessons.map((lesson) => lesson.id),
  );

  return courses
    .map((course) => {
      const enrollment = enrollments.find((row) => row.course_id === course.id)!;
      return toSummary(course, enrollment, lessons, sections, progressRows);
    })
    .sort((a, b) => a.position - b.position || a.title.localeCompare(b.title));
}

export async function fetchCourseDetail(
  courseId: string,
  userId: string,
): Promise<CourseDetail | null> {
  const { data: enrollment, error: enrollmentError } = await supabase
    .from("enrollments")
    .select(
      "id, user_id, course_id, status, granted_by, granted_at, expires_at, created_at, updated_at",
    )
    .eq("user_id", userId)
    .eq("course_id", courseId)
    .eq("status", "active")
    .maybeSingle();
  if (enrollmentError) throw new Error(enrollmentError.message);
  if (!enrollment || !isActiveEnrollment(enrollment)) return null;

  const { data: course, error: courseError } = await supabase
    .from("courses")
    .select(
      "id, slug, title, description, cover_url, status, price, currency, difficulty, position, created_by, created_at, updated_at",
    )
    .eq("id", courseId)
    .eq("status", "published")
    .maybeSingle();
  if (courseError) throw new Error(courseError.message);
  if (!course) return null;

  const [sections, lessons] = await Promise.all([
    fetchSections([courseId]),
    fetchPublishedLessons([courseId]),
  ]);
  const progressRows = await fetchProgress(
    userId,
    lessons.map((lesson) => lesson.id),
  );
  const progressByLesson = new Map(progressRows.map((row) => [row.lesson_id, row]));
  const sectionRows = sections.length
    ? sections
    : [
        {
          id: "default",
          course_id: courseId,
          title: "Уроки",
          description: null,
          position: 0,
          created_at: course.created_at,
          updated_at: course.updated_at,
        },
      ];

  return {
    ...toSummary(course as CourseRow, enrollment, lessons, sections, progressRows),
    sections: sectionRows.map((section) => ({
      id: section.id,
      title: section.title,
      description: section.description,
      position: section.position,
      lessons: lessons
        .filter((lesson) =>
          section.id === "default" ? !lesson.section_id : lesson.section_id === section.id,
        )
        .map((lesson) => {
          const progress = progressByLesson.get(lesson.id);
          return {
            id: lesson.id,
            title: lesson.title,
            description: lesson.description,
            position: lesson.position,
            completed: Boolean(progress?.completed),
            progress: progress?.progress ?? 0,
          };
        }),
    })),
  };
}
