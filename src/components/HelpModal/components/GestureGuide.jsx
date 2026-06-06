import { TbHandMove, TbHandClick, TbHandFinger } from "react-icons/tb";

/**
 * GestureGuide — renders the three gesture interaction cards shown in the Help Modal.
 *
 * Responsibilities:
 *  - Display how single tap, long press, and double tap each behave.
 *  - Purely presentational; no props, no state, no side effects.
 */
export function GestureGuide() {
  return (
    <div>
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
        Gestos de Control
      </h3>
      <div className="flex flex-col gap-2.5">
        {/* Single tap gesture */}
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
              tienes, le añade una <strong>Repetida</strong> (x1, x2, etc.).
            </p>
          </div>
        </div>

        {/* Long press gesture */}
        <div className="flex gap-3 bg-white p-3 rounded-2xl border border-slate-100 items-start">
          <div className="bg-red-50 text-red-500 p-2 rounded-xl text-sm shrink-0 mt-0.5">
            <TbHandClick />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-700 m-0 uppercase tracking-wide">
              Presionar 1 Segundo (Hold)
            </h4>
            <p className="text-[11px] text-slate-500 m-0 mt-0.5 leading-relaxed font-medium">
              <strong>Resta</strong> una repetida. Si llega a 0, la desmarca
              completamente volviéndola <strong>Faltante</strong>.
            </p>
          </div>
        </div>

        {/* Double tap gesture */}
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
  );
}
