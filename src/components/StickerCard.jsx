import { useRef } from "react";

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

  return (
    <div
      onMouseDown={startPress}
      onMouseUp={endPress}
      onMouseLeave={cancelPress}
      onTouchStart={startPress}
      onTouchEnd={endPress}
      onTouchMove={cancelPress}
      onContextMenu={(e) => e.preventDefault()}
      className={`relative flex flex-col justify-center items-center rounded-xl overflow-hidden transition-all duration-300 aspect-[1/1.1] border cursor-pointer select-none ${
        status.dup > 0
          ? "bg-accent-gold/10 border-accent-gold/45 hover:bg-accent-gold/15 hover:border-accent-gold/60 shadow-inner shadow-accent-gold/5 active:scale-95 hover:-translate-y-0.5 hover:shadow-accent-gold/25 hover:shadow-lg"
          : status.have
            ? "bg-emerald-500/10 border-emerald-500/40 hover:bg-emerald-500/15 hover:border-emerald-500/60 shadow-inner shadow-emerald-500/5 active:scale-95 hover:-translate-y-0.5 hover:shadow-emerald-500/20 hover:shadow-lg"
            : "bg-white/2 border-white/7 hover:border-white/20 active:scale-95"
      }`}
    >
      <span
        className={`text-[10px] font-extrabold ${
          status.dup > 0
            ? "text-accent-gold-light"
            : status.have
              ? "text-emerald-400"
              : "text-slate-200"
        }`}
      >
        {sticker.id}
      </span>

      {/* Badge for duplicate stickers */}
      {status.dup > 0 && (
        <span className="absolute top-1 right-1 text-[9px] font-black text-accent-gold bg-accent-gold/15 px-1.5 py-0.5 rounded-full border border-accent-gold/30">
          x{status.dup}
        </span>
      )}

      {/* Badge for owned sticker (no duplicates) */}
      {status.have && status.dup === 0 && (
        <span className="text-[9px] font-black absolute top-1 right-1 text-emerald-400 bg-emerald-500/15 w-4 h-4 rounded-full flex items-center justify-center border border-emerald-500/30">
          ✓
        </span>
      )}
    </div>
  );
}
