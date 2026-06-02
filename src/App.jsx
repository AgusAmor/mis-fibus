import { useState } from "react";
import originalStickers from "../fibus_album.json";
import { useSharedAlbum } from "./hooks/useSharedAlbum";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { StatsPanel } from "./components/StatsPanel";
import { FiltersPanel } from "./components/FiltersPanel";
import { StickerGroup } from "./components/StickerGroup";

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
  const [sectionFilter, setSectionFilter] = useState("all");

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

      let matchesSection = true;
      if (sectionFilter !== "all") {
        if (sectionFilter === "SPECIAL") {
          matchesSection = s.group === "SPECIAL" || (s.group === "FWC" && parseInt(s.number, 10) <= 8);
        } else if (sectionFilter === "FWC_HISTORY") {
          matchesSection = s.group === "FWC" && parseInt(s.number, 10) >= 9;
        } else {
          matchesSection = s.group === sectionFilter;
        }
      }

      return matchesSearch && matchesStatus && matchesSection;
    });
  };

  return (
    <div className="w-full max-w-200 mx-auto min-h-screen flex flex-col box-border pb-8">
      {/* Header */}
      <Header syncStatus={syncStatus} />

      {/* Hero Stats Panel */}
      <StatsPanel stats={stats} />

      {/* Main Container */}
      <main className="px-4 grow flex flex-col gap-4">
        {/* Search & Filters */}
        <FiltersPanel
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          sectionFilter={sectionFilter}
          setSectionFilter={setSectionFilter}
        />

        {/* Accordion Board */}
        <div className="flex flex-col gap-3">
          {/* Special Stickers & Stadiums */}
          {(sectionFilter === "all" || sectionFilter === "SPECIAL") && (
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
            />
          )}

          {/* Group Stages A - L */}
          {["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"].map(
            (groupKey) => {
              if (sectionFilter !== "all" && sectionFilter !== groupKey)
                return null;
              const groupCountries = groupTeams[groupKey] || [];

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
                />
              );
            },
          )}

          {/* FIFA World Cup History */}
          {(sectionFilter === "all" || sectionFilter === "FWC_HISTORY") && (
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
            />
          )}

          {/* Coca-Cola Stickers */}
          {(sectionFilter === "all" || sectionFilter === "CC") && (
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
            />
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
