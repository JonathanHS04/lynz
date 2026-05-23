"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import SearchBar from "./SearchBar";
import NavPages from "./NavPages";
import { User } from "lucide-react";
import { useAuth } from "@/components/Auth/AuthProvider";
import AuthPromptModal from "@/components/Auth/AuthPromptModal";

const Navbar = () => {
  const { isAuthenticated, isReady } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    if (!isAuthModalOpen) return;

    const handlePointerDown = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsAuthModalOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsAuthModalOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isAuthModalOpen]);

  const handleProfileClick = () => {
    if (!isReady) return;
    setIsAuthModalOpen((current) => !current);
  };

  return (
    <>
      <nav className="fixed op-0 z-50 w-full bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5 [padding-right:var(--modal-scrollbar-offset,0px)]">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-20">

          <Link href="/" className="text-2xl font-black text-white">
            <span className="text-violet-500">L</span>ynz
          </Link>

          <NavPages />
          <div className="flex items-center gap-6">
            <SearchBar />

            <div className="relative" ref={profileMenuRef}>
              <button
                type="button"
                onClick={handleProfileClick}
                disabled={!isReady}
                aria-expanded={isAuthModalOpen}
                aria-haspopup="dialog"
                className="disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
              >
                <User className={`w-7 h-7 border rounded-full p-1 transition-all ${isAuthenticated ? "text-zinc-400 hover:text-white border-zinc-400 hover:border-white" : "text-zinc-400 hover:text-violet-400 border-zinc-400 hover:border-violet-400"}`} />
              </button>

              <AuthPromptModal
                isOpen={isAuthModalOpen}
                isAuthenticated={isAuthenticated}
                onClose={() => setIsAuthModalOpen(false)}
              />
            </div>

          </div>

        </div>
      </nav>
    </>
  );
};

export default Navbar;