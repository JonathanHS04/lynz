'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Disc3, LogOut, Mail, ShieldCheck, UserRound } from 'lucide-react'
import { FaGoogle } from 'react-icons/fa'
import { useAuth } from '@/components/Auth/AuthProvider'
import { getInitials } from '@/utils/getInitials'

const buildAuthHref = (mode, returnTo) => {
  const params = new URLSearchParams()
  params.set('mode', mode)
  if (returnTo && returnTo !== '/') {
    params.set('returnTo', returnTo)
  }

  return `/auth?${params.toString()}`
}

export default function AuthScreen({ initialMode = 'login', returnTo = '/' }) {
  const router = useRouter()
  const { isAuthenticated, login, register, signInWithGoogle, signOut, user } = useAuth()
  const [mode, setMode] = useState(initialMode)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const authHref = useMemo(() => ({
    login: buildAuthHref('login', returnTo),
    register: buildAuthHref('register', returnTo),
  }), [returnTo])

  const isRegisterMode = mode === 'register'

  const updateField = (field) => (event) => {
    setFormData((current) => ({
      ...current,
      [field]: event.target.value,
    }))
  }

  const changeMode = (nextMode) => {
    setMode(nextMode)
    setErrorMessage('')
    router.replace(buildAuthHref(nextMode, returnTo), { scroll: false })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      setIsSubmitting(true)
      setErrorMessage('')

      if (isRegisterMode) {
        await register(formData)
      } else {
        await login(formData)
      }

      router.push(returnTo || '/')
    } catch (error) {
      setErrorMessage(error.message || 'No pudimos completar la autenticacion.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogleAuth = async () => {
    try {
      setIsSubmitting(true)
      setErrorMessage('')
      await signInWithGoogle()
      router.push(returnTo || '/')
    } catch (error) {
      setErrorMessage(error.message || 'No pudimos iniciar con Google.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSignOut = async () => {
    setIsSubmitting(true)
    try {
      await signOut()
      changeMode('login')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="min-h-screen bg-[#0a0a0a] px-4 pb-20 pt-20 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[50%] items-center justify-center">
        <div className="relative w-full rounded-[1.75rem] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.34)] sm:p-7">
          <div className="pointer-events-none absolute inset-x-10 top-0 h-20 bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.1),transparent_68%)]" />
          {isAuthenticated ? (
            <div className="flex h-full flex-col justify-between gap-8 rounded-[1.5rem] border border-white/8 bg-[#121212] p-5 sm:p-6">
              <div className="space-y-6">
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/8 px-3 py-1 text-[10px] font-black uppercase tracking-[0.3em] text-emerald-200">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Sesion activa
                </span>

                <div className="flex items-center gap-4 rounded-[1.25rem] border border-white/8 bg-white/[0.03] p-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border border-violet-400/20 bg-violet-500/12 text-sm font-black uppercase tracking-[0.22em] text-white">
                    {getInitials(user?.name || user?.email || 'LY')}
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Cuenta actual</p>
                    <h2 className="mt-1.5 text-2xl font-semibold text-white">{user?.name}</h2>
                    <p className="mt-1 text-sm text-zinc-500">{user?.email} · {user?.provider === 'google' ? 'Google' : 'Credenciales'}</p>
                  </div>
                </div>

                <p className="text-sm leading-7 text-zinc-400">
                  Tu cuenta ya esta activa. Desde aqui puedes volver a la app o cerrar sesion cuando quieras.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href={returnTo || '/'}
                  className="flex flex-1 items-center justify-center gap-2 rounded-[1rem] bg-violet-500 px-5 py-3.5 font-medium text-white transition-all hover:bg-violet-400"
                >
                  Volver a la app
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-2 rounded-[1rem] border border-white/10 bg-white/[0.04] px-5 py-3.5 font-medium text-white transition-all hover:bg-white/[0.07] disabled:cursor-wait disabled:opacity-70"
                >
                  <LogOut className="h-4 w-4" />
                  Cerrar sesion
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-[1.5rem] border border-white/8 bg-[#121212] p-5 sm:p-6">
              <div className="space-y-7">
                <div className="flex justify-between">
                <div className="space-y-3">
                  <div>
                    <h1 className="text-3xl font-black leading-[0.95] tracking-[-0.04em] text-white sm:text-4xl">
                      {isRegisterMode ? 'Crea tu cuenta' : 'Inicia sesion'}
                    </h1>
                    <p className="mt-2 text-sm leading-6 text-zinc-400">
                      Accede a tu perfil para guardar tu actividad y seguir explorando Lynz.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="rounded-full border border-white/10 bg-black/20 p-1 text-sm">
                    <button
                      type="button"
                      onClick={() => changeMode('login')}
                          className={`rounded-full px-4 py-2 font-medium transition-all ${!isRegisterMode ? 'bg-violet-500 text-white' : 'text-zinc-500 hover:text-white'}`}
                    >
                      Login
                    </button>
                    <button
                      type="button"
                      onClick={() => changeMode('register')}
                          className={`rounded-full px-4 py-2 font-medium transition-all ${isRegisterMode ? 'bg-violet-500 text-white' : 'text-zinc-500 hover:text-white'}`}
                    >
                      Registro
                    </button>
                  </div>
                </div>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-3 rounded-[1rem] border border-violet-400/20 bg-white px-5 py-3.5 font-medium text-black transition-all hover:bg-violet-50 disabled:cursor-wait disabled:opacity-70"
                >
                  <FaGoogle className="h-4 w-4" />
                  {isSubmitting ? 'Procesando acceso...' : 'Continuar con Google'}
                </button>

                <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] text-zinc-600">
                  <span className="h-px flex-1 bg-white/10" />
                  o con correo
                  <span className="h-px flex-1 bg-white/10" />
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 mt-[-6]">
                {isRegisterMode && (
                  <label className="block space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Nombre</span>
                    <div className="flex items-center gap-3 rounded-[1rem] border border-white/10 bg-white/[0.03] px-4 py-3.5 transition-colors focus-within:border-white/25 focus-within:bg-white/[0.05]">
                      <UserRound className="h-4 w-4 text-zinc-600" />
                      <input
                        value={formData.name}
                        onChange={updateField('name')}
                        placeholder="Tu alias musical"
                        className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-600"
                      />
                    </div>
                  </label>
                )}

                <label className="block space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Correo</span>
                  <div className="flex items-center gap-3 rounded-[1rem] border border-white/10 bg-white/[0.03] px-4 py-3.5 transition-colors focus-within:border-white/25 focus-within:bg-white/[0.05]">
                    <Mail className="h-4 w-4 text-zinc-600" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={updateField('email')}
                      placeholder="tu@email.com"
                      className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-600"
                    />
                  </div>
                </label>

                <label className="block space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Contrasena</span>
                  <div className="flex items-center gap-3 rounded-[1rem] border border-white/10 bg-white/[0.03] px-4 py-3.5 transition-colors focus-within:border-white/25 focus-within:bg-white/[0.05]">
                    <ShieldCheck className="h-4 w-4 text-zinc-600" />
                    <input
                      type="password"
                      value={formData.password}
                      onChange={updateField('password')}
                      placeholder="Minimo 8 caracteres"
                      className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-600"
                    />
                  </div>
                </label>

                {isRegisterMode && (
                  <label className="block space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Confirmar contrasena</span>
                    <div className="flex items-center gap-3 rounded-[1rem] border border-white/10 bg-white/[0.03] px-4 py-3.5 transition-colors focus-within:border-white/25 focus-within:bg-white/[0.05]">
                      <ShieldCheck className="h-4 w-4 text-zinc-600" />
                      <input
                        type="password"
                        value={formData.confirmPassword}
                        onChange={updateField('confirmPassword')}
                        placeholder="Repite tu contrasena"
                        className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-600"
                      />
                    </div>
                  </label>
                )}

                {errorMessage ? (
                  <p className="rounded-[1rem] border border-red-500/20 bg-red-500/8 px-4 py-3 text-sm text-red-100">
                    {errorMessage}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 mt-12 rounded-[1rem] bg-violet-500 px-5 py-3.5 font-medium text-white transition-all hover:bg-violet-400 disabled:cursor-wait disabled:opacity-70"
                >
                  {isSubmitting ? 'Procesando...' : isRegisterMode ? 'Crear cuenta' : 'Entrar a Lynz'}
                  <ArrowRight className="h-4 w-4" />
                </button>
                </form>

                <p className="text-sm text-zinc-500">
                  {isRegisterMode ? '¿Ya tienes cuenta?' : '¿Aun no tienes cuenta?'}{' '}
                  <button
                    type="button"
                    onClick={() => changeMode(isRegisterMode ? 'login' : 'register')}
                    className="font-medium text-violet-200 underline decoration-violet-300/40 underline-offset-4"
                  >
                    {isRegisterMode ? 'Inicia sesion' : 'Registrate'}
                  </button>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}