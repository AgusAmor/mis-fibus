import { SettingsPanel } from "./SettingsPanel";

// Footer component showing the current room/album code and toggleable SettingsPanel.
export function Footer({
  albumCode,
  setAlbumCode,
  showSettings,
  setShowSettings,
}) {
  return (
    <footer className="mt-8 pt-6 border-t border-white/10 flex flex-col gap-4 items-center">
      {/* Room Info and Settings toggle button */}
      <div className="flex items-center justify-between w-full max-w-150 px-4">
        <span className="text-xs text-slate-400">
          Sala:{" "}
          <strong className="text-white uppercase tracking-wider">
            {albumCode}
          </strong>
        </span>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="text-xs font-semibold py-1.5 px-3 rounded-lg border border-white/10 hover:border-white/25 bg-white/2 hover:bg-white/5 text-slate-300 hover:text-white cursor-pointer transition-all duration-300"
        >
          {showSettings ? "✕ Ocultar Ajustes" : "⚙️ Cambiar Sala"}
        </button>
      </div>

      {/* Settings Panel inside the footer area */}
      <SettingsPanel
        showSettings={showSettings}
        albumCode={albumCode}
        setAlbumCode={setAlbumCode}
      />

      <div className="text-center mt-2">
        <p className="text-[10px] text-slate-400 m-0">
          MIS-FIBUS 2026 &copy;&nbsp; | Álbum Único Compartido en Tiempo Real
        </p>
      </div>
    </footer>
  );
}
