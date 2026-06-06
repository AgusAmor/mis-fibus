import React from "react";

/**
 * CountryFlag Component
 * Renders a simplified, highly recognizable vector flag (SVG) for each of the 48 countries
 * in standard 3:2 aspect ratio.
 */
export function CountryFlag({ countryKey, className = "" }) {
  // Get SVG inner elements representing the flag layout
  const renderFlagContent = (key) => {
    switch (key) {
      case "MEX": // Mexico: vertical green, white, red with simplified seal
        return (
          <>
            <rect x="0" y="0" width="10" height="20" fill="#006847" />
            <rect x="10" y="0" width="10" height="20" fill="#FFFFFF" />
            <rect x="20" y="0" width="10" height="20" fill="#CE1126" />
            <circle cx="15" cy="10" r="1.8" fill="#8B5A2B" />
          </>
        );

      case "RSA": // South Africa: complex Y-band and triangle layout
        return (
          <>
            <rect x="0" y="0" width="30" height="10" fill="#E21836" />
            <rect x="0" y="10" width="30" height="10" fill="#002395" />
            {/* White boundary for the green Y */}
            <path d="M0,0 L12,10 L0,20 L4,20 L14,12 L30,12 L30,8 L14,8 L4,0 Z" fill="#FFFFFF" />
            {/* Green Y shape */}
            <path d="M0,1 L11,10 L0,19 L2,19 L12,11 L30,11 L30,9 L12,9 L2,1 Z" fill="#007A3D" />
            {/* Gold boundary for black triangle */}
            <path d="M0,2 L8,10 L0,18 Z" fill="#FECB00" />
            {/* Black triangle at hoist */}
            <path d="M0,3 L7,10 L0,17 Z" fill="#000000" />
          </>
        );

      case "KOR": // Korea Republic: white field, red/blue taegeuk, black trigrams
        return (
          <>
            <rect x="0" y="0" width="30" height="20" fill="#FFFFFF" />
            <circle cx="15" cy="10" r="4.2" fill="#CD2E3A" />
            <path d="M 10.8 10 A 4.2 4.2 0 0 0 19.2 10 A 2.1 2.1 0 0 0 15 10 A 2.1 2.1 0 0 1 10.8 10 Z" fill="#0A1D37" />
            {/* Simplified black trigrams */}
            <line x1="6" y1="5" x2="9" y2="3" stroke="#000000" strokeWidth="1.2" />
            <line x1="21" y1="3" x2="24" y2="5" stroke="#000000" strokeWidth="1.2" />
            <line x1="6" y1="15" x2="9" y2="17" stroke="#000000" strokeWidth="1.2" />
            <line x1="21" y1="17" x2="24" y2="15" stroke="#000000" strokeWidth="1.2" />
          </>
        );

      case "CZE": // Czechia: white top, red bottom, blue triangle
        return (
          <>
            <rect x="0" y="0" width="30" height="10" fill="#FFFFFF" />
            <rect x="0" y="10" width="30" height="10" fill="#D7141A" />
            <path d="M0,0 L13,10 L0,20 Z" fill="#11457E" />
          </>
        );

      case "CAN": // Canada: red-white-red vertical stripes with maple leaf
        return (
          <>
            <rect x="0" y="0" width="7.5" height="20" fill="#FF0000" />
            <rect x="7.5" y="0" width="15" height="20" fill="#FFFFFF" />
            <rect x="22.5" y="0" width="7.5" height="20" fill="#FF0000" />
            {/* Simplified red maple leaf */}
            <path d="M15,5 L16.2,8 L18.5,7 L17.7,10 L20.5,10.7 L17.7,11.5 L18.5,14.5 L16.2,13.5 L15.5,15.5 L14.5,15.5 L13.8,13.5 L11.5,14.5 L12.3,11.5 L9.5,10.7 L12.3,10 L11.5,7 L13.8,8 Z" fill="#FF0000" />
          </>
        );

      case "BIH": // Bosnia-Herzegovina: blue field, yellow triangle, white dots
        return (
          <>
            <rect x="0" y="0" width="30" height="20" fill="#002395" />
            <path d="M8,0 L24,0 L24,16 Z" fill="#FECB00" />
            <circle cx="9" cy="2" r="0.6" fill="#FFFFFF" />
            <circle cx="11.5" cy="4.8" r="0.6" fill="#FFFFFF" />
            <circle cx="14" cy="7.6" r="0.6" fill="#FFFFFF" />
            <circle cx="16.5" cy="10.4" r="0.6" fill="#FFFFFF" />
            <circle cx="19" cy="13.2" r="0.6" fill="#FFFFFF" />
            <circle cx="21.5" cy="16" r="0.6" fill="#FFFFFF" />
          </>
        );

      case "QAT": // Qatar: maroon field, white serrations
        return (
          <>
            <rect x="0" y="0" width="30" height="20" fill="#8D1B3D" />
            <path d="M0,0 L7,0 L9.5,1 L7,2 L9.5,3 L7,4 L9.5,5 L7,6 L9.5,7 L7,8 L9.5,9 L7,10 L9.5,11 L7,12 L9.5,13 L7,14 L9.5,15 L7,16 L9.5,17 L7,18 L9.5,19 L7,20 L0,20 Z" fill="#FFFFFF" />
          </>
        );

      case "SUI": // Switzerland: square cross representation on red
        return (
          <>
            <rect x="0" y="0" width="30" height="20" fill="#DA291C" />
            <rect x="13.5" y="4.5" width="3" height="11" fill="#FFFFFF" />
            <rect x="9.5" y="8.5" width="11" height="3" fill="#FFFFFF" />
          </>
        );

      case "BRA": // Brazil: green field, yellow rhombus, blue circle, white stripe
        return (
          <>
            <rect x="0" y="0" width="30" height="20" fill="#009739" />
            <polygon points="15,2.5 27,10 15,17.5 3,10" fill="#FEDF00" />
            <circle cx="15" cy="10" r="4" fill="#012169" />
            <path d="M12.5,11 C13.5,10.2 15.5,10.2 17.5,11" stroke="#FFFFFF" strokeWidth="0.6" fill="none" />
          </>
        );

      case "MAR": // Morocco: red field, green pentagram outline
        return (
          <>
            <rect x="0" y="0" width="30" height="20" fill="#C1272D" />
            <polygon points="15,5.5 16.2,9 19.5,9 16.8,11.2 17.8,14.5 15,12.5 12.2,14.5 13.2,11.2 10.5,9 13.8,9" fill="none" stroke="#006233" strokeWidth="1" />
          </>
        );

      case "HAI": // Haiti: blue/red horizontal stripes, white emblem box
        return (
          <>
            <rect x="0" y="0" width="30" height="10" fill="#00209F" />
            <rect x="0" y="10" width="30" height="10" fill="#D21034" />
            <rect x="11.5" y="6.5" width="7" height="7" fill="#FFFFFF" />
            <rect x="14.5" y="8" width="1" height="4.5" fill="#8B5A2B" />
            <circle cx="15" cy="8" r="1.2" fill="#008000" />
          </>
        );

      case "SCO": // Scotland: blue with white saltire
        return (
          <>
            <rect x="0" y="0" width="30" height="20" fill="#0065BF" />
            <line x1="0" y1="0" x2="30" y2="20" stroke="#FFFFFF" strokeWidth="2.5" />
            <line x1="30" y1="0" x2="0" y2="20" stroke="#FFFFFF" strokeWidth="2.5" />
          </>
        );

      case "USA": // USA: red/white stripes, blue canton, white dots
        return (
          <>
            <rect x="0" y="0" width="30" height="20" fill="#FFFFFF" />
            <rect x="0" y="0" width="30" height="1.54" fill="#B31942" />
            <rect x="0" y="3.08" width="30" height="1.54" fill="#B31942" />
            <rect x="0" y="6.15" width="30" height="1.54" fill="#B31942" />
            <rect x="0" y="9.23" width="30" height="1.54" fill="#B31942" />
            <rect x="0" y="12.3" width="30" height="1.54" fill="#B31942" />
            <rect x="0" y="15.38" width="30" height="1.54" fill="#B31942" />
            <rect x="0" y="18.46" width="30" height="1.54" fill="#B31942" />
            <rect x="0" y="0" width="12.5" height="10.8" fill="#0A3161" />
            <circle cx="2.5" cy="2.5" r="0.4" fill="#FFFFFF" />
            <circle cx="5" cy="2.5" r="0.4" fill="#FFFFFF" />
            <circle cx="7.5" cy="2.5" r="0.4" fill="#FFFFFF" />
            <circle cx="10" cy="2.5" r="0.4" fill="#FFFFFF" />
            <circle cx="3.5" cy="5" r="0.4" fill="#FFFFFF" />
            <circle cx="6" cy="5" r="0.4" fill="#FFFFFF" />
            <circle cx="8.5" cy="5" r="0.4" fill="#FFFFFF" />
            <circle cx="2.5" cy="7.5" r="0.4" fill="#FFFFFF" />
            <circle cx="5" cy="7.5" r="0.4" fill="#FFFFFF" />
            <circle cx="7.5" cy="7.5" r="0.4" fill="#FFFFFF" />
            <circle cx="10" cy="7.5" r="0.4" fill="#FFFFFF" />
          </>
        );

      case "PAR": // Paraguay: red, white, blue horizontal stripes with emblem
        return (
          <>
            <rect x="0" y="0" width="30" height="6.7" fill="#D52B1E" />
            <rect x="0" y="6.7" width="30" height="6.7" fill="#FFFFFF" />
            <rect x="0" y="13.4" width="30" height="6.6" fill="#0038A8" />
            <circle cx="15" cy="10" r="1.8" fill="#FFFFFF" stroke="#0038A8" strokeWidth="0.4" />
            <circle cx="15" cy="10" r="0.7" fill="#FEDF00" />
          </>
        );

      case "AUS": // Australia: blue field, Union Jack canton, white stars
        return (
          <>
            <rect x="0" y="0" width="30" height="20" fill="#00008B" />
            <rect x="0" y="0" width="15" height="10" fill="#00209F" />
            <line x1="0" y1="0" x2="15" y2="10" stroke="#FFFFFF" strokeWidth="1.2" />
            <line x1="15" y1="0" x2="0" y2="10" stroke="#FFFFFF" strokeWidth="1.2" />
            <line x1="0" y1="0" x2="15" y2="10" stroke="#FF0000" strokeWidth="0.5" />
            <line x1="15" y1="0" x2="0" y2="10" stroke="#FF0000" strokeWidth="0.5" />
            <rect x="6" y="0" width="3" height="10" fill="#FFFFFF" />
            <rect x="0" y="3.5" width="15" height="3" fill="#FFFFFF" />
            <rect x="7" y="0" width="1" height="10" fill="#FF0000" />
            <rect x="0" y="4.5" width="15" height="1" fill="#FF0000" />
            {/* Southern Cross representation */}
            <circle cx="22.5" cy="4" r="0.5" fill="#FFFFFF" />
            <circle cx="22.5" cy="16" r="0.5" fill="#FFFFFF" />
            <circle cx="27" cy="8" r="0.5" fill="#FFFFFF" />
            <circle cx="27" cy="12.5" r="0.5" fill="#FFFFFF" />
            <circle cx="24.5" cy="10" r="0.3" fill="#FFFFFF" />
            <circle cx="7.5" cy="15" r="0.8" fill="#FFFFFF" />
          </>
        );

      case "TUR": // Türkiye: red background, white crescent and star
        return (
          <>
            <rect x="0" y="0" width="30" height="20" fill="#E30A17" />
            <circle cx="13" cy="10" r="3.8" fill="#FFFFFF" />
            <circle cx="14.4" cy="10" r="3" fill="#E30A17" />
            <polygon points="18.5,8.8 18.9,10 20.1,10 19.1,10.8 19.5,12 18.5,11.2 17.5,12 17.9,10.8 16.9,10 18.1,10" fill="#FFFFFF" />
          </>
        );

      case "GER": // Germany: black, red, yellow stripes
        return (
          <>
            <rect x="0" y="0" width="30" height="6.7" fill="#000000" />
            <rect x="0" y="6.7" width="30" height="6.7" fill="#DD0000" />
            <rect x="0" y="13.4" width="30" height="6.6" fill="#FFCC00" />
          </>
        );

      case "CUW": // Curaçao: blue background, yellow stripe, two stars
        return (
          <>
            <rect x="0" y="0" width="30" height="20" fill="#002B7F" />
            <rect x="0" y="13" width="30" height="2.2" fill="#F9E814" />
            <circle cx="4" cy="4" r="0.8" fill="#FFFFFF" />
            <circle cx="7.2" cy="6.2" r="0.5" fill="#FFFFFF" />
          </>
        );

      case "CIV": // Côte d'Ivoire: orange, white, green stripes
        return (
          <>
            <rect x="0" y="0" width="10" height="20" fill="#F77F00" />
            <rect x="10" y="0" width="10" height="20" fill="#FFFFFF" />
            <rect x="20" y="0" width="10" height="20" fill="#009E60" />
          </>
        );

      case "ECU": // Ecuador: yellow, blue, red with simplified seal
        return (
          <>
            <rect x="0" y="0" width="30" height="10" fill="#FFDD00" />
            <rect x="0" y="10" width="30" height="5" fill="#001489" />
            <rect x="0" y="15" width="30" height="5" fill="#ED1C24" />
            <circle cx="15" cy="11" r="1.3" fill="#8B5A2B" stroke="#001489" strokeWidth="0.3" />
          </>
        );

      case "NED": // Netherlands: red, white, blue stripes
        return (
          <>
            <rect x="0" y="0" width="30" height="6.7" fill="#AE1C28" />
            <rect x="0" y="6.7" width="30" height="6.7" fill="#FFFFFF" />
            <rect x="0" y="13.4" width="30" height="6.6" fill="#21468B" />
          </>
        );

      case "JPN": // Japan: white field, red disc
        return (
          <>
            <rect x="0" y="0" width="30" height="20" fill="#FFFFFF" />
            <circle cx="15" cy="10" r="4.2" fill="#BC002D" />
          </>
        );

      case "SWE": // Sweden: blue with yellow Nordic cross
        return (
          <>
            <rect x="0" y="0" width="30" height="20" fill="#006AA7" />
            <rect x="9" y="0" width="3" height="20" fill="#FECC00" />
            <rect x="0" y="8.5" width="30" height="3" fill="#FECC00" />
          </>
        );

      case "TUN": // Tunisia: red field, white circle, crescent & star
        return (
          <>
            <rect x="0" y="0" width="30" height="20" fill="#E20909" />
            <circle cx="15" cy="10" r="4.2" fill="#FFFFFF" />
            <circle cx="15.5" cy="10" r="2.2" fill="#E20909" />
            <circle cx="16.5" cy="10" r="1.7" fill="#FFFFFF" />
            <circle cx="16.2" cy="10" r="0.8" fill="#E20909" />
          </>
        );

      case "BEL": // Belgium: black, yellow, red stripes
        return (
          <>
            <rect x="0" y="0" width="10" height="20" fill="#000000" />
            <rect x="10" y="0" width="10" height="20" fill="#FDDA24" />
            <rect x="20" y="0" width="10" height="20" fill="#EF3340" />
          </>
        );

      case "EGY": // Egypt: red, white, black stripes with emblem
        return (
          <>
            <rect x="0" y="0" width="30" height="6.7" fill="#C1272D" />
            <rect x="0" y="6.7" width="30" height="6.7" fill="#FFFFFF" />
            <rect x="0" y="13.4" width="30" height="6.6" fill="#000000" />
            <circle cx="15" cy="10" r="0.9" fill="#C09300" />
          </>
        );

      case "IRN": // Iran: green, white, red stripes with center emblem
        return (
          <>
            <rect x="0" y="0" width="30" height="6.7" fill="#239B56" />
            <rect x="0" y="6.7" width="30" height="6.7" fill="#FFFFFF" />
            <rect x="0" y="13.4" width="30" height="6.6" fill="#DA291C" />
            <circle cx="15" cy="10" r="1" fill="#DA291C" />
          </>
        );

      case "NZL": // New Zealand: blue field, Union Jack, red stars
        return (
          <>
            <rect x="0" y="0" width="30" height="20" fill="#00247D" />
            {/* Canton Union Jack */}
            <rect x="0" y="0" width="15" height="10" fill="#00247D" />
            <line x1="0" y1="0" x2="15" y2="10" stroke="#FFFFFF" strokeWidth="1.2" />
            <line x1="15" y1="0" x2="0" y2="10" stroke="#FFFFFF" strokeWidth="1.2" />
            <line x1="0" y1="0" x2="15" y2="10" stroke="#FF0000" strokeWidth="0.5" />
            <line x1="15" y1="0" x2="0" y2="10" stroke="#FF0000" strokeWidth="0.5" />
            <rect x="6" y="0" width="3" height="10" fill="#FFFFFF" />
            <rect x="0" y="3.5" width="15" height="3" fill="#FFFFFF" />
            <rect x="7" y="0" width="1" height="10" fill="#FF0000" />
            <rect x="0" y="4.5" width="15" height="1" fill="#FF0000" />
            {/* Stars representation */}
            <circle cx="22.5" cy="4.5" r="0.6" fill="#FFFFFF" />
            <circle cx="22.5" cy="4.5" r="0.3" fill="#CC0A2C" />
            <circle cx="22.5" cy="15.5" r="0.6" fill="#FFFFFF" />
            <circle cx="22.5" cy="15.5" r="0.3" fill="#CC0A2C" />
            <circle cx="26.5" cy="9.5" r="0.6" fill="#FFFFFF" />
            <circle cx="26.5" cy="9.5" r="0.3" fill="#CC0A2C" />
            <circle cx="18.5" cy="10" r="0.5" fill="#FFFFFF" />
            <circle cx="18.5" cy="10" r="0.2" fill="#CC0A2C" />
          </>
        );

      case "ESP": // Spain: red, double yellow, red stripes with emblem
        return (
          <>
            <rect x="0" y="0" width="30" height="5" fill="#AD1519" />
            <rect x="0" y="5" width="30" height="10" fill="#FABD00" />
            <rect x="0" y="15" width="30" height="5" fill="#AD1519" />
            <rect x="7" y="8" width="2.5" height="4" fill="#AD1519" stroke="#00568F" strokeWidth="0.3" />
          </>
        );

      case "CPV": // Cabo Verde: blue field, striped bands, circle of stars
        return (
          <>
            <rect x="0" y="0" width="30" height="20" fill="#002A8F" />
            <rect x="0" y="10" width="30" height="1.4" fill="#FFFFFF" />
            <rect x="0" y="11.4" width="30" height="1.4" fill="#CE1126" />
            <rect x="0" y="12.8" width="30" height="1.4" fill="#FFFFFF" />
            <circle cx="10" cy="12" r="3.2" stroke="#FECC00" strokeWidth="0.9" strokeDasharray="1,1.5" fill="none" />
          </>
        );

      case "KSA": // Saudi Arabia: green field, white elements
        return (
          <>
            <rect x="0" y="0" width="30" height="20" fill="#006C35" />
            <rect x="8" y="7" width="14" height="2.2" fill="#FFFFFF" />
            <line x1="7" y1="12" x2="23" y2="12" stroke="#FFFFFF" strokeWidth="1" />
          </>
        );

      case "URU": // Uruguay: striped layout with canton sun
        return (
          <>
            <rect x="0" y="0" width="30" height="20" fill="#FFFFFF" />
            <rect x="0" y="2.2" width="30" height="2.2" fill="#0038A8" />
            <rect x="0" y="6.6" width="30" height="2.2" fill="#0038A8" />
            <rect x="0" y="11" width="30" height="2.2" fill="#0038A8" />
            <rect x="0" y="15.4" width="30" height="2.2" fill="#0038A8" />
            <rect x="0" y="0" width="10.5" height="10.5" fill="#FFFFFF" />
            <circle cx="5" cy="5" r="2.2" fill="#FEDF00" />
            <circle cx="5" cy="5" r="0.9" fill="#FFCC00" />
          </>
        );

      case "FRA": // France: blue, white, red vertical stripes
        return (
          <>
            <rect x="0" y="0" width="10" height="20" fill="#002654" />
            <rect x="10" y="0" width="10" height="20" fill="#FFFFFF" />
            <rect x="20" y="0" width="10" height="20" fill="#ED2939" />
          </>
        );

      case "SEN": // Senegal: green, yellow, red vertical stripes, green star
        return (
          <>
            <rect x="0" y="0" width="10" height="20" fill="#00853F" />
            <rect x="10" y="0" width="10" height="20" fill="#FDEF42" />
            <rect x="20" y="0" width="10" height="20" fill="#E31B23" />
            <polygon points="15,7.8 15.5,9.5 17.2,9.5 15.8,10.5 16.3,12.2 15,11.2 13.7,12.2 14.2,10.5 12.8,9.5 14.5,9.5" fill="#00853F" />
          </>
        );

      case "IRQ": // Iraq: red, white, black stripes, green center block
        return (
          <>
            <rect x="0" y="0" width="30" height="6.7" fill="#FF0000" />
            <rect x="0" y="6.7" width="30" height="6.7" fill="#FFFFFF" />
            <rect x="0" y="13.4" width="30" height="6.6" fill="#000000" />
            <rect x="11.5" y="9.2" width="7" height="1.8" fill="#00853F" rx="0.5" />
          </>
        );

      case "NOR": // Norway: red field, white-bordered blue cross
        return (
          <>
            <rect x="0" y="0" width="30" height="20" fill="#EF2B2D" />
            <rect x="9" y="0" width="4" height="20" fill="#FFFFFF" />
            <rect x="0" y="8" width="30" height="4" fill="#FFFFFF" />
            <rect x="10" y="0" width="2" height="20" fill="#00205B" />
            <rect x="0" y="9" width="30" height="2" fill="#00205B" />
          </>
        );

      case "ARG": // Argentina: light blue, white, light blue with yellow sun
        return (
          <>
            <rect x="0" y="0" width="30" height="6.7" fill="#74ACDF" />
            <rect x="0" y="6.7" width="30" height="6.7" fill="#FFFFFF" />
            <rect x="0" y="13.4" width="30" height="6.6" fill="#74ACDF" />
            <circle cx="15" cy="10" r="1.6" fill="#F4B400" />
            <circle cx="15" cy="10" r="0.8" fill="#D4AF37" />
          </>
        );

      case "ALG": // Algeria: green, white vertical split, crescent & star
        return (
          <>
            <rect x="0" y="0" width="15" height="20" fill="#006633" />
            <rect x="15" y="0" width="15" height="20" fill="#FFFFFF" />
            <circle cx="15" cy="10" r="3" fill="#D21034" />
            <circle cx="16.2" cy="10" r="2.4" fill="#FFFFFF" />
            <polygon points="17.5,9 17.8,9.8 18.6,9.8 18,10.3 18.2,11.1 17.5,10.6 16.8,11.1 17,10.3 16.4,9.8 17.2,9.8" fill="#D21034" />
          </>
        );

      case "AUT": // Austria: red, white, red stripes
        return (
          <>
            <rect x="0" y="0" width="30" height="6.7" fill="#ED2939" />
            <rect x="0" y="6.7" width="30" height="6.7" fill="#FFFFFF" />
            <rect x="0" y="13.4" width="30" height="6.6" fill="#ED2939" />
          </>
        );

      case "JOR": // Jordan: striped layout with red triangle, white star
        return (
          <>
            <rect x="0" y="0" width="30" height="6.7" fill="#000000" />
            <rect x="0" y="6.7" width="30" height="6.7" fill="#FFFFFF" />
            <rect x="0" y="13.4" width="30" height="6.6" fill="#007A3D" />
            <polygon points="0,0 12,10 0,20" fill="#D21034" />
            <circle cx="4" cy="10" r="0.7" fill="#FFFFFF" />
          </>
        );

      case "POR": // Portugal: green/red vertical split with emblem
        return (
          <>
            <rect x="0" y="0" width="12" height="20" fill="#046A38" />
            <rect x="12" y="0" width="18" height="20" fill="#DA291C" />
            <circle cx="12" cy="10" r="2.4" fill="#F4B400" />
            <rect x="11" y="8.5" width="2" height="3" fill="#DA291C" />
            <rect x="11.5" y="9" width="1" height="2" fill="#FFFFFF" />
          </>
        );

      case "COD": // Congo DR: blue field, yellow star, diagonal striped band
        return (
          <>
            <rect x="0" y="0" width="30" height="20" fill="#007FFF" />
            <polygon points="0,20 3,20 30,2 30,0 27,0 0,18" fill="#F4B400" />
            <polygon points="0,20 1.5,20 30,1 30,0 28.5,0 0,19" fill="#CE1126" />
            <polygon points="5,3.5 5.3,4.5 6.3,4.5 5.5,5.1 5.8,6.1 5,5.5 4.2,6.1 4.5,5.1 3.7,4.5 4.7,4.5" fill="#F4B400" />
          </>
        );

      case "UZB": // Uzbekistan: blue, white, green stripes with crescent canton
        return (
          <>
            <rect x="0" y="0" width="30" height="6" fill="#00A3E0" />
            <rect x="0" y="6" width="30" height="0.5" fill="#CE1126" />
            <rect x="0" y="6.5" width="30" height="7" fill="#FFFFFF" />
            <rect x="0" y="13.5" width="30" height="0.5" fill="#CE1126" />
            <rect x="0" y="14" width="30" height="6" fill="#1FAE51" />
            <circle cx="4.5" cy="3.2" r="1.3" fill="#FFFFFF" />
            <circle cx="5.5" cy="3.2" r="1.3" fill="#00A3E0" />
          </>
        );

      case "COL": // Colombia: yellow, blue, red horizontal stripes
        return (
          <>
            <rect x="0" y="0" width="30" height="10" fill="#FCD116" />
            <rect x="0" y="10" width="30" height="5" fill="#0038A8" />
            <rect x="0" y="15" width="30" height="5" fill="#C8102E" />
          </>
        );

      case "ENG": // England: white with red cross
        return (
          <>
            <rect x="0" y="0" width="30" height="20" fill="#FFFFFF" />
            <rect x="13.5" y="0" width="3" height="20" fill="#CE1126" />
            <rect x="0" y="8.5" width="30" height="3" fill="#CE1126" />
          </>
        );

      case "CRO": // Croatia: red, white, blue stripes with checkers shield
        return (
          <>
            <rect x="0" y="0" width="30" height="6.7" fill="#FF0000" />
            <rect x="0" y="6.7" width="30" height="6.7" fill="#FFFFFF" />
            <rect x="0" y="13.4" width="30" height="6.6" fill="#171796" />
            <rect x="13.5" y="5.2" width="3" height="3.6" fill="#FF0000" stroke="#FFFFFF" strokeWidth="0.3" />
            <rect x="14" y="5.7" width="1" height="1" fill="#FFFFFF" />
            <rect x="15" y="6.7" width="1" height="1" fill="#FFFFFF" />
          </>
        );

      case "GHA": // Ghana: red, yellow, green stripes with center black star
        return (
          <>
            <rect x="0" y="0" width="30" height="6.7" fill="#DA291C" />
            <rect x="0" y="6.7" width="30" height="6.7" fill="#FCD116" />
            <rect x="0" y="13.4" width="30" height="6.6" fill="#006B3F" />
            <polygon points="15,7.8 15.5,9.5 17.2,9.5 15.8,10.5 16.3,12.2 15,11.2 13.7,12.2 14.2,10.5 12.8,9.5 14.5,9.5" fill="#000000" />
          </>
        );

      case "PAN": // Panama: four quarters, blue & red stars representation
        return (
          <>
            <rect x="0" y="0" width="15" height="10" fill="#FFFFFF" />
            <rect x="15" y="0" width="15" height="10" fill="#D21034" />
            <rect x="0" y="10" width="15" height="10" fill="#005293" />
            <rect x="15" y="10" width="15" height="10" fill="#FFFFFF" />
            <polygon points="7.5,3.5 7.8,4.5 8.8,4.5 8,5.1 8.3,6.1 7.5,5.5 6.7,6.1 7,4.5 6.2,4.5 7.2,4.5" fill="#005293" />
            <polygon points="22.5,13.5 22.8,14.5 23.8,14.5 23,15.1 23.3,16.1 22.5,15.5 21.7,16.1 22,14.5 21.2,14.5 22.2,14.5" fill="#D21034" />
          </>
        );

      default: // Fallback if country key is unknown
        return <rect x="0" y="0" width="30" height="20" fill="#CCCCCC" />;
    }
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 30 20"
      className={className}
    >
      {renderFlagContent(countryKey)}
    </svg>
  );
}
