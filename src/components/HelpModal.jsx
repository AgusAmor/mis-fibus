import { useState, useEffect } from "react";
import { FaCheck, FaTimes, FaLock, FaInfoCircle, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { TbHandMove, TbHandClick, TbHandFinger } from "react-icons/tb";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export function HelpModal({ isOpen, onClose, albumCode }) {
  if (!isOpen) return null;

  const isRoomNotSet = albumCode === "sala_predeterminada";
  const [roomInput, setRoomInput] = useState("");
  const [roomExists, setRoomExists] = useState(null);
  const [isCheckingRoom, setIsCheckingRoom] = useState(false);

  // Debounced check if the room already exists in Firestore
  useEffect(() => {
    const cleanCode = roomInput.trim().toLowerCase();
    if (!cleanCode || cleanCode === "sala_predeterminada") {
      setRoomExists(null);
      return;
    }

    setIsCheckingRoom(true);
    const delayDebounce = setTimeout(async () => {
      try {
        const docRef = doc(db, "albums", cleanCode);
        const docSnap = await getDoc(docRef);
        setRoomExists(docSnap.exists());
      } catch (err) {
        console.error("Error checking room existence in Firestore:", err);
      } finally {
        setIsCheckingRoom(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [roomInput]);

  const handleConfirm = () => {
    if (isRoomNotSet) {
      if (roomInput.trim() && roomInput.trim() !== "sala_predeterminada") {
        onClose(roomInput.trim());
      }
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-100 p-4 animate-fade-in">
      <div
        className="bg-bg-base border-2 border-primary/20 rounded-3xl shadow-2xl w-full max-w-lg overflow-y-auto max-h-[90vh] flex flex-col relative animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button Top Right */}
        {!isRoomNotSet && (
          <button
            onClick={() => onClose()}
            className="absolute top-4 right-4 text-slate-400 hover:text-primary transition-colors cursor-pointer p-1.5 rounded-lg hover:bg-slate-100"
            aria-label="Cerrar"
          >
            <FaTimes className="text-base" />
          </button>
        )}

        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-slate-200">
          <h2 className="text-xl font-montserrat font-extrabold text-primary uppercase tracking-wide flex items-center gap-2">
            Guía de Uso - Mis Fibus
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
            Aprende a registrar tus figuritas y compartirlas en tiempo real.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 py-4 flex flex-col gap-5 overflow-y-auto">
          {/* Card Legend */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
              Estados de las Figuritas
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white border border-slate-100 p-4.5 rounded-2xl shadow-xs justify-items-center">
              {/* Faltante */}
              <div className="flex flex-col items-center gap-1.5">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">
                  Faltante
                </span>
                <div className="w-16 h-18 bg-white text-slate-400 border border-slate-200/85 rounded-xl flex flex-col items-center justify-center select-none shadow-xs">
                  <span className="font-bebas text-sm leading-none">ARG17</span>
                  <span className="font-medium text-center text-[6px] px-1 mt-0.5 leading-tight opacity-85">
                    Lionel Messi
                  </span>
                </div>
              </div>

              {/* Obtenida */}
              <div className="flex flex-col items-center gap-1.5">
                <span className="text-[9px] font-bold text-success uppercase tracking-wide">
                  Obtenida
                </span>
                <div className="w-16 h-18 bg-[#E8F8F0] text-success border border-success/60 rounded-xl flex flex-col items-center justify-center select-none relative shadow-xs">
                  <span className="font-bebas text-sm leading-none">ARG17</span>
                  <span className="font-medium text-center text-[6px] px-1 mt-0.5 leading-tight opacity-85">
                    Lionel Messi
                  </span>
                  <span className="absolute top-1 right-1 text-[6px] bg-success/10 border border-success/30 text-success w-3.5 h-3.5 rounded-full flex items-center justify-center">
                    <FaCheck className="text-[5px]" />
                  </span>
                </div>
              </div>

              {/* Repetida */}
              <div className="flex flex-col items-center gap-1.5">
                <span className="text-[9px] font-bold text-accent uppercase tracking-wide">
                  Repetida
                </span>
                <div className="w-16 h-18 bg-[#FEF8E7] text-accent border border-accent/70 rounded-xl flex flex-col items-center justify-center select-none relative shadow-xs">
                  <span className="font-bebas text-sm leading-none">ARG17</span>
                  <span className="font-medium text-center text-[6px] px-1 mt-0.5 leading-tight opacity-85">
                    Lionel Messi
                  </span>
                  <span className="absolute top-1 right-1 text-[8px] bg-accent/10 border border-accent/30 text-accent px-1.5 py-0.5 rounded-full font-bebas leading-none">
                    x1
                  </span>
                </div>
              </div>

              {/* Favorita */}
              <div className="flex flex-col items-center gap-1.5">
                <span className="text-[9px] font-bold text-amber-600 uppercase tracking-wide">
                  Favorita
                </span>
                <div className="w-16 h-18 bg-[#E8F8F0] text-success border-2 border-amber-500 shadow-md shadow-amber-500/25 rounded-xl flex flex-col items-center justify-center select-none relative">
                  <span className="font-bebas text-sm leading-none">ARG17</span>
                  <span className="font-medium text-center text-[6px] px-1 mt-0.5 leading-tight opacity-85">
                    Lionel Messi
                  </span>
                  <span className="absolute top-1 right-1 text-[6px] bg-success/10 border border-success/30 text-success w-3.5 h-3.5 rounded-full flex items-center justify-center">
                    <FaCheck className="text-[5px]" />
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Interaction Gestures */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Gestos de Control
            </h3>
            <div className="flex flex-col gap-2.5">
              <div className="flex gap-3 bg-white p-3 rounded-2xl border border-slate-100 items-start">
                <div className="bg-[#E8F8F0] text-success p-2 rounded-xl text-sm shrink-0 mt-0.5">
                  <TbHandFinger />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-700 m-0 uppercase tracking-wide">
                    1 Toque / Click Corto
                  </h4>
                  <p className="text-[11px] text-slate-500 m-0 mt-0.5 leading-relaxed font-medium">
                    Marca la figurita como <strong>Obtenida</strong>. Si ya la
                    tienes, le añade una <strong>Repetida</strong> (x1, x2,
                    etc.).
                  </p>
                </div>
              </div>

              <div className="flex gap-3 bg-white p-3 rounded-2xl border border-slate-100 items-start">
                <div className="bg-red-50 text-red-500 p-2 rounded-xl text-sm shrink-0 mt-0.5">
                  <TbHandClick />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-700 m-0 uppercase tracking-wide">
                    Presionar 1 Segundo (Hold)
                  </h4>
                  <p className="text-[11px] text-slate-500 m-0 mt-0.5 leading-relaxed font-medium">
                    <strong>Resta</strong> una repetida. Si llega a 0, la
                    desmarca completamente volviéndola <strong>Faltante</strong>
                    .
                  </p>
                </div>
              </div>

              <div className="flex gap-3 bg-white p-3 rounded-2xl border border-slate-100 items-start">
                <div className="bg-amber-50 text-amber-500 p-2 rounded-xl text-sm shrink-0 mt-0.5">
                  <TbHandMove />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-700 m-0 uppercase tracking-wide">
                    Doble Toque / Double Tap
                  </h4>
                  <p className="text-[11px] text-slate-500 m-0 mt-0.5 leading-relaxed font-medium">
                    Marca o desmarca la figurita como <strong>Favorita</strong>{" "}
                    (destaca la figurita con un borde dorado).
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Shared Rooms */}
          <div className="bg-primary/5 border border-primary/10 p-3.5 rounded-2xl">
            <h4 className="text-xs font-bold text-primary m-0 uppercase tracking-wide">
              Álbum Compartido en Tiempo Real
            </h4>
            <p className="text-[11px] text-slate-600 m-0 mt-1 leading-relaxed font-medium">
              Puedes invitar a otra persona compartiendo el código de tu sala.
              Cualquier cambio que realicen se reflejará en ambos teléfonos.
            </p>
          </div>

          {/* Conditional Room Configuration */}
          {isRoomNotSet && (
            <div className="bg-amber-500/5 border border-amber-500/20 p-4.5 rounded-2xl flex flex-col gap-2.5">
              <h4 className="text-xs font-bold text-slate-700 m-0 uppercase tracking-wide flex items-center gap-1.5">
                Configura tu Sala
              </h4>
              <p className="text-[11px] text-slate-500 m-0 leading-relaxed font-medium">
                Para evitar compartir el mismo álbum con otros usuarios, ingresa
                un nombre o código único para tu sala (ej.{" "}
                <em>nuestro_album_2026</em>).
              </p>
              <div className="flex flex-col gap-1 mt-1">
                <input
                  type="text"
                  value={roomInput}
                  onChange={(e) => setRoomInput(e.target.value)}
                  placeholder="ej. mi_album_privado"
                  className="bg-white border border-slate-200 text-slate-800 rounded-xl p-3 text-xs outline-none focus:border-primary focus:shadow-[0_0_8px_rgba(94,11,25,0.15)] transition-all duration-300 w-full"
                />

                {/* Real-time feedback status */}
                <div className="min-h-4.5 mt-1">
                  {isCheckingRoom && (
                    <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1 animate-pulse">
                      Buscando sala en la nube...
                    </span>
                  )}
                  {!isCheckingRoom && roomExists === true && (
                    <span className="text-[10px] text-blue-600 font-semibold flex items-center gap-1.5">
                      <FaInfoCircle className="text-[10px] shrink-0" /> Esta sala ya existe. Te unirás al álbum compartido existente.
                    </span>
                  )}
                  {!isCheckingRoom && roomExists === false && (
                    <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1.5">
                      <FaCheckCircle className="text-[10px] shrink-0" /> Nombre disponible. Se creará un nuevo álbum privado.
                    </span>
                  )}
                </div>
              </div>

              {/* Security Warning */}
              <p className="text-[10px] text-red-500 font-semibold leading-relaxed m-0 mt-0.5 flex items-start gap-1.5">
                <FaExclamationTriangle className="text-[10px] shrink-0 mt-0.5" /> No compartas este código con extraños. Cualquiera que tenga el código de tu sala podrá ver y modificar tu álbum.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-5 border-t border-slate-200 flex justify-center bg-white rounded-b-3xl">
          <button
            onClick={handleConfirm}
            disabled={
              isRoomNotSet &&
              (!roomInput.trim() || roomInput.trim() === "sala_predeterminada")
            }
            className={`w-full max-w-xs font-montserrat text-xs uppercase tracking-wider font-extrabold py-3 px-6 rounded-xl transition-all duration-300 ${
              isRoomNotSet &&
              (!roomInput.trim() || roomInput.trim() === "sala_predeterminada")
                ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                : "bg-primary hover:bg-primary/95 text-white cursor-pointer hover:shadow-lg"
            }`}
          >
            ¡Entendido!
          </button>
        </div>
      </div>
    </div>
  );
}
