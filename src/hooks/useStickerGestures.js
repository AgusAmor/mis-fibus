import { useRef, useEffect } from "react";

/**
 * useStickerGestures — encapsulates the multi-gesture interaction model for a sticker card.
 *
 * Responsibilities:
 *  - Detect single tap (250ms delay to differentiate from double tap).
 *  - Detect double tap (within 250ms window) and cancel the pending single tap.
 *  - Detect long press (500ms hold) and trigger haptic feedback.
 *  - Cancel all pending timers on unmount to prevent memory leaks.
 *
 * Returns an object of event handler props to spread directly onto the card element.
 *
 * @param {string} stickerId - The ID of the sticker this gesture is attached to.
 * @param {{ onShortTap: Function, onLongPress: Function, onToggleFavorite: Function }} handlers
 */
export function useStickerGestures(stickerId, { onShortTap, onLongPress, onToggleFavorite }) {
  const timerRef = useRef(null);
  const isLongPressRef = useRef(false);
  const hasMovedRef = useRef(false);
  const isTouchRef = useRef(false);
  const lastTapRef = useRef(0);
  const clickTimeoutRef = useRef(null);

  // Clean up all pending timers when the component unmounts
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    };
  }, []);

  const startPress = (e) => {
    if (e.type === "mousedown" && e.button !== 0) return;

    // Track touch events to suppress the emulated mousedown that follows on mobile
    if (e.type === "touchstart") {
      isTouchRef.current = true;
    } else if (e.type === "mousedown" && isTouchRef.current) {
      return;
    }

    isLongPressRef.current = false;
    hasMovedRef.current = false;

    // Cancel any pending single-tap dispatch to avoid race conditions during long-press initiation
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
    }

    // Schedule long-press action after 500ms hold
    timerRef.current = setTimeout(() => {
      isLongPressRef.current = true;
      onLongPress(stickerId);
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    }, 500);
  };

  const endPress = (e) => {
    // Ignore the emulated mouse-up that follows a touch-end on mobile
    if (e.type === "mouseup" && isTouchRef.current) {
      isTouchRef.current = false;
      return;
    }

    if (timerRef.current) clearTimeout(timerRef.current);

    // If the finger/cursor moved, treat as a scroll — not a tap
    if (hasMovedRef.current) return;

    if (!isLongPressRef.current) {
      const now = Date.now();
      const DOUBLE_PRESS_DELAY = 250;

      if (now - lastTapRef.current < DOUBLE_PRESS_DELAY) {
        // Double tap: cancel the pending single tap and toggle favorite
        if (clickTimeoutRef.current) {
          clearTimeout(clickTimeoutRef.current);
          clickTimeoutRef.current = null;
        }
        onToggleFavorite(stickerId);
        if (navigator.vibrate) {
          navigator.vibrate(35);
        }
        lastTapRef.current = 0; // Reset tap tracker
      } else {
        // First tap: schedule dispatch with delay to allow double-tap detection window
        lastTapRef.current = now;
        clickTimeoutRef.current = setTimeout(() => {
          onShortTap(stickerId);
          clickTimeoutRef.current = null;
        }, DOUBLE_PRESS_DELAY);
      }
    }
    isLongPressRef.current = false;
  };

  const cancelPress = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    hasMovedRef.current = true;
  };

  // Return as spreadable event handler props for the card element
  return {
    onMouseDown: startPress,
    onMouseUp: endPress,
    onMouseLeave: cancelPress,
    onTouchStart: startPress,
    onTouchEnd: endPress,
    onTouchMove: cancelPress,
    onContextMenu: (e) => e.preventDefault(),
  };
}
