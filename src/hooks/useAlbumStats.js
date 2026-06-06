import originalStickers from "../../fibus_album.json";

/**
 * useAlbumStats — derives album completion statistics from the sticker state map.
 *
 * Responsibilities:
 *  - Calculate total sticker count, owned count, completion percentage, and duplicate total.
 *
 * @param {Object} stickersState - Map of sticker IDs to their { have, duplicated } state.
 * @returns {{ total: number, owned: number, percent: string, dups: number }}
 */
export function useAlbumStats(stickersState) {
  let owned = 0;
  let dups = 0;

  originalStickers.forEach((s) => {
    const state = stickersState[s.id] || {};
    if (state.have) owned++;
    dups += state.duplicated || 0;
  });

  return {
    total: originalStickers.length,
    owned,
    percent: ((owned / originalStickers.length) * 100).toFixed(1),
    dups,
  };
}
