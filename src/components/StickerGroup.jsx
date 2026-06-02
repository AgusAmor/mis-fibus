import { StickerCard } from "./StickerCard";
import { CountrySection } from "./CountrySection";
import { FaStar, FaFutbol, FaChevronUp, FaChevronDown } from "react-icons/fa";
import { SiCocacola } from "react-icons/si";

// Reusable component representing a group of stickers (Special or standard group stages).
export function StickerGroup({
  groupKey,
  title,
  isExpanded,
  onToggle,
  isSpecial,
  stickers = [],
  countriesList = [],
  countriesData = {},
  getFilteredStickers,
  getStickerStatus,
  onShortTap,
  onLongPress,
  searchQuery = "",
}) {
  // Calculate dynamic group completion stats
  const allGroupStickers = isSpecial
    ? stickers
    : countriesList.reduce(
        (acc, cKey) => [...acc, ...(countriesData[cKey] || [])],
        [],
      );
  const ownedGroupCount = allGroupStickers.filter(
    (s) => getStickerStatus(s.id).have,
  ).length;
  const totalGroupCount = allGroupStickers.length;
  const groupPercent =
    totalGroupCount > 0
      ? Math.round((ownedGroupCount / totalGroupCount) * 100)
      : 0;
  const isGroupCompleted = groupPercent >= 100;

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-md shadow-slate-100/50 flex flex-col">
      {/* Group Accordion Header */}
      <header
        className="flex flex-col gap-2.5 px-5 py-4 cursor-pointer hover:bg-slate-50/50 select-none transition-colors"
        onClick={() => onToggle(groupKey)}
      >
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-3">
            {groupKey === "CC" ? (
              <SiCocacola className="text-secondary text-base" />
            ) : isSpecial ? (
              <FaStar className="text-accent text-base" />
            ) : (
              <FaFutbol className="text-primary text-base" />
            )}
            <h2 className="text-sm font-montserrat font-extrabold text-slate-800 uppercase tracking-wide">
              {title}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-bebas text-lg text-slate-600 leading-none">
              {groupPercent}%
            </span>
            <span className="text-xs text-slate-400">
              {isExpanded ? (
                <FaChevronUp className="text-[10px]" />
              ) : (
                <FaChevronDown className="text-[10px]" />
              )}
            </span>
          </div>
        </div>
        {/* Group Progress Bar */}
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              isGroupCompleted
                ? "bg-success"
                : groupKey === "CC"
                  ? "bg-secondary"
                  : "bg-primary"
            }`}
            style={{ width: `${groupPercent}%` }}
          />
        </div>
      </header>

      {/* Expanded Accordion Body */}
      {isExpanded && (
        <div className="p-4 border-t border-slate-100 bg-slate-50/30 flex flex-col gap-5">
          {isSpecial ? (
            /* Special section layout */
            <>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(65px,1fr))] gap-2.5 sm:grid-cols-[repeat(auto-fill,minmax(70px,1fr))]">
                {getFilteredStickers(stickers).map((sticker) => (
                  <StickerCard
                    key={sticker.id}
                    sticker={sticker}
                    status={getStickerStatus(sticker.id)}
                    onShortTap={onShortTap}
                    onLongPress={onLongPress}
                  />
                ))}
              </div>
              {getFilteredStickers(stickers).length === 0 && (
                <p className="text-xs text-slate-400 text-center my-2 font-medium">
                  Ninguna figurita coincide con los filtros.
                </p>
              )}
            </>
          ) : (
            /* Regular group stages layout with country subdivisions */
            <div className="flex flex-col gap-6.5">
              {countriesList.map((countryKey) => {
                const countryStickers = countriesData[countryKey] || [];
                // Hide country accordions with zero search results when searching
                if (
                  searchQuery !== "" &&
                  getFilteredStickers(countryStickers).length === 0
                ) {
                  return null;
                }

                return (
                  <CountrySection
                    key={countryKey}
                    countryKey={countryKey}
                    groupKey={groupKey}
                    countryStickers={countryStickers}
                    getFilteredStickers={getFilteredStickers}
                    getStickerStatus={getStickerStatus}
                    onShortTap={onShortTap}
                    onLongPress={onLongPress}
                    showGroupLabel={false}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
