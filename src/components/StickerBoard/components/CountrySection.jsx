import { useState } from "react";
import { StickerCard } from "./StickerCard";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import { CountryFlag } from "./CountryFlag";
import { getCountryPattern, COUNTRY_METADATA } from "../../../constants/countryData";

/**
 * CountrySection — collapsible accordion for a single country with flag background pattern.
 *
 * Responsibilities:
 *  - Render the country header (flag thumbnail, name, progress bar).
 *  - Expand/collapse the sticker grid on click.
 *  - Display the flag-colors SVG background when expanded.
 */
export function CountrySection({
  countryKey,
  groupKey,
  countryStickers = [],
  getFilteredStickers,
  getStickerStatus,
  onShortTap,
  onLongPress,
  onToggleFavorite,
  displayMode = "both",
  showGroupLabel = false,
  countryIndex = 0,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const filteredCountryStickers = getFilteredStickers(countryStickers);

  // Calculate country progress
  const ownedCountryCount = countryStickers.filter(
    (s) => getStickerStatus(s.id).have,
  ).length;
  const totalCountryCount = countryStickers.length;
  const countryPercent =
    totalCountryCount > 0
      ? Math.round((ownedCountryCount / totalCountryCount) * 100)
      : 0;
  const isCountryCompleted = countryPercent >= 100;

  const countryInfo = COUNTRY_METADATA[countryKey] || { name: countryKey };
  const countryBg = getCountryPattern(countryKey);
  
  // Inherit the group's color based on its letter (A=0, B=1, C=2...)
  const groupIndex = (groupKey && groupKey.length === 1) ? groupKey.charCodeAt(0) - 65 : -1;
  const countryBgColor = groupIndex >= 0 
    ? ["bg-primary", "bg-secondary", "bg-success"][groupIndex % 3] 
    : "bg-primary";

  const headerTitle = showGroupLabel
    ? `${countryInfo.name} (Group ${groupKey})`
    : countryInfo.name;

  return (
    <div className="flex flex-col border border-slate-200/80 rounded-xl overflow-hidden shadow-xs relative transition-all duration-300 bg-white">
      {/* Country Header */}
      <div
        className="relative z-10 flex flex-col gap-1.5 p-3.5 bg-white border-b border-slate-200/60 cursor-pointer select-none hover:bg-slate-50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CountryFlag
              countryKey={countryKey}
              className="w-6 h-4 rounded-xs border border-slate-200/50 shadow-xs shrink-0"
            />
            <h3 className="text-xs font-montserrat font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <span>{headerTitle}</span>
            </h3>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="font-bebas text-sm text-slate-700 leading-none">
              {ownedCountryCount}/{totalCountryCount}
            </span>
            {isOpen ? (
              <FaChevronUp className="text-[9px] text-slate-500" />
            ) : (
              <FaChevronDown className="text-[9px] text-slate-500" />
            )}
          </div>
        </div>

        {/* Selection progress bar */}
        <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden mt-0.5">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              isCountryCompleted ? "bg-success" : countryBgColor
            }`}
            style={{ width: `${countryPercent}%` }}
          />
        </div>
      </div>

      {/* Stickers Grid & Content */}
      {isOpen && (
        <div
          className="relative z-10 p-4 flex flex-col gap-3 rounded-b-xl overflow-hidden"
          style={
            countryBg !== "none"
              ? {
                  backgroundImage: countryBg,
                  backgroundSize: "cover",
                }
              : {}
          }
        >
          {/* Semi-translucent overlay to soften the flag background for high contrast */}
          <div className="absolute inset-0 bg-white/30 pointer-events-none z-0"></div>

          {/* Stickers Grid in 4 columns */}
          {filteredCountryStickers.length > 0 && (
            <div className="relative z-10 grid grid-cols-4 gap-2 sm:gap-2.5 mt-1">
              {filteredCountryStickers.map((sticker) => (
                <StickerCard
                  key={sticker.id}
                  sticker={sticker}
                  status={getStickerStatus(sticker.id)}
                  onShortTap={onShortTap}
                  onLongPress={onLongPress}
                  onToggleFavorite={onToggleFavorite}
                  displayMode={displayMode}
                />
              ))}
            </div>
          )}

          {filteredCountryStickers.length === 0 && (
            <p className="relative z-10 text-[11px] font-semibold text-slate-700 bg-white/80 px-3 py-1.5 rounded-lg border border-slate-200/50 shadow-xs self-center my-1">
              Ninguna figurita coincide con los filtros.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
