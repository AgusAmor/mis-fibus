const fs = require('fs');

const albumPath = './fibus_album.json';
const album = JSON.parse(fs.readFileSync(albumPath, 'utf8'));

const COUNTRY_METADATA = {
  MEX: { name: "Mexico" },
  RSA: { name: "South Africa" },
  KOR: { name: "South Korea" },
  CZE: { name: "Czech Republic" },
  CAN: { name: "Canada" },
  BIH: { name: "Bosnia and Herzegovina" },
  QAT: { name: "Qatar" },
  SUI: { name: "Switzerland" },
  BRA: { name: "Brazil" },
  MAR: { name: "Morocco" },
  HAI: { name: "Haiti" },
  SCO: { name: "Scotland" },
  USA: { name: "USA" },
  PAR: { name: "Paraguay" },
  AUS: { name: "Australia" },
  TUR: { name: "Turkey" },
  GER: { name: "Germany" },
  CUW: { name: "Curaçao" },
  CIV: { name: "Ivory Coast" },
  ECU: { name: "Ecuador" },
  NED: { name: "Netherlands" },
  JPN: { name: "Japan" },
  SWE: { name: "Sweden" },
  TUN: { name: "Tunisia" },
  BEL: { name: "Belgium" },
  EGY: { name: "Egypt" },
  IRN: { name: "Iran" },
  NZL: { name: "New Zealand" },
  ESP: { name: "Spain" },
  CPV: { name: "Cape Verde" },
  KSA: { name: "Saudi Arabia" },
  URU: { name: "Uruguay" },
  FRA: { name: "France" },
  SEN: { name: "Senegal" },
  IRQ: { name: "Iraq" },
  NOR: { name: "Norway" },
  ARG: { name: "Argentina" },
  ALG: { name: "Algeria" },
  AUT: { name: "Austria" },
  JOR: { name: "Jordan" },
  POR: { name: "Portugal" },
  COD: { name: "DR Congo" },
  UZB: { name: "Uzbekistan" },
  COL: { name: "Colombia" },
  ENG: { name: "England" },
  CRO: { name: "Croatia" },
  GHA: { name: "Ghana" },
  PAN: { name: "Panama" },
};

let updatedCount = 0;
album.forEach(item => {
  if (item.number === "01" && COUNTRY_METADATA[item.team]) {
    item.name = "Escudo " + COUNTRY_METADATA[item.team].name;
    updatedCount++;
  }
});

console.log(`Updated ${updatedCount} shields`);
fs.writeFileSync(albumPath, JSON.stringify(album, null, 2), 'utf8');
console.log('Saved fibus_album.json');
