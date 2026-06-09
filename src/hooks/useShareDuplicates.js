import { useState } from "react";
import { albumOrderedStickers } from "../constants/albumSections";
import { COUNTRY_EMOJIS } from "../constants/countryData";

/**
 * useShareDuplicates - Hook to compile, format and copy/share duplicate stickers.
 * 
 * Responsibilities:
 *  - Compute if the album has duplicate stickers.
 *  - Formats duplicates list grouped by category with flags and quantities.
 *  - Shares using Web Share API on mobile or clipboard fallback on desktop.
 */
export function useShareDuplicates(getStickerStatus) {
  const [copied, setCopied] = useState(false);

  const hasDuplicates = albumOrderedStickers.some(
    (s) => getStickerStatus(s.id).dup > 0,
  );

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  const handleShareRepeated = async () => {
    const repeatedStickers = albumOrderedStickers.filter((s) => {
      const status = getStickerStatus(s.id);
      return status.dup > 0;
    });

    if (repeatedStickers.length === 0) {
      alert("No tenés figuritas repetidas para compartir.");
      return;
    }

    // Group duplicates by team/section key to format according to user layout
    const groups = [];
    const groupMap = {};

    repeatedStickers.forEach((s) => {
      const status = getStickerStatus(s.id);
      
      // Separate FWC into Specials (<= 8) and History (>= 9) matching album sections
      let groupKey = s.team;
      if (s.group === "SPECIAL" || (s.group === "FWC" && parseInt(s.number, 10) <= 8)) {
        groupKey = "FWC_SPECIAL";
      } else if (s.group === "FWC" && parseInt(s.number, 10) >= 9) {
        groupKey = "FWC_HISTORY";
      }

      if (!groupMap[groupKey]) {
        groupMap[groupKey] = {
          team: groupKey,
          stickers: []
        };
        groups.push(groupMap[groupKey]);
      }

      groupMap[groupKey].stickers.push({
        s,
        dup: status.dup
      });
    });

    // Format each team/category group into a display line
    const formattedList = groups
      .map((g) => {
        let label = g.team;
        let emoji = "⚽";

        if (g.team === "FWC_SPECIAL" || g.team === "FWC_HISTORY") {
          label = "FWC";
          emoji = "🏆";
        } else if (g.team === "CC") {
          label = "CC";
          emoji = "🥤";
        } else if (COUNTRY_EMOJIS[g.team]) {
          emoji = COUNTRY_EMOJIS[g.team];
        }

        const numbersList = g.stickers
          .map(({ s, dup }) => {
            const displayNum = s.number === "00" ? "00" : parseInt(s.number, 10).toString();
            return dup > 1 ? `${displayNum} (x${dup})` : displayNum;
          })
          .join(", ");

        return `${label} ${emoji} : ${numbersList}`;
      })
      .join("\n");

    const totalDups = repeatedStickers.reduce(
      (acc, s) => acc + getStickerStatus(s.id).dup,
      0,
    );

    const shareText = `¿Querés cambiar? 🔄\nMis Fibus Repetidas (${totalDups})\n\n${formattedList}`;

    // Detect if the client is on a mobile browser or desktop computer
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    );

    if (navigator.share && isMobile) {
      try {
        await navigator.share({
          title: "Mis Fibus Repetidas",
          text: shareText,
        });
      } catch (err) {
        // Fallback to clipboard if share sheet fails (e.g., sharing cancelled by user)
        if (err.name !== "AbortError") {
          copyToClipboard(shareText);
        }
      }
    } else {
      copyToClipboard(shareText);
    }
  };

  return { copied, handleShareRepeated, hasDuplicates };
}
