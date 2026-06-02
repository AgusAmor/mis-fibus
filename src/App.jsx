import { useState, useEffect } from "react";
import { db } from "./firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import originalStickers from "../fibus_album.json";

function App() {
  // Shared Album Room Code State
  const [albumCode, setAlbumCode] = useState(() => {
    return localStorage.getItem("fibus_album_code") || "fibus_mundial_2026";
  });

  // Settings Panel Visibility
  const [showSettings, setShowSettings] = useState(false);

  // Cloud Sincronization Status State
  const [syncStatus, setSyncStatus] = useState("disconnected"); // 'disconnected', 'syncing', 'synced', 'offline', 'error'

  // Sticker Inventory State
  const [stickersState, setStickersState] = useState({});

  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // 'all', 'missing', 'owned', 'duplicated'
  const [sectionFilter, setSectionFilter] = useState("all"); // 'all', 'SPECIAL', 'A', 'B', etc.

  // Accordion Expansions State
  const [expandedGroups, setExpandedGroups] = useState({
    FWC_SPECIAL_CC: true,
    A: false,
    B: false,
    C: false,
    D: false,
    E: false,
    F: false,
    G: false,
    H: false,
    I: false,
    J: false,
    K: false,
    L: false,
  });

  // Real-Time Cloud Sincronization with Firestore
  useEffect(() => {
    if (!albumCode.trim()) {
      setSyncStatus("disconnected");
      return;
    }

    setSyncStatus("syncing");
    const docRef = doc(db, "albums", albumCode.trim().toLowerCase());

    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.stickers) {
            setStickersState(data.stickers);
          }
          setSyncStatus("synced");
        } else {
          setSyncStatus("synced");
          setStickersState({});
        }
      },
      (error) => {
        console.error("Firestore sync error:", error);
        if (!navigator.onLine) {
          setSyncStatus("offline");
        } else {
          setSyncStatus("error");
        }
      },
    );

    return () => unsubscribe();
  }, [albumCode]);

  // Handle local storage caching of preferences
  useEffect(() => {
    localStorage.setItem("fibus_album_code", albumCode);
  }, [albumCode]);

  // Update a sticker count in Firestore
  const updateSticker = async (stickerId, updates) => {
    const newStickers = {
      ...stickersState,
      [stickerId]: {
        ...(stickersState[stickerId] || { have: false, duplicated: 0 }),
        ...updates,
      },
    };

    // Optimistic local state update for zero-latency feel
    setStickersState(newStickers);

    try {
      const docRef = doc(db, "albums", albumCode.trim().toLowerCase());
      await setDoc(
        docRef,
        {
          stickers: newStickers,
          lastUpdated: new Date().toISOString(),
        },
        { merge: true },
      );
    } catch (e) {
      console.error("Error writing document to Firestore:", e);
      if (!navigator.onLine) {
        setSyncStatus("offline");
      }
    }
  };

  // Sticker click interaction
  const handleToggleHave = (id) => {
    const current = stickersState[id] || { have: false, duplicated: 0 };
    updateSticker(id, { have: !current.have });
  };

  // Duplicate adjustment interactions
  const handleIncrementDup = (id) => {
    const current = stickersState[id] || { have: false, duplicated: 0 };
    updateSticker(id, {
      have: true,
      duplicated: (current.duplicated || 0) + 1,
    });
  };

  const handleDecrementDup = (id) => {
    const current = stickersState[id] || { have: false, duplicated: 0 };
    if ((current.duplicated || 0) <= 0) return;
    updateSticker(id, {
      duplicated: (current.duplicated || 0) - 1,
    });
  };

  const toggleGroup = (groupKey) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupKey]: !prev[groupKey],
    }));
  };

  const getStickerStatus = (sticker) => {
    const state = stickersState[sticker.id] || {};
    return {
      have: state.have || false,
      dup: state.duplicated || 0,
    };
  };

  // Stickers categories definitions
  const sections = {
    FWC_SPECIAL_CC: originalStickers.filter(
      (s) => s.group === "SPECIAL" || s.group === "FWC" || s.group === "CC",
    ),
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

  const groupTeams = {
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

  const countries = {};
  originalStickers.forEach((s) => {
    if (s.group !== "SPECIAL" && s.group !== "FWC" && s.group !== "CC") {
      if (!countries[s.team]) {
        countries[s.team] = [];
      }
      countries[s.team].push(s);
    }
  });

  const getFilteredStickers = (stickerList) => {
    return stickerList.filter((s) => {
      const status = getStickerStatus(s);
      const matchesSearch =
        s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.team.toLowerCase().includes(searchQuery.toLowerCase());

      let matchesStatus = true;
      if (statusFilter === "missing") {
        matchesStatus = !status.have;
      } else if (statusFilter === "owned") {
        matchesStatus = status.have;
      } else if (statusFilter === "duplicated") {
        matchesStatus = status.dup > 0;
      }

      let matchesSection = true;
      if (sectionFilter !== "all") {
        if (sectionFilter === "SPECIAL") {
          matchesSection =
            s.group === "SPECIAL" || s.group === "FWC" || s.group === "CC";
        } else {
          matchesSection = s.group === sectionFilter;
        }
      }

      return matchesSearch && matchesStatus && matchesSection;
    });
  };

  const totalStickersCount = originalStickers.length;

  const getStats = () => {
    let owned = 0;
    let dups = 0;

    originalStickers.forEach((s) => {
      const state = stickersState[s.id] || {};
      if (state.have) owned++;
      dups += state.duplicated || 0;
    });

    return {
      total: totalStickersCount,
      owned,
      percent: ((owned / totalStickersCount) * 100).toFixed(1),
      dups,
    };
  };

  const stats = getStats();

  const getSyncIcon = () => {
    switch (syncStatus) {
      case "syncing":
        return (
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide bg-white/10 text-white animate-pulse">
            🔄 Sincronizando...
          </span>
        );
      case "synced":
        return (
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
            🟢 En Línea
          </span>
        );
      case "offline":
        return (
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide bg-amber-500/15 text-amber-400 border border-amber-500/20">
            ⚠️ Modo Offline
          </span>
        );
      case "error":
        return (
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide bg-red-500/15 text-red-400 border border-red-500/20">
            🔴 Error
          </span>
        );
      default:
        return (
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide bg-white/5 text-slate-400">
            ⚪ Desconectado
          </span>
        );
    }
  };

  return (
    <div className="w-full max-w-[800px] mx-auto min-h-screen flex flex-col box-border pb-8">
      {/* Header */}
      <header className="flex justify-between items-center px-4 py-5 border-b border-white/10 bg-[#062315]/80 backdrop-blur-2xl sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🏆</span>
          <div>
            <h1 className="text-xl font-extrabold tracking-wider bg-gradient-to-r from-white to-accent-gold bg-clip-text text-transparent filter drop-shadow-[0_2px_10px_rgba(212,175,55,0.2)]">
              FIBUS 2026
            </h1>
          </div>
          <span className="text-[9px] font-semibold text-accent-gold border border-accent-gold px-1.5 py-0.5 rounded uppercase tracking-widest ml-1">
            Compartido
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end gap-1">
            <span className="text-xs text-slate-400">
              Sala:{" "}
              <strong className="text-white uppercase">{albumCode}</strong>
            </span>
            {getSyncIcon()}
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2.5 rounded-xl border border-white/10 hover:border-white/20 bg-white/[0.03] hover:bg-white/[0.07] text-slate-300 hover:text-white cursor-pointer transition-all duration-300 shadow-md"
            title="Ajustes de Sincronización"
          >
            ⚙️
          </button>
        </div>
      </header>

      {/* Settings Panel */}
      {showSettings && (
        <section className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl rounded-3xl p-5 m-4 flex flex-col gap-3 shadow-xl transition-all duration-500">
          <h3 className="m-0 text-sm font-bold text-accent-gold">
            ⚙️ Configuración del Álbum
          </h3>
          <p className="text-xs text-slate-400 m-0 leading-relaxed">
            Ingresen el mismo código de sala compartido en sus respectivos
            celulares para ver y registrar sus figuritas en tiempo real.
          </p>
          <div className="flex flex-col gap-1.5 mt-1">
            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wide">
              Código de Sala
            </label>
            <input
              type="text"
              value={albumCode}
              onChange={(e) => setAlbumCode(e.target.value)}
              placeholder="ej. elmo-y-novia"
              className="bg-[#062315]/80 border border-white/[0.08] text-white rounded-xl p-3 text-sm outline-none focus:border-accent-gold focus:shadow-[0_0_8px_rgba(212,175,55,0.2)] transition-all duration-300"
            />
          </div>
        </section>
      )}

      {/* Hero Stats Panel */}
      <section className="bg-gradient-to-b from-primary-emerald-light/10 to-primary-emerald-dark/30 border border-white/10 rounded-3xl p-6 m-4 relative overflow-hidden shadow-xl shadow-black/25">
        <div className="absolute -top-1/2 -right-1/5 w-[300px] h-[300px] rounded-full bg-gradient-to-br from-accent-gold/15 to-transparent blur-3xl z-0"></div>

        <div className="relative z-10 flex flex-col gap-2.5">
          <span className="text-xs font-bold text-accent-gold uppercase tracking-wider">
            Progreso del Álbum
          </span>

          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent tracking-tight">
              {stats.percent}%
            </span>
            <span className="text-xs text-slate-400">completado</span>
          </div>

          <div className="bg-white/5 border border-white/10 h-4.5 rounded-full overflow-hidden shadow-inner shadow-black/40">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all duration-800 rounded-full"
              style={{ width: `${stats.percent}%` }}
            ></div>
          </div>

          <div className="flex justify-between items-center text-xs text-slate-400 mt-0.5">
            <span>
              Tenemos {stats.owned} de {stats.total} figuritas
            </span>
            <span className="text-accent-gold font-medium">
              🔁 {stats.dups} repetidas
            </span>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="px-4 flex-grow flex flex-col gap-4">
        {/* Search & Filters */}
        <div className="flex flex-col gap-3">
          <div className="relative bg-white/[0.03] border border-white/[0.06] rounded-xl flex items-center px-3 focus-within:border-accent-gold transition-all duration-300">
            <span className="text-slate-400 text-sm">🔍</span>
            <input
              type="text"
              placeholder="Buscar por código (ej. ARG10, FWC04, MEX)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none text-white text-sm py-3 px-2 w-full outline-none"
            />
            {searchQuery && (
              <button
                className="bg-none border-none text-slate-400 cursor-pointer p-1 hover:text-white"
                onClick={() => setSearchQuery("")}
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 bg-[#062315]/80 border border-white/[0.08] text-slate-200 rounded-xl p-2.5 text-xs font-semibold outline-none cursor-pointer focus:border-accent-gold transition-all duration-300"
            >
              <option value="all">Todas las figuritas</option>
              <option value="missing">Faltantes</option>
              <option value="owned">Tenemos</option>
              <option value="duplicated">Repetidas</option>
            </select>

            <select
              value={sectionFilter}
              onChange={(e) => setSectionFilter(e.target.value)}
              className="flex-1 bg-[#062315]/80 border border-white/[0.08] text-slate-200 rounded-xl p-2.5 text-xs font-semibold outline-none cursor-pointer focus:border-accent-gold transition-all duration-300"
            >
              <option value="all">Todas las secciones</option>
              <option value="SPECIAL">Especiales & Sedes</option>
              {["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"].map(
                (g) => (
                  <option key={g} value={g}>
                    Grupo {g}
                  </option>
                ),
              )}
            </select>
          </div>
        </div>

        {/* Accordion Board */}
        <div className="flex flex-col gap-3">
          {/* Especiales & Sedes */}
          {(sectionFilter === "all" || sectionFilter === "SPECIAL") && (
            <div className="border border-white/[0.08] rounded-2xl overflow-hidden bg-white/[0.04]">
              <header
                className="flex justify-between items-center px-5 py-4 cursor-pointer hover:bg-white/[0.02] select-none"
                onClick={() => toggleGroup("FWC_SPECIAL_CC")}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">✨</span>
                  <h2 className="text-sm font-bold text-white">
                    Especiales & Sedes
                  </h2>
                </div>
                <span className="text-xs text-slate-400">
                  {expandedGroups.FWC_SPECIAL_CC ? "▲" : "▼"}
                </span>
              </header>

              {expandedGroups.FWC_SPECIAL_CC && (
                <div className="p-4 border-t border-white/[0.08] bg-black/15">
                  <div className="grid grid-cols-[repeat(auto-fill,minmax(65px,1fr))] gap-2 sm:grid-cols-[repeat(auto-fill,minmax(70px,1fr))]">
                    {getFilteredStickers(sections.FWC_SPECIAL_CC).map(
                      (sticker) => {
                        const status = getStickerStatus(sticker);
                        return (
                          <div
                            key={sticker.id}
                            className={`flex flex-col rounded-xl overflow-hidden transition-all duration-300 aspect-[1/1.1] border ${
                              status.dup > 0
                                ? "bg-accent-gold/10 border-accent-gold/45 hover:bg-accent-gold/15 hover:border-accent-gold/60 shadow-inner shadow-accent-gold/5 hover:-translate-y-0.5 hover:scale-[1.03] hover:shadow-accent-gold/25 hover:shadow-lg"
                                : status.have
                                  ? "bg-emerald-500/10 border-emerald-500/40 hover:bg-emerald-500/15 hover:border-emerald-500/60 shadow-inner shadow-emerald-500/5 hover:-translate-y-0.5 hover:scale-[1.03] hover:shadow-emerald-500/20 hover:shadow-lg"
                                  : "bg-white/[0.02] border-white/[0.07] hover:border-white/20"
                            }`}
                          >
                            <div
                              className="flex-1 flex flex-col justify-center items-center relative cursor-pointer p-1.5"
                              onClick={() => handleToggleHave(sticker.id)}
                            >
                              <span
                                className={`text-[10px] font-extrabold ${status.dup > 0 ? "text-accent-gold-light" : status.have ? "text-emerald-400" : "text-slate-200"}`}
                              >
                                {sticker.id}
                              </span>
                              {status.have && (
                                <span className="text-[9px] font-black absolute top-1 right-1 text-emerald-400 bg-emerald-500/15 w-3.5 h-3.5 rounded-full flex items-center justify-center border border-emerald-500/30">
                                  ✓
                                </span>
                              )}
                            </div>
                            <div className="flex justify-between items-center border-t border-white/[0.04] bg-black/25 px-1 py-0.5">
                              <button
                                className="text-slate-400 hover:bg-white/[0.08] hover:text-white rounded w-4 h-4 flex items-center justify-center text-xs transition-all cursor-pointer"
                                onClick={() => handleDecrementDup(sticker.id)}
                              >
                                -
                              </button>
                              <span
                                className={`text-[9px] font-extrabold min-w-[14px] text-center ${status.dup > 0 ? "text-accent-gold-light" : "text-slate-400"}`}
                              >
                                {status.dup > 0 ? `x${status.dup}` : "-"}
                              </span>
                              <button
                                className="text-slate-400 hover:bg-white/[0.08] hover:text-white rounded w-4 h-4 flex items-center justify-center text-xs transition-all cursor-pointer"
                                onClick={() => handleIncrementDup(sticker.id)}
                              >
                                +
                              </button>
                            </div>
                          </div>
                        );
                      },
                    )}
                  </div>
                  {getFilteredStickers(sections.FWC_SPECIAL_CC).length ===
                    0 && (
                    <p className="text-xs text-slate-400 text-center my-2">
                      Ninguna figurita coincide con los filtros.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Group Stages A - L */}
          {["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"].map(
            (groupKey) => {
              if (sectionFilter !== "all" && sectionFilter !== groupKey)
                return null;
              const groupCountries = groupTeams[groupKey] || [];

              return (
                <div
                  key={groupKey}
                  className="border border-white/[0.08] rounded-2xl overflow-hidden bg-white/[0.04]"
                >
                  <header
                    className="flex justify-between items-center px-5 py-4 cursor-pointer hover:bg-white/[0.02] select-none"
                    onClick={() => toggleGroup(groupKey)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">⚽</span>
                      <h2 className="text-sm font-bold text-white">
                        Grupo {groupKey}
                      </h2>
                    </div>
                    <span className="text-xs text-slate-400">
                      {expandedGroups[groupKey] ? "▲" : "▼"}
                    </span>
                  </header>

                  {expandedGroups[groupKey] && (
                    <div className="p-4 border-t border-white/[0.08] bg-black/15 flex flex-col gap-6">
                      {groupCountries.map((countryKey) => {
                        const countryStickers = countries[countryKey] || [];
                        const filteredCountryStickers =
                          getFilteredStickers(countryStickers);

                        return (
                          <div key={countryKey} className="flex flex-col">
                            <h3 className="text-xs font-bold text-accent-gold mb-2.5 flex items-center gap-1.5 uppercase tracking-wide">
                              <span>🏳️</span>
                              {countryKey}
                            </h3>
                            <div className="grid grid-cols-[repeat(auto-fill,minmax(65px,1fr))] gap-2 sm:grid-cols-[repeat(auto-fill,minmax(70px,1fr))]">
                              {filteredCountryStickers.map((sticker) => {
                                const status = getStickerStatus(sticker);
                                return (
                                  <div
                                    key={sticker.id}
                                    className={`flex flex-col rounded-xl overflow-hidden transition-all duration-300 aspect-[1/1.1] border ${
                                      status.dup > 0
                                        ? "bg-accent-gold/10 border-accent-gold/45 hover:bg-accent-gold/15 hover:border-accent-gold/60 shadow-inner shadow-accent-gold/5 hover:-translate-y-0.5 hover:scale-[1.03] hover:shadow-accent-gold/25 hover:shadow-lg"
                                        : status.have
                                          ? "bg-emerald-500/10 border-emerald-500/40 hover:bg-emerald-500/15 hover:border-emerald-500/60 shadow-inner shadow-emerald-500/5 hover:-translate-y-0.5 hover:scale-[1.03] hover:shadow-emerald-500/20 hover:shadow-lg"
                                          : "bg-white/[0.02] border-white/[0.07] hover:border-white/20"
                                    }`}
                                  >
                                    <div
                                      className="flex-1 flex flex-col justify-center items-center relative cursor-pointer p-1.5"
                                      onClick={() =>
                                        handleToggleHave(sticker.id)
                                      }
                                    >
                                      <span
                                        className={`text-[10px] font-extrabold ${status.dup > 0 ? "text-accent-gold-light" : status.have ? "text-emerald-400" : "text-slate-200"}`}
                                      >
                                        {sticker.id}
                                      </span>
                                      {status.have && (
                                        <span className="text-[9px] font-black absolute top-1 right-1 text-emerald-400 bg-emerald-500/15 w-3.5 h-3.5 rounded-full flex items-center justify-center border border-emerald-500/30">
                                          ✓
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex justify-between items-center border-t border-white/[0.04] bg-black/25 px-1 py-0.5">
                                      <button
                                        className="text-slate-400 hover:bg-white/[0.08] hover:text-white rounded w-4 h-4 flex items-center justify-center text-xs transition-all cursor-pointer"
                                        onClick={() =>
                                          handleDecrementDup(sticker.id)
                                        }
                                      >
                                        -
                                      </button>
                                      <span
                                        className={`text-[9px] font-extrabold min-w-[14px] text-center ${status.dup > 0 ? "text-accent-gold-light" : "text-slate-400"}`}
                                      >
                                        {status.dup > 0
                                          ? `x${status.dup}`
                                          : "-"}
                                      </span>
                                      <button
                                        className="text-slate-400 hover:bg-white/[0.08] hover:text-white rounded w-4 h-4 flex items-center justify-center text-xs transition-all cursor-pointer"
                                        onClick={() =>
                                          handleIncrementDup(sticker.id)
                                        }
                                      >
                                        +
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
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
              );
            },
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-8 pt-4 border-t border-white/5 text-center">
        <p className="text-[10px] text-slate-400 m-0">
          FIBUS 2026 • Álbum Único Compartido en Tiempo Real • 💚
        </p>
      </footer>
    </div>
  );
}

export default App;
