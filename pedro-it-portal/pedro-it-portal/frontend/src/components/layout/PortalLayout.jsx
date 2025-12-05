import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Monitor, 
  LayoutDashboard, 
  Ticket, 
  FileText, 
  Settings, 
  LogOut,
  MessageCircle,
  Briefcase,
  Menu,
  X,
  Bell
} from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';

export default function PortalLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const navItems = [
    { path: '/portal', icon: LayoutDashboard, label: 'Dashboard', exact: true },
    { path: '/portal/tickets', icon: Ticket, label: 'Tickets' },
    { path: '/portal/invoices', icon: FileText, label: 'Facturas' },
    { path: '/portal/services', icon: Briefcase, label: 'Mis Servicios' },
    { path: '/portal/support', icon: MessageCircle, label: 'Soporte AI' },
    { path: '/portal/settings', icon: Settings, label: 'Configuración' },
  ];

  const isActive = (path, exact = false) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a237e] via-[#283593] to-[#c62828] flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-black/30 backdrop-blur-md border-r border-white/10">
        {/* Logo */}
        <div className="flex items-center gap-2 h-16 px-6 border-b border-white/10">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <Monitor className="w-5 h-5 text-[#1a237e]" />
          </div>
          <span className="text-lg font-bold">
            <span className="bg-black px-2 py-1 rounded text-white">Pedro</span> <span className="text-[#42a5f5]">IT</span>
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path, item.exact);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  active
                    ? 'bg-white text-[#1a237e] shadow-md'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className={active ? '' : 'bg-black/70 px-2 py-0.5 rounded'}>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-10 h-10 bg-[#c62828] rounded-full flex items-center justify-center text-white font-semibold shadow-md">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium"><span className="bg-black/70 px-2 py-0.5 rounded text-white">{user?.name}</span></p>
              <p className="text-xs text-white/60 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="mt-2 w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-white hover:bg-white/10 transition-all duration-300"
          >
            <LogOut className="w-5 h-5" />
            <span className="bg-black/70 px-2 py-0.5 rounded">Cerrar Sesion</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="fixed inset-y-0 left-0 w-64 bg-black/90 backdrop-blur-md border-r border-white/10 animate-slide-in">
            <div className="flex items-center justify-between h-16 px-6 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <Monitor className="w-5 h-5 text-[#1a237e]" />
                </div>
                <span className="text-lg font-bold">
                  <span className="bg-black px-2 py-1 rounded text-white">Pedro</span> <span className="text-[#42a5f5]">IT</span>
                </span>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="text-white/80 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="px-4 py-6 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path, item.exact);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                      active
                        ? 'bg-white text-[#1a237e] shadow-md'
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className={active ? '' : 'bg-black/70 px-2 py-0.5 rounded'}>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 lg:pl-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-40 bg-black/20 backdrop-blur-md border-b border-white/10">
          <div className="flex items-center justify-between h-16 px-4 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-white/80 hover:text-white"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex-1 lg:flex-none" />

            <div className="flex items-center gap-4">
              <button className="p-2 text-white/80 hover:text-white relative transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#c62828] rounded-full" />
              </button>
              <Link to="/" className="text-sm text-white/80 hover:text-white hidden sm:block font-medium transition-colors">
                Volver al sitio
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8 min-h-[calc(100vh-4rem)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
