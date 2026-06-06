import {
  FaSync,
  FaCircle,
  FaExclamationTriangle,
  FaTimesCircle,
} from "react-icons/fa";

/**
 * SyncStatusBadge — maps the current Firestore sync status string to a styled badge element.
 *
 * Responsibilities:
 *  - Render the correct icon and label for each sync state.
 *  - Apply the appropriate color styling per state.
 *
 * @param {{ syncStatus: 'disconnected'|'syncing'|'synced'|'offline'|'error' }} props
 */
export function SyncStatusBadge({ syncStatus }) {
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
}
