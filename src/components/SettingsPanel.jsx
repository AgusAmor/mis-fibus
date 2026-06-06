import { useState, useEffect } from "react";
import { FaCog } from "react-icons/fa";
import { IoLogIn } from "react-icons/io5";

// Settings panel component where users can view/change the shared album room code.
export function SettingsPanel({ showSettings, albumCode, setAlbumCode }) {
  if (!showSettings) return null;

  const [localRoom, setLocalRoom] = useState(albumCode);

  // Keep local state in sync if global albumCode changes from elsewhere (e.g. storage listener)
  useEffect(() => {
    setLocalRoom(albumCode);
  }, [albumCode]);

  // Trigger global albumCode update only when explicit confirmation is made (Save button clicked)
  const handleSave = () => {
    const cleanCode = localRoom.trim().toLowerCase();
    if (cleanCode && cleanCode !== "sala_predeterminada") {
      setAlbumCode(cleanCode);
    }
  };

  return (
    <section className="bg-white border border-slate-200 rounded-3xl p-5 mx-4 flex flex-col gap-3 shadow-lg shadow-slate-100/50 transition-all duration-500 w-full max-w-150">
      <h3 className="m-0 text-sm font-montserrat font-extrabold text-primary uppercase tracking-wide flex items-center gap-1.5">
        <FaCog className="text-xs" /> Configuración del Álbum
      </h3>
      <p className="text-xs text-slate-500 m-0 leading-relaxed font-medium">
        Compartí este código de sala para ver y registrar sus figuritas en
        tiempo real con alguien más.
      </p>
      <div className="flex flex-col gap-1.5 mt-1">
        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
          Código de Sala
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={localRoom}
            onChange={(e) => setLocalRoom(e.target.value)}
            placeholder="ej. nuestro_album"
            className="flex-1 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl p-3 text-sm outline-none focus:border-primary focus:shadow-[0_0_8px_rgba(0,57,166,0.15)] transition-all duration-300"
          />
          <button
            onClick={handleSave}
            disabled={
              !localRoom.trim() ||
              localRoom.trim().toLowerCase() === albumCode.toLowerCase()
            }
            className={`px-4 rounded-xl flex items-center justify-center gap-1.5 text-xs font-montserrat font-extrabold uppercase tracking-wide transition-all duration-300 ${
              !localRoom.trim() ||
              localRoom.trim().toLowerCase() === albumCode.toLowerCase()
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : "bg-primary hover:bg-primary/95 text-white hover:shadow-md cursor-pointer"
            }`}
          >
            <IoLogIn className="text-xs" /> Entrar
          </button>
        </div>
      </div>
    </section>
  );
}
