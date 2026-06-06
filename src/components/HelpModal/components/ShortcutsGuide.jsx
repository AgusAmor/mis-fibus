import { FaSync } from "react-icons/fa";

/**
 * ShortcutsGuide — renders the visual guide for StatsPanel shortcuts.
 *
 * Responsibilities:
 *  - Display how tapping the progress bar or duplicates badge behaves.
 *  - Purely presentational; no props, no state, no side effects.
 */
export function ShortcutsGuide() {
  return (
    <div>
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
        Atajos del Panel
      </h3>
      <div className="flex flex-col gap-2.5">
        {/* Reset Filters Shortcut */}
        <div className="flex gap-3 bg-white p-3 rounded-2xl border border-slate-100 items-start">
          <div className="flex flex-col gap-1 shrink-0 mt-1 w-[80px]">
            <span className="text-[8px] font-bold text-primary font-montserrat uppercase tracking-wider leading-none">
              Progreso
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bebas font-extrabold text-slate-800 leading-none">
                45%
              </span>
            </div>
            <div className="w-full bg-slate-100 border border-slate-200/60 h-2.5 rounded-full overflow-hidden mt-0.5 p-[1px]">
              <div className="h-full bg-primary rounded-full w-[45%]"></div>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-700 m-0 uppercase tracking-wide">
              Restablecer Filtros
            </h4>
            <p className="text-[11px] text-slate-500 m-0 mt-0.5 leading-relaxed font-medium">
              Toca la sección de <strong>Progreso</strong> o el porcentaje completado para limpiar los filtros y volver a la vista general.
            </p>
          </div>
        </div>

        {/* View Duplicates Shortcut */}
        <div className="flex gap-3 bg-white p-3 rounded-2xl border border-slate-100 items-center">
          <div className="shrink-0 w-[80px] flex justify-center">
            <span className="text-secondary flex items-center gap-1 bg-secondary/5 px-2.5 py-1 rounded-full border border-secondary/10 font-bold uppercase tracking-wider text-[9px] select-none shadow-sm">
              <FaSync className="text-[8px]" />{" "}
              <strong className="font-bebas text-base leading-none text-secondary">
                15
              </strong>{" "}
              rep.
            </span>
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-700 m-0 uppercase tracking-wide">
              Filtrar Repetidas
            </h4>
            <p className="text-[11px] text-slate-500 m-0 mt-0.5 leading-relaxed font-medium">
              Toca la cantidad de <strong>repetidas</strong> para ver al instante sólo las figuritas que tienes duplicadas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
