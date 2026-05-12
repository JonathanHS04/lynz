'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowRight, LogOut, UserRound } from 'lucide-react'
import { FaGoogle } from 'react-icons/fa'
import { useAuth } from '@/components/Auth/AuthProvider'

export default function AuthPromptModal({ isOpen, isAuthenticated = false, onClose }) {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const { signInWithGoogle, signOut } = useAuth()

  const handleGoogleLogin = async () => {
    try {
      setIsGoogleLoading(true)
      await signInWithGoogle()
      onClose()
    } finally {
      setIsGoogleLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true)
      await signOut()
      onClose()
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-hidden={!isOpen}
      aria-labelledby="auth-prompt-title"
      className={`absolute right-0 top-full z-[80] mt-3 w-[18rem] origin-top-right overflow-hidden rounded-[1.15rem] border border-white/10 bg-[#101010]/98 text-white shadow-[0_18px_48px_rgba(0,0,0,0.42)] backdrop-blur-xl transition-all duration-200 ${isOpen ? 'pointer-events-auto translate-y-0 scale-100 opacity-100' : 'pointer-events-none -translate-y-2 scale-95 opacity-0'}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.16),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_45%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-300/35 to-transparent" />

      <div className="relative p-4">
        <div>
          <div className="mt-1">
            <h2 id="auth-prompt-title" className="text-sm font-semibold tracking-[0.01em] text-white">
              {isAuthenticated ? 'Tu cuenta' : 'Accede a tu perfil'}
            </h2>
            <p className="mt-1.5 text-xs leading-relaxed text-zinc-500">
              {isAuthenticated
                ? 'Abre tu perfil o cierra sesion desde aqui.'
                : 'Inicia sesion, crea tu cuenta o entra con Google.'}
            </p>
          </div>

          <div className="mt-4 space-y-2">
            {isAuthenticated ? (
              <>
                <Link
                  href="/auth"
                  onClick={onClose}
                  className="group flex items-center justify-between rounded-[0.9rem] border border-transparent bg-white/[0.035] px-3.5 py-3 transition-all hover:border-violet-400/20 hover:bg-violet-500/[0.08]"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-violet-400/20 bg-violet-500/10 text-violet-200">
                      <UserRound className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-[0.24em] text-zinc-500">Cuenta</p>
                      <p className="mt-1 text-sm font-medium text-white">Mi perfil</p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-zinc-600 transition-all group-hover:translate-x-0.5 group-hover:text-violet-200" />
                </Link>

                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="group flex w-full items-center justify-between rounded-[0.9rem] border border-transparent bg-white/[0.035] px-3.5 py-3 text-left transition-all hover:border-violet-400/20 hover:bg-violet-500/[0.08] disabled:cursor-wait disabled:opacity-70"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-zinc-300">
                      <LogOut className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-[0.24em] text-zinc-500">Sesion</p>
                      <p className="mt-1 text-sm font-medium text-white">
                        {isSigningOut ? 'Cerrando sesion...' : 'Cerrar sesion'}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-zinc-600 transition-all group-hover:translate-x-0.5 group-hover:text-violet-200" />
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth?mode=login"
                  onClick={onClose}
                  className="group flex items-center justify-between rounded-[0.9rem] border border-transparent bg-white/[0.035] px-3.5 py-3 transition-all hover:border-violet-400/20 hover:bg-violet-500/[0.08]"
                >
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.24em] text-zinc-500">Cuenta existente</p>
                    <p className="mt-1 text-sm font-medium text-white">Iniciar sesion</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-zinc-600 transition-all group-hover:translate-x-0.5 group-hover:text-violet-200" />
                </Link>

                <Link
                  href="/auth?mode=register"
                  onClick={onClose}
                  className="group flex items-center justify-between rounded-[0.9rem] border border-transparent bg-white/[0.035] px-3.5 py-3 transition-all hover:border-violet-400/20 hover:bg-violet-500/[0.08]"
                >
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.24em] text-zinc-500">Nueva cuenta</p>
                    <p className="mt-1 text-sm font-medium text-white">Registrarme</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-zinc-600 transition-all group-hover:translate-x-0.5 group-hover:text-violet-200" />
                </Link>
              </>
            )}
          </div>

          {!isAuthenticated ? (
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-[0.9rem] border border-violet-400/20 bg-white px-4 py-3 text-sm font-medium text-black transition-all hover:bg-violet-50 disabled:cursor-wait disabled:opacity-70"
            >
              <FaGoogle className="h-3.5 w-3.5" />
              {isGoogleLoading ? 'Conectando...' : 'Continuar con Google'}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  )
}