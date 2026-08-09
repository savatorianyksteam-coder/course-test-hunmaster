REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.has_course_access(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.current_user_has_course_access() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.protect_profile_fields() FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.has_course_access(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.current_user_has_course_access() TO authenticated, service_role;