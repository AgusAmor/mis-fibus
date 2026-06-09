import { useState, useCallback, useEffect } from "react";
import { appendHistoryEvent, ACTION_TYPES } from "../utils/historyLogic";
import { db } from "../firebase";
import { doc, onSnapshot, setDoc, updateDoc, getDoc } from "firebase/firestore";
import { useRoomSync } from "./useRoomSync";
import { useNetworkListeners } from "./useNetworkListeners";
import { useAlbumStats } from "./useAlbumStats";

/**
 * useSharedAlbum — composes the album's real-time Firestore synchronization.
 *
 * Responsibilities:
 *  - Subscribe to the Firestore album document and keep local sticker state in sync.
 *  - Initialize the room document in Firestore if it doesn't exist yet.
 *  - Expose granular sticker update actions (short tap, long press, favorite toggle).
 *  - Delegate room code management to useRoomSync.
 *  - Delegate network/visibility listener setup to useNetworkListeners.
 *  - Delegate stats derivation to useAlbumStats.
 */
export function useSharedAlbum() {
  // Room code lifecycle (URL init, localStorage cache, cross-tab sync, URL reflection)
  const { albumCode, setAlbumCode } = useRoomSync();

  // Cloud synchronization status indicator
  const [syncStatus, setSyncStatus] = useState("disconnected");

  // Local mirror of the Firestore stickers map
  const [stickersState, setStickersState] = useState({});

  // Incrementing trigger used to force-restart the Firestore snapshot on reconnect/visibility
  const [syncTrigger, setSyncTrigger] = useState(0);

  // Network and visibility event listener callbacks
  const handleOnline = useCallback(() => {
    setSyncStatus("syncing");
    setSyncTrigger((prev) => prev + 1);
  }, []);

  const handleOffline = useCallback(() => {
    setSyncStatus("offline");
  }, []);

  const handleVisible = useCallback(() => {
    setSyncTrigger((prev) => prev + 1);
  }, []);

  // Attach browser-level connectivity and visibility listeners
  useNetworkListeners({ onOnline: handleOnline, onOffline: handleOffline, onVisible: handleVisible });

  // Real-time Firestore subscription — restarts whenever the album code or syncTrigger changes
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
        setSyncStatus(navigator.onLine ? "error" : "offline");
      },
    );

    return () => unsubscribe();
  }, [albumCode, syncTrigger]);

  // Automatically create the room document in Firestore if it doesn't exist yet
  useEffect(() => {
    const initRoomInFirestore = async () => {
      const cleanCode = albumCode.trim().toLowerCase();
      if (!cleanCode || cleanCode === "sala_predeterminada") return;

      try {
        const docRef = doc(db, "albums", cleanCode);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
          await setDoc(docRef, {
            stickers: {},
            createdAt: new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
          });
          console.log(`Document for room '${cleanCode}' successfully created in Firestore.`);
        }
      } catch (err) {
        console.error("Error checking or creating room in Firestore:", err);
      }
    };

    initRoomInFirestore();
  }, [albumCode]);

  /**
   * Update a single sticker's state in Firestore using granular dot-notation updates.
   * Performs an optimistic local state update first for sub-100ms perceived latency.
   */
  const updateSticker = async (stickerId, updates) => {
    const targetStickerData = {
      ...(stickersState[stickerId] || { have: false, duplicated: 0, favorite: false }),
      ...updates,
    };

    // Optimistic update: reflect the change locally before the server round-trip
    setStickersState((prev) => ({ ...prev, [stickerId]: targetStickerData }));

    try {
      const docRef = doc(db, "albums", albumCode.trim().toLowerCase());
      await updateDoc(docRef, {
        [`stickers.${stickerId}`]: targetStickerData,
        lastUpdated: new Date().toISOString(),
      });
    } catch (e) {
      // If the room document doesn't exist yet, create it with this sticker as the seed
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
        if (!navigator.onLine) setSyncStatus("offline");
      }
    }
  };


  // Short tap: mark as owned, or add a duplicate if already owned
  const handleShortTap = (id) => {
    const current = stickersState[id] || { have: false, duplicated: 0, history: [] };
    if (!current.have) {
      updateSticker(id, { 
        have: true, 
        duplicated: 0,
        history: appendHistoryEvent(current.history, ACTION_TYPES.OBTENIDA)
      });
    } else {
      updateSticker(id, { 
        duplicated: (current.duplicated || 0) + 1,
        history: appendHistoryEvent(current.history, ACTION_TYPES.REPETIDA_AGREGADA)
      });
    }
  };

  // Long press: subtract a duplicate, or un-mark as owned if no duplicates remain
  const handleLongPress = (id) => {
    const current = stickersState[id] || { have: false, duplicated: 0, history: [] };
    if (!current.have) return;

    if ((current.duplicated || 0) > 0) {
      updateSticker(id, { 
        duplicated: (current.duplicated || 0) - 1,
        history: appendHistoryEvent(current.history, ACTION_TYPES.REPETIDA_ELIMINADA)
      });
    } else {
      updateSticker(id, { 
        have: false, 
        duplicated: 0,
        history: appendHistoryEvent(current.history, ACTION_TYPES.ELIMINADA)
      });
    }
  };

  // Double tap: toggle the sticker's favorite status
  const toggleFavorite = (id) => {
    const current = stickersState[id] || { have: false, duplicated: 0, favorite: false, history: [] };
    updateSticker(id, { 
      favorite: !current.favorite,
      history: appendHistoryEvent(
        current.history, 
        !current.favorite ? ACTION_TYPES.FAVORITA_AGREGADA : ACTION_TYPES.FAVORITA_ELIMINADA
      )
    });
  };

  // Return a normalized status object for a given sticker ID
  const getStickerStatus = (stickerId) => {
    const state = stickersState[stickerId] || {};
    return {
      have: state.have || false,
      dup: state.duplicated || 0,
      favorite: state.favorite || false,
    };
  };

  // Derive album-wide completion stats from the current sticker state
  const stats = useAlbumStats(stickersState);

  return {
    albumCode,
    setAlbumCode,
    syncStatus,
    stickersState,
    stats,
    handleShortTap,
    handleLongPress,
    getStickerStatus,
    toggleFavorite,
  };
}
