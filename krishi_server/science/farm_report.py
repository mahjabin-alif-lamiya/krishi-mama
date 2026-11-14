"""Deterministic, multi-source environmental evidence report for a farm."""

from datetime import date
from typing import Any, Dict, Optional
import math
import numpy as np

SUPPORTED_DISTRICTS = {"cumilla", "chattogram"}
FORMULA_VERSION = "farm-report-v1.0.0"


def _finite(value: Any) -> Optional[float]:
    try:
        number = float(value)
    except (TypeError, ValueError):
        return None
    return number if np.isfinite(number) else None


def _date(value: Any) -> Optional[date]:
    if not isinstance(value, str):
        return None
    try:
        return date.fromisoformat(value[:10])
    except ValueError:
        return None


def build_farm_environment_report(payload: Dict[str, Any]) -> Dict[str, Any]:
    """Combine already-validated source summaries without inventing a risk score."""
    if not isinstance(payload, dict):
        return {"success": False, "error": "Input must be a JSON object."}

    district = str(payload.get("district") or "").strip().lower()
    if district not in SUPPORTED_DISTRICTS:
        return {"success": False, "error": "Unsupported district.", "supportedDistricts": sorted(SUPPORTED_DISTRICTS)}

    raw = payload.get("datasets") if isinstance(payload.get("datasets"), dict) else {}
    gpm_raw = raw.get("gpm") if isinstance(raw.get("gpm"), dict) else {}
    smap_raw = raw.get("smap") if isinstance(raw.get("smap"), dict) else {}
    modis_raw = raw.get("modis") if isinstance(raw.get("modis"), dict) else {}
    power_raw = raw.get("power") if isinstance(raw.get("power"), dict) else {}

    gpm_day = gpm_raw.get("dailySummary") if isinstance(gpm_raw.get("dailySummary"), dict) else {}
    gpm_total = _finite(gpm_day.get("totalPrecipitationMm"))
    gpm_intervals = int(gpm_day.get("validIntervals") or 0)
    gpm_complete = gpm_day.get("completeness") == "complete" and gpm_intervals == 48 and gpm_total is not None
    gpm = {
        "status": "available" if gpm_complete else "incomplete_or_unavailable",
        "observationDate": gpm_raw.get("observationDate") or gpm_day.get("dateLabel"),
        "dailyTotalMm": gpm_total if gpm_complete else None,
        "validIntervals": gpm_intervals,
        "expectedIntervals": 48,
        "source": gpm_raw.get("source") or "NASA GPM IMERG Final V07",
        "spatialResolution": gpm_raw.get("spatialResolution"),
    }

    smap_value = _finite(smap_raw.get("soilMoisture"))
    smap_available = smap_value is not None and bool(smap_raw.get("isRecommendedQuality"))
    smap = {
        "status": "available" if smap_available else "unavailable",
        "observationDate": smap_raw.get("date"),
        "surfaceSoilMoisture": smap_value if smap_available else None,
        "unit": smap_raw.get("unit"),
        "qualityFlag": smap_raw.get("retrievalQualityFlag"),
        "qualityClassification": smap_raw.get("qualityClassification"),
        "measurementDepth": "Top 0-5 cm only; not root-zone moisture.",
    }

    ndvi = _finite(modis_raw.get("ndvi"))
    evi = _finite(modis_raw.get("evi"))
    modis_available = (ndvi is not None or evi is not None) and bool(modis_raw.get("isReliableQuality"))
    modis = {
        "status": "available" if modis_available else "unavailable",
        "observationDate": modis_raw.get("date"),
        "ndvi": ndvi if modis_available else None,
        "evi": evi if modis_available else None,
        "pixelReliability": modis_raw.get("pixelReliability"),
        "qualityClassification": modis_raw.get("qualityClassification"),
        "temporalResolution": modis_raw.get("temporalResolution") or "16-day composite",
        "meaning": "Regional vegetation greenness; not a disease diagnosis or yield estimate.",
    }

    annual = power_raw.get("annualHistorical") if isinstance(power_raw.get("annualHistorical"), dict) else {}
    power_mean = _finite(annual.get("meanAnnualTotalMm"))
    power_available = power_mean is not None
    recent_series = power_raw.get("recentAnnualSeries") if isinstance(power_raw.get("recentAnnualSeries"), list) else []
    power = {
        "status": "available" if power_available else "unavailable",
        "baselinePeriod": "2001-2025",
        "meanAnnualRainfallMm": power_mean,
        "medianAnnualRainfallMm": _finite(annual.get("medianAnnualTotalMm")),
        "recentAnnualSeries": recent_series[-5:],
        "source": power_raw.get("dataset") or "NASA POWER Daily Point",
        "interpretation": "Historical district climate baseline; not current weather or a forecast.",
    }

    date_map = {
        "gpm": _date(gpm.get("observationDate")),
        "smap": _date(smap.get("observationDate")),
        "modis": _date(modis.get("observationDate")),
    }
    dated = [item for item in date_map.items() if item[1] is not None]
    date_span_days = (max(day for _, day in dated) - min(day for _, day in dated)).days if len(dated) > 1 else 0
    used = [
        name for name, available in (
            ("GPM", gpm_complete),
            ("SMAP", smap_available),
            ("MODIS", modis_available),
            ("POWER", power_available),
        ) if available
    ]
    unavailable = [name for name in ("GPM", "SMAP", "MODIS", "POWER") if name not in used]

    cautions = [
        "The datasets have different spatial footprints and update periods; they are not simultaneous field measurements.",
        "District-level satellite and gridded values are regional evidence, not measurements at the farm boundary.",
        "This report is descriptive evidence only. It does not calculate disease, yield, irrigation need, or a future forecast.",
    ]
    if not gpm_complete:
        cautions.append(f"GPM daily rainfall total withheld: {gpm_intervals}/48 valid half-hour intervals.")

    status = "complete_evidence_set" if len(used) == 4 else "partial_evidence" if used else "no_verified_evidence"
    farm = payload.get("farm") if isinstance(payload.get("farm"), dict) else None
    return {
        "success": True,
        "meta": {
            "engine": "python-numpy-deterministic",
            "formulaVersion": FORMULA_VERSION,
            "district": district,
            "status": status,
            "availableDatasetCount": len(used),
            "expectedDatasetCount": 4,
            "availableDatasets": used,
            "unavailableOrIncompleteDatasets": unavailable,
            "latestSatelliteDateRange": {
                "earliest": min((day for _, day in dated), default=None).isoformat() if dated else None,
                "latest": max((day for _, day in dated), default=None).isoformat() if dated else None,
                "spanDays": date_span_days,
                "sources": {name: day.isoformat() if day else None for name, day in date_map.items()},
            },
            "analysisType": "descriptive_multi_dataset_evidence_not_prediction",
        },
        "farmContext": farm,
        "evidence": {"gpm": gpm, "smap": smap, "modis": modis, "power": power},
        "cautions": cautions,
    }
