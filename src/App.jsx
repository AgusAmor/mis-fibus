import { useState } from "react";
import originalStickers from "../fibus_album.json";
import { useSharedAlbum } from "./hooks/useSharedAlbum";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { StatsPanel } from "./components/StatsPanel";
import { FiltersPanel } from "./components/FiltersPanel";
import { StickerGroup } from "./components/StickerGroup";
import { StickerCard } from "./components/StickerCard";
import { CountrySection } from "./components/CountrySection";

function App() {
  const {
    albumCode,
    setAlbumCode,
    syncStatus,
    stats,
    handleShortTap,
    handleLongPress,
    getStickerStatus,
  } = useSharedAlbum();

  // Settings Panel Visibility
  const [showSettings, setShowSettings] = useState(false);

  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState("album");

  // Accordion Expansions State
  const [expandedGroups, setExpandedGroups] = useState({
    FWC_SPECIAL: true,
    FWC_HISTORY: true,
    CC: true,
    A: true,
    B: true,
    C: true,
    D: true,
    E: true,
    F: true,
    G: true,
    H: true,
    I: true,
    J: true,
    K: true,
    L: true,
  });

  const toggleGroup = (groupKey) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupKey]: !prev[groupKey],
    }));
  };

  // Stickers categories definitions
  const sections = {
    FWC_SPECIAL: originalStickers.filter(
      (s) => s.group === "SPECIAL" || (s.group === "FWC" && parseInt(s.number, 10) <= 8),
    ),
    FWC_HISTORY: originalStickers.filter(
      (s) => s.group === "FWC" && parseInt(s.number, 10) >= 9,
    ),
    CC: originalStickers.filter((s) => s.group === "CC"),
    A: originalStickers.filter((s) => s.group === "A"),
    B: originalStickers.filter((s) => s.group === "B"),
    C: originalStickers.filter((s) => s.group === "C"),
    D: originalStickers.filter((s) => s.group === "D"),
    E: originalStickers.filter((s) => s.group === "E"),
    F: originalStickers.filter((s) => s.group === "F"),
    G: originalStickers.filter((s) => s.group === "G"),
    H: originalStickers.filter((s) => s.group === "H"),
    I: originalStickers.filter((s) => s.group === "I"),
    J: originalStickers.filter((s) => s.group === "J"),
    K: originalStickers.filter((s) => s.group === "K"),
    L: originalStickers.filter((s) => s.group === "L"),
  };

  const groupTeams = {
    A: ["MEX", "RSA", "KOR", "CZE"],
    B: ["CAN", "BIH", "QAT", "SUI"],
    C: ["BRA", "MAR", "HAI", "SCO"],
    D: ["USA", "PAR", "AUS", "TUR"],
    E: ["GER", "CUW", "CIV", "ECU"],
    F: ["NED", "JPN", "SWE", "TUN"],
    G: ["BEL", "EGY", "IRN", "NZL"],
    H: ["ESP", "CPV", "KSA", "URU"],
    I: ["FRA", "SEN", "IRQ", "NOR"],
    J: ["ARG", "ALG", "AUT", "JOR"],
    K: ["POR", "COD", "UZB", "COL"],
    L: ["ENG", "CRO", "GHA", "PAN"],
  };

  const countries = {};
  originalStickers.forEach((s) => {
    if (s.group !== "SPECIAL" && s.group !== "FWC" && s.group !== "CC") {
      if (!countries[s.team]) {
        countries[s.team] = [];
      }
      countries[s.team].push(s);
    }
  });

  const getFilteredStickers = (stickerList) => {
    return stickerList.filter((s) => {
      const status = getStickerStatus(s.id);
      const matchesSearch =
        s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.team.toLowerCase().includes(searchQuery.toLowerCase());

      let matchesStatus = true;
      if (statusFilter === "missing") {
        matchesStatus = !status.have;
      } else if (statusFilter === "owned") {
        matchesStatus = status.have;
      } else if (statusFilter === "duplicated") {
        matchesStatus = status.dup > 0;
      }

      return matchesSearch && matchesStatus;
    });
  };

  return (
    <div className="w-full max-w-200 mx-auto min-h-screen flex flex-col box-border pb-8">
      {/* Header */}
      <Header syncStatus={syncStatus} />

      {/* Hero Stats Panel */}
      <StatsPanel
        stats={stats}
        onShowDuplicates={() => {
          setStatusFilter("duplicated");
          setViewMode("flat");
        }}
        onResetFilters={() => {
          setStatusFilter("all");
          setViewMode("album");
          setSearchQuery("");
        }}
      />

      {/* Main Container */}
      <main className="px-4 grow flex flex-col gap-4">
        {/* Search & Filters */}
        <FiltersPanel
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        {/* Board */}
        <div className="flex flex-col gap-3">
          {viewMode === "flat" ? (
            /* Continuous Grid */
            <>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(65px,1fr))] gap-2 sm:grid-cols-[repeat(auto-fill,minmax(70px,1fr))]">
                {getFilteredStickers(originalStickers).map((sticker) => (
                  <StickerCard
                    key={sticker.id}
                    sticker={sticker}
                    status={getStickerStatus(sticker.id)}
                    onShortTap={handleShortTap}
                    onLongPress={handleLongPress}
                  />
                ))}
              </div>
              {getFilteredStickers(originalStickers).length === 0 && (
                <p className="text-xs text-slate-400 text-center my-8 font-medium">
                  Ninguna figurita coincide con los filtros.
                </p>
              )}
            </>
          ) : viewMode === "teams" ? (
            /* Teams Only - flat list of CountrySections with group names */
            <div className="flex flex-col gap-3.5">
              {["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"].flatMap(
                (groupKey) => {
                  const groupCountries = groupTeams[groupKey] || [];
                  return groupCountries.map((countryKey) => {
                    const countryStickers = countries[countryKey] || [];
                    // Only render if there's at least one sticker matching filters in this country
                    if (getFilteredStickers(countryStickers).length === 0) return null;

                    return (
                      <CountrySection
                        key={countryKey}
                        countryKey={countryKey}
                        groupKey={groupKey}
                        countryStickers={countryStickers}
                        getFilteredStickers={getFilteredStickers}
                        getStickerStatus={getStickerStatus}
                        onShortTap={handleShortTap}
                        onLongPress={handleLongPress}
                        showGroupLabel={true}
                      />
                    );
                  });
                }
              )}
              {/* If no country has matching stickers */}
              {["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"].every(
                (groupKey) =>
                  (groupTeams[groupKey] || []).every(
                    (countryKey) =>
                      getFilteredStickers(countries[countryKey] || []).length === 0
                  )
              ) && (
                <p className="text-xs text-slate-400 text-center my-8 font-medium">
                  Ninguna figurita coincide con los filtros.
                </p>
              )}
            </div>
          ) : (
            /* Album / Specials view modes (with accordions) */
            <>
              {/* Special Stickers & Stadiums */}
              {(viewMode === "album" || viewMode === "specials") &&
                (searchQuery === "" || getFilteredStickers(sections.FWC_SPECIAL).length > 0) && (
                  <StickerGroup
                    groupKey="FWC_SPECIAL"
                    title="FIFA World Cup 2026 & Host Countries"
                    isExpanded={expandedGroups.FWC_SPECIAL}
                    onToggle={toggleGroup}
                    isSpecial={true}
                    stickers={sections.FWC_SPECIAL}
                    getFilteredStickers={getFilteredStickers}
                    getStickerStatus={getStickerStatus}
                    onShortTap={handleShortTap}
                    onLongPress={handleLongPress}
                    searchQuery={searchQuery}
                  />
                )}

              {/* Group Stages A - L */}
              {viewMode === "album" &&
                ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"].map(
                  (groupKey) => {
                    const groupCountries = groupTeams[groupKey] || [];
                    const groupStickers = groupCountries.reduce(
                      (acc, cKey) => [...acc, ...(countries[cKey] || [])],
                      []
                    );
                    if (searchQuery !== "" && getFilteredStickers(groupStickers).length === 0)
                      return null;

                    return (
                      <StickerGroup
                        key={groupKey}
                        groupKey={groupKey}
                        title={`Group ${groupKey}`}
                        isExpanded={expandedGroups[groupKey]}
                        onToggle={toggleGroup}
                        isSpecial={false}
                        countriesList={groupCountries}
                        countriesData={countries}
                        getFilteredStickers={getFilteredStickers}
                        getStickerStatus={getStickerStatus}
                        onShortTap={handleShortTap}
                        onLongPress={handleLongPress}
                        searchQuery={searchQuery}
                      />
                    );
                  }
                )}

              {/* FIFA World Cup History */}
              {(viewMode === "album" || viewMode === "specials") &&
                (searchQuery === "" || getFilteredStickers(sections.FWC_HISTORY).length > 0) && (
                  <StickerGroup
                    groupKey="FWC_HISTORY"
                    title="FIFA World Cup History"
                    isExpanded={expandedGroups.FWC_HISTORY}
                    onToggle={toggleGroup}
                    isSpecial={true}
                    stickers={sections.FWC_HISTORY}
                    getFilteredStickers={getFilteredStickers}
                    getStickerStatus={getStickerStatus}
                    onShortTap={handleShortTap}
                    onLongPress={handleLongPress}
                    searchQuery={searchQuery}
                  />
                )}

              {/* Coca-Cola Stickers */}
              {(viewMode === "album" || viewMode === "specials") &&
                (searchQuery === "" || getFilteredStickers(sections.CC).length > 0) && (
                  <StickerGroup
                    groupKey="CC"
                    title="Coca-Cola"
                    isExpanded={expandedGroups.CC}
                    onToggle={toggleGroup}
                    isSpecial={true}
                    stickers={sections.CC}
                    getFilteredStickers={getFilteredStickers}
                    getStickerStatus={getStickerStatus}
                    onShortTap={handleShortTap}
                    onLongPress={handleLongPress}
                    searchQuery={searchQuery}
                  />
                )}

              {/* If nothing matches in the entire album under Album or Specials mode */}
              {getFilteredStickers(originalStickers).length === 0 && (
                <p className="text-xs text-slate-400 text-center my-8 font-medium">
                  Ninguna figurita coincide con los filtros.
                </p>
              )}
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer
        albumCode={albumCode}
        setAlbumCode={setAlbumCode}
        showSettings={showSettings}
        setShowSettings={setShowSettings}
      />
    </div>
  );
}

export default App;
