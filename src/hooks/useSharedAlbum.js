import { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
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
  }, [albumCode]);

  // Handle local storage caching of preferences
  useEffect(() => {
    localStorage.setItem("fibus_album_code", albumCode);
  }, [albumCode]);

  // Update a sticker count in Firestore
  const updateSticker = async (stickerId, updates) => {
    const newStickers = {
      ...stickersState,
      [stickerId]: {
        ...(stickersState[stickerId] || { have: false, duplicated: 0 }),
        ...updates,
      },
    };

    // Optimistic local state update
    setStickersState(newStickers);

    try {
      const docRef = doc(db, "albums", albumCode.trim().toLowerCase());
      await setDoc(
        docRef,
        {
          stickers: newStickers,
          lastUpdated: new Date().toISOString(),
        },
        { merge: true },
      );
    } catch (e) {
      console.error("Error writing document to Firestore:", e);
      if (!navigator.onLine) {
        setSyncStatus("offline");
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

  const getStickerStatus = (stickerId) => {
    const state = stickersState[stickerId] || {};
    return {
      have: state.have || false,
      dup: state.duplicated || 0,
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
  };
}
