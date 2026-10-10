"use client";

import React from "react";
import { Check } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { getDistrictsByDivision } from "@/lib/bangladesh-districts";
import UseMyLocationButton from "./UseMyLocationButton";

export default function DistrictPicker({
  divisionId,
  selectedDistrict = null,
  onSelectDistrict,
}) {
  const { language } = useLanguage();
  const districts = getDistrictsByDivision(divisionId);

  return (
    <div className="w-full space-y-6">
      {/* Large Grid of District Buttons for the Chosen Division */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
        {districts.map((d) => {
          const isSelected = selectedDistrict === d.id;
          const name = d.name[language] || d.name.en;

          return (
            <button
              key={d.id}
              type="button"
              onClick={() => onSelectDistrict(d.id, d)}
              className={`min-h-[64px] sm:min-h-[72px] px-4 py-3 rounded-xl border text-center flex items-center justify-center relative transition-all duration-200 cursor-pointer select-none hover:-translate-y-0.5 hover:shadow-md ${
                isSelected
                  ? "ring-2 ring-[#E5B84A]/40 shadow-md"
                  : "shadow-xs hover:border-neutral-300 dark:hover:border-neutral-700"
              }`}
              style={{
                backgroundColor: "var(--card)",
                borderColor: isSelected ? "#E5B84A" : "var(--border)",
              }}
            >
              {isSelected && (
                <div
                  className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center bg-[#E5B84A] text-[#0B3A22]"
                  aria-hidden="true"
                >
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}

              <span
                className="text-sm sm:text-base font-bold tracking-tight"
                style={{ color: "var(--text)" }}
              >
                {name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Geolocation Option & Grid Notice */}
      <UseMyLocationButton
        onSelectDistrict={(districtObj) => {
          onSelectDistrict(districtObj.id, districtObj);
        }}
      />
    </div>
  );
}
