import { useState } from "react";
import { FaShareAlt, FaCheck } from "react-icons/fa";
import { albumOrderedStickers } from "../../constants/albumSections";
import { COUNTRY_EMOJIS } from "../../constants/countryData";

// ShareDuplicatesButton Component
// Handles the compiling, formatting, and copying/sharing of duplicate stickers
export function ShareDuplicatesButton({
  statusFilter,
  albumCode,
  getStickerStatus,
}) {
  // Local state to track if copy-to-clipboard was completed successfully
  const [copied, setCopied] = useState(false);

  // Render nothing if the duplicates filter is not active
  if (statusFilter !== "duplicated") return null;

  // Scan the album list to check if at least one duplicate exists
  const hasDuplicates = albumOrderedStickers.some(
    (s) => getStickerStatus(s.id).dup > 0,
  );

  // Copy formatted text to clipboard and trigger temporary visual success state
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

  // Compile list of duplicates, format and dispatch via Web Share API or clipboard fallback
  const handleShareRepeated = async () => {
    const repeatedStickers = albumOrderedStickers.filter((s) => {
      const status = getStickerStatus(s.id);
      return status.dup > 0;
    });

    if (repeatedStickers.length === 0) {
      alert("No tenés figuritas repetidas para compartir.");
      return;
    }

    // Group duplicates by team key to format according to user layout
    const groups = [];
    const groupMap = {};

    repeatedStickers.forEach((s) => {
      const status = getStickerStatus(s.id);
      const teamKey = s.team === "SPECIAL" ? "FWC" : s.team;

      if (!groupMap[teamKey]) {
        groupMap[teamKey] = {
          team: teamKey,
          stickers: []
        };
        groups.push(groupMap[teamKey]);
      }

      groupMap[teamKey].stickers.push({
        s,
        dup: status.dup
      });
    });

    // Format each team/category group into a display line
    const formattedList = groups
      .map((g) => {
        let emoji = "⚽";
        if (g.team === "FWC") {
          emoji = "🏆";
        } else if (g.team === "CC") {
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

        return `${g.team} ${emoji} : ${numbersList}`;
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

  return (
    <button
      onClick={handleShareRepeated}
      disabled={!hasDuplicates}
      className={`w-full rounded-xl py-3 px-4 font-montserrat font-extrabold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 ${
        !hasDuplicates
          ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
          : copied
            ? "bg-success text-white border-2 border-success/45 hover:shadow-lg hover:shadow-success/15 active:scale-[0.98] cursor-pointer"
            : "bg-secondary hover:bg-secondary/90 text-white border-2 border-accent/45 hover:border-accent hover:shadow-lg hover:shadow-secondary/15 active:scale-[0.98] cursor-pointer"
      }`}
    >
      {copied ? (
        <>
          <FaCheck className="text-sm text-white/80 animate-bounce" />{" "}
          ¡Copiado al portapapeles!
        </>
      ) : (
        <>
          <FaShareAlt
            className={`text-sm ${hasDuplicates ? "text-accent" : "text-slate-400"}`}
          />{" "}
          Compartir repetidas
        </>
      )}
    </button>
  );
}
