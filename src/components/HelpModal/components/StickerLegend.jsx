import { FaCheck } from "react-icons/fa";

/**
 * StickerLegend — renders the four sticker state example cards shown in the Help Modal.
 *
 * Responsibilities:
 *  - Display a visual legend for Faltante, Obtenida, Repetida, and Favorita states.
 */
export function StickerLegend() {
  return (
    <div>
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
        Estados de las Figuritas
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white border border-slate-100 p-4.5 rounded-2xl shadow-xs justify-items-center">
        {/* Missing state example */}
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">
            Faltante
          </span>
          <div className="w-16 h-18 bg-white text-slate-400 border border-slate-200/85 rounded-xl flex flex-col items-center justify-center select-none shadow-xs">
            <span className="font-bebas text-sm leading-none">ARG17</span>
            <span className="font-medium text-center text-[6px] px-1 mt-0.5 leading-tight opacity-85">
              Lionel Messi
            </span>
          </div>
        </div>

        {/* Owned state example */}
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-[9px] font-bold text-success uppercase tracking-wide">
            Obtenida
          </span>
          <div className="w-16 h-18 bg-[#E8F8F0] text-success border border-success/60 rounded-xl flex flex-col items-center justify-center select-none relative shadow-xs">
            <span className="font-bebas text-sm leading-none">ARG17</span>
            <span className="font-medium text-center text-[6px] px-1 mt-0.5 leading-tight opacity-85">
              Lionel Messi
            </span>
            <span className="absolute top-1 right-1 text-[6px] bg-success/10 border border-success/30 text-success w-3.5 h-3.5 rounded-full flex items-center justify-center">
              <FaCheck className="text-[5px]" />
            </span>
          </div>
        </div>

        {/* Duplicate state example */}
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-[9px] font-bold text-accent uppercase tracking-wide">
            Repetida
          </span>
          <div className="w-16 h-18 bg-[#FEF8E7] text-accent border border-accent/70 rounded-xl flex flex-col items-center justify-center select-none relative shadow-xs">
            <span className="font-bebas text-sm leading-none">ARG17</span>
            <span className="font-medium text-center text-[6px] px-1 mt-0.5 leading-tight opacity-85">
              Lionel Messi
            </span>
            <span className="absolute top-1 right-1 text-[8px] bg-accent/10 border border-accent/30 text-accent px-1.5 py-0.5 rounded-full font-bebas leading-none">
              x1
            </span>
          </div>
        </div>

        {/* Favorite state example */}
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-[9px] font-bold text-amber-600 uppercase tracking-wide">
            Favorita
          </span>
          <div className="w-16 h-18 bg-[#E8F8F0] text-success border-2 border-amber-500 shadow-md shadow-amber-500/25 rounded-xl flex flex-col items-center justify-center select-none relative">
            <span className="font-bebas text-sm leading-none">ARG17</span>
            <span className="font-medium text-center text-[6px] px-1 mt-0.5 leading-tight opacity-85">
              Lionel Messi
            </span>
            <span className="absolute top-1 right-1 text-[6px] bg-success/10 border border-success/30 text-success w-3.5 h-3.5 rounded-full flex items-center justify-center">
              <FaCheck className="text-[5px]" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
