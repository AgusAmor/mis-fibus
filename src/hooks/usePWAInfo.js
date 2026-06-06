import { useState, useEffect } from "react";

/**
 * usePWAInfo - Hook to detect if the app is running in standalone mode
 * and to detect the current operating system (iOS vs Android).
 * 
 * Returns: { isStandalone: boolean, os: "ios" | "android" | "other" }
 */
export function usePWAInfo() {
  // Default to true during SSR or initial paint to avoid flashing the modal
  const [isStandalone, setIsStandalone] = useState(true);
  const [os, setOs] = useState("other");

  useEffect(() => {
    // Check if running in standalone (PWA/Home Screen) mode
    const isIOSStandalone = window.navigator.standalone === true;
    const isMatchMediaStandalone = window.matchMedia("(display-mode: standalone)").matches;
    setIsStandalone(isIOSStandalone || isMatchMediaStandalone);

    // Detect operating system
    const userAgent = window.navigator.userAgent || window.navigator.vendor || window.opera;
    if (/android/i.test(userAgent)) {
      setOs("android");
    } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      setOs("ios");
    }
  }, []);

  return { isStandalone, os };
}
