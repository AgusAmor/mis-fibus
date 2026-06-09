import { FaShareAlt, FaCheck } from "react-icons/fa";
import { useShareMissing } from "../../hooks/useShareMissing";

// ShareMissingButton Component
// Presentational component that renders the button to share missing stickers.
// Consumes the useShareMissing custom hook for formatting and sharing logic.
export function ShareMissingButton({
  statusFilter,
  albumCode,
  getStickerStatus,
  forceShow = false,
}) {
  const { copied, handleShareMissing, hasMissing } = useShareMissing(getStickerStatus);

  // Render nothing if the missing filter is not active (unless forceShow is true)
  if (!forceShow && statusFilter !== "missing") return null;

  return (
    <button
      onClick={handleShareMissing}
      disabled={!hasMissing}
      className={`w-full rounded-xl py-3 px-4 font-montserrat font-extrabold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 ${
        !hasMissing
          ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
          : copied
            ? "bg-success text-white border-2 border-success/45 hover:shadow-lg hover:shadow-success/15 active:scale-[0.98] cursor-pointer"
            : "bg-primary hover:bg-primary/90 text-white border-2 border-accent/45 hover:border-accent hover:shadow-lg hover:shadow-primary/15 active:scale-[0.98] cursor-pointer"
      }`}
    >
      {copied ? (
        <>
          <FaCheck className="text-sm text-white/80 animate-bounce" />{" "}
          ¡Copiado al portapapeles!
        </>
      ) : (
        <>
          <FaShareAlt
            className={`text-sm ${hasMissing ? "text-accent" : "text-slate-400"}`}
          />{" "}
          Compartir faltantes
        </>
      )}
    </button>
  );
}

