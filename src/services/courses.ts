import { supabase } from "@/integrations/supabase/client";

export type Course = {
  id: string;
  slug: string;
  code: string;
  title: string;
  description: string | null;
  status: string;
  lessons_count: number;
  modules_count: number;
  hours_count: number;
  sort_order: number;
};

export async function fetchCourses(): Promise<Course[]> {
  const { data, error } = await supabase
    .from("courses")
    .select(
      "id, slug, code, title, description, status, lessons_count, modules_count, hours_count, sort_order",
    )
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return (data as Course[] | null) ?? [];
}

export async function fetchCourseProgress(userId: string) {
  const { data, error } = await supabase
    .from("course_progress")
    .select("course_id, progress_percent, lessons_completed")
    .eq("user_id", userId);
  if (error) throw new Error(error.message);
  return data ?? [];
}