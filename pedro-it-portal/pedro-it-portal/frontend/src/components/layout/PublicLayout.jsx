import { Outlet, Link, useLocation } from 'react-router-dom';
import { Monitor, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';

export default function PublicLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();

  const navLinks = [
    { path: '/', label: 'Inicio' },
    { path: '/services', label: 'Servicios' },
    { path: '/contact', label: 'Contacto' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-950/80 backdrop-blur-lg border-b border-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <Monitor className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Pedro <span className="text-primary-500">IT</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? 'text-primary-500'
                      : 'text-dark-300 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-4">
              {isAuthenticated ? (
                <Link to="/portal" className="btn-primary">
                  Mi Portal
                </Link>
              ) : (
                <>
                  <Link to="/login" className="btn-ghost">
                    Iniciar Sesión
                  </Link>
                  <Link to="/register" className="btn-primary">
                    Registrarse
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-dark-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-dark-900 border-t border-dark-800">
            <div className="px-4 py-4 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block text-sm font-medium ${
                    isActive(link.path) ? 'text-primary-500' : 'text-dark-300'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-dark-800 space-y-2">
                {isAuthenticated ? (
                  <Link
                    to="/portal"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn-primary w-full text-center block"
                  >
                    Mi Portal
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="btn-secondary w-full text-center block"
                    >
                      Iniciar Sesión
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="btn-primary w-full text-center block"
                    >
                      Registrarse
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="pt-16">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-dark-900 border-t border-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                  <Monitor className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">
                  Pedro <span className="text-primary-500">IT</span>
                </span>
              </Link>
              <p className="text-dark-400 text-sm max-w-md">
                Servicios profesionales de IT y ciberseguridad en Odessa, Texas. 
                Soluciones tecnológicas para empresas que buscan crecer de manera segura.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Enlaces</h4>
              <ul className="space-y-2">
                {navLinks.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="text-dark-400 hover:text-primary-500 text-sm">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contacto</h4>
              <ul className="space-y-2 text-sm text-dark-400">
                <li>Odessa, Texas</li>
                <li>info@pedroitsolutions.com</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-dark-800 text-center text-dark-500 text-sm">
            © {new Date().getFullYear()} Pedro IT Solutions. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
