"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarRange,
  ArrowLeft,
  Clock,
  Database,
  ExternalLink,
  Globe,
  Layers,
  ShieldAlert,
} from "lucide-react";

import { Card, CardBody, CardHeader } from "@/components/ui/Card.js";
import { ErrorState, LoadingState } from "@/components/ui/States.js";
import { Table, TBody, TD, THead, TR } from "@/components/ui/Table.js";
import { useLang } from "@/lib/i18n/LanguageContext.js";
import { fetchDataSources } from "@/services/api.js";

export default function DataSourcesPage() {
  const { t } = useLang();
  const [datasets, setDatasets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatDate = (value) => {
    if (!value) return "—";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "—" : date.toISOString().slice(0, 10);
  };

  const loadDataSources = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchDataSources();
      if (res.success && Array.isArray(res.data)) {
        setDatasets(res.data);
      } else {
        setError(res.error?.message || "Failed to load dataset catalogue");
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadDataSources();
  }, []);

  return (
    <div className="space-y-7 rounded-3xl bg-gradient-to-br from-sky-50/50 via-bg to-emerald-50/50 p-3 sm:p-5 dark:from-sky-950/15 dark:to-emerald-950/15">
      {/* Page header */}
      <header className="rounded-3xl border border-sky-200 bg-gradient-to-br from-sky-100 via-surface to-emerald-100/70 p-5 sm:p-7 dark:border-sky-900 dark:from-sky-950/40 dark:to-emerald-950/30">
        <div className="mb-5 flex justify-end">
          <Link href="/" className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-emerald-200 bg-surface px-4 py-2 text-sm font-semibold text-forest transition-colors hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-200 dark:hover:bg-emerald-950/30">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />{t("common.backHome")}
          </Link>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-[#124394] sm:text-3xl dark:text-sky-200">
          {t("dataSources.title")}
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">
          {t("dataSources.subtitle")}
        </p>
      </header>

      {/* Loading state */}
      {isLoading && (
        <Card>
          <CardBody>
            <LoadingState />
          </CardBody>
        </Card>
      )}

      {/* Error state */}
      {error && !isLoading && (
        <Card>
          <CardBody>
            <ErrorState onRetry={loadDataSources} />
            <p className="mt-2 text-center text-xs text-danger">{error}</p>
          </CardBody>
        </Card>
      )}

      {/* Active Datasets */}
      {!isLoading && datasets.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-lg font-semibold text-content flex items-center gap-2">
            <Database className="h-5 w-5 text-emerald" aria-hidden="true" />
            {t("dataSources.activeTitle")}
          </h2>

          {datasets.map((ds, index) => (
            <Card key={ds.datasetKey} className={`overflow-hidden !rounded-3xl shadow-km-sm ${["!border-emerald-200 bg-gradient-to-br from-emerald-50/80 via-surface to-lime-50/40 dark:!border-emerald-900 dark:from-emerald-950/30 dark:to-lime-950/15", "!border-sky-200 bg-gradient-to-br from-sky-50/80 via-surface to-cyan-50/40 dark:!border-sky-900 dark:from-sky-950/30 dark:to-cyan-950/15", "!border-amber-200 bg-gradient-to-br from-amber-50/80 via-surface to-yellow-50/40 dark:!border-amber-900 dark:from-amber-950/30 dark:to-yellow-950/15", "!border-violet-200 bg-gradient-to-br from-violet-50/80 via-surface to-indigo-50/40 dark:!border-violet-900 dark:from-violet-950/30 dark:to-indigo-950/15"][index % 4]}`}>
              <CardHeader
                className="border-b border-black/5 bg-surface/50 pb-5 dark:border-white/10"
                title={ds.product}
                description={ds.provider}
              />
              <CardBody className="space-y-6">
                {/* Key metadata grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50/80 p-4 dark:border-emerald-900 dark:bg-emerald-950/20">
                    <p className="text-xs text-muted flex items-center gap-1.5">
                      <Layers className="h-3.5 w-3.5 text-emerald" />
                      {t("dataSources.observationCount")}
                    </p>
                    <p className="mt-2 break-words text-base font-semibold leading-7 text-content">
                      {Number.isFinite(ds.observationCount) ? ds.observationCount.toLocaleString() : "—"}
                    </p>
                    <p className="text-xs text-muted mt-0.5">
                    {ds.availability === "available" ? (t("dataSources.lastIngested") || "Last ingested") + ": " + formatDate(ds.lastIngestedAt) : ds.availability}
                    </p>
                    <p className="text-[11px] text-muted mt-1">
                      {Object.entries(ds.districtCoverage || {}).map(([district, count]) => `${district}: ${count.toLocaleString()}`).join(" · ") || "No district records"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-sky-100 bg-sky-50/80 p-4 dark:border-sky-900 dark:bg-sky-950/20">
                    <p className="text-xs text-muted flex items-center gap-1.5">
                      <CalendarRange className="h-3.5 w-3.5 text-climate" />
                      {t("dataSources.coveragePeriod")}
                    </p>
                    <p className="mt-2 break-words text-base font-semibold leading-7 text-content">
                      {formatDate(ds.firstObservationDate)} – {formatDate(ds.lastObservationDate)}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-amber-100 bg-amber-50/80 p-4 dark:border-amber-900 dark:bg-amber-950/20">
                    <p className="text-xs text-muted flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-amber" />
                      {t("dataSources.timeStandard")}
                    </p>
                    <p className="mt-2 break-words text-base font-semibold leading-7 text-content">{ds.timeStandard || "—"}</p>
                    <p className="text-xs text-muted mt-0.5">{ds.timeStandardDisclosure}</p>
                  </div>

                  <div className="rounded-2xl border border-violet-100 bg-violet-50/80 p-4 dark:border-violet-900 dark:bg-violet-950/20">
                    <p className="text-xs text-muted flex items-center gap-1.5">
                      <Globe className="h-3.5 w-3.5 text-purple" />
                      {t("dataSources.spatialResolution")}
                    </p>
                    <p className="mt-2 break-words text-base font-semibold leading-7 text-content">
                      {ds.spatialResolution || ds.spatialResolutionNote || "—"}
                    </p>
                  </div>
                </div>

                {/* Parameters table */}
                <details className="rounded-2xl border border-line bg-surface/80 p-4">
                  <summary className="cursor-pointer text-sm font-semibold text-content">{t("dataSources.parameters")}</summary>
                <div className="mt-4 overflow-x-auto">
                  <h3 className="text-sm font-semibold text-content mb-3">
                    {t("dataSources.parameters")}
                  </h3>
                  <Table>
                    <THead columns={["Code", "Description", "Unit", "Temporal Resolution"]} />
                    <TBody>
                      {Object.entries(ds.parameters || {}).map(([paramCode, info]) => (
                        <TR key={paramCode}>
                          <TD className="font-mono text-xs font-semibold text-emerald">
                            {paramCode}
                          </TD>
                          <TD className="text-content text-sm">{info.longName}</TD>
                          <TD className="text-muted text-sm font-mono">{info.unit}</TD>
                          <TD className="text-muted text-sm">Daily (LST)</TD>
                        </TR>
                      ))}
                    </TBody>
                  </Table>
                </div>

                {/* Time standard disclosure notice */}
                <div className="mt-4 rounded-2xl border border-sky-100 bg-sky-50/60 p-4 space-y-2 dark:border-sky-900 dark:bg-sky-950/20">
                  <div className="flex items-center gap-2 text-content font-medium text-sm">
                    <Clock className="h-4 w-4 text-climate" />
                    {t("dataSources.disclosureTitle")}
                  </div>
                  <p className="text-xs text-muted leading-relaxed">
                    {ds.timeStandardDisclosure}
                  </p>
                  {ds.qualityPolicy && <p className="text-xs text-muted leading-relaxed"><strong className="text-content">Quality policy:</strong> {ds.qualityPolicy}</p>}
                </div>

                </details>

                {/* Official source links */}
                {ds.sourceUrls && ds.sourceUrls.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-content uppercase tracking-wider mb-2">
                      {t("dataSources.sources")}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {ds.sourceUrls.map((url) => (
                        <a
                          key={url}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex max-w-full items-center gap-2 rounded-xl border border-emerald-200 bg-surface px-3 py-2.5 text-xs text-content transition-colors hover:bg-emerald-50 dark:border-emerald-900 dark:hover:bg-emerald-950/30"
                        >
                          <span className="break-all">{url}</span>
                          <ExternalLink className="h-3 w-3 text-muted" aria-hidden="true" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>
          ))}
        </section>
      )}

      {/* Transparency and Scientific Notice */}
      <section>
        <Card className="!rounded-2xl !border-sky-200 bg-sky-50/60 dark:!border-sky-900 dark:bg-sky-950/20">
          <CardBody className="flex items-start gap-3 p-5">
            <ShieldAlert className="h-5 w-5 shrink-0 text-amber mt-0.5" aria-hidden="true" />
            <div>
              <h3 className="text-sm font-semibold text-content">
                {t("dataSources.limitationsTitle")}
              </h3>
              <p className="mt-1 text-xs text-muted leading-relaxed">
                {t("dataSources.limitationsBody")}
              </p>
            </div>
          </CardBody>
        </Card>
      </section>
    </div>
  );
}
