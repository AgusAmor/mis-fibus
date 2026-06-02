export function FiltersPanel({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  sectionFilter,
  setSectionFilter,
}) {
  return (
    <div className="flex flex-col gap-3">
      {/* Search Input */}
      <div className="relative bg-white/3 border border-white/6 rounded-xl flex items-center px-3 focus-within:border-accent-gold transition-all duration-300">
        <span className="text-slate-400 text-sm">🔍</span>
        <input
          type="text"
          placeholder="Buscar por código (ej. ARG10, FWC04, MEX)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-transparent border-none text-white text-sm py-3 px-2 w-full outline-none"
        />
        {searchQuery && (
          <button
            className="bg-none border-none text-slate-400 cursor-pointer p-1 hover:text-white"
            onClick={() => setSearchQuery("")}
          >
            ✕
          </button>
        )}
      </div>

      {/* Filter Selectors */}
      <div className="flex gap-2">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="flex-1 bg-primary-emerald-dark/80 border border-white/8 text-slate-200 rounded-xl p-2.5 text-xs font-semibold outline-none cursor-pointer focus:border-accent-gold transition-all duration-300"
        >
          <option value="all">Todas las figuritas</option>
          <option value="missing">Faltantes</option>
          <option value="owned">Tenemos</option>
          <option value="duplicated">Repetidas</option>
        </select>

        <select
          value={sectionFilter}
          onChange={(e) => setSectionFilter(e.target.value)}
          className="flex-1 bg-primary-emerald-dark/80 border border-white/8 text-slate-200 rounded-xl p-2.5 text-xs font-semibold outline-none cursor-pointer focus:border-accent-gold transition-all duration-300"
        >
          <option value="all">Todas las secciones</option>
          <option value="SPECIAL">Especiales & Sedes</option>
          {["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"].map(
            (g) => (
              <option key={g} value={g}>
                Grupo {g}
              </option>
            ),
          )}
        </select>
      </div>
    </div>
  );
}
