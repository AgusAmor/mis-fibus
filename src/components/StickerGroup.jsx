import { StickerCard } from "./StickerCard";
import { FaStar, FaFutbol, FaChevronUp, FaChevronDown, FaFlag } from "react-icons/fa";

// Flag color gradients for all 48 countries
const FLAG_GRADIENTS = {
  MEX: "linear-gradient(to bottom, #006847 33%, #FFFFFF 33% 66%, #CE1126 66%)",
  RSA: "linear-gradient(to bottom, #E21836, #007A3D, #002395)",
  KOR: "linear-gradient(to bottom, #CD2E3A, #FFFFFF, #0A1D37)",
  CZE: "linear-gradient(to bottom, #11457E, #FFFFFF, #D7141A)",
  CAN: "linear-gradient(to bottom, #FF0000, #FFFFFF, #FF0000)",
  BIH: "linear-gradient(to bottom, #002395, #FECB00, #002395)",
  QAT: "linear-gradient(to bottom, #FFFFFF, #8D1B3D)",
  SUI: "linear-gradient(to bottom, #DA291C, #FFFFFF, #DA291C)",
  BRA: "linear-gradient(to bottom, #009739, #FEDF00, #012169)",
  MAR: "linear-gradient(to bottom, #C1272D, #006233, #C1272D)",
  HAI: "linear-gradient(to bottom, #00209F, #D21034)",
  SCO: "linear-gradient(to bottom, #0065BF, #FFFFFF, #0065BF)",
  USA: "linear-gradient(to bottom, #0A3161, #FFFFFF, #B31942)",
  PAR: "linear-gradient(to bottom, #D52B1E, #FFFFFF, #0038A8)",
  AUS: "linear-gradient(to bottom, #00008B, #FFFFFF, #FF0000)",
  TUR: "linear-gradient(to bottom, #E30A17, #FFFFFF, #E30A17)",
  GER: "linear-gradient(to bottom, #000000, #DD0000, #FFCC00)",
  CUW: "linear-gradient(to bottom, #002B7F, #F9E814, #002B7F)",
  CIV: "linear-gradient(to bottom, #F77F00, #FFFFFF, #FC3D21)",
  ECU: "linear-gradient(to bottom, #FFDD00, #001489, #ED1C24)",
  NED: "linear-gradient(to bottom, #AE1C28, #FFFFFF, #21468B)",
  JPN: "linear-gradient(to bottom, #FFFFFF, #BC002D, #FFFFFF)",
  SWE: "linear-gradient(to bottom, #006AA7, #FECC00, #006AA7)",
  TUN: "linear-gradient(to bottom, #E20909, #FFFFFF, #E20909)",
  BEL: "linear-gradient(to bottom, #000000, #FDDA24, #EF3340)",
  EGY: "linear-gradient(to bottom, #C09300, #FFFFFF, #000000)",
  IRN: "linear-gradient(to bottom, #239B56, #FFFFFF, #DA291C)",
  NZL: "linear-gradient(to bottom, #000000, #FFFFFF, #000000)",
  ESP: "linear-gradient(to bottom, #AD1519, #FABD00, #AD1519)",
  CPV: "linear-gradient(to bottom, #002A8F, #FFFFFF, #CE1126)",
  KSA: "linear-gradient(to bottom, #006C35, #FFFFFF, #006C35)",
  URU: "linear-gradient(to bottom, #0038A8, #FFFFFF, #FEDF00)",
  FRA: "linear-gradient(to bottom, #002654, #FFFFFF, #ED2939)",
  SEN: "linear-gradient(to bottom, #00853F, #FDEF42, #E31B23)",
  IRQ: "linear-gradient(to bottom, #FF0000, #FFFFFF, #000000)",
  NOR: "linear-gradient(to bottom, #EF2B2D, #00205B, #EF2B2D)",
  ARG: "linear-gradient(to bottom, #74ACDF, #FFFFFF, #74ACDF)",
  ALG: "linear-gradient(to bottom, #006633, #FFFFFF, #D21034)",
  AUT: "linear-gradient(to bottom, #ED2939, #FFFFFF, #ED2939)",
  JOR: "linear-gradient(to bottom, #000000, #FFFFFF, #D21034)",
  POR: "linear-gradient(to bottom, #046A38, #DA291C, #DA291C)",
  COD: "linear-gradient(to bottom, #007FFF, #F4B400, #CE1126)",
  UZB: "linear-gradient(to bottom, #00A3E0, #FFFFFF, #1FAE51)",
  COL: "linear-gradient(to bottom, #FCD116, #0038A8, #C8102E)",
  ENG: "linear-gradient(to bottom, #FFFFFF, #CE1126, #FFFFFF)",
  CRO: "linear-gradient(to bottom, #FF0000, #FFFFFF, #171796)",
  GHA: "linear-gradient(to bottom, #FCD116, #006B3F, #DA291C)",
  PAN: "linear-gradient(to bottom, #005293, #FFFFFF, #D21034)",
};

// Selection metadata including flags and full names
const COUNTRY_METADATA = {
  MEX: { name: "México", confederation: "CONCACAF" },
  RSA: { name: "Sudáfrica", confederation: "CAF" },
  KOR: { name: "Corea del Sur", confederation: "AFC" },
  CZE: { name: "R. Checa", confederation: "UEFA" },
  CAN: { name: "Canadá", confederation: "CONCACAF" },
  BIH: { name: "Bosnia", confederation: "UEFA" },
  QAT: { name: "Catar", confederation: "AFC" },
  SUI: { name: "Suiza", confederation: "UEFA" },
  BRA: { name: "Brasil", confederation: "CONMEBOL" },
  MAR: { name: "Marruecos", confederation: "CAF" },
  HAI: { name: "Haití", confederation: "CONCACAF" },
  SCO: { name: "Escocia", confederation: "UEFA" },
  USA: { name: "EE. UU.", confederation: "CONCACAF" },
  PAR: { name: "Paraguay", confederation: "CONMEBOL" },
  AUS: { name: "Australia", confederation: "AFC" },
  TUR: { name: "Turquía", confederation: "UEFA" },
  GER: { name: "Alemania", confederation: "UEFA" },
  CUW: { name: "Curazao", confederation: "CONCACAF" },
  CIV: { name: "Costa de Marfil", confederation: "CAF" },
  ECU: { name: "Ecuador", confederation: "CONMEBOL" },
  NED: { name: "Países Bajos", confederation: "UEFA" },
  JPN: { name: "Japón", confederation: "AFC" },
  SWE: { name: "Suecia", confederation: "UEFA" },
  TUN: { name: "Túnez", confederation: "CAF" },
  BEL: { name: "Bélgica", confederation: "UEFA" },
  EGY: { name: "Egipto", confederation: "CAF" },
  IRN: { name: "Irán", confederation: "AFC" },
  NZL: { name: "Nueva Zelanda", confederation: "OFC" },
  ESP: { name: "España", confederation: "UEFA" },
  CPV: { name: "Cabo Verde", confederation: "CAF" },
  KSA: { name: "Arabia Saudita", confederation: "AFC" },
  URU: { name: "Uruguay", confederation: "CONMEBOL" },
  FRA: { name: "Francia", confederation: "UEFA" },
  SEN: { name: "Senegal", confederation: "CAF" },
  IRQ: { name: "Irak", confederation: "AFC" },
  NOR: { name: "Noruega", confederation: "UEFA" },
  ARG: { name: "Argentina", confederation: "CONMEBOL" },
  ALG: { name: "Argelia", confederation: "CAF" },
  AUT: { name: "Austria", confederation: "UEFA" },
  JOR: { name: "Jordania", confederation: "AFC" },
  POR: { name: "Portugal", confederation: "UEFA" },
  COD: { name: "Rep. Dem. Congo", confederation: "CAF" },
  UZB: { name: "Uzbekistán", confederation: "AFC" },
  COL: { name: "Colombia", confederation: "CONMEBOL" },
  ENG: { name: "Inglaterra", confederation: "UEFA" },
  CRO: { name: "Croacia", confederation: "UEFA" },
  GHA: { name: "Ghana", confederation: "CAF" },
  PAN: { name: "Panamá", confederation: "CONCACAF" },
  SPECIAL: { name: "Especial", confederation: "FIFA" },
  FWC: { name: "Mundial", confederation: "FIFA" },
  CC: { name: "Estadio", confederation: "FIFA" },
};

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
  // Calculate dynamic group completion stats
  const allGroupStickers = isSpecial
    ? stickers
    : countriesList.reduce((acc, cKey) => [...acc, ...(countriesData[cKey] || [])], []);
  const ownedGroupCount = allGroupStickers.filter((s) => getStickerStatus(s.id).have).length;
  const totalGroupCount = allGroupStickers.length;
  const groupPercent = totalGroupCount > 0 ? Math.round((ownedGroupCount / totalGroupCount) * 100) : 0;
  const isGroupCompleted = groupPercent >= 100;

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-md shadow-slate-100/50 flex flex-col">
      {/* Group Accordion Header */}
      <header
        className="flex flex-col gap-2.5 px-5 py-4 cursor-pointer hover:bg-slate-50/50 select-none transition-colors"
        onClick={() => onToggle(groupKey)}
      >
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-3">
            {groupKey === "CC" ? (
              <FaStar className="text-secondary text-base" />
            ) : isSpecial ? (
              <FaStar className="text-accent text-base" />
            ) : (
              <FaFutbol className="text-primary text-base" />
            )}
            <h2 className="text-sm font-montserrat font-extrabold text-slate-800 uppercase tracking-wide">
              {title}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-bebas text-lg text-slate-600 leading-none">{groupPercent}%</span>
            <span className="text-xs text-slate-400">
              {isExpanded ? <FaChevronUp className="text-[10px]" /> : <FaChevronDown className="text-[10px]" />}
            </span>
          </div>
        </div>
        {/* Group Progress Bar */}
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              isGroupCompleted ? "bg-success" : (groupKey === "CC" ? "bg-secondary" : "bg-primary")
            }`}
            style={{ width: `${groupPercent}%` }}
          />
        </div>
      </header>

      {/* Expanded Accordion Body */}
      {isExpanded && (
        <div className="p-4 border-t border-slate-100 bg-slate-50/30 flex flex-col gap-5">
          {isSpecial ? (
            /* Special section layout */
            <>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(65px,1fr))] gap-2.5 sm:grid-cols-[repeat(auto-fill,minmax(70px,1fr))]">
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
                <p className="text-xs text-slate-400 text-center my-2 font-medium">
                  Ninguna figurita coincide con los filtros.
                </p>
              )}
            </>
          ) : (
            /* Regular group stages layout with country subdivisions */
            <div className="flex flex-col gap-6.5">
              {countriesList.map((countryKey) => {
                const countryStickers = countriesData[countryKey] || [];
                const filteredCountryStickers = getFilteredStickers(countryStickers);

                // Calculate progress of this specific country (selection)
                const ownedCountryCount = countryStickers.filter((s) => getStickerStatus(s.id).have).length;
                const totalCountryCount = countryStickers.length;
                const countryPercent = totalCountryCount > 0 ? Math.round((ownedCountryCount / totalCountryCount) * 100) : 0;
                const isCountryCompleted = countryPercent >= 100;

                const countryInfo = COUNTRY_METADATA[countryKey] || { name: countryKey };
                const flagGradient = FLAG_GRADIENTS[countryKey];

                return (
                  <div key={countryKey} className="flex flex-col gap-3 p-3.5 bg-white border border-slate-100 rounded-xl shadow-xs">
                    {/* Country Header (flag gradients + metadata + progress) */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {/* Flag-colored vertical visual capsule */}
                          {flagGradient ? (
                            <span 
                              className="w-1.5 h-6 rounded-full inline-block" 
                              style={{ backgroundImage: flagGradient }}
                            />
                          ) : (
                            <span className="w-1.5 h-6 rounded-full inline-block bg-primary" />
                          )}
                          <h3 className="text-xs font-montserrat font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                            <FaFlag className="text-[10px] text-slate-400" />
                            <span>{countryInfo.name}</span>
                          </h3>
                        </div>
                        {/* Selection progress status in Bebas Neue */}
                        <div className="flex items-center gap-1.5">
                          <span className="font-bebas text-sm text-slate-700 leading-none">
                            {ownedCountryCount}/{totalCountryCount}
                          </span>
                        </div>
                      </div>

                      {/* Selection (country) progress bar */}
                      <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 rounded-full ${
                            isCountryCompleted ? "bg-success" : "bg-primary"
                          }`}
                          style={{ width: `${countryPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Stickers Grid */}
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(65px,1fr))] gap-2 sm:grid-cols-[repeat(auto-fill,minmax(70px,1fr))] mt-1">
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
                      <p className="text-[11px] text-slate-400 italic mt-1 font-medium">
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
