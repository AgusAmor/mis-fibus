import { FaTimes, FaApple, FaAndroid, FaRegPlusSquare, FaEllipsisV, FaPlusSquare } from "react-icons/fa";
import { MdIosShare } from "react-icons/md";

export function InstallModal({ isOpen, onClose, os }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-100 p-4 animate-fade-in">
      <div
        className="bg-bg-base border-2 border-primary/20 rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col relative animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-primary transition-colors cursor-pointer p-1.5 rounded-lg hover:bg-slate-100 z-10"
          aria-label="Cerrar"
        >
          <FaTimes className="text-base" />
        </button>

        <div className="p-6 pb-4 border-b border-slate-200 bg-white">
          <h2 className="text-xl font-montserrat font-extrabold text-primary uppercase tracking-wide flex items-center gap-2">
            Instalar la App
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
            Agregá Mis Fibus a tu pantalla de inicio para una mejor experiencia.
          </p>
        </div>

        <div className="p-6 flex flex-col gap-5 bg-slate-50/50">
          {os === "ios" ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 text-slate-700 font-medium text-sm">
                <span className="bg-apple/10 text-apple w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                  <FaApple className="text-lg" />
                </span>
                <span>Instrucciones para Safari en iOS</span>
              </div>
              <ol className="flex flex-col gap-3 text-xs text-slate-600 pl-2 border-l-2 border-slate-200 ml-4">
                <li className="leading-relaxed">
                    <span className="font-bold mr-1">1.</span> Tocá el ícono de <strong className="text-apple whitespace-nowrap"><MdIosShare className="inline text-[13px] align-middle mr-0.5 relative -top-0.5" />Compartir</strong> en la barra inferior.
                  </li>
                  <li className="leading-relaxed">
                    <span className="font-bold mr-1">2.</span> Seleccioná <strong className="text-apple whitespace-nowrap"><FaRegPlusSquare className="inline text-[13px] align-middle mr-1 relative -top-px" />Agregar a Inicio</strong>.
                  </li>
              </ol>
            </div>
          ) : os === "android" ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 text-slate-700 font-medium text-sm">
                <span className="bg-success/10 text-success w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                  <FaAndroid className="text-lg" />
                </span>
                <span>Instrucciones para Chrome en Android</span>
              </div>
              <ol className="flex flex-col gap-3 text-xs text-slate-600 pl-2 border-l-2 border-slate-200 ml-4">
                <li className="leading-relaxed">
                    <span className="font-bold mr-1">1.</span> En la barra superior, a la derecha de la barra de búsqueda tocá el ícono<strong className="text-success whitespace-nowrap"><FaEllipsisV className="inline text-[13px] align-middle relative -top-px" />Tres puntos</strong>.
                  </li>
                  <li className="leading-relaxed">
                    <span className="font-bold mr-1">2.</span> Seleccioná la opción <strong className="text-success">Instalar aplicación</strong>.
                  </li>
              </ol>
            </div>
          ) : (
            <div className="flex flex-col gap-5 overflow-y-auto max-h-[60vh] pr-2">
              <p className="text-sm text-slate-700 leading-relaxed font-semibold">
                Para la mejor experiencia, abrí esta página desde tu celular e instalá la App:
              </p>
              
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 text-slate-700 font-medium text-sm">
                  <span className="bg-apple/10 text-apple w-7 h-7 rounded-full flex items-center justify-center shrink-0">
                    <FaApple className="text-sm" />
                  </span>
                  <span>iOS desde Safari</span>
                </div>
                <ol className="flex flex-col gap-2 text-[11px] text-slate-600 pl-2 border-l-2 border-slate-200 ml-3.5">
                  <li className="leading-relaxed">
                    <span className="font-bold mr-1">1.</span> Tocá el ícono de <strong className="text-apple whitespace-nowrap"><MdIosShare className="inline text-[13px] align-middle mr-0.5 relative -top-0.5" />Compartir</strong> en la barra inferior.
                  </li>
                  <li className="leading-relaxed">
                    <span className="font-bold mr-1">2.</span> Seleccioná <strong className="text-apple whitespace-nowrap"><FaRegPlusSquare className="inline text-[13px] align-middle mr-1 relative -top-px" />Agregar a Inicio</strong>.
                  </li>
                </ol>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 text-slate-700 font-medium text-sm">
                  <span className="bg-success/10 text-success w-7 h-7 rounded-full flex items-center justify-center shrink-0">
                    <FaAndroid className="text-sm" />
                  </span>
                  <span>Android desde Chrome</span>
                </div>
                <ol className="flex flex-col gap-2 text-[11px] text-slate-600 pl-2 border-l-2 border-slate-200 ml-3.5">
                  <li className="leading-relaxed">
                    <span className="font-bold mr-1">1.</span> En la barra superior, a la derecha de la barra de búsqueda tocá el ícono<strong className="text-success whitespace-nowrap"><FaEllipsisV className="inline text-[13px] align-middle relative -top-px" />Tres puntos</strong>.
                  </li>
                  <li className="leading-relaxed">
                    <span className="font-bold mr-1">2.</span> Seleccioná la opción <strong className="text-success">Instalar aplicación</strong>.
                  </li>
                </ol>
              </div>
            </div>
          )}
        </div>

        <div className="p-5 border-t border-slate-200 flex justify-center bg-white rounded-b-3xl">
          <button
            onClick={onClose}
            className="w-full max-w-xs font-montserrat text-xs uppercase tracking-wider font-extrabold py-3 px-6 rounded-xl transition-all duration-300 bg-primary hover:bg-primary/95 text-white cursor-pointer hover:shadow-lg"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
