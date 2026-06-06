import { StickerCard } from "./components/StickerCard";
import { StickerGroup } from "./components/StickerGroup";
import { CountrySection } from "./components/CountrySection";
import { sections, groupTeams, countries } from "../../constants/albumSections";
import originalStickers from "../../../fibus_album.json";

// Ordered list of group keys for group-stage rendering
const GROUP_KEYS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];

/**
 * StickerBoard — renders the correct sticker grid layout based on the active view mode.
 *
 * Responsibilities:
 *  - Switch between flat, teams, album, and specials view layouts.
 *  - Delegate rendering of individual cards and group accordions to child components.
 *  - Show an empty state message when no stickers match the current filters.
 */
export function StickerBoard({
  viewMode,
  expandedGroups,
  onToggleGroup,
  getFilteredStickers,
  getStickerStatus,
  onShortTap,
  onLongPress,
  onToggleFavorite,
  displayMode,
  searchQuery,
}) {
  const cardHandlers = { onShortTap, onLongPress, onToggleFavorite, displayMode };
  const groupHandlers = { getFilteredStickers, getStickerStatus, ...cardHandlers, searchQuery };

  // --- FLAT (Continuous Grid) ---
  if (viewMode === "flat") {
    const flatStickers = getFilteredStickers(originalStickers);
    return (
      <>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(65px,1fr))] gap-2 sm:grid-cols-[repeat(auto-fill,minmax(70px,1fr))]">
          {flatStickers.map((sticker) => (
            <StickerCard key={sticker.id} sticker={sticker} status={getStickerStatus(sticker.id)} {...cardHandlers} />
          ))}
        </div>
        {flatStickers.length === 0 && <EmptyMessage />}
      </>
    );
  }

  // --- TEAMS (Flat country list, no special sections) ---
  if (viewMode === "teams") {
    const renderedCountries = GROUP_KEYS.flatMap((groupKey) =>
      (groupTeams[groupKey] || []).map((countryKey) => {
        const countryStickers = countries[countryKey] || [];
        if (getFilteredStickers(countryStickers).length === 0) return null;
        return (
          <CountrySection
            key={countryKey}
            countryKey={countryKey}
            groupKey={groupKey}
            countryStickers={countryStickers}
            showGroupLabel={true}
            {...groupHandlers}
          />
        );
      }),
    );
    const allEmpty = GROUP_KEYS.every((groupKey) =>
      (groupTeams[groupKey] || []).every(
        (countryKey) => getFilteredStickers(countries[countryKey] || []).length === 0,
      ),
    );
    return (
      <div className="flex flex-col gap-3.5">
        {renderedCountries}
        {allEmpty && <EmptyMessage />}
      </div>
    );
  }

  // --- ALBUM / SPECIALS (Accordion group sections) ---
  const showSpecials = viewMode === "album" || viewMode === "specials";
  return (
    <>
      {showSpecials && (searchQuery === "" || getFilteredStickers(sections.FWC_SPECIAL).length > 0) && (
        <StickerGroup groupKey="FWC_SPECIAL" title="FIFA World Cup 2026 & Host Countries" isExpanded={expandedGroups.FWC_SPECIAL} onToggle={onToggleGroup} isSpecial={true} stickers={sections.FWC_SPECIAL} {...groupHandlers} />
      )}
      {viewMode === "album" &&
        GROUP_KEYS.map((groupKey) => {
          const groupCountries = groupTeams[groupKey] || [];
          const groupStickers = groupCountries.reduce((acc, cKey) => [...acc, ...(countries[cKey] || [])], []);
          if (searchQuery !== "" && getFilteredStickers(groupStickers).length === 0) return null;
          return (
            <StickerGroup key={groupKey} groupKey={groupKey} title={`Group ${groupKey}`} isExpanded={expandedGroups[groupKey]} onToggle={onToggleGroup} isSpecial={false} countriesList={groupCountries} countriesData={countries} {...groupHandlers} />
          );
        })}
      {showSpecials && (searchQuery === "" || getFilteredStickers(sections.FWC_HISTORY).length > 0) && (
        <StickerGroup groupKey="FWC_HISTORY" title="FIFA World Cup History" isExpanded={expandedGroups.FWC_HISTORY} onToggle={onToggleGroup} isSpecial={true} stickers={sections.FWC_HISTORY} {...groupHandlers} />
      )}
      {showSpecials && (searchQuery === "" || getFilteredStickers(sections.CC).length > 0) && (
        <StickerGroup groupKey="CC" title="Coca-Cola" isExpanded={expandedGroups.CC} onToggle={onToggleGroup} isSpecial={true} stickers={sections.CC} {...groupHandlers} />
      )}
      {getFilteredStickers(originalStickers).length === 0 && <EmptyMessage />}
    </>
  );
}

function EmptyMessage() {
  return (
    <p className="text-xs text-slate-400 text-center my-8 font-medium">
      Ninguna figurita coincide con los filtros.
    </p>
  );
}
