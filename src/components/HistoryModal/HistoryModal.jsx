import { useState, useEffect } from "react";
import { FaTimes, FaHistory, FaCheckCircle, FaTrashAlt, FaPlusCircle, FaMinusCircle, FaStar, FaRegStar } from "react-icons/fa";
import { getVisibleHistory, ACTION_TYPES } from "../../utils/historyLogic";

/**
 * Agrupa los eventos del historial por fecha relativa ("Hoy", "Ayer", o la fecha formateada).
 */
const groupEventsByDate = (events) => {
  const groups = {};
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const isSameDay = (d1, d2) => d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();

  events.forEach(event => {
    const eventDate = new Date(event.timestamp);
    let dateLabel = "";

    if (isSameDay(eventDate, today)) {
      dateLabel = "Hoy";
    } else if (isSameDay(eventDate, yesterday)) {
      dateLabel = "Ayer";
    } else {
      dateLabel = new Intl.DateTimeFormat('es-AR', { day: 'numeric', month: 'short', year: 'numeric' }).format(eventDate);
    }

    if (!groups[dateLabel]) {
      groups[dateLabel] = [];
    }
    groups[dateLabel].push(event);
  });

  return groups;
};

const getActionInfo = (action) => {
  switch (action) {
    case ACTION_TYPES.OBTENIDA:
      return { label: "Obtenida", icon: <FaCheckCircle className="text-emerald-500" />, colorClass: "text-emerald-600", bgClass: "bg-emerald-50 border-emerald-100" };
    case ACTION_TYPES.ELIMINADA:
      return { label: "Eliminada", icon: <FaTrashAlt className="text-red-500" />, colorClass: "text-red-600", bgClass: "bg-red-50 border-red-100" };
    case ACTION_TYPES.REPETIDA_AGREGADA:
      return { label: "Repetida agregada", icon: <FaPlusCircle className="text-amber-500" />, colorClass: "text-amber-600", bgClass: "bg-amber-50 border-amber-100" };
    case ACTION_TYPES.REPETIDA_ELIMINADA:
      return { label: "Repetida eliminada", icon: <FaMinusCircle className="text-orange-500" />, colorClass: "text-orange-600", bgClass: "bg-orange-50 border-orange-100" };
    case ACTION_TYPES.FAVORITA_AGREGADA:
      return { label: "Favorita", icon: <FaStar className="text-yellow-500" />, colorClass: "text-yellow-600", bgClass: "bg-yellow-50 border-yellow-100" };
    case ACTION_TYPES.FAVORITA_ELIMINADA:
      return { label: "Ya no es favorita", icon: <FaRegStar className="text-slate-400" />, colorClass: "text-slate-500", bgClass: "bg-slate-50 border-slate-200" };
    default:
      return { label: "Acción", icon: <FaHistory className="text-slate-400" />, colorClass: "text-slate-600", bgClass: "bg-slate-50 border-slate-200" };
  }
};

export function HistoryModal({ isOpen, onClose, stickersState }) {
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
      }, 200); // 200ms delay for closing animation
      return () => clearTimeout(timer);
    }
  }, [isOpen, render]);

  if (!render) return null;

  const historyEvents = getVisibleHistory(stickersState || {});
  const groupedEvents = groupEventsByDate(historyEvents);

  return (
    <div className={`fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-100 p-4 ${isClosing ? "animate-fade-out" : "animate-fade-in"}`}>
      <div
        className={`bg-bg-base border-2 border-primary/20 rounded-3xl shadow-2xl w-full max-w-lg overflow-y-auto max-h-[90vh] flex flex-col relative ${isClosing ? "animate-scale-out" : "animate-scale-in"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-primary transition-colors cursor-pointer p-1.5 rounded-lg hover:bg-slate-100 z-10"
          aria-label="Cerrar"
        >
          <FaTimes className="text-base" />
        </button>

        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-slate-200 shrink-0">
          <h2 className="text-xl font-montserrat font-extrabold text-primary uppercase tracking-wide flex items-center gap-2">
            <FaHistory className="text-lg" />
            Historial
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
            Registro de la fecha y hora de todos los cambios de tu álbum.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 py-4 flex flex-col gap-6 overflow-y-auto">
          {historyEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
              <FaHistory className="text-4xl text-slate-200" />
              <p className="text-sm font-medium text-slate-400">
                Aún no hay registros en el historial. ¡Empezá a agregar figuritas!
              </p>
            </div>
          ) : (
            Object.entries(groupedEvents).map(([dateLabel, events]) => (
              <div key={dateLabel} className="flex flex-col gap-3">
                <h3 className="text-xs font-montserrat font-extrabold uppercase text-slate-400 border-b border-slate-200 pb-1 mb-1">
                  {dateLabel}
                </h3>
                <div className="flex flex-col gap-2">
                  {events.map((event, idx) => {
                    const info = getActionInfo(event.action);
                    const timeString = new Intl.DateTimeFormat('es-AR', { hour: '2-digit', minute: '2-digit' }).format(new Date(event.timestamp));
                    
                    return (
                      <div key={`${event.stickerId}-${event.timestamp}-${idx}`} className={`flex items-center justify-between p-3 rounded-xl border ${info.bgClass}`}>
                        <div className="flex items-center gap-3">
                          <div className="text-base">
                            {info.icon}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bebas text-lg tracking-wider text-slate-800 leading-none mb-0.5">
                              {event.stickerId}
                            </span>
                            <span className={`text-[10px] font-semibold uppercase tracking-wider ${info.colorClass}`}>
                              {info.label}
                            </span>
                          </div>
                        </div>
                        <div className="text-[10px] font-bold text-slate-400 bg-white/60 px-2 py-1 rounded-md">
                          {timeString}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
