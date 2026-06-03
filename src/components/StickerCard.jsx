import { useRef } from "react";
import { FaCheck, FaStar, FaRegStar } from "react-icons/fa";

// Sticker Card component representing a single digital collectible card.
export function StickerCard({
  sticker,
  status,
  onShortTap,
  onLongPress,
  onToggleFavorite,
}) {
  const timerRef = useRef(null);
  const isLongPressRef = useRef(false);
  const hasMovedRef = useRef(false);
  const isTouchRef = useRef(false);

  const startPress = (e) => {
    if (e.type === "mousedown" && e.button !== 0) return;

    // Detect if this is a real touch event to ignore subsequently emulated mouse events
    if (e.type === "touchstart") {
      isTouchRef.current = true;
    } else if (e.type === "mousedown" && isTouchRef.current) {
      return;
    }

    isLongPressRef.current = false;
    hasMovedRef.current = false;

    timerRef.current = setTimeout(() => {
      isLongPressRef.current = true;
      onLongPress(sticker.id);
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    }, 500);
  };

  const endPress = (e) => {
    // Ignore emulated mouse release from touch events
    if (e.type === "mouseup" && isTouchRef.current) {
      isTouchRef.current = false;
      return;
    }

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (hasMovedRef.current) return;

    if (!isLongPressRef.current) {
      onShortTap(sticker.id);
    }
    isLongPressRef.current = false;
  };

  const cancelPress = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    hasMovedRef.current = true;
  };

  const isTeamSpecial =
    (sticker.number === "01" || sticker.number === "13") &&
    sticker.group !== "SPECIAL" &&
    sticker.group !== "FWC" &&
    sticker.group !== "CC";

  let cardClass = "";

  if (status.dup > 0) {
    cardClass = isTeamSpecial
      ? "bg-accent border-accent text-white hover:bg-accent/90 active:scale-95 hover:-translate-y-0.5 shadow-md shadow-accent/10 hover:shadow-accent/35 hover:shadow-lg"
      : "bg-[#FEF8E7] border-accent/70 text-accent hover:bg-[#FDF1CE] hover:border-accent active:scale-95 hover:-translate-y-0.5 shadow-md shadow-accent/5 hover:shadow-accent/25 hover:shadow-lg";
  } else if (status.have) {
    cardClass = isTeamSpecial
      ? "bg-success border-success text-white hover:bg-success/90 active:scale-95 hover:-translate-y-0.5 shadow-md shadow-success/10 hover:shadow-success/25 hover:shadow-lg"
      : "bg-[#E8F8F0] border-success/60 text-success hover:bg-[#DDF5E7] hover:border-success active:scale-95 hover:-translate-y-0.5 shadow-md shadow-success/5 hover:shadow-success/20 hover:shadow-lg";
  } else {
    cardClass = isTeamSpecial
      ? "bg-slate-400 border-slate-400 text-white hover:bg-slate-500 active:scale-95 shadow-xs"
      : "bg-white border-slate-200/85 text-slate-400 hover:border-slate-300 hover:bg-slate-50 active:scale-95";
  }

  return (
    <div
      onMouseDown={startPress}
      onMouseUp={endPress}
      onMouseLeave={cancelPress}
      onTouchStart={startPress}
      onTouchEnd={endPress}
      onTouchMove={cancelPress}
      onContextMenu={(e) => e.preventDefault()}
      className={`relative flex flex-col justify-center items-center rounded-xl transition-all duration-300 aspect-[1/1.1] border cursor-pointer select-none ${cardClass}`}
    >
      {/* Favorite Star Button */}
      <button
        onMouseDown={(e) => e.stopPropagation()}
        onMouseUp={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(sticker.id);
        }}
        className={`absolute top-0.5 left-0.5 w-8 h-8 rounded-full hover:bg-slate-200/20 active:scale-90 transition-all cursor-pointer z-20 flex items-center justify-center ${
          status.favorite
            ? "text-amber-500 drop-shadow-[0_1px_1px_rgba(0,0,0,0.15)]"
            : "text-slate-300 hover:text-slate-400"
        }`}
        title={
          status.favorite ? "Eliminar de favoritas" : "Marcar como favorita"
        }
      >
        {status.favorite ? (
          <FaStar className="text-[15px]" />
        ) : (
          <FaRegStar className="text-[15px]" />
        )}
      </button>

      {/* Sticker Code in Bebas Neue */}
      <span className="font-bebas text-lg leading-none tracking-wide">
        {sticker.id}
      </span>

      {/* Duplicate Badge */}
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

      {/* Obtained Check Badge */}
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
