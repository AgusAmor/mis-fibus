import {
  FaTrophy,
  FaSync,
  FaCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaQuestionCircle,
} from "react-icons/fa";

// Header component displaying the app title, help button, and real-time sync status indicator.
export function Header({ syncStatus, onOpenHelp }) {
  const getSyncIcon = () => {
    switch (syncStatus) {
      case "syncing":
        return (
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide bg-white/15 text-white flex items-center gap-1.5">
            <FaSync className="animate-spin text-[10px]" /> Sincronizando...
          </span>
        );
      case "synced":
        return (
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide bg-white/20 text-white border border-white/30 flex items-center gap-1.5">
            <FaCircle className="text-emerald-400 text-[8px]" /> En Línea
          </span>
        );
      case "offline":
        return (
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide bg-accent/25 text-amber-300 border border-accent/30 flex items-center gap-1.5">
            <FaExclamationTriangle className="text-[10px]" /> Offline
          </span>
        );
      case "error":
        return (
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide bg-secondary/25 text-white border border-secondary/30 flex items-center gap-1.5">
            <FaTimesCircle className="text-[10px]" /> Error
          </span>
        );
      default:
        return (
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide bg-white/5 text-white/50 flex items-center gap-1.5">
            <FaCircle className="text-white/30 text-[8px]" /> Desconectado
          </span>
        );
    }
  };

  return (
    <header className="flex justify-between items-center px-4 py-4.5 bg-primary text-white sticky top-0 z-50 shadow-md">
      <div className="flex items-center gap-2">
        <img src="/logo-fibus.png" alt="Logo Fibus" className="h-15 w-auto" />
        <div>
          <h1 className="text-xl font-montserrat font-extrabold tracking-wider text-white">
            MIS FIBUS
          </h1>
        </div>
      </div>
      <div className="flex items-center gap-2.5">
        <button
          onClick={onOpenHelp}
          className="text-white/85 hover:text-white transition-colors cursor-pointer p-1 rounded-full hover:bg-white/10 flex items-center justify-center"
          title="Ayuda e Instrucciones"
          aria-label="Ayuda"
        >
          <FaQuestionCircle className="text-lg" />
        </button>
        {getSyncIcon()}
      </div>
    </header>
  );
}
