import { FaCog } from "react-icons/fa";

// Settings panel component where users can view/change the shared album room code.
export function SettingsPanel({ showSettings, albumCode, setAlbumCode }) {
  if (!showSettings) return null;

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
        <input
          type="text"
          value={albumCode}
          onChange={(e) => setAlbumCode(e.target.value)}
          placeholder="ej. nuestro_album"
          className="bg-slate-50 border border-slate-200 text-slate-800 rounded-xl p-3 text-sm outline-none focus:border-primary focus:shadow-[0_0_8px_rgba(0,57,166,0.15)] transition-all duration-300"
        />
      </div>
    </section>
  );
}
