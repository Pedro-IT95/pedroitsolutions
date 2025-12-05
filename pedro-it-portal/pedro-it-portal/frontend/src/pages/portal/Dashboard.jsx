import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Ticket, 
  FileText, 
  Briefcase, 
  MessageCircle,
  Plus,
  ArrowRight,
  Clock,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Bell,
  Shield,
  Server,
  Headphones,
  Activity,
  RefreshCw
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';
import { useAuthStore } from '../../stores/authStore';
import api from '../../services/api';

export default function Dashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    openTickets: 0,
    pendingInvoices: 0,
    activeServices: 0
  });
  const [recentTickets, setRecentTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data for charts - in production, fetch from API
  const ticketsByMonth = [
    { month: 'Jul', tickets: 4, resolved: 3 },
    { month: 'Ago', tickets: 6, resolved: 5 },
    { month: 'Sep', tickets: 8, resolved: 7 },
    { month: 'Oct', tickets: 5, resolved: 5 },
    { month: 'Nov', tickets: 9, resolved: 7 },
    { month: 'Dic', tickets: 3, resolved: 2 },
  ];

  const paymentStatus = [
    { name: 'Pagadas', value: 8, color: '#10b981' },
    { name: 'Pendientes', value: 2, color: '#f59e0b' },
    { name: 'Vencidas', value: 1, color: '#ef4444' },
  ];

  const recentActivity = [
    { id: 1, type: 'ticket', action: 'Ticket #1234 resuelto', time: 'Hace 2 horas', icon: CheckCircle, color: 'text-green-400' },
    { id: 2, type: 'payment', action: 'Pago recibido - $299.00', time: 'Hace 5 horas', icon: DollarSign, color: 'text-emerald-400' },
    { id: 3, type: 'service', action: 'Servicio de backup activado', time: 'Hace 1 día', icon: Server, color: 'text-cyan-400' },
    { id: 4, type: 'ticket', action: 'Nuevo ticket creado #1235', time: 'Hace 1 día', icon: Ticket, color: 'text-yellow-400' },
    { id: 5, type: 'alert', action: 'Mantenimiento programado', time: 'Hace 2 días', icon: Bell, color: 'text-purple-400' },
  ];

  const upcomingRenewals = [
    { service: 'Plan de Soporte Básico', date: '15 Dic 2024', amount: '$199/mes', status: 'active' },
    { service: 'Administración de Servidores', date: '01 Ene 2025', amount: '$299/mes', status: 'upcoming' },
    { service: 'Monitoreo 24/7', date: '10 Ene 2025', amount: '$199/mes', status: 'upcoming' },
  ];

  const alerts = [
    { id: 1, type: 'warning', message: 'Tienes 1 factura por vencer en 3 días', priority: 'high' },
    { id: 2, type: 'info', message: 'Mantenimiento programado: 10 Dic, 2:00 AM', priority: 'medium' },
  ];

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [ticketsData, meData] = await Promise.all([
        api.getTickets({ limit: 5 }),
        api.getMe()
      ]);

      setRecentTickets(ticketsData.tickets || []);
      setStats({
        openTickets: meData.user._count?.tickets || 0,
        pendingInvoices: meData.user._count?.invoices || 0,
        activeServices: meData.user._count?.services || 0
      });
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      label: 'Tickets Abiertos',
      value: stats.openTickets,
      icon: Ticket,
      trend: '+2 esta semana',
      trendUp: false,
      gradient: 'from-yellow-500/20 to-orange-500/20',
      iconBg: 'bg-yellow-500/20',
      iconColor: 'text-yellow-400',
      link: '/portal/tickets'
    },
    {
      label: 'Facturas Pendientes',
      value: stats.pendingInvoices,
      icon: FileText,
      trend: '$598 total',
      trendUp: null,
      gradient: 'from-red-500/20 to-pink-500/20',
      iconBg: 'bg-red-500/20',
      iconColor: 'text-red-400',
      link: '/portal/invoices'
    },
    {
      label: 'Servicios Activos',
      value: stats.activeServices,
      icon: Briefcase,
      trend: 'Todo operacional',
      trendUp: true,
      gradient: 'from-green-500/20 to-emerald-500/20',
      iconBg: 'bg-green-500/20',
      iconColor: 'text-green-400',
      link: '/portal/services'
    },
    {
      label: 'Uptime del Mes',
      value: '99.9%',
      icon: Activity,
      trend: 'Excelente',
      trendUp: true,
      gradient: 'from-cyan-500/20 to-blue-500/20',
      iconBg: 'bg-cyan-500/20',
      iconColor: 'text-cyan-400',
      link: '/portal/services'
    }
  ];

  const getStatusBadge = (status) => {
    const styles = {
      OPEN: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
      IN_PROGRESS: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
      WAITING_CLIENT: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
      RESOLVED: 'bg-green-500/20 text-green-400 border border-green-500/30',
      CLOSED: 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
    };
    const labels = {
      OPEN: 'Abierto',
      IN_PROGRESS: 'En Progreso',
      WAITING_CLIENT: 'Esperando',
      RESOLVED: 'Resuelto',
      CLOSED: 'Cerrado'
    };
    return (
      <span className={`px-2 py-0.5 rounded text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header with Alerts */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white mb-1">
            {getGreeting()}, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-gray-400">
            Aquí tienes el resumen de tu cuenta
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={loadDashboardData}
            className="p-2 bg-dark-800 hover:bg-dark-700 rounded-lg text-gray-400 hover:text-white transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <Link to="/portal/tickets/new" className="btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Ticket
          </Link>
        </div>
      </div>

      {/* Alerts Banner */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert) => (
            <div 
              key={alert.id}
              className={`p-4 rounded-xl border flex items-center gap-3 ${
                alert.type === 'warning' 
                  ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' 
                  : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
              }`}
            >
              <Bell className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm flex-1">{alert.message}</p>
              <button className="text-xs opacity-70 hover:opacity-100">Descartar</button>
            </div>
          ))}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Link 
              key={index} 
              to={stat.link}
              className={`relative overflow-hidden bg-gradient-to-br ${stat.gradient} backdrop-blur border border-white/10 rounded-2xl p-5 hover:border-cyan-500/50 transition-all duration-300 group`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    {stat.trendUp !== null && (
                      stat.trendUp 
                        ? <TrendingUp className="w-3 h-3 text-green-400" />
                        : <TrendingDown className="w-3 h-3 text-red-400" />
                    )}
                    <span className={`text-xs ${stat.trendUp ? 'text-green-400' : stat.trendUp === false ? 'text-red-400' : 'text-gray-500'}`}>
                      {stat.trend}
                    </span>
                  </div>
                </div>
                <div className={`w-12 h-12 ${stat.iconBg} rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Tickets Chart */}
        <div className="lg:col-span-2 bg-dark-900/80 backdrop-blur border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-white">Tickets por Mes</h3>
              <p className="text-sm text-gray-500">Últimos 6 meses</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-cyan-500" />
                <span className="text-gray-400">Creados</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-gray-400">Resueltos</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={ticketsByMonth}>
              <defs>
                <linearGradient id="colorTickets" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0f172a', 
                  border: '1px solid #1e293b',
                  borderRadius: '8px',
                  color: '#fff'
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="tickets" 
                stroke="#06b6d4" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorTickets)" 
              />
              <Area 
                type="monotone" 
                dataKey="resolved" 
                stroke="#10b981" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorResolved)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Payment Status Pie Chart */}
        <div className="bg-dark-900/80 backdrop-blur border border-white/10 rounded-2xl p-6">
          <h3 className="font-semibold text-white mb-2">Estado de Pagos</h3>
          <p className="text-sm text-gray-500 mb-4">Distribución de facturas</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={paymentStatus}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {paymentStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0f172a', 
                  border: '1px solid #1e293b',
                  borderRadius: '8px',
                  color: '#fff'
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            {paymentStatus.map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-xs">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-gray-400">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activity Timeline */}
        <div className="bg-dark-900/80 backdrop-blur border border-white/10 rounded-2xl p-6">
          <h3 className="font-semibold text-white mb-4">Actividad Reciente</h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg bg-dark-800 flex items-center justify-center flex-shrink-0 ${activity.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <button className="w-full mt-4 py-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
            Ver toda la actividad →
          </button>
        </div>

        {/* Upcoming Renewals */}
        <div className="bg-dark-900/80 backdrop-blur border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Próximas Renovaciones</h3>
            <Calendar className="w-5 h-5 text-gray-500" />
          </div>
          <div className="space-y-3">
            {upcomingRenewals.map((renewal, index) => (
              <div 
                key={index} 
                className={`p-3 rounded-xl border ${
                  renewal.status === 'active' 
                    ? 'bg-green-500/10 border-green-500/30' 
                    : 'bg-dark-800 border-dark-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">{renewal.service}</p>
                    <p className="text-xs text-gray-500 mt-1">{renewal.date}</p>
                  </div>
                  <span className="text-sm font-semibold text-cyan-400">{renewal.amount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions & Services */}
        <div className="bg-dark-900/80 backdrop-blur border border-white/10 rounded-2xl p-6">
          <h3 className="font-semibold text-white mb-4">Acciones Rápidas</h3>
          <div className="grid grid-cols-2 gap-3">
            <Link 
              to="/portal/tickets/new"
              className="p-4 bg-dark-800 hover:bg-dark-700 rounded-xl border border-dark-700 hover:border-cyan-500/50 transition-all group"
            >
              <Ticket className="w-6 h-6 text-cyan-400 mb-2" />
              <p className="text-sm font-medium text-white">Nuevo Ticket</p>
            </Link>
            <Link 
              to="/portal/support"
              className="p-4 bg-dark-800 hover:bg-dark-700 rounded-xl border border-dark-700 hover:border-cyan-500/50 transition-all group"
            >
              <MessageCircle className="w-6 h-6 text-cyan-400 mb-2" />
              <p className="text-sm font-medium text-white">Chat AI</p>
            </Link>
            <Link 
              to="/portal/invoices"
              className="p-4 bg-dark-800 hover:bg-dark-700 rounded-xl border border-dark-700 hover:border-cyan-500/50 transition-all group"
            >
              <DollarSign className="w-6 h-6 text-cyan-400 mb-2" />
              <p className="text-sm font-medium text-white">Pagar Factura</p>
            </Link>
            <Link 
              to="/portal/services"
              className="p-4 bg-dark-800 hover:bg-dark-700 rounded-xl border border-dark-700 hover:border-cyan-500/50 transition-all group"
            >
              <Shield className="w-6 h-6 text-cyan-400 mb-2" />
              <p className="text-sm font-medium text-white">Servicios</p>
            </Link>
          </div>

          {/* Compliance Badges */}
          <div className="mt-4 pt-4 border-t border-dark-700">
            <p className="text-xs text-gray-500 mb-3">Certificaciones</p>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded text-xs text-cyan-400">HIPAA</span>
              <span className="px-2 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded text-xs text-cyan-400">FedRAMP</span>
              <span className="px-2 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded text-xs text-cyan-400">CJIS</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Tickets Table */}
      <div className="bg-dark-900/80 backdrop-blur border border-white/10 rounded-2xl">
        <div className="flex items-center justify-between p-6 border-b border-dark-800">
          <div>
            <h3 className="font-semibold text-white">Tickets Recientes</h3>
            <p className="text-sm text-gray-500">Últimas solicitudes de soporte</p>
          </div>
          <Link to="/portal/tickets" className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
            Ver todos
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {recentTickets.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Ticket className="w-8 h-8 text-gray-600" />
            </div>
            <p className="text-gray-400 mb-4">No tienes tickets todavía</p>
            <Link to="/portal/tickets/new" className="btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Crear Primer Ticket
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-gray-500 border-b border-dark-800">
                  <th className="px-6 py-3 font-medium">Ticket</th>
                  <th className="px-6 py-3 font-medium">Categoría</th>
                  <th className="px-6 py-3 font-medium">Estado</th>
                  <th className="px-6 py-3 font-medium">Fecha</th>
                  <th className="px-6 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-800">
                {recentTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-dark-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-white">{ticket.title}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-400">{ticket.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(ticket.status)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-500">
                        {new Date(ticket.createdAt).toLocaleDateString('es')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link 
                        to={`/portal/tickets/${ticket.id}`}
                        className="text-cyan-400 hover:text-cyan-300 text-sm"
                      >
                        Ver →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
