"use client";
import { CloudSun } from "lucide-react";
import { usePathname } from "next/navigation";
import { PublicHeader, PublicFooter } from "@/components/layout/PublicChrome.js";
import { AppShell } from "@/components/layout/AppShell.js";
import { useAuth } from "@/contexts/AuthContext.js";
import { useLang } from "@/lib/i18n/LanguageContext.js";

function PublicRecordsShell({ children }) {
  const pathname = usePathname();
  const { t } = useLang();
  return <div className="flex min-h-screen flex-col bg-bg">
    {pathname !== "/data-sources" && <PublicHeader />}
    {pathname === "/climate" && <div className="border-b border-green-100 bg-gradient-to-r from-green-50 via-surface to-sky-50 dark:border-green-900 dark:from-green-950/30 dark:via-surface dark:to-sky-950/20">
      <div className="mx-auto flex max-w-7xl items-start gap-4 px-4 py-6 sm:px-6 lg:px-8">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"><CloudSun className="h-7 w-7" aria-hidden="true" /></span>
        <div>
          <p className="text-2xl font-bold text-forest dark:text-green-200">{t("publicHeader.climateData")}</p>
          <p className="mt-1 max-w-3xl text-sm leading-6 text-muted">{t("publicData.intro")}</p>
        </div>
      </div>
    </div>}
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    <PublicFooter />
  </div>;
}

/** Keep records public, with workspace navigation for signed-in farmers. */
export function PublicDataLayout({ children }) {
  const { user } = useAuth();
  const Shell = user ? AppShell : PublicRecordsShell;
  return <Shell>{children}</Shell>;
}
