import { FaInstagram, FaXTwitter, FaYoutube } from 'react-icons/fa6';
import Link from 'next/link';
const Footer = () => (
  <footer className="border-t border-white/5 bg-[#0a0a0a] pt-16 pb-10">
    
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center items-center">

        {/* BRAND */}
        <div className="space-y-4">
          <h3 className="text-lg font-black uppercase tracking-tight text-white">
            Lynz
          </h3>

          <p className="text-sm text-zinc-500 leading-relaxed mx-auto text-left">
            Plataforma para descubrir, calificar y explorar música a través de la comunidad.
          </p>
        </div>

        {/* LINKS */}
        <div className="space-y-4">
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-zinc-500">
            Legal
          </p>

          <div className="flex flex-col gap-2 text-sm">
            <Link href="/privacy">
              <span className="text-zinc-400 hover:text-white transition-colors cursor-pointer">
                Política de privacidad
              </span>
            </Link>

            <Link href="/terms">
              <span className="text-zinc-400 hover:text-white transition-colors cursor-pointer">
                Términos y condiciones
              </span>
            </Link>
          </div>
        </div>

        {/* SOCIAL */}
        <div className="space-y-4">
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-zinc-500">
            Comunidad
          </p>

          <div className="flex items-center justify-center gap-3">

            <a
              href="#"
              className="p-2 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-violet-400/40 transition-all"
            >
              <FaInstagram className="w-4 h-4 text-zinc-400 hover:text-violet-300" />
            </a>

            <a
              href="#"
              className="p-2 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-violet-400/40 transition-all"
            >
              <FaXTwitter className="w-4 h-4 text-zinc-400 hover:text-violet-300" />
            </a>

            <a
              href="#"
              className="p-2 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-violet-400/40 transition-all"
            >
              <FaYoutube className="w-4 h-4 text-zinc-400 hover:text-violet-300" />
            </a>

          </div>
        </div>

      </div>

      {/* DIVIDER */}
      <div className="mt-12 border-t border-white/5 pt-6 text-center">
        <p className="text-xs text-zinc-600">
          © {new Date().getFullYear()} Lynz. Todos los derechos reservados.
        </p>
      </div>

    </div>
  </footer>
);

export default Footer;