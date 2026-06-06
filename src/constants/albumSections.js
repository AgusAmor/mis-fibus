import originalStickers from "../../fibus_album.json";

// Teams grouped by their respective World Cup group stages (Groups A - L)
export const groupTeams = {
  A: ["MEX", "RSA", "KOR", "CZE"],
  B: ["CAN", "BIH", "QAT", "SUI"],
  C: ["BRA", "MAR", "HAI", "SCO"],
  D: ["USA", "PAR", "AUS", "TUR"],
  E: ["GER", "CUW", "CIV", "ECU"],
  F: ["NED", "JPN", "SWE", "TUN"],
  G: ["BEL", "EGY", "IRN", "NZL"],
  H: ["ESP", "CPV", "KSA", "URU"],
  I: ["FRA", "SEN", "IRQ", "NOR"],
  J: ["ARG", "ALG", "AUT", "JOR"],
  K: ["POR", "COD", "UZB", "COL"],
  L: ["ENG", "CRO", "GHA", "PAN"],
};

// Main groupings for index navigation and accordion structure
export const sections = {
  FWC_SPECIAL: originalStickers.filter(
    (s) => s.group === "SPECIAL" || (s.group === "FWC" && parseInt(s.number, 10) <= 8),
  ),
  FWC_HISTORY: originalStickers.filter(
    (s) => s.group === "FWC" && parseInt(s.number, 10) >= 9,
  ),
  CC: originalStickers.filter((s) => s.group === "CC"),
  A: originalStickers.filter((s) => s.group === "A"),
  B: originalStickers.filter((s) => s.group === "B"),
  C: originalStickers.filter((s) => s.group === "C"),
  D: originalStickers.filter((s) => s.group === "D"),
  E: originalStickers.filter((s) => s.group === "E"),
  F: originalStickers.filter((s) => s.group === "F"),
  G: originalStickers.filter((s) => s.group === "G"),
  H: originalStickers.filter((s) => s.group === "H"),
  I: originalStickers.filter((s) => s.group === "I"),
  J: originalStickers.filter((s) => s.group === "J"),
  K: originalStickers.filter((s) => s.group === "K"),
  L: originalStickers.filter((s) => s.group === "L"),
};

// Map storing stickers grouped by country/team key
export const countries = {};
originalStickers.forEach((s) => {
  if (s.group !== "SPECIAL" && s.group !== "FWC" && s.group !== "CC") {
    if (!countries[s.team]) {
      countries[s.team] = [];
    }
    countries[s.team].push(s);
  }
});

// Full sequential list of stickers ordered exactly as they are laid out in the physical album pages
export const albumOrderedStickers = (() => {
  const list = [];
  
  // 1. Specials & Host Stadiums
  list.push(...sections.FWC_SPECIAL);
  
  // 2. Group Stages (A to L)
  ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"].forEach((groupKey) => {
    const groupCountries = groupTeams[groupKey] || [];
    groupCountries.forEach((cKey) => {
      list.push(...(countries[cKey] || []));
    });
  });
  
  // 3. World Cup History
  list.push(...sections.FWC_HISTORY);
  
  // 4. Coca-Cola Section
  list.push(...sections.CC);
  
  return list;
})();
