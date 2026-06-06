# AI Developer Guidelines & Project Context (`AGENTS.md`)

Welcome, fellow AI agent! This document serves as the single source of truth for the context, design systems, interaction patterns, and constraints of the **mis-fibus** application.

> [!IMPORTANT]
> **To future AI Developers:** If you introduce new core UX features, modify design tokens, or adjust fundamental logic, **you MUST update this file** at the end of your execution to keep future agents aligned.

---

## 1. Project Overview & Context

- **Application Name:** mis-fibus (an online, real-time shared Panini FIFA World Cup 2026 sticker checklist).
- **Goal:** Provide a shared room/album checklist that two users can view and update simultaneously on their mobile phones with sub-100ms latency, enabling real-time collaboration.
- **Tech Stack:** React, Vite, Tailwind CSS v4, Firebase (Firestore, Hosting).

---

## 2. Design System & Theme (Panini Physical Album Style)

The design mimics the feel of the physical Panini sticker album:

- **Primary Background:** A soft cream/ivory color (`#F9F7F3`) simulating matte paper.
- **Primary Accent Color:** Blue/Teal (`#a9ced6`) representing the official look.
- **Secondary Color:** Vibrant Orange (`#e25822`) from the package background curves.
- **Highlight/Accent Color:** Gold/Oro (`#D4AF37`) for highlights, special cards, and duplicates.
- **Success Color:** Green (`#00a651`) from the package background curves.
- **Typography Hierarchy:**
  - `Montserrat` (extrabold, uppercase) for section headers and country names.
  - `Bebas Neue` for numbers, percentages, duplicate counts, and sticker codes (e.g., `ARG10`).
  - `Inter` for reading text, select dropdowns, search inputs, and body elements.
- **Icons:** Avoid using plain emojis. Always use vector icons from `react-icons/fa` or `react-icons/si`.

---

## 3. Sticker Card Layout (`StickerCard.jsx`)

Stickers are laid out as individual rectangular collectible cards:

- **Proportions:** `aspect-[1/1.1]` with border radius `rounded-xl`.
- **Visual Simplicity:** Clean cards showing only the sticker code in the center (in `Bebas Neue` `text-lg`) and the player's name below it (in `Inter` `text-[8px]`). No flags, shields, or other clutter inside individual cards.
- **Solid Backgrounds (No Translucency):**
  - **Missing (Faltante):** Clean white background (`bg-white`), thin grey border.
  - **Owned (Obtenida):** Light green background (`bg-[#E8F8F0]`), thin green border, checkmark icon in top-right.
  - **Duplicate (Repetida):** Light gold background (`bg-[#FEF8E7]`), gold border, `xN` badge in top-right.
  - **Specials (01 / 13 of each team):** Inverse coloring (dark background, white text) to stand out.
- **Favorites Highlight:** When a card is marked as favorite, its border turns into a double golden border: `border-2 border-amber-500 shadow-md shadow-amber-500/25`. **There is no star button rendered on the card** to keep it completely clean and avoid overlaps.

---

## 4. Multi-Gesture Interaction Model

The sticker cards support three touch/click states with haptic feedback:

1.  **Short Tap / Single Click:**
    - If missing: Marks it as **Owned**.
    - If owned: Adds a **Duplicate** (`x1`, `x2`, etc.).
    - _Technical implementation:_ Run with a `250ms` delay via `setTimeout` to differentiate from a double tap.
2.  **Long Press (500ms):**
    - Subtracts one duplicate. If duplicates reach `0`, it marks it as **Missing** (white background).
    - Triggers a brief haptic vibration of `50ms` (`navigator.vibrate(50)`) on mobile devices.
3.  **Double Tap (within 250ms):**
    - Toggles the **Favorite** status (triggering the golden border).
    - Triggers a brief haptic vibration of `35ms` (`navigator.vibrate(35)`).
    - Cancels any pending single tap to prevent changing owned/duplicate counts during favoriting.

_Gestural Isolation:_ Ensure all touch phases and mouse clicks cancel default propagation (`e.stopPropagation()`) where appropriate to avoid breaking layouts or triggering parent actions while interacting with overlays.

---

## 5. Country Sections & Background Gradients (`CountrySection.jsx`)

- Each team (e.g. Argentina, Germany) is rendered as a collapsible accordion header with a chevron and a simplified vector flag thumbnail (drawn dynamically as SVG in `CountryFlag.jsx`) next to the team name.
- **Page Pattern:** When expanded, the background of each country section displays randomized, organic wave, diagonal, or circular curves (drawn dynamically as an inline SVG using `getCountryPattern`) in the primary, secondary, and tertiary flag colors using their true, saturated colors (100% opacity, completely solid and unblended to prevent muddy color mixing), scaled dynamically to reflect the actual visual proportions and weights of each color in the respective national flag (e.g. Brazil has 80% Green, 15% Yellow, 5% Blue). A white curve is added on the left side to represent the page margin split, directly mimicking the visual style of the official digital album page background.
- **Readability Overlay:** An overlay of `bg-white/30` is placed on top of the waves background to ensure the solid card backgrounds and texts remain highly legible while maintaining the full vibrancy and depth of the flag colors.

---

## 6. Advanced Filtering & Display Modes

- **Status Filter (Left):** Filters stickers by "Todas" (All), "Faltantes" (Missing), "Obtenidas" (Owned), "Repetidas" (Duplicated), and "Favoritas" (Favorites).
- **View Mode Filter (Center):**
  - `album`: Grouped by official sections (Sedes, Group Stages, History, Coca-Cola) with collapsible country accordions.
  - `teams`: Flat list of all 48 country sections, hiding special non-country segments (Group labels like "Group A" are appended to header names).
  - `specials`: Shows only non-country categories ("FIFA World Cup 2026", "History", "Coca-Cola").
  - `flat` (Continuous Grid): Displays all matching stickers in a single flat grid without sections or accordions.
- **Display Style Filter (Right):**
  - `both` (Default): Shows both the sticker code and the player's name.
  - `code`: Shows only the sticker code (e.g., `MEX10`).
  - `name`: Shows only the player's name in a larger, bold, uppercase style (`text-[10px] font-semibold font-sans uppercase tracking-tight`). Fallback to code if the name is not present in the JSON.
- **Interactive Atajos (Shortcuts):**
  - Clicking the duplicate count badge in `StatsPanel` switches filters to "Duplicated" and "Continuous Grid".
  - Clicking the progress bar or stats counts resets filters to "Album View", "All Stickers", and empty search.
- **Sharing Duplicates:**
  - When the "Repetidas" (Duplicated) status filter is active, a premium "Compartir repetidas" button is rendered below the filters and above the sticker list.
  - It compiles all duplicates sorted by album order, formats them (e.g., `- ARG17 (Lionel Messi) x2`) and sums the total.
  - On mobile devices, it invokes `navigator.share` for native sharing; on desktop browsers, it copies the text to the clipboard and shows a temporary success state (`"¡Copiado al portapapeles!"` in success green) for 2 seconds.
  - The button automatically disables (greyed out) if the active room has zero duplicates.

---

## 7. Real-Time Cloud Synchronization & URL Routing Logic (`useSharedAlbum.js`)

- **Firestore Room:** Albums are stored in Firestore under `albums/{albumCode}`.
- **Room Initialization & Persistence:**
  - Upon load, the room code is read from the URL parameter `room` or `sala` (e.g., `?room=mi_sala`).
  - If no URL parameter is provided, it falls back to the room saved in `localStorage` (`fibus_album_code`) or defaults to `"fibus_mundial_2026"`.
  - Any active room code is immediately cached in `localStorage` to ensure persistence across sessions (e.g., when launched from the iPhone Home Screen shortcut).
  - **Room Code Modification:** Changing the room code in the settings panel uses a local input state and an explicit 'Save' (Guardar) button. This prevents updating the global room state on every keypress, which would otherwise trigger premature initialization of intermediate/incomplete room documents on Firestore.
- **Dynamic URL Reflection:** Whenever the active `albumCode` changes, the URL query parameters are updated in real-time to `?room={albumCode}` using `window.history.replaceState` without reloading the page.
- **Ultra-Low Latency Updates:** Updates do not upload the entire checklist. They use granular dot notation updates (e.g., `updateDoc` with `stickers.ARG10`) so that only a few bytes are transferred per click.
- **Mobile App Resumption & Tab Isolation listeners:**
  - `visibilitychange`: Forces a fresh subscription fetch from Firestore when the browser tab/mobile app becomes visible (`document.visibilityState === 'visible'`).
  - `online` / `offline`: Dynamically updates network status and re-establishes snapshot listeners as soon as connectivity recovers.
  - `storage`: Syncs the active room code (`albumCode`) across tabs in real-time, but **ignores updates** if the target tab has an explicit room query parameter in its URL that differs from the new value, preventing cross-tab pollution for independent albums.

## 8. PWA & iOS Home Screen Integration

To support running as a standalone app on iOS Safari ("Add to Home Screen") and Android Google Chrome ("Install App"):

- **PWA Manifest:** Added `manifest.json` in `/public/manifest.json` defining standard metadata (`name`, `short_name`, `theme_color`, `background_color`) with linked icons having the purpose set to `"any"` (to prevent Android Chrome from stretching/distorting the logo in masked launchers) and linked it in `index.html`.
- **Clean Startup URL:** Manifest defines `"start_url": "/"` and `"display": "standalone"`. This forces both Android WebAPKs and iOS Web Clips to launch at the clean root URL without query parameter pollution, ensuring it automatically falls back to retrieve the saved room from `localStorage`.
- **Icon:** Configured via `<link rel="apple-touch-icon" href="/logo-fibus.png" />` in `index.html`.
- **Standalone Mode:** Enabled via `<meta name="apple-mobile-web-app-capable" content="yes" />` to hide browser navigation frames when launched from the home screen.
- **Title & Styling:** Custom title `"Mis Fibus"` set via `apple-mobile-web-app-title` and status bar styled to `default`.
- **Caching Strategy (Firebase Hosting Caching Control):** To ensure iOS standalone atajos (Web Clips) load the latest code updates on every launch instead of keeping old files in aggressive local cache, `firebase.json` specifies:
  - `index.html` (and dynamic routes matched by `/**`) is served with `Cache-Control: no-cache, no-store, must-revalidate` to force server revalidation.
  - Hashed static assets in `/assets/**` are cached long-term using `Cache-Control: public, max-age=31536000, immutable` for maximum performance.

---

## 9. Module Architecture & Single Responsibility Principle

The codebase follows the Single Responsibility Principle. Every file has one clear reason to change.

### Hooks (`src/hooks/`)

| Hook | Responsibility |
|---|---|
| `useSharedAlbum.js` | Composes all album hooks; owns Firestore subscription and sticker mutation actions |
| `useRoomSync.js` | Room code init from URL/localStorage, persistence, URL reflection, cross-tab sync |
| `useNetworkListeners.js` | Attaches and cleans up `online`, `offline`, and `visibilitychange` event listeners |
| `useAlbumStats.js` | Derives `{ total, owned, percent, dups }` from the sticker state map (pure computation) |
| `useStickerGestures.js` | Encapsulates tap/double-tap/long-press gesture detection with timer refs; returns spreadable event handler props |
| `useFilteredStickers.js` | Returns a `getFilteredStickers(list)` function scoped to the current status and search filters |
| `useRoomCheck.js` | Debounced Firestore room-existence check; returns `{ roomExists, isCheckingRoom }` |

### Components (`src/components/`)

| Component | Responsibility |
|---|---|
| `App.jsx` | Root wiring: state declarations, prop distribution, page layout |
| `StickerBoard.jsx` | Switches between flat/teams/album/specials grid layouts; delegates card/group rendering |
| `StickerCard.jsx` | Presentational single-card view; consumes `useStickerGestures` for all interactions |
| `StickerGroup.jsx` | Collapsible accordion for a named group (Special or Group Stage) with progress bar |
| `CountrySection.jsx` | Collapsible accordion for a single country with flag background pattern and 4-col card grid |
| `Header.jsx` | App title, help button, sync badge layout |
| `SyncStatusBadge.jsx` | Maps `syncStatus` string to its styled badge element |
| `StatsPanel.jsx` | Album progress overview with clickable shortcut handlers |
| `FiltersPanel.jsx` | Search input + three filter selectors (status / view / display) |
| `ShareDuplicatesButton.jsx` | Compiles and shares/copies duplicate sticker list; shown only in Repetidas filter mode |
| `Footer.jsx` | Room code display and settings panel toggle |
| `SettingsPanel.jsx` | Room code editing form with debounced save |
| `HelpModal.jsx` | Modal shell + section structure; composes StickerLegend, GestureGuide, useRoomCheck |
| `StickerLegend.jsx` | Four example cards showing sticker states (Faltante/Obtenida/Repetida/Favorita) |
| `GestureGuide.jsx` | Three gesture cards explaining single tap, long press, and double tap |
| `CountryFlag.jsx` | Dynamic SVG flag thumbnail for each country key |

### Constants (`src/constants/`)

| File | Responsibility |
|---|---|
| `albumSections.js` | `groupTeams`, `sections`, `countries` map, and `albumOrderedStickers` ordered list |
| `countryData.js` | `FLAG_GRADIENTS`, `FLAG_PROPORTIONS`, `COUNTRY_METADATA`, and `getCountryPattern` SVG generator |
