import { useState, useEffect } from "react";
import { useSharedAlbum } from "./hooks/useSharedAlbum";
import { useFilteredStickers } from "./hooks/useFilteredStickers";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { StatsPanel } from "./components/StatsPanel";
import { FiltersPanel } from "./components/FiltersPanel";
import { StickerBoard } from "./components/StickerBoard";
import { HelpModal } from "./components/HelpModal";
import { ShareDuplicatesButton } from "./components/ShareDuplicatesButton";

/**
 * App — root component responsible for wiring state and layout.
 *
 * Responsibilities:
 *  - Initialize and expose shared album hooks (Firestore sync, sticker actions, stats).
 *  - Manage UI-only state: filter selections, view mode, accordion expansions, modals.
 *  - Compose and render the page layout (Header → Stats → Filters → Board → Footer → Modal).
 *  - Delegate board rendering to StickerBoard and filter logic to useFilteredStickers.
 */
function App() {
  const {
    albumCode,
    setAlbumCode,
    syncStatus,
    stats,
    handleShortTap,
    handleLongPress,
    getStickerStatus,
    toggleFavorite,
  } = useSharedAlbum();

  // --- UI State ---
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState("album");
  const [displayMode, setDisplayMode] = useState("both");

  // Accordion expanded/collapsed state — all sections open by default
  const [expandedGroups, setExpandedGroups] = useState({
    FWC_SPECIAL: true,
    FWC_HISTORY: true,
    CC: true,
    A: true, B: true, C: true, D: true, E: true, F: true,
    G: true, H: true, I: true, J: true, K: true, L: true,
  });

  const toggleGroup = (groupKey) => {
    setExpandedGroups((prev) => ({ ...prev, [groupKey]: !prev[groupKey] }));
  };

  // Show the help modal on first visit or when the room hasn't been configured yet
  useEffect(() => {
    const hasSeenHelp = localStorage.getItem("fibus_help_dismissed");
    if (!hasSeenHelp || albumCode === "sala_predeterminada") {
      setShowHelp(true);
    }
  }, [albumCode]);

  const closeHelp = (newRoomCode) => {
    if (newRoomCode && newRoomCode !== "sala_predeterminada") {
      setAlbumCode(newRoomCode);
    }
    localStorage.setItem("fibus_help_dismissed", "true");
    setShowHelp(false);
  };

  // Filter function scoped to current status and search filters
  const getFilteredStickers = useFilteredStickers(statusFilter, searchQuery, getStickerStatus);

  return (
    <div className="w-full max-w-200 mx-auto min-h-screen flex flex-col box-border pb-8">
      {/* App header with logo, sync status, and help button */}
      <Header syncStatus={syncStatus} onOpenHelp={() => setShowHelp(true)} />

      {/* Album progress overview with shortcut click handlers */}
      <StatsPanel
        stats={stats}
        onShowDuplicates={() => {
          setStatusFilter("duplicated");
          setViewMode("flat");
        }}
        onResetFilters={() => {
          setStatusFilter("all");
          setViewMode("album");
          setDisplayMode("both");
          setSearchQuery("");
        }}
      />

      <main className="px-4 grow flex flex-col gap-4">
        {/* Search input and filter/view/display selectors */}
        <FiltersPanel
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          viewMode={viewMode}
          setViewMode={setViewMode}
          displayMode={displayMode}
          setDisplayMode={setDisplayMode}
        />

        {/* Share duplicates button — visible only when the Repetidas filter is active */}
        <ShareDuplicatesButton
          statusFilter={statusFilter}
          albumCode={albumCode}
          getStickerStatus={getStickerStatus}
        />

        {/* Main sticker grid — layout switches based on viewMode */}
        <div className="flex flex-col gap-3">
          <StickerBoard
            viewMode={viewMode}
            expandedGroups={expandedGroups}
            onToggleGroup={toggleGroup}
            getFilteredStickers={getFilteredStickers}
            getStickerStatus={getStickerStatus}
            onShortTap={handleShortTap}
            onLongPress={handleLongPress}
            onToggleFavorite={toggleFavorite}
            displayMode={displayMode}
            searchQuery={searchQuery}
          />
        </div>
      </main>

      {/* Footer with room code display and settings panel toggle */}
      <Footer
        albumCode={albumCode}
        setAlbumCode={setAlbumCode}
        showSettings={showSettings}
        setShowSettings={setShowSettings}
      />

      {/* Help and onboarding modal */}
      <HelpModal isOpen={showHelp} onClose={closeHelp} albumCode={albumCode} />
    </div>
  );
}

export default App;
