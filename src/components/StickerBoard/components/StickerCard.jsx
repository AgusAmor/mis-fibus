import { FaCheck } from "react-icons/fa";
import { useStickerGestures } from "../../../hooks/useStickerGestures";

/**
 * StickerCard — presentational component for a single collectible sticker card.
 *
 * Responsibilities:
 *  - Render the sticker code, player name, status badges, and border styling.
 *  - Delegate all gesture detection (tap, double-tap, long-press) to useStickerGestures.
 */
export function StickerCard({
  sticker,
  status,
  onShortTap,
  onLongPress,
  onToggleFavorite,
  displayMode = "both",
}) {
  // Gesture handlers (timers, touch/mouse tracking, double-tap logic)
  const gestureHandlers = useStickerGestures(sticker.id, {
    onShortTap,
    onLongPress,
    onToggleFavorite,
  });

  // Sticker numbers 01 and 13 of each team get an inverse (dark) color treatment
  const isTeamSpecial =
    (sticker.number === "01" || sticker.number === "13") &&
    sticker.group !== "SPECIAL" &&
    sticker.group !== "FWC" &&
    sticker.group !== "CC";

  // Derive background + text classes based on sticker status
  let bgTextClass = "";
  let borderClass = "";

  if (status.favorite) {
    borderClass = "border-2 border-amber-500 shadow-md shadow-amber-500/25";
  }

  if (status.dup > 0) {
    if (isTeamSpecial) {
      bgTextClass =
        "bg-accent text-white hover:bg-accent/90 active:scale-95 hover:-translate-y-0.5 shadow-md shadow-accent/10 hover:shadow-accent/35 hover:shadow-lg";
      if (!status.favorite) borderClass = "border border-accent";
    } else {
      bgTextClass =
        "bg-[#FEF8E7] text-accent hover:bg-[#FDF1CE] hover:border-accent active:scale-95 hover:-translate-y-0.5 shadow-md shadow-accent/5 hover:shadow-accent/25 hover:shadow-lg";
      if (!status.favorite) borderClass = "border border-accent/70";
    }
  } else if (status.have) {
    if (isTeamSpecial) {
      bgTextClass =
        "bg-success text-white hover:bg-success/90 active:scale-95 hover:-translate-y-0.5 shadow-md shadow-success/10 hover:shadow-success/25 hover:shadow-lg";
      if (!status.favorite) borderClass = "border border-success";
    } else {
      bgTextClass =
        "bg-[#E8F8F0] text-success hover:bg-[#DDF5E7] active:scale-95 hover:-translate-y-0.5 shadow-md shadow-success/5 hover:shadow-success/20 hover:shadow-lg";
      if (!status.favorite) borderClass = "border border-success/60";
    }
  } else {
    if (isTeamSpecial) {
      bgTextClass = "bg-slate-400 text-white hover:bg-slate-500 active:scale-95 shadow-xs";
      if (!status.favorite) borderClass = "border border-slate-400";
    } else {
      bgTextClass = "bg-white text-slate-400 hover:bg-slate-50 active:scale-95";
      if (!status.favorite) borderClass = "border border-slate-200/85";
    }
  }

  return (
    <div
      {...gestureHandlers}
      className={`relative flex flex-col justify-center items-center rounded-xl transition-all duration-300 aspect-[1/1.1] cursor-pointer select-none ${borderClass} ${bgTextClass}`}
    >
      {/* Sticker code in Bebas Neue — shown in 'both', 'code', or as fallback when name is absent */}
      {(displayMode === "both" ||
        displayMode === "code" ||
        (displayMode === "name" && !sticker.name)) && (
        <span className="font-bebas text-lg leading-none tracking-wide">{sticker.id}</span>
      )}

      {/* Player name */}
      {(displayMode === "both" || displayMode === "name") && sticker.name && (
        <span
          className={`font-medium text-center px-1.5 leading-tight max-w-full overflow-hidden text-ellipsis line-clamp-2 opacity-85 ${
            displayMode === "name"
              ? "text-[10px] font-semibold leading-normal font-sans uppercase tracking-tight"
              : "text-[8px] mt-0.5"
          }`}
        >
          {sticker.name}
        </span>
      )}

      {/* Duplicate count badge (top-right corner) */}
      {status.dup > 0 && (
        <span
          className={`absolute top-1.5 right-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full border leading-none font-bebas ${
            isTeamSpecial
              ? "bg-white border-white text-accent"
              : "bg-accent/10 border-accent/30 text-accent"
          }`}
        >
          x{status.dup}
        </span>
      )}

      {/* Owned check badge (top-right corner, only when no duplicates) */}
      {status.have && status.dup === 0 && (
        <span
          className={`absolute top-1.5 right-1.5 text-[9px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border leading-none ${
            isTeamSpecial
              ? "bg-white border-white text-success"
              : "bg-success/10 border-success/30 text-success"
          }`}
        >
          <FaCheck className="text-[7px]" />
        </span>
      )}
    </div>
  );
}
