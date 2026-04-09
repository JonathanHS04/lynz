import { Search, Menu, User } from "lucide-react";
import Link from "next/link";

const Navbar = () => (
  <nav className="fixed w-full z-50 top-0 transition-all duration-300 backdrop-blur-xl bg-[#0a0a0a]/70 border-b border-white/5">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-20">
        
        {/* LOGO */}
        <div className="flex-shrink-0 flex items-center cursor-pointer">
          <span className="text-2xl font-black tracking-tighter text-white">
            <Link href="/"><span className="text-violet-500">L</span>ynz</Link>
          </span>
        </div>

        {/* LINKS CENTRALES (Solo Desktop) */}
        <div className="hidden md:flex space-x-8">
          <Link href="/reviews" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Reviews</Link>
          <Link href="/genres" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Géneros</Link>
          <Link href="/Rankings" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Rankings</Link>
        </div>

        {/* ACCIONES: BUSQUEDA Y PERFIL */}
        <div className="flex items-center space-x-3 sm:space-x-5">
          
          {/* Input de Búsqueda Minimalista */}
          <div className="relative hidden sm:block">
            <input 
              type="text" 
              placeholder="Buscar..." 
              className="bg-white/5 border border-white/10 rounded-full py-1.5 pl-4 pr-10 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.08] transition-all w-48 lg:w-64"
            />
            <Search className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Icono de Búsqueda (Solo para móviles donde el input está oculto) */}
          <button className="sm:hidden text-gray-400 hover:text-white transition-colors p-2">
            <Search className="w-5 h-5" />
          </button>

          {/* Botón de Perfil (Solo Icono) */}
          <Link 
            href="/profile" 
            className="p-2 rounded-full border border-white/10 bg-white/5 text-gray-300 hover:text-violet-400 hover:border-violet-500/30 transition-all shadow-lg"
          >
            <User className="w-5 h-5" />
          </Link>

          {/* Menú Hamburguesa (Mobile) */}
          <button className="md:hidden text-gray-400 hover:text-white p-1">
            <Menu className="w-6 h-6" />
          </button>
        </div>

      </div>
    </div>
  </nav>
);

export default Navbar;