import { FaQuestionCircle } from "react-icons/fa";
import { SyncStatusBadge } from "./components/SyncStatusBadge";

/**
 * Header — renders the sticky top navigation bar.
 *
 * Responsibilities:
 *  - Display the app logo and title.
 *  - Provide a help button to open the help modal.
 *  - Show the current sync status via SyncStatusBadge.
 */
export function Header({ syncStatus, onOpenHelp }) {
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
        <SyncStatusBadge syncStatus={syncStatus} />
      </div>
    </header>
  );
}
