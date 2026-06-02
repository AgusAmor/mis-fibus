export function StatsPanel({ stats }) {
  return (
    <section className="bg-linear-to-b from-primary-emerald-light/10 to-primary-emerald-dark/30 border border-white/10 rounded-3xl p-6 m-4 relative overflow-hidden shadow-xl shadow-black/25">
      <div className="absolute -top-1/2 -right-1/5 w-75 h-75 rounded-full bg-linear-to-br from-accent-gold/15 to-transparent blur-3xl z-0"></div>

      <div className="relative z-10 flex flex-col gap-2.5">
        <span className="text-xs font-bold text-accent-gold uppercase tracking-wider">
          Progreso del Álbum
        </span>

        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-black bg-linear-to-r from-white to-slate-200 bg-clip-text text-transparent tracking-tight">
            {stats.percent}%
          </span>
          <span className="text-xs text-slate-400">completado</span>
        </div>

        <div className="bg-white/5 border border-white/10 h-4.5 rounded-full overflow-hidden shadow-inner shadow-black/40">
          <div
            className="h-full bg-linear-to-r from-emerald-500 to-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all duration-800 rounded-full"
            style={{ width: `${stats.percent}%` }}
          ></div>
        </div>

        <div className="flex justify-between items-center text-xs text-slate-400 mt-0.5">
          <span>
            Tenemos {stats.owned} de {stats.total} figuritas
          </span>
          <span className="text-accent-gold font-medium">
            🔁 {stats.dups} repetidas
          </span>
        </div>
      </div>
    </section>
  );
}
