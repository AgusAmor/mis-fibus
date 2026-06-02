import { useState } from "react";
import { StickerCard } from "./StickerCard";
import {
  FaStar,
  FaFutbol,
  FaChevronUp,
  FaChevronDown,
  FaFlag,
} from "react-icons/fa";

// Raw flag colors for all 48 countries
const FLAG_GRADIENTS = {
  MEX: ["#006847", "#FFFFFF", "#CE1126"],
  RSA: ["#E21836", "#007A3D", "#002395"],
  KOR: ["#CD2E3A", "#FFFFFF", "#0A1D37"],
  CZE: ["#11457E", "#FFFFFF", "#D7141A"],
  CAN: ["#FF0000", "#FFFFFF", "#FF0000"],
  BIH: ["#002395", "#FECB00", "#002395"],
  QAT: ["#FFFFFF", "#8D1B3D", "#8D1B3D"],
  SUI: ["#DA291C", "#FFFFFF", "#DA291C"],
  BRA: ["#009739", "#FEDF00", "#012169"],
  MAR: ["#C1272D", "#006233", "#C1272D"],
  HAI: ["#00209F", "#D21034", "#00209F"],
  SCO: ["#0065BF", "#FFFFFF", "#0065BF"],
  USA: ["#0A3161", "#FFFFFF", "#B31942"],
  PAR: ["#D52B1E", "#FFFFFF", "#0038A8"],
  AUS: ["#00008B", "#FFFFFF", "#FF0000"],
  TUR: ["#E30A17", "#FFFFFF", "#E30A17"],
  GER: ["#000000", "#DD0000", "#FFCC00"],
  CUW: ["#002B7F", "#F9E814", "#002B7F"],
  CIV: ["#F77F00", "#FFFFFF", "#FC3D21"],
  ECU: ["#FFDD00", "#001489", "#ED1C24"],
  NED: ["#AE1C28", "#FFFFFF", "#21468B"],
  JPN: ["#FFFFFF", "#BC002D", "#FFFFFF"],
  SWE: ["#006AA7", "#FECC00", "#006AA7"],
  TUN: ["#E20909", "#FFFFFF", "#E20909"],
  BEL: ["#000000", "#FDDA24", "#EF3340"],
  EGY: ["#C09300", "#FFFFFF", "#000000"],
  IRN: ["#239B56", "#FFFFFF", "#DA291C"],
  NZL: ["#000000", "#FFFFFF", "#000000"],
  ESP: ["#AD1519", "#FABD00", "#00568F"],
  CPV: ["#002A8F", "#FFFFFF", "#CE1126"],
  KSA: ["#006C35", "#FFFFFF", "#006C35"],
  URU: ["#0038A8", "#FFFFFF", "#FEDF00"],
  FRA: ["#002654", "#FFFFFF", "#ED2939"],
  SEN: ["#00853F", "#FDEF42", "#E31B23"],
  IRQ: ["#FF0000", "#FFFFFF", "#000000"],
  NOR: ["#EF2B2D", "#00205B", "#EF2B2D"],
  ARG: ["#74ACDF", "#FFFFFF", "#74ACDF"],
  ALG: ["#006633", "#FFFFFF", "#D21034"],
  AUT: ["#ED2939", "#FFFFFF", "#ED2939"],
  JOR: ["#000000", "#FFFFFF", "#D21034"],
  POR: ["#046A38", "#DA291C", "#DA291C"],
  COD: ["#007FFF", "#F4B400", "#CE1126"],
  UZB: ["#00A3E0", "#FFFFFF", "#1FAE51"],
  COL: ["#FCD116", "#0038A8", "#C8102E"],
  ENG: ["#FFFFFF", "#CE1126", "#FFFFFF"],
  CRO: ["#FF0000", "#FFFFFF", "#171796"],
  GHA: ["#FCD116", "#006B3F", "#DA291C"],
  PAN: ["#005293", "#FFFFFF", "#D21034"],
};

// Helper to build a linear flag representation for small previews (capsules)
const getCountryFlagGradient = (countryKey) => {
  const colors = FLAG_GRADIENTS[countryKey];
  if (!colors) return "none";
  const c1 = colors[0];
  const c2 = colors[1] || colors[0];
  const c3 = colors[2] || colors[1] || colors[0];
  return `linear-gradient(to right, ${c1} 33%, ${c2} 33% 66%, ${c3} 66%)`;
};

// Helper to build flag-colored abstract circular shapes (radial waves/circles) for country backgrounds
const getCountryPattern = (countryKey) => {
  const colors = FLAG_GRADIENTS[countryKey];
  if (!colors) return "none";
  const c1 = colors[0];
  const c2 = colors[1] || colors[0];
  const c3 = colors[2] || colors[1] || colors[0];

  // Creates circular/elliptical intersecting shapes representing the flag colors (similar to physical album)
  return `radial-gradient(circle at 0% 0%, ${c1} 45%, transparent 45%), radial-gradient(circle at 100% 100%, ${c2} 55%, ${c3} 55%)`;
};

// Selection metadata including flags and full names
const COUNTRY_METADATA = {
  MEX: { name: "Mexico", confederation: "CONCACAF" },
  RSA: { name: "South Africa", confederation: "CAF" },
  KOR: { name: "South Korea", confederation: "AFC" },
  CZE: { name: "Czech Republic", confederation: "UEFA" },
  CAN: { name: "Canada", confederation: "CONCACAF" },
  BIH: { name: "Bosnia and Herzegovina", confederation: "UEFA" },
  QAT: { name: "Qatar", confederation: "AFC" },
  SUI: { name: "Switzerland", confederation: "UEFA" },
  BRA: { name: "Brazil", confederation: "CONMEBOL" },
  MAR: { name: "Morocco", confederation: "CAF" },
  HAI: { name: "Haiti", confederation: "CONCACAF" },
  SCO: { name: "Scotland", confederation: "UEFA" },
  USA: { name: "USA", confederation: "CONCACAF" },
  PAR: { name: "Paraguay", confederation: "CONMEBOL" },
  AUS: { name: "Australia", confederation: "AFC" },
  TUR: { name: "Turkey", confederation: "UEFA" },
  GER: { name: "Germany", confederation: "UEFA" },
  CUW: { name: "Curaçao", confederation: "CONCACAF" },
  CIV: { name: "Ivory Coast", confederation: "CAF" },
  ECU: { name: "Ecuador", confederation: "CONMEBOL" },
  NED: { name: "Netherlands", confederation: "UEFA" },
  JPN: { name: "Japan", confederation: "AFC" },
  SWE: { name: "Sweden", confederation: "UEFA" },
  TUN: { name: "Tunisia", confederation: "CAF" },
  BEL: { name: "Belgium", confederation: "UEFA" },
  EGY: { name: "Egypt", confederation: "CAF" },
  IRN: { name: "Iran", confederation: "AFC" },
  NZL: { name: "New Zealand", confederation: "OFC" },
  ESP: { name: "Spain", confederation: "UEFA" },
  CPV: { name: "Cape Verde", confederation: "CAF" },
  KSA: { name: "Saudi Arabia", confederation: "AFC" },
  URU: { name: "Uruguay", confederation: "CONMEBOL" },
  FRA: { name: "France", confederation: "UEFA" },
  SEN: { name: "Senegal", confederation: "CAF" },
  IRQ: { name: "Iraq", confederation: "AFC" },
  NOR: { name: "Norway", confederation: "UEFA" },
  ARG: { name: "Argentina", confederation: "CONMEBOL" },
  ALG: { name: "Algeria", confederation: "CAF" },
  AUT: { name: "Austria", confederation: "UEFA" },
  JOR: { name: "Jordan", confederation: "AFC" },
  POR: { name: "Portugal", confederation: "UEFA" },
  COD: { name: "DR Congo", confederation: "CAF" },
  UZB: { name: "Uzbekistan", confederation: "AFC" },
  COL: { name: "Colombia", confederation: "CONMEBOL" },
  ENG: { name: "England", confederation: "UEFA" },
  CRO: { name: "Croatia", confederation: "UEFA" },
  GHA: { name: "Ghana", confederation: "CAF" },
  PAN: { name: "Panama", confederation: "CONCACAF" },
  SPECIAL: { name: "Special", confederation: "FIFA" },
  FWC: { name: "FIFA World Cup", confederation: "FIFA" },
  CC: { name: "Coca-Cola", confederation: "Coca-Cola" },
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
  const [expandedCountries, setExpandedCountries] = useState({});

  const isCountryExpanded = (cKey) => {
    return expandedCountries[cKey] === true;
  };

  const toggleCountry = (cKey) => {
    setExpandedCountries((prev) => ({
      ...prev,
      [cKey]: !isCountryExpanded(cKey),
    }));
  };

  // Calculate dynamic group completion stats
  const allGroupStickers = isSpecial
    ? stickers
    : countriesList.reduce(
        (acc, cKey) => [...acc, ...(countriesData[cKey] || [])],
        [],
      );
  const ownedGroupCount = allGroupStickers.filter(
    (s) => getStickerStatus(s.id).have,
  ).length;
  const totalGroupCount = allGroupStickers.length;
  const groupPercent =
    totalGroupCount > 0
      ? Math.round((ownedGroupCount / totalGroupCount) * 100)
      : 0;
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
            <span className="font-bebas text-lg text-slate-600 leading-none">
              {groupPercent}%
            </span>
            <span className="text-xs text-slate-400">
              {isExpanded ? (
                <FaChevronUp className="text-[10px]" />
              ) : (
                <FaChevronDown className="text-[10px]" />
              )}
            </span>
          </div>
        </div>
        {/* Group Progress Bar */}
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              isGroupCompleted
                ? "bg-success"
                : groupKey === "CC"
                  ? "bg-secondary"
                  : "bg-primary"
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
                const filteredCountryStickers =
                  getFilteredStickers(countryStickers);

                // Calculate progress of this specific country (selection)
                const ownedCountryCount = countryStickers.filter(
                  (s) => getStickerStatus(s.id).have,
                ).length;
                const totalCountryCount = countryStickers.length;
                const countryPercent =
                  totalCountryCount > 0
                    ? Math.round((ownedCountryCount / totalCountryCount) * 100)
                    : 0;
                const isCountryCompleted = countryPercent >= 100;

                const countryInfo = COUNTRY_METADATA[countryKey] || {
                  name: countryKey,
                };
                const countryBg = getCountryPattern(countryKey);
                const flagGradient = getCountryFlagGradient(countryKey);
                const isOpen = isCountryExpanded(countryKey);

                return (
                  <div
                    key={countryKey}
                    className="flex flex-col border border-slate-200/80 rounded-xl overflow-hidden shadow-xs relative transition-all duration-300 bg-white"
                  >
                    {/* Country Header (flag gradients + metadata + progress) */}
                    <div
                      className="relative z-10 flex flex-col gap-1.5 p-3.5 bg-white border-b border-slate-200/60 cursor-pointer select-none hover:bg-slate-50 transition-colors"
                      onClick={() => toggleCountry(countryKey)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
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
                        <div className="flex items-center gap-2.5">
                          <span className="font-bebas text-sm text-slate-700 leading-none">
                            {ownedCountryCount}/{totalCountryCount}
                          </span>
                          {isOpen ? (
                            <FaChevronUp className="text-[9px] text-slate-500" />
                          ) : (
                            <FaChevronDown className="text-[9px] text-slate-500" />
                          )}
                        </div>
                      </div>

                      {/* Selection (country) progress bar */}
                      <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden mt-0.5">
                        <div
                          className={`h-full transition-all duration-500 rounded-full ${
                            isCountryCompleted ? "bg-success" : "bg-primary"
                          }`}
                          style={{ width: `${countryPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Stickers Grid & Content (Flag background is set here, keeping the header clean) */}
                    {isOpen && (
                      <div
                        className="relative z-10 p-4 flex flex-col gap-3 rounded-b-xl overflow-hidden"
                        style={
                          countryBg !== "none"
                            ? {
                                backgroundImage: countryBg,
                                backgroundSize: "cover",
                              }
                            : {}
                        }
                      >
                        {/* Semi-translucent overlay to soften the flag background for high contrast */}
                        <div className="absolute inset-0 bg-white/25 pointer-events-none z-0"></div>

                        <div className="relative z-10 grid grid-cols-[repeat(auto-fill,minmax(65px,1fr))] gap-2 sm:grid-cols-[repeat(auto-fill,minmax(70px,1fr))] mt-1">
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
                          <p className="relative z-10 text-[11px] font-semibold text-slate-700 bg-white/80 px-3 py-1.5 rounded-lg border border-slate-200/50 shadow-xs self-center my-1">
                            Ninguna figurita coincide con los filtros.
                          </p>
                        )}
                      </div>
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
