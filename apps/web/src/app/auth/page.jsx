import AuthScreen from '@/components/Auth/AuthScreen'

export default async function AuthPage({ searchParams }) {
  const params = await searchParams
  const initialMode = params?.mode === 'register' ? 'register' : 'login'
  const returnTo = typeof params?.returnTo === 'string' ? params.returnTo : '/'

  return <AuthScreen initialMode={initialMode} returnTo={returnTo} />
}