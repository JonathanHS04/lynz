const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const AUTH_STORAGE_KEY = 'lynz.auth.session'
const AUTH_EVENT_NAME = 'lynz-auth-change'
const MOCK_DELAY_MS = 650
let cachedSessionRaw = null
let cachedSession = null

const wait = (ms) => new Promise((resolve) => {
  setTimeout(resolve, ms)
})

const normalizeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  provider: user.provider,
  avatar: user.avatar ?? null,
})

const notifyAuthChange = () => {
  if (typeof window === 'undefined') return

  window.dispatchEvent(new Event(AUTH_EVENT_NAME))
}

export const getStoredSession = () => {
  if (typeof window === 'undefined') return null

  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY)
    if (!raw) return null

    if (raw === cachedSessionRaw) {
      return cachedSession
    }

    cachedSessionRaw = raw
    cachedSession = JSON.parse(raw)
    return cachedSession
  } catch {
    cachedSessionRaw = null
    cachedSession = null
    return null
  }
}

export const saveSession = (session) => {
  if (typeof window === 'undefined') return

  const raw = JSON.stringify(session)
  cachedSessionRaw = raw
  cachedSession = session
  window.localStorage.setItem(AUTH_STORAGE_KEY, raw)
  notifyAuthChange()
}

export const clearSession = () => {
  if (typeof window === 'undefined') return

  cachedSessionRaw = null
  cachedSession = null
  window.localStorage.removeItem(AUTH_STORAGE_KEY)
  notifyAuthChange()
}

export const subscribeToAuth = (callback) => {
  if (typeof window === 'undefined') return () => {}

  const handleChange = () => callback()
  window.addEventListener('storage', handleChange)
  window.addEventListener(AUTH_EVENT_NAME, handleChange)

  return () => {
    window.removeEventListener('storage', handleChange)
    window.removeEventListener(AUTH_EVENT_NAME, handleChange)
  }
}

export async function loginWithCredentials({ email, password }) {
  const response = await fetch(`${apiUrl}/user/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al iniciar sesión');
  }

  // Como el backend responde "Login succesful" y pone una cookie,
  // necesitamos obtener los datos del usuario de otro endpoint para la sesión local
  // o modificar el backend para que devuelva el usuario en el JSON.
  
  // Asumiendo que el login ahora devuelve el objeto usuario:
  const userData = await response.json(); 

  const session = {
    user: normalizeUser({
      id: userData.id,
      name: userData.username,
      email: userData.email,
      provider: 'credentials',
    }),
    // El accessToken vive en la cookie httpOnly, no aquí.
  };

  saveSession(session);
  return session;
}

export async function logout() {
  await fetch(`${apiUrl}/logout`, { method: 'POST' });
  clearSession();
}

export async function registerWithCredentials({ name, email, password, confirmPassword }) {
  // 1. Validaciones locales previas al fetch
  if (!name || !email || !password || !confirmPassword) {
    throw new Error('Completa todos los campos para registrarte.');
  }

  if (password !== confirmPassword) {
    throw new Error('Las contraseñas no coinciden.');
  }

  // 2. Llamada al backend
  const response = await fetch(`${apiUrl}/user/register`, { // Asegúrate que la ruta sea /users/register
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      username: name, // El backend espera 'username'
      email: email.toLowerCase(), 
      password 
    }),
  });

  // 3. Manejo de errores del servidor
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error en el registro');
  }

  const userData = await response.json();

  // 4. Normalizar y guardar sesión
  const session = {
    user: normalizeUser({
      id: userData.id,
      name: userData.username,
      email: userData.email,
      provider: 'credentials',
    }),
    // La cookie ya está en el navegador por el res.cookie del backend
  };

  saveSession(session);
  return session;
}

export async function loginWithGoogle() {
  await wait(MOCK_DELAY_MS)

  const session = {
    user: normalizeUser({
      id: `google-google.user@lynz.app`,
      name: 'Google Listener',
      email: 'google.user@lynz.app',
      provider: 'google',
      avatar: null,
    }),
    accessToken: 'mock-google-token',
  }

  saveSession(session)
  return session
}