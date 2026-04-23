import Link from "next/link";
import SearchBar from "./SearchBar";
import NavPages from "./NavPages";
import { User } from "lucide-react";

const Navbar = () => {

  return (
    <>
      <nav className="fixed op-0 z-50 w-full bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-20">

          <Link href="/" className="text-2xl font-black text-white">
            <span className="text-violet-500">L</span>ynz
          </Link>

          <NavPages />
          <div className="flex items-center gap-6">
            <SearchBar />

            <Link href="/profile">
              <User className="w-7 h-7 text-zinc-400 hover:text-white border border-zinc-400 hover:border-white rounded-full p-1 transition-all" />
            </Link>
          </div>

        </div>
      </nav>
    </>
  );
};

export default Navbar;