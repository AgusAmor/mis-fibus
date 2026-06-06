import { SettingsPanel } from "./components/SettingsPanel";
import { FaCog, FaTimes } from "react-icons/fa";

// Footer component showing the current room/album code and toggleable SettingsPanel.
export function Footer({
  albumCode,
  setAlbumCode,
  showSettings,
  setShowSettings,
}) {
  return (
    <footer className="mt-8 pt-6 border-t border-slate-200 flex flex-col gap-4 items-center">
      {/* Room Info and Settings toggle button */}
      <div className="flex items-center justify-between w-full max-w-150 px-4">
        <span className="text-xs text-slate-500 font-semibold uppercase tracking-wide">
          Sala:{" "}
          <strong className="text-primary font-montserrat tracking-wider normal-case ml-1">
            {albumCode}
          </strong>
        </span>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="text-xs font-bold py-1.5 px-3 rounded-lg border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-800 cursor-pointer transition-all duration-300 shadow-xs flex items-center gap-1.5"
        >
          {showSettings ? (
            <>
              <FaTimes className="text-[10px]" /> Ocultar Ajustes
            </>
          ) : (
            <>
              <FaCog className="text-[10px]" /> Cambiar Sala
            </>
          )}
        </button>
      </div>

      {/* Settings Panel inside the footer area */}
      <SettingsPanel
        showSettings={showSettings}
        albumCode={albumCode}
        setAlbumCode={setAlbumCode}
      />

      <div className="text-center mt-2 mb-6">
        <p className="text-[10px] text-slate-400 font-medium m-0">
          MIS-FIBUS 2026 &copy;&nbsp; | Único Álbum Compartido en Tiempo Real
        </p>
      </div>
    </footer>
  );
}
