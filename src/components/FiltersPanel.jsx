import { FaSearch, FaTimes } from "react-icons/fa";

// Filters and search panel component for filtering stickers by query, status, or view mode.
export function FiltersPanel({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  viewMode,
  setViewMode,
}) {
  return (
    <div className="flex flex-col gap-3">
      {/* Search Input */}
      <div className="relative bg-white border border-slate-200 rounded-xl flex items-center px-3 focus-within:border-primary focus-within:shadow-[0_0_8px_rgba(0,57,166,0.15)] transition-all duration-300 shadow-xs">
        <FaSearch className="text-slate-400 text-xs" />
        <input
          type="text"
          placeholder="Buscar por código (ej. ARG10, FWC04, MEX)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-transparent border-none text-slate-800 text-sm py-3 px-2 w-full outline-none"
        />
        {searchQuery && (
          <button
            className="bg-none border-none text-slate-400 cursor-pointer p-1 hover:text-slate-600 transition-colors flex items-center"
            onClick={() => setSearchQuery("")}
          >
            <FaTimes className="text-[10px]" />
          </button>
        )}
      </div>

      {/* Filter Selectors */}
      <div className="flex gap-2">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="flex-1 bg-white border border-slate-200 text-slate-700 rounded-xl p-2.5 text-xs font-semibold outline-none cursor-pointer focus:border-primary focus:shadow-[0_0_8px_rgba(0,57,166,0.15)] transition-all duration-300 shadow-xs"
        >
          <option value="all">Todas</option>
          <option value="missing">Faltantes</option>
          <option value="owned">Obtenidas</option>
          <option value="duplicated">Repetidas</option>
        </select>

        <select
          value={viewMode}
          onChange={(e) => setViewMode(e.target.value)}
          className="flex-1 bg-white border border-slate-200 text-slate-700 rounded-xl p-2.5 text-xs font-semibold outline-none cursor-pointer focus:border-primary focus:shadow-[0_0_8px_rgba(0,57,166,0.15)] transition-all duration-300 shadow-xs"
        >
          <option value="album">Álbum</option>
          <option value="teams">Equipos</option>
          <option value="specials">Especiales / Extras</option>
          <option value="flat">Continua</option>
        </select>
      </div>
    </div>
  );
}
