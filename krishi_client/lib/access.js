const PRIVATE_ROOTS = ["/handoff", "/my-farm", "/rotation-planner", "/assistant", "/settings", "/map", "/crop-calendar"];
export const PUBLIC_DATA_PATHS = ["/climate", "/rainfall", "/soil-moisture", "/vegetation", "/data-sources"];
export function isPublicDataPath(pathname) { return PUBLIC_DATA_PATHS.includes(pathname); }
export function isPrivatePath(pathname = "") {
  return PRIVATE_ROOTS.some((root) => pathname === root || pathname.startsWith(`${root}/`));
}
// Only permit known internal routes. Reject protocol-relative and encoded redirect escapes.
export function safeReturnTo(value) {
  if (typeof value !== "string" || value.includes("\\") || /[%\s#?]/.test(value)) return "/dashboard";
  return ["/dashboard", "/handoff", "/rotation-planner", "/assistant", "/settings", "/map", "/crop-calendar"].includes(value) || /^\/my-farm(?:\/(?:new|plan|[a-f\d]{24})(?:\/edit)?)?$/.test(value) ? value : "/dashboard";
}
export const AUTH_RETURN_KEY = "km-auth-return";
