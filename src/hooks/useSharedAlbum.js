import { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import originalStickers from "../../fibus_album.json";

export function useSharedAlbum() {
  // Shared Album Room Code State
  const [albumCode, setAlbumCode] = useState(() => {
    return localStorage.getItem("fibus_album_code") || "fibus_mundial_2026";
  });

  // Cloud Sincronization Status State
  const [syncStatus, setSyncStatus] = useState("disconnected"); // 'disconnected', 'syncing', 'synced', 'offline', 'error'

  // Sticker Inventory State
  const [stickersState, setStickersState] = useState({});

  // Trigger state to force-restart subscription on connection/visibility changes
  const [syncTrigger, setSyncTrigger] = useState(0);

  // Real-Time Cloud Sincronization with Firestore
  useEffect(() => {
    if (!albumCode.trim()) {
      setSyncStatus("disconnected");
      return;
    }

    setSyncStatus("syncing");
    const docRef = doc(db, "albums", albumCode.trim().toLowerCase());

    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.stickers) {
            setStickersState(data.stickers);
          }
          setSyncStatus("synced");
        } else {
          setSyncStatus("synced");
          setStickersState({});
        }
      },
      (error) => {
        console.error("Firestore sync error:", error);
        if (!navigator.onLine) {
          setSyncStatus("offline");
        } else {
          setSyncStatus("error");
        }
      },
    );

    return () => unsubscribe();
  }, [albumCode, syncTrigger]);

  // Handle local storage caching of preferences
  useEffect(() => {
    localStorage.setItem("fibus_album_code", albumCode);
  }, [albumCode]);

  // Sync room code changes across tabs in real-time
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "fibus_album_code" && e.newValue) {
        setAlbumCode(e.newValue);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Sync network status and visibility/focus updates to guarantee real-time updates
  useEffect(() => {
    const handleOnline = () => {
      setSyncStatus("syncing");
      setSyncTrigger((prev) => prev + 1);
    };
    const handleOffline = () => {
      setSyncStatus("offline");
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        setSyncTrigger((prev) => prev + 1);
      }
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    window.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Update a sticker count in Firestore using granular nested updates for ultra-low latency
  const updateSticker = async (stickerId, updates) => {
    // Create the full updated data object for the specific sticker to preserve all fields (have/duplicated)
    const targetStickerData = {
      ...(stickersState[stickerId] || { have: false, duplicated: 0, favorite: false }),
      ...updates,
    };

    const newStickers = {
      ...stickersState,
      [stickerId]: targetStickerData,
    };

    // Optimistic local state update
    setStickersState(newStickers);

    try {
      const docRef = doc(db, "albums", albumCode.trim().toLowerCase());
      await updateDoc(docRef, {
        [`stickers.${stickerId}`]: targetStickerData,
        lastUpdated: new Date().toISOString(),
      });
    } catch (e) {
      // If the room document doesn't exist, create it with the initial sticker
      if (e.code === "not-found") {
        try {
          const docRef = doc(db, "albums", albumCode.trim().toLowerCase());
          await setDoc(docRef, {
            stickers: { [stickerId]: targetStickerData },
            lastUpdated: new Date().toISOString(),
          });
        } catch (setErr) {
          console.error("Error creating room document in Firestore:", setErr);
        }
      } else {
        console.error("Error updating sticker in Firestore:", e);
        if (!navigator.onLine) {
          setSyncStatus("offline");
        }
      }
    }
  };

  // Toque corto: poseer o sumar repetidas
  const handleShortTap = (id) => {
    const current = stickersState[id] || { have: false, duplicated: 0 };
    if (!current.have) {
      updateSticker(id, { have: true, duplicated: 0 });
    } else {
      updateSticker(id, { duplicated: (current.duplicated || 0) + 1 });
    }
  };

  // Presión larga: restar repetidas o desmarcar posesión
  const handleLongPress = (id) => {
    const current = stickersState[id] || { have: false, duplicated: 0 };
    if (!current.have) return;

    if ((current.duplicated || 0) > 0) {
      updateSticker(id, { duplicated: (current.duplicated || 0) - 1 });
    } else {
      updateSticker(id, { have: false, duplicated: 0 });
    }
  };

  const toggleFavorite = (id) => {
    const current = stickersState[id] || { have: false, duplicated: 0, favorite: false };
    updateSticker(id, { favorite: !current.favorite });
  };

  const getStickerStatus = (stickerId) => {
    const state = stickersState[stickerId] || {};
    return {
      have: state.have || false,
      dup: state.duplicated || 0,
      favorite: state.favorite || false,
    };
  };

  const getStats = () => {
    let owned = 0;
    let dups = 0;

    originalStickers.forEach((s) => {
      const state = stickersState[s.id] || {};
      if (state.have) owned++;
      dups += state.duplicated || 0;
    });

    return {
      total: originalStickers.length,
      owned,
      percent: ((owned / originalStickers.length) * 100).toFixed(1),
      dups,
    };
  };

  return {
    albumCode,
    setAlbumCode,
    syncStatus,
    stickersState,
    stats: getStats(),
    handleShortTap,
    handleLongPress,
    getStickerStatus,
    toggleFavorite,
  };
}
