import { StickerCard } from "./StickerCard";

// Reusable component representing a group of stickers (Special or standard group stages).
export function StickerGroup({
  groupKey,
  title,
  icon,
  isExpanded,
  onToggle,
  isSpecial,
  stickers = [],
  countriesList = [],
  countriesData = {},
  getFilteredStickers,
  getStickerStatus,
  onShortTap,
  onLongPress,
}) {
  return (
    <div className="border border-white/8 rounded-2xl overflow-hidden bg-white/4">
      {/* Group Header */}
      <header
        className="flex justify-between items-center px-5 py-4 cursor-pointer hover:bg-white/2 select-none"
        onClick={() => onToggle(groupKey)}
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{icon}</span>
          <h2 className="text-sm font-bold text-white">{title}</h2>
        </div>
        <span className="text-xs text-slate-400">
          {isExpanded ? "▲" : "▼"}
        </span>
      </header>

      {/* Group Content */}
      {isExpanded && (
        <div className="p-4 border-t border-white/8 bg-black/15">
          {isSpecial ? (
            /* Special section layout */
            <>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(65px,1fr))] gap-2 sm:grid-cols-[repeat(auto-fill,minmax(70px,1fr))]">
                {getFilteredStickers(stickers).map((sticker) => (
                  <StickerCard
                    key={sticker.id}
                    sticker={sticker}
                    status={getStickerStatus(sticker.id)}
                    onShortTap={onShortTap}
                    onLongPress={onLongPress}
                  />
                ))}
              </div>
              {getFilteredStickers(stickers).length === 0 && (
                <p className="text-xs text-slate-400 text-center my-2">
                  Ninguna figurita coincide con los filtros.
                </p>
              )}
            </>
          ) : (
            /* Regular group stages layout with country subdivisions */
            <div className="flex flex-col gap-6">
              {countriesList.map((countryKey) => {
                const countryStickers = countriesData[countryKey] || [];
                const filteredCountryStickers = getFilteredStickers(countryStickers);

                return (
                  <div key={countryKey} className="flex flex-col">
                    <h3 className="text-xs font-bold text-accent-gold mb-2.5 flex items-center gap-1.5 uppercase tracking-wide">
                      <span>🏳️</span>
                      {countryKey}
                    </h3>
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(65px,1fr))] gap-2 sm:grid-cols-[repeat(auto-fill,minmax(70px,1fr))]">
                      {filteredCountryStickers.map((sticker) => (
                        <StickerCard
                          key={sticker.id}
                          sticker={sticker}
                          status={getStickerStatus(sticker.id)}
                          onShortTap={onShortTap}
                          onLongPress={onLongPress}
                        />
                      ))}
                    </div>
                    {filteredCountryStickers.length === 0 && (
                      <p className="text-[11px] text-slate-400 italic mt-1.5">
                        Ninguna figurita coincide con los filtros.
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
