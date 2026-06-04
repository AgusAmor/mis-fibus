# AI Developer Guidelines & Project Context (`AGENTS.md`)

Welcome, fellow AI agent! This document serves as the single source of truth for the context, design systems, interaction patterns, and constraints of the **mis-fibus** application. 

> [!IMPORTANT]
> **To future AI Developers:** If you introduce new core UX features, modify design tokens, or adjust fundamental logic, **you MUST update this file** at the end of your execution to keep future agents aligned.

---

## 1. Project Overview & Context

*   **Application Name:** mis-fibus (an online, real-time shared Panini FIFA World Cup 2026 sticker checklist).
*   **Goal:** Provide a shared room/album checklist that two users can view and update simultaneously on their mobile phones with sub-100ms latency, enabling real-time collaboration.
*   **Tech Stack:** React, Vite, Tailwind CSS v4, Firebase (Firestore, Hosting).

---

## 2. Design System & Theme (Panini Physical Album Style)

The design mimics the feel of the physical Panini sticker album:
*   **Primary Background:** A soft cream/ivory color (`#F9F7F3`) simulating matte paper.
*   **Primary Accent Color:** A deep Burgundy/Guinda (`#5E0B19`) representing the official World Cup look.
*   **Secondary/Highlight Color:** Gold/Oro (`#D4AF37`) for highlights, special cards, and duplicates.
*   **Typography Hierarchy:**
    *   `Montserrat` (extrabold, uppercase) for section headers and country names.
    *   `Bebas Neue` for numbers, percentages, duplicate counts, and sticker codes (e.g., `ARG10`).
    *   `Inter` for reading text, select dropdowns, search inputs, and body elements.
*   **Icons:** Avoid using plain emojis. Always use vector icons from `react-icons/fa` or `react-icons/si`.

---

## 3. Sticker Card Layout (`StickerCard.jsx`)

Stickers are laid out as individual rectangular collectible cards:
*   **Proportions:** `aspect-[1/1.1]` with border radius `rounded-xl`.
*   **Visual Simplicity:** Clean cards showing only the sticker code in the center (in `Bebas Neue` `text-lg`) and the player's name below it (in `Inter` `text-[8px]`). No flags, shields, or other clutter inside individual cards.
*   **Solid Backgrounds (No Translucency):**
    *   **Missing (Faltante):** Clean white background (`bg-white`), thin grey border.
    *   **Owned (Obtenida):** Light green background (`bg-[#E8F8F0]`), thin green border, checkmark icon in top-right.
    *   **Duplicate (Repetida):** Light gold background (`bg-[#FEF8E7]`), gold border, `xN` badge in top-right.
    *   **Specials (01 / 13 of each team):** Inverse coloring (dark background, white text) to stand out.
*   **Favorites Highlight:** When a card is marked as favorite, its border turns into a double golden border: `border-2 border-amber-500 shadow-md shadow-amber-500/25`. **There is no star button rendered on the card** to keep it completely clean and avoid overlaps.

---

## 4. Multi-Gesture Interaction Model

The sticker cards support three touch/click states with haptic feedback:
1.   **Short Tap / Single Click:**
     *   If missing: Marks it as **Owned**.
     *   If owned: Adds a **Duplicate** (`x1`, `x2`, etc.).
     *   *Technical implementation:* Run with a `250ms` delay via `setTimeout` to differentiate from a double tap.
2.   **Long Press (500ms):**
     *   Subtracts one duplicate. If duplicates reach `0`, it marks it as **Missing** (white background).
     *   Triggers a brief haptic vibration of `50ms` (`navigator.vibrate(50)`) on mobile devices.
3.   **Double Tap (within 250ms):**
     *   Toggles the **Favorite** status (triggering the golden border).
     *   Triggers a brief haptic vibration of `35ms` (`navigator.vibrate(35)`).
     *   Cancels any pending single tap to prevent changing owned/duplicate counts during favoriting.

*Gestural Isolation:* Ensure all touch phases and mouse clicks cancel default propagation (`e.stopPropagation()`) where appropriate to avoid breaking layouts or triggering parent actions while interacting with overlays.

---

## 5. Country Sections & Background Gradients (`CountrySection.jsx`)

*   Each team (e.g. Argentina, Germany) is rendered as a collapsible accordion header with a chevron and flag-color stripes.
*   **Page Pattern:** When expanded, the background of each country is decorated with circular/radial abstract patterns based on its national colors (`getCountryPattern`).
*   **Readability Overlay:** An overlay of `bg-white/25` is placed on top of the national color patterns to ensure the solid card backgrounds and texts remain highly legible.

---

## 6. Advanced Filtering & Display Modes

*   **Status Filter (Left):** Filters stickers by "Todas" (All), "Faltantes" (Missing), "Obtenidas" (Owned), "Repetidas" (Duplicated), and "Favoritas" (Favorites).
*   **View Mode Filter (Center):**
    *   `album`: Grouped by official sections (Sedes, Group Stages, History, Coca-Cola) with collapsible country accordions.
    *   `teams`: Flat list of all 48 country sections, hiding special non-country segments (Group labels like "Group A" are appended to header names).
    *   `specials`: Shows only non-country categories ("FIFA World Cup 2026", "History", "Coca-Cola").
    *   `flat` (Continuous Grid): Displays all matching stickers in a single flat grid without sections or accordions.
*   **Display Style Filter (Right):**
    *   `both` (Default): Shows both the sticker code and the player's name.
    *   `code`: Shows only the sticker code (e.g., `MEX10`).
    *   `name`: Shows only the player's name in a larger, bold, uppercase style (`text-[10px] font-semibold font-sans uppercase tracking-tight`). Fallback to code if the name is not present in the JSON.
*   **Interactive Atajos (Shortcuts):**
    *   Clicking the duplicate count badge in `StatsPanel` switches filters to "Duplicated" and "Continuous Grid".
    *   Clicking the progress bar or stats counts resets filters to "Album View", "All Stickers", and empty search.

---

## 7. Real-Time Cloud Synchronization Logic (`useSharedAlbum.js`)

*   **Firestore Room:** Albums are stored in Firestore under `albums/{albumCode}`.
*   **Ultra-Low Latency Updates:** Updates do not upload the entire checklist. They use granular dot notation updates (e.g. `updateDoc` with `stickers.ARG10`) so that only a few bytes are transferred per click.
*   **Mobile App Resumption listeners:**
    *   `visibilitychange`: Forces a fresh subscription fetch from Firestore when the browser tab/mobile app becomes visible (`document.visibilityState === 'visible'`).
    *   `online` / `offline`: Dynamically updates network status and re-establishes snapshot listeners as soon as connectivity recovers.
    *   `storage`: Syncs the active room code (`albumCode`) across multiple tabs in real-time.

---

## 8. PWA & iOS Home Screen Integration

To support running as a standalone app on iOS Safari ("Add to Home Screen"):
*   **Icon:** Configured via `<link rel="apple-touch-icon" href="/logo-fibus.png" />` in `index.html`.
*   **Standalone Mode:** Enabled via `<meta name="apple-mobile-web-app-capable" content="yes" />` to hide browser navigation frames when launched from the home screen.
*   **Title & Styling:** Custom title `"Mis Fibus"` set via `apple-mobile-web-app-title` and status bar styled to `default`.

