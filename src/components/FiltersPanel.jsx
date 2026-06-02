import { FaSearch, FaTimes } from "react-icons/fa";

// Filters and search panel component for filtering stickers by query, status, or group.
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
      <div className="relative bg-white border border-slate-200 rounded-xl flex items-center px-3 focus-within:border-primary focus-within:shadow-[0_0_8px_rgba(0,57,166,0.15)] transition-all duration-300 shadow-xs">
        <FaSearch className="text-slate-400 text-xs" />
        <input
          type="text"
          placeholder="Search by code (e.g. ARG10, FWC04, MEX)..."
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
          <option value="all">All Stickers</option>
          <option value="missing">Missing</option>
          <option value="owned">Owned</option>
          <option value="duplicated">Duplicates</option>
        </select>

        <select
          value={sectionFilter}
          onChange={(e) => setSectionFilter(e.target.value)}
          className="flex-1 bg-white border border-slate-200 text-slate-700 rounded-xl p-2.5 text-xs font-semibold outline-none cursor-pointer focus:border-primary focus:shadow-[0_0_8px_rgba(0,57,166,0.15)] transition-all duration-300 shadow-xs"
        >
          <option value="all">All Sections</option>
          <option value="SPECIAL">FIFA World Cup 2026 & Host Countries</option>
          <option value="FWC_HISTORY">FIFA World Cup History</option>
          <option value="CC">Coca-Cola</option>
          {["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"].map(
            (g) => (
              <option key={g} value={g}>
                Group {g}
              </option>
            ),
          )}
        </select>
      </div>
    </div>
  );
}
