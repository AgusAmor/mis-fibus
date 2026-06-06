import { useState } from "react";
import { StickerCard } from "./StickerCard";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import { CountryFlag } from "./CountryFlag";

// Raw flag colors for all 48 countries
export const FLAG_GRADIENTS = {
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
  CIV: ["#F77F00", "#FFFFFF", "#009E60"],
  ECU: ["#FFDD00", "#001489", "#ED1C24"],
  NED: ["#AE1C28", "#FFFFFF", "#21468B"],
  JPN: ["#FFFFFF", "#BC002D", "#FFFFFF"],
  SWE: ["#006AA7", "#FECC00", "#006AA7"],
  TUN: ["#E20909", "#FFFFFF", "#E20909"],
  BEL: ["#000000", "#FDDA24", "#EF3340"],
  EGY: ["#C1272D", "#FFFFFF", "#000000"],
  IRN: ["#239B56", "#FFFFFF", "#DA291C"],
  NZL: ["#00247D", "#FFFFFF", "#CC0A2C"],
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

// Relative color proportions representing the visual prominence in each flag
export const FLAG_PROPORTIONS = {
  MEX: [33, 34, 33],
  RSA: [35, 30, 35],
  KOR: [10, 80, 10],
  CZE: [30, 35, 35],
  CAN: [50, 50, 0],
  BIH: [65, 30, 5],
  QAT: [30, 70, 0],
  SUI: [85, 15, 0],
  BRA: [80, 15, 5],
  MAR: [90, 10, 0],
  HAI: [45, 45, 10],
  SCO: [75, 25, 0],
  USA: [20, 40, 40],
  PAR: [33, 34, 33],
  AUS: [75, 15, 10],
  TUR: [85, 15, 0],
  GER: [33, 34, 33],
  CUW: [85, 10, 5],
  CIV: [33, 34, 33],
  ECU: [50, 25, 25],
  NED: [33, 34, 33],
  JPN: [80, 20, 0],
  SWE: [70, 30, 0],
  TUN: [80, 20, 0],
  BEL: [33, 34, 33],
  EGY: [33, 34, 33],
  IRN: [33, 34, 33],
  NZL: [75, 15, 10],
  ESP: [50, 40, 10],
  CPV: [75, 15, 10],
  KSA: [85, 15, 0],
  URU: [45, 45, 10],
  FRA: [33, 34, 33],
  SEN: [33, 34, 33],
  IRQ: [33, 34, 33],
  NOR: [70, 15, 15],
  ARG: [66, 33, 1],
  ALG: [45, 45, 10],
  AUT: [33, 34, 33],
  JOR: [35, 35, 30],
  POR: [40, 60, 0],
  COD: [75, 15, 10],
  UZB: [33, 34, 33],
  COL: [50, 25, 25],
  ENG: [75, 25, 0],
  CRO: [33, 34, 33],
  GHA: [33, 34, 33],
  PAN: [50, 25, 25],
};

// Pattern represents the digital album page background (overlapping waves)

// Helper to build dynamic, randomized (but deterministic) flag-colored background pattern
const getCountryPattern = (countryKey) => {
  const colors = FLAG_GRADIENTS[countryKey];
  if (!colors) return "none";
  const c1 = colors[0];
  const c2 = colors[1] || colors[0];
  const c3 = colors[2] || colors[1] || colors[0];

  const props = FLAG_PROPORTIONS[countryKey] || [33, 34, 33];
  const p1 = props[0];
  const p2 = props[1];
  const p3 = props[2];

  // Simple deterministic hash helper to create random variations per country
  const hash = (seed) => {
    let val = 0;
    const str = countryKey + seed;
    for (let i = 0; i < str.length; i++) {
      val = str.charCodeAt(i) + ((val << 5) - val);
    }
    return Math.abs(val);
  };

  // Generate deterministic variations for angles, coordinates, and curves
  const r1 = (hash("a") % 30) + 10;  // 10-40
  const r2 = (hash("b") % 40) + 30;  // 30-70
  const r3 = (hash("c") % 30) + 60;  // 60-90
  
  const cp1 = (hash("d") % 40) + 20; // 20-60
  const cp2 = (hash("e") % 40) + 40; // 40-80

  const curveType = hash("f") % 3; // 0, 1, 2 for layout variation

  let paths = "";
  // Draw base background in c1 (representing primary flag color)
  paths += `<rect width='100' height='100' fill='${c1}' />`;

  if (curveType === 0) {
    // Wave paths stacking from left to right scaled to reflect flag proportions
    const w2_start = Math.max(5, Math.min(95, 100 - (p2 + p3) + (hash("w1") % 10 - 5)));
    const w2_end = Math.max(5, Math.min(95, 100 - (p2 + p3) + (hash("w2") % 10 - 5)));
    const w3_start = Math.max(5, Math.min(95, 100 - p3 + (hash("w3") % 10 - 5)));
    const w3_end = Math.max(5, Math.min(95, 100 - p3 + (hash("w4") % 10 - 5)));

    paths += `<path d='M ${w2_start} 0 C ${cp1} ${r2}, ${cp2} ${r1}, ${w2_end} 100 L 100 100 L 100 0 Z' fill='${c2}' />`;
    paths += `<path d='M ${w3_start} 0 C ${cp2} ${cp1}, ${cp1} ${r3}, ${w3_end} 100 L 100 100 L 100 0 Z' fill='${c3}' />`;
  } else if (curveType === 1) {
    // Diagonal division scaled to reflect flag proportions
    const d2_start = Math.max(5, Math.min(95, 100 - (p2 + p3) + (hash("d1") % 14 - 7)));
    const d2_end = Math.max(5, Math.min(95, 100 - (p2 + p3) + (hash("d2") % 14 - 7)));
    const d3_start = Math.max(5, Math.min(95, 100 - p3 + (hash("d3") % 14 - 7)));
    const d3_end = Math.max(5, Math.min(95, 100 - p3 + (hash("d4") % 14 - 7)));

    paths += `<path d='M 0 ${d2_start} Q ${cp1} ${cp2} 100 ${d2_end} L 100 100 L 0 100 Z' fill='${c2}' />`;
    paths += `<path d='M 0 ${d3_start} C ${cp1} ${r1}, ${cp2} ${r3}, 100 ${d3_end} L 100 100 L 0 100 Z' fill='${c3}' />`;
  } else {
    // Concentric circles from top-right scaled to reflect flag proportions (quarter-circle area = p%)
    const r_c2 = 11.28 * Math.sqrt(p2 + p3);
    const r_c3 = 11.28 * Math.sqrt(p3);

    paths += `<circle cx='100' cy='0' r='${r_c2}' fill='${c2}' />`;
    paths += `<circle cx='100' cy='0' r='${r_c3}' fill='${c3}' />`;
  }

  // Add the white margin split representing page fold (solid white)
  const marginW = (hash("g") % 15) + 15; // 15-30
  paths += `<path d='M 0 0 C ${marginW} ${r1}, ${marginW / 2} ${r3}, 0 100 Z' fill='#ffffff' />`;

  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%' viewBox='0 0 100 100' preserveAspectRatio='none'>
    ${paths}
  </svg>`;

  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
};

// Selection metadata including flags and full names
const COUNTRY_METADATA = {
  MEX: { name: "Mexico", confederation: "CONCACAF" },
  RSA: { name: "South Africa", confederation: "CAF" },
  KOR: { name: "Korea Republic", confederation: "AFC" },
  CZE: { name: "Czechia", confederation: "UEFA" },
  CAN: { name: "Canada", confederation: "CONCACAF" },
  BIH: { name: "Bosnia-Herzegovina", confederation: "UEFA" },
  QAT: { name: "Qatar", confederation: "AFC" },
  SUI: { name: "Switzerland", confederation: "UEFA" },
  BRA: { name: "Brazil", confederation: "CONMEBOL" },
  MAR: { name: "Morocco", confederation: "CAF" },
  HAI: { name: "Haiti", confederation: "CONCACAF" },
  SCO: { name: "Scotland", confederation: "UEFA" },
  USA: { name: "USA", confederation: "CONCACAF" },
  PAR: { name: "Paraguay", confederation: "CONMEBOL" },
  AUS: { name: "Australia", confederation: "AFC" },
  TUR: { name: "Türkiye", confederation: "UEFA" },
  GER: { name: "Germany", confederation: "UEFA" },
  CUW: { name: "Curaçao", confederation: "CONCACAF" },
  CIV: { name: "Côte d'Ivoire", confederation: "CAF" },
  ECU: { name: "Ecuador", confederation: "CONMEBOL" },
  NED: { name: "Netherlands", confederation: "UEFA" },
  JPN: { name: "Japan", confederation: "AFC" },
  SWE: { name: "Sweden", confederation: "UEFA" },
  TUN: { name: "Tunisia", confederation: "CAF" },
  BEL: { name: "Belgium", confederation: "UEFA" },
  EGY: { name: "Egypt", confederation: "CAF" },
  IRN: { name: "IR Iran", confederation: "AFC" },
  NZL: { name: "New Zealand", confederation: "OFC" },
  ESP: { name: "Spain", confederation: "UEFA" },
  CPV: { name: "Cabo Verde", confederation: "CAF" },
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
  COD: { name: "Congo DR", confederation: "CAF" },
  UZB: { name: "Uzbekistan", confederation: "AFC" },
  COL: { name: "Colombia", confederation: "CONMEBOL" },
  ENG: { name: "England", confederation: "UEFA" },
  CRO: { name: "Croatia", confederation: "UEFA" },
  GHA: { name: "Ghana", confederation: "CAF" },
  PAN: { name: "Panama", confederation: "CONCACAF" },
};

export function CountrySection({
  countryKey,
  groupKey,
  countryStickers = [],
  getFilteredStickers,
  getStickerStatus,
  onShortTap,
  onLongPress,
  onToggleFavorite,
  displayMode = "both",
  showGroupLabel = false,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const filteredCountryStickers = getFilteredStickers(countryStickers);

  // Calculate country progress
  const ownedCountryCount = countryStickers.filter(
    (s) => getStickerStatus(s.id).have,
  ).length;
  const totalCountryCount = countryStickers.length;
  const countryPercent =
    totalCountryCount > 0
      ? Math.round((ownedCountryCount / totalCountryCount) * 100)
      : 0;
  const isCountryCompleted = countryPercent >= 100;

  const countryInfo = COUNTRY_METADATA[countryKey] || { name: countryKey };
  const countryBg = getCountryPattern(countryKey);

  const headerTitle = showGroupLabel
    ? `${countryInfo.name} (Group ${groupKey})`
    : countryInfo.name;

  return (
    <div className="flex flex-col border border-slate-200/80 rounded-xl overflow-hidden shadow-xs relative transition-all duration-300 bg-white">
      {/* Country Header */}
      <div
        className="relative z-10 flex flex-col gap-1.5 p-3.5 bg-white border-b border-slate-200/60 cursor-pointer select-none hover:bg-slate-50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CountryFlag
              countryKey={countryKey}
              className="w-6 h-4 rounded-xs border border-slate-200/50 shadow-xs shrink-0"
            />
            <h3 className="text-xs font-montserrat font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <span>{headerTitle}</span>
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

        {/* Selection progress bar */}
        <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden mt-0.5">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              isCountryCompleted ? "bg-success" : "bg-primary"
            }`}
            style={{ width: `${countryPercent}%` }}
          />
        </div>
      </div>

      {/* Stickers Grid & Content */}
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
          <div className="absolute inset-0 bg-white/30 pointer-events-none z-0"></div>

          {/* Stickers Grid in 4 columns */}
          {filteredCountryStickers.length > 0 && (
            <div className="relative z-10 grid grid-cols-4 gap-2 sm:gap-2.5 mt-1">
              {filteredCountryStickers.map((sticker) => (
                <StickerCard
                  key={sticker.id}
                  sticker={sticker}
                  status={getStickerStatus(sticker.id)}
                  onShortTap={onShortTap}
                  onLongPress={onLongPress}
                  onToggleFavorite={onToggleFavorite}
                  displayMode={displayMode}
                />
              ))}
            </div>
          )}

          {filteredCountryStickers.length === 0 && (
            <p className="relative z-10 text-[11px] font-semibold text-slate-700 bg-white/80 px-3 py-1.5 rounded-lg border border-slate-200/50 shadow-xs self-center my-1">
              Ninguna figurita coincide con los filtros.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
