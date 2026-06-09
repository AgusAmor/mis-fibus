import { FaShareAlt, FaCheck } from "react-icons/fa";
import { useShareDuplicates } from "../../hooks/useShareDuplicates";

// ShareDuplicatesButton Component
// Presentational component that renders the button to share duplicate stickers.
// Consumes the useShareDuplicates custom hook for formatting and sharing logic.
export function ShareDuplicatesButton({
  statusFilter,
  albumCode,
  getStickerStatus,
  forceShow = false,
}) {
  const { copied, handleShareRepeated, hasDuplicates } = useShareDuplicates(getStickerStatus);

  // Render nothing if the duplicates filter is not active (unless forceShow is true)
  if (!forceShow && statusFilter !== "duplicated") return null;

  return (
    <button
      onClick={handleShareRepeated}
      disabled={!hasDuplicates}
      className={`w-full rounded-xl py-3 px-4 font-montserrat font-extrabold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 ${
        !hasDuplicates
          ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
          : copied
            ? "bg-success text-white border-2 border-success/45 hover:shadow-lg hover:shadow-success/15 active:scale-[0.98] cursor-pointer"
            : "bg-secondary hover:bg-secondary/90 text-white border-2 border-accent/45 hover:border-accent hover:shadow-lg hover:shadow-secondary/15 active:scale-[0.98] cursor-pointer"
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
            className={`text-sm ${hasDuplicates ? "text-accent" : "text-slate-400"}`}
          />{" "}
          Compartir repetidas
        </>
      )}
    </button>
  );
}

