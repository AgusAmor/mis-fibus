import { useState, useEffect } from "react";
import {
  FaTimes,
  FaInfoCircle,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import { StickerLegend } from "./components/StickerLegend";
import { GestureGuide } from "./components/GestureGuide";
import { ShortcutsGuide } from "./components/ShortcutsGuide";
import { useRoomCheck } from "../../hooks/useRoomCheck";

/**
 * HelpModal — modal dialog that introduces the app and guides new users through setup.
 *
 * Responsibilities:
 *  - Display the modal shell and section structure.
 *  - Compose StickerLegend, GestureGuide, and the room setup form.
 *  - Use useRoomCheck for the debounced Firestore room-existence check.
 *  - Delegate confirmation to the onClose callback with the chosen room code.
 */
export function HelpModal({ isOpen, onClose, albumCode }) {
  const [render, setRender] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setRender(true);
      setIsClosing(false);
    } else if (render) {
      setIsClosing(true);
      const timer = setTimeout(() => {
        setRender(false);
        setIsClosing(false);
      }, 200); // Wait for the 200ms scale-out/fade-out exit animation
      return () => clearTimeout(timer);
    }
  }, [isOpen, render]);

  const isRoomNotSet = albumCode === "sala_predeterminada";
  const [roomInput, setRoomInput] = useState("");

  // Debounced check for whether the typed room code already exists in Firestore
  const { roomExists, isCheckingRoom } = useRoomCheck(roomInput);

  const handleConfirm = () => {
    if (isRoomNotSet) {
      if (roomInput.trim() && roomInput.trim() !== "sala_predeterminada") {
        onClose(roomInput.trim());
      }
    } else {
      onClose();
    }
  };

  if (!render) return null;

  return (
    <div className={`fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-100 p-4 ${isClosing ? "animate-fade-out" : "animate-fade-in"}`}>
      <div
        className={`bg-bg-base border-2 border-primary/20 rounded-3xl shadow-2xl w-full max-w-lg overflow-y-auto max-h-[90vh] flex flex-col relative ${isClosing ? "animate-scale-out" : "animate-scale-in"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button — hidden when the room has not yet been configured */}
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
            Aprendé a registrar tus figuritas y compartirlas en tiempo real.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 py-4 flex flex-col gap-5 overflow-y-auto">
          {/* Visual legend of sticker states */}
          <StickerLegend />

          {/* Gesture interaction guide */}
          <GestureGuide />

          {/* Shortcuts guide */}
          <ShortcutsGuide />

          {/* Shared rooms explanation */}
          <div className="bg-primary/5 border border-primary/10 p-3.5 rounded-2xl">
            <h4 className="text-xs font-bold text-primary m-0 uppercase tracking-wide">
              Álbum Compartido en Tiempo Real
            </h4>
            <p className="text-[11px] text-slate-600 m-0 mt-1 leading-relaxed font-medium">
              Podés invitar a otra persona compartiendo el código de tu sala.
              Cualquier cambio que realicen se verá reflejado en el dispositivo
              del otro.
            </p>
          </div>

          {/* Room setup form — shown only when no room has been configured yet */}
          {isRoomNotSet && (
            <div className="bg-amber-500/5 border border-amber-500/20 p-4.5 rounded-2xl flex flex-col gap-2.5">
              <h4 className="text-xs font-bold text-slate-700 m-0 uppercase tracking-wide flex items-center gap-1.5">
                Configura tu Sala
              </h4>
              <p className="text-[11px] text-slate-500 m-0 leading-relaxed font-medium">
                Para evitar compartir el mismo álbum con otros usuarios, ingresá
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

                {/* Real-time availability feedback */}
                <div className="min-h-4.5 mt-1">
                  {isCheckingRoom && (
                    <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1 animate-pulse">
                      Buscando sala en la nube...
                    </span>
                  )}
                  {!isCheckingRoom && roomExists === true && (
                    <span className="text-[10px] text-blue-600 font-semibold flex items-center gap-1.5">
                      <FaInfoCircle className="text-[10px] shrink-0" /> Esta
                      sala ya existe. Te unirás al álbum compartido existente.
                    </span>
                  )}
                  {!isCheckingRoom && roomExists === false && (
                    <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1.5">
                      <FaCheckCircle className="text-[10px] shrink-0" /> Nombre
                      disponible. Se creará un nuevo álbum privado.
                    </span>
                  )}
                </div>
              </div>

              {/* Security warning */}
              <p className="text-[10px] text-red-500 font-semibold leading-relaxed m-0 mt-0.5 flex items-start gap-1.5">
                <FaExclamationTriangle className="text-[10px] shrink-0 mt-0.5" />{" "}
                No compartas este código con extraños. Cualquiera que tenga el
                código de tu sala podrá ver y modificar tu álbum.
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
