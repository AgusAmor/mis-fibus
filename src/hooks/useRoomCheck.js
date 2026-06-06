import { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

/**
 * useRoomCheck — debounced check for whether a Firestore room document already exists.
 *
 * Responsibilities:
 *  - Watch a room code input string.
 *  - After a 400ms debounce, query Firestore and return the existence result.
 *  - Provide a loading flag while the check is in progress.
 *
 * @param {string} roomInput - The room code string to check (raw, potentially untrimmed).
 * @returns {{ roomExists: boolean|null, isCheckingRoom: boolean }}
 */
export function useRoomCheck(roomInput) {
  const [roomExists, setRoomExists] = useState(null);
  const [isCheckingRoom, setIsCheckingRoom] = useState(false);

  useEffect(() => {
    const cleanCode = roomInput.trim().toLowerCase();
    if (!cleanCode || cleanCode === "sala_predeterminada") {
      setRoomExists(null);
      return;
    }

    setIsCheckingRoom(true);

    // Debounce: only fire the Firestore query after 400ms of inactivity
    const delayDebounce = setTimeout(async () => {
      try {
        const docRef = doc(db, "albums", cleanCode);
        const docSnap = await getDoc(docRef);
        setRoomExists(docSnap.exists());
      } catch (err) {
        console.error("Error checking room existence in Firestore:", err);
      } finally {
        setIsCheckingRoom(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [roomInput]);

  return { roomExists, isCheckingRoom };
}
