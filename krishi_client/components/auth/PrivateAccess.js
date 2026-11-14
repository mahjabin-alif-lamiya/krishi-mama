"use client";
import { useSyncExternalStore } from "react";
import { MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext.js";
import { useLang } from "@/lib/i18n/LanguageContext.js";
import { isPrivatePath } from "@/lib/access.js";
import { Button } from "@/components/ui/Button.js";

const subscribe = () => () => {};

export function PrivateAccess({ children }) {
  const pathname = usePathname();
  const { user, isLoading } = useAuth();
  const { t } = useLang();
  const hydrated = useSyncExternalStore(subscribe, () => true, () => false);
  if (!hydrated) return <p role="status" className="p-8 text-muted">{t("common.loading")}</p>;
  if (!isPrivatePath(pathname)) return children;
  if (isLoading) return <p role="status" className="p-8 text-muted">{t("common.loading")}</p>;
  if (user) return children;
  const isAssistant = pathname === "/assistant";
  return <section className={`mx-auto max-w-xl rounded-3xl border p-6 sm:p-10 ${isAssistant ? "border-emerald-200 bg-gradient-to-br from-emerald-50 via-surface to-lime-50 shadow-sm dark:border-emerald-900 dark:from-emerald-950/30 dark:to-lime-950/20" : "border-line bg-surface"}`}>
    {isAssistant && <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"><MessageCircle className="h-7 w-7" aria-hidden="true" /></span>}
    <h1 className="text-2xl font-semibold text-content">{t(isAssistant ? "access.assistantTitle" : "access.title")}</h1>
    <p className="my-4 leading-relaxed text-muted">{t(isAssistant ? "access.assistantBody" : "access.body")}</p>
    <div className="flex flex-wrap gap-3">
      <Button href={`/login?redirect=${encodeURIComponent(pathname)}`}>{t(isAssistant ? "access.assistantLogin" : "auth.login")}</Button>
      <Button href="/crop-rotation" variant="outline">{t("access.demo")}</Button>
    </div>
  </section>;
}
