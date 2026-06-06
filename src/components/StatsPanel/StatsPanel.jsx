import { FaSync } from "react-icons/fa";

// Statistics panel showing general album progress, percentages, and duplicate counts.
export function StatsPanel({ stats, onShowDuplicates, onResetFilters }) {
  const isCompleted = parseFloat(stats.percent) >= 100;

  return (
    <section className="bg-white border border-slate-100 rounded-3xl p-6 m-4 relative overflow-hidden shadow-lg shadow-slate-100/80">
      {/* Subtle brand color accent background glow */}
      <div className="absolute -top-1/2 -right-1/5 w-75 h-75 rounded-full bg-linear-to-br from-primary/5 to-transparent blur-3xl z-0"></div>

      <div className="relative z-10 flex flex-col gap-3">
        {/* Clickable Progress Region */}
        <div
          onClick={onResetFilters}
          title="Click para restablecer los filtros y ver el álbum completo"
          className="cursor-pointer group flex flex-col gap-3 select-none"
        >
          <span className="text-xs font-bold text-primary font-montserrat uppercase tracking-wider group-hover:text-primary/80 transition-colors">
            Progreso del Álbum
          </span>

          <div className="flex items-baseline gap-1.5 active:scale-[0.99] transition-transform origin-left">
            <span className="text-5xl font-bebas font-extrabold text-slate-800 group-hover:text-slate-700 tracking-tight leading-none transition-colors">
              {stats.percent}%
            </span>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider font-inter">
              completado
            </span>
          </div>

          {/* Brand progress bar */}
          <div className="bg-slate-100 border border-slate-200/60 h-4.5 rounded-full overflow-hidden p-0.5 group-hover:border-slate-300 transition-colors">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                isCompleted
                  ? "bg-success shadow-[0_0_12px_rgba(0,166,81,0.25)]"
                  : "bg-primary shadow-[0_0_12px_rgba(0,57,166,0.25)]"
              }`}
              style={{ width: `${stats.percent}%` }}
            ></div>
          </div>
        </div>

        <div className="flex justify-between items-center text-xs text-slate-500 font-semibold mt-1">
          <span
            onClick={onResetFilters}
            title="Click para restablecer los filtros y ver el álbum completo"
            className="flex items-center gap-1 cursor-pointer hover:text-slate-700 transition-colors select-none"
          >
            <strong className="font-bebas text-base text-slate-800 leading-none">
              {stats.owned}
            </strong>{" "}
            de{" "}
            <strong className="font-bebas text-base text-slate-800 leading-none">
              {stats.total}
            </strong>
          </span>
          <span
            onClick={onShowDuplicates}
            title="Click para ver todas las repetidas en una cuadrícula"
            className="text-secondary flex items-center gap-1.5 bg-secondary/5 px-2.5 py-1 rounded-full border border-secondary/10 font-bold uppercase tracking-wider text-[10px] cursor-pointer hover:bg-secondary/10 active:scale-95 transition-all duration-200 select-none"
          >
            <FaSync className="text-[9px]" />{" "}
            <strong className="font-bebas text-base leading-none text-secondary">
              {stats.dups}
            </strong>{" "}
            repetidas
          </span>
        </div>
      </div>
    </section>
  );
}
