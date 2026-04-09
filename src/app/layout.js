import "./globals.css"
import Navbar from '../components/Navbar';
import Footer from '@/components/Footer';

export default function DashboardLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <Navbar />
        <main>
            {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}