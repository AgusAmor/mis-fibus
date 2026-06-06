import { useEffect } from "react";

/**
 * useNetworkListeners — attaches browser-level event listeners to manage
 * sync status and re-trigger Firestore subscriptions on connectivity changes.
 *
 * Responsibilities:
 *  - Listen to `online` / `offline` window events.
 *  - Listen to `visibilitychange` to re-subscribe when the app comes to foreground.
 *  - Call the provided callbacks; does NOT manage any state itself.
 */
export function useNetworkListeners({ onOnline, onOffline, onVisible }) {
  useEffect(() => {
    const handleOnline = () => onOnline?.();
    const handleOffline = () => onOffline?.();
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        onVisible?.();
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
  }, [onOnline, onOffline, onVisible]);
}
