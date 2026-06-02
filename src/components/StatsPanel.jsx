import { FaSync } from "react-icons/fa";

// Statistics panel showing general album progress, percentages, and duplicate counts.
export function StatsPanel({ stats }) {
  const isCompleted = parseFloat(stats.percent) >= 100;

  return (
    <section className="bg-white border border-slate-100 rounded-3xl p-6 m-4 relative overflow-hidden shadow-lg shadow-slate-100/80">
      {/* Subtle brand color accent background glow */}
      <div className="absolute -top-1/2 -right-1/5 w-75 h-75 rounded-full bg-linear-to-br from-primary/5 to-transparent blur-3xl z-0"></div>

      <div className="relative z-10 flex flex-col gap-3">
        <span className="text-xs font-bold text-primary font-montserrat uppercase tracking-wider">
          Progreso del Álbum
        </span>

        <div className="flex items-baseline gap-1.5">
          <span className="text-5xl font-bebas font-extrabold text-slate-800 tracking-tight leading-none">
            {stats.percent}%
          </span>
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider font-inter">
            completado
          </span>
        </div>

        {/* Brand progress bar */}
        <div className="bg-slate-100 border border-slate-200/60 h-4.5 rounded-full overflow-hidden p-0.5">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              isCompleted
                ? "bg-success shadow-[0_0_12px_rgba(0,166,81,0.25)]"
                : "bg-primary shadow-[0_0_12px_rgba(0,57,166,0.25)]"
            }`}
            style={{ width: `${stats.percent}%` }}
          ></div>
        </div>

        <div className="flex justify-between items-center text-xs text-slate-500 font-semibold mt-1">
          <span className="flex items-center gap-1">
            <strong className="font-bebas text-base text-slate-800 leading-none">
              {stats.owned}
            </strong>{" "}
            de{" "}
            <strong className="font-bebas text-base text-slate-800 leading-none">
              {stats.total}
            </strong>
          </span>
          <span className="text-secondary flex items-center gap-1.5 bg-secondary/5 px-2.5 py-1 rounded-full border border-secondary/10 font-bold uppercase tracking-wider text-[10px]">
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
