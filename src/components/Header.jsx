// Header component displaying the app title and the real-time sync status indicator.
export function Header({ syncStatus }) {
  const getSyncIcon = () => {
    switch (syncStatus) {
      case "syncing":
        return (
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide bg-white/10 text-white animate-pulse">
            🔄 Sincronizando...
          </span>
        );
      case "synced":
        return (
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
            🟢 En Línea
          </span>
        );
      case "offline":
        return (
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide bg-amber-500/15 text-amber-400 border border-amber-500/20">
            ⚠️ Modo Offline
          </span>
        );
      case "error":
        return (
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide bg-red-500/15 text-red-400 border border-red-500/20">
            🔴 Error
          </span>
        );
      default:
        return (
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide bg-white/5 text-slate-400">
            ⚪ Desconectado
          </span>
        );
    }
  };

  return (
    <header className="flex justify-between items-center px-4 py-5 border-b border-white/10 bg-primary-emerald-dark/80 backdrop-blur-2xl sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <span className="text-2xl">🏆</span>
        <div>
          <h1 className="text-xl font-extrabold tracking-wider bg-linear-to-r from-white to-accent-gold bg-clip-text text-transparent filter drop-shadow-[0_2px_10px_rgba(212,175,55,0.2)]">
            FIBUS 2026
          </h1>
        </div>
        <span className="text-[9px] font-semibold text-accent-gold border border-accent-gold px-1.5 py-0.5 rounded uppercase tracking-widest ml-1">
          Compartido
        </span>
      </div>
      <div>
        {getSyncIcon()}
      </div>
    </header>
  );
}
