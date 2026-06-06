/**
 * useFilteredStickers — returns a memoizable filter function scoped to the current
 * status filter and search query.
 *
 * Responsibilities:
 *  - Apply status-based filtering (all / missing / owned / duplicated / favorite).
 *  - Apply text-based search filtering against sticker ID and team name.
 *
 * @param {string} statusFilter - Active status filter key.
 * @param {string} searchQuery - Active search string.
 * @param {Function} getStickerStatus - Function returning { have, dup, favorite } for a sticker ID.
 * @returns {Function} getFilteredStickers — accepts a sticker array and returns the filtered subset.
 */
export function useFilteredStickers(
  statusFilter,
  searchQuery,
  getStickerStatus,
) {
  const getFilteredStickers = (stickerList) => {
    return stickerList.filter((s) => {
      const status = getStickerStatus(s.id);

      // Text search against sticker code and team name (case-insensitive)
      const matchesSearch =
        s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.team.toLowerCase().includes(searchQuery.toLowerCase());

      // Status-based filter
      let matchesStatus = true;
      if (statusFilter === "missing") {
        matchesStatus = !status.have;
      } else if (statusFilter === "owned") {
        matchesStatus = status.have;
      } else if (statusFilter === "duplicated") {
        matchesStatus = status.dup > 0;
      } else if (statusFilter === "favorite") {
        matchesStatus = status.favorite;
      }

      return matchesSearch && matchesStatus;
    });
  };

  return getFilteredStickers;
}
