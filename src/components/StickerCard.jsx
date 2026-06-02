import { useRef } from "react";
import { FaCheck } from "react-icons/fa";

// Sticker Card component representing a single digital collectible card.
export function StickerCard({ sticker, status, onShortTap, onLongPress }) {
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

  const isSpecial = sticker.group === "SPECIAL" || sticker.group === "FWC" || sticker.group === "CC";
  const isCocaCola = sticker.group === "CC" || sticker.id.startsWith("CC");

  let cardClass = "";

  if (status.dup > 0) {
    cardClass = "bg-accent/10 border-accent/45 text-accent hover:bg-accent/15 hover:border-accent/60 shadow-inner shadow-accent/5 active:scale-95 hover:-translate-y-0.5 hover:shadow-accent/25 hover:shadow-lg";
  } else if (status.have) {
    cardClass = "bg-success/10 border-success/40 text-success hover:bg-success/15 hover:border-success/60 shadow-inner shadow-success/5 active:scale-95 hover:-translate-y-0.5 hover:shadow-success/20 hover:shadow-lg";
  } else {
    cardClass = "bg-slate-100/50 border-slate-200/85 text-slate-400 hover:border-slate-300 active:scale-95";
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
      {/* Sticker Code in Bebas Neue */}
      <span className="font-bebas text-lg leading-none tracking-wide">
        {sticker.id}
      </span>

      {/* Duplicate Badge */}
      {status.dup > 0 && (
        <span className="absolute top-1.5 right-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full border bg-accent/10 border-accent/30 text-accent leading-none font-bebas">
          x{status.dup}
        </span>
      )}

      {/* Obtained Check Badge */}
      {status.have && status.dup === 0 && (
        <span className="absolute top-1.5 right-1.5 text-[9px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border bg-success/10 border-success/30 text-success leading-none">
          <FaCheck className="text-[7px]" />
        </span>
      )}
    </div>
  );
}
