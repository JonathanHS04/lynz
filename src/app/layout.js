import "./globals.css"
import Navbar from '../components/Navbar/Navbar';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/components/Auth/AuthProvider';

export default function DashboardLayout({ children }) {
  
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          <Navbar />
          <main>
              {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}