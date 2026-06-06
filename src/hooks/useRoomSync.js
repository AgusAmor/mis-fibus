import { useState, useEffect } from "react";

/**
 * useRoomSync — manages the shared album room code lifecycle.
 *
 * Responsibilities:
 *  - Initialize the room code from URL params, localStorage, or a default.
 *  - Persist the active room code to localStorage on every change.
 *  - Reflect the active room code in the URL query parameter (no page reload).
 *  - Sync the active room across browser tabs via the `storage` event.
 */
export function useRoomSync() {
  const [albumCode, setAlbumCode] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const roomParam = urlParams.get("room") || urlParams.get("sala");

    // Ignore placeholder/fallback strings in URL parameters to avoid overwriting stored preferences
    if (roomParam && roomParam.trim() && roomParam.trim() !== "sala_predeterminada") {
      return roomParam.trim().toLowerCase();
    }

    // Retrieve stored room or use the default placeholder
    return localStorage.getItem("fibus_album_code") || "sala_predeterminada";
  });

  // Persist room code to localStorage and update the URL query parameter whenever it changes
  useEffect(() => {
    if (albumCode) {
      localStorage.setItem("fibus_album_code", albumCode);
      const newUrl = new URL(window.location.href);
      if (newUrl.searchParams.get("room") !== albumCode) {
        newUrl.searchParams.set("room", albumCode);
        newUrl.searchParams.delete("sala"); // Normalize legacy 'sala' param to 'room'
        window.history.replaceState(null, "", newUrl.toString());
      }
    }
  }, [albumCode]);

  // Sync room code changes from other tabs via the localStorage storage event
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "fibus_album_code" && e.newValue) {
        // If this tab has an explicit room query param that differs, ignore the cross-tab update
        // to prevent tabs with independent albums from overriding each other.
        const urlParams = new URLSearchParams(window.location.search);
        const currentRoomParam = urlParams.get("room") || urlParams.get("sala");
        if (currentRoomParam && currentRoomParam !== e.newValue) {
          return;
        }
        setAlbumCode(e.newValue);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return { albumCode, setAlbumCode };
}
