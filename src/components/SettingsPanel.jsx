export function SettingsPanel({ showSettings, albumCode, setAlbumCode }) {
  if (!showSettings) return null;

  return (
    <section className="bg-white/3 border border-white/8 backdrop-blur-xl rounded-3xl p-5 m-4 flex flex-col gap-3 shadow-xl transition-all duration-500">
      <h3 className="m-0 text-sm font-bold text-accent-gold">
        ⚙️ Configuración del Álbum
      </h3>
      <p className="text-xs text-slate-400 m-0 leading-relaxed">
        Ingresen el mismo código de sala compartido en sus respectivos celulares
        para ver y registrar sus figuritas en tiempo real.
      </p>
      <div className="flex flex-col gap-1.5 mt-1">
        <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wide">
          Código de Sala
        </label>
        <input
          type="text"
          value={albumCode}
          onChange={(e) => setAlbumCode(e.target.value)}
          placeholder="ej. nuestro_album"
          className="bg-primary-emerald-dark/80 border border-white/8 text-white rounded-xl p-3 text-sm outline-none focus:border-accent-gold focus:shadow-[0_0_8px_rgba(212,175,55,0.2)] transition-all duration-300"
        />
      </div>
    </section>
  );
}
