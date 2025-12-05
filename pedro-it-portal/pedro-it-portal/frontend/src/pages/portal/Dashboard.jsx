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
  Cell
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
    { id: 3, type: 'service', action: 'Servicio de backup activado', time: 'Hace 1 dia', icon: Server, color: 'text-cyan-400' },
    { id: 4, type: 'ticket', action: 'Nuevo ticket creado #1235', time: 'Hace 1 dia', icon: Ticket, color: 'text-yellow-400' },
    { id: 5, type: 'alert', action: 'Mantenimiento programado', time: 'Hace 2 dias', icon: Bell, color: 'text-purple-400' },
  ];

  const upcomingRenewals = [
    { service: 'Plan de Soporte Basico', date: '15 Dic 2024', amount: '$199/mes', status: 'active' },
    { service: 'Administracion de Servidores', date: '01 Ene 2025', amount: '$299/mes', status: 'upcoming' },
    { service: 'Monitoreo 24/7', date: '10 Ene 2025', amount: '$199/mes', status: 'upcoming' },
  ];

  const alerts = [
    { id: 1, type: 'warning', message: 'Tienes 1 factura por vencer en 3 dias', priority: 'high' },
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
      iconColor: 'text-yellow-400',
      link: '/portal/tickets'
    },
    {
      label: 'Facturas Pendientes',
      value: stats.pendingInvoices,
      icon: FileText,
      trend: '$598 total',
      trendUp: null,
      iconColor: 'text-red-400',
      link: '/portal/invoices'
    },
    {
      label: 'Servicios Activos',
      value: stats.activeServices,
      icon: Briefcase,
      trend: 'Todo operacional',
      trendUp: true,
      iconColor: 'text-green-400',
      link: '/portal/services'
    },
    {
      label: 'Uptime del Mes',
      value: '99.9%',
      icon: Activity,
      trend: 'Excelente',
      trendUp: true,
      iconColor: 'text-cyan-400',
      link: '/portal/services'
    }
  ];

  const getStatusBadge = (status) => {
    const styles = {
      OPEN: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
      IN_PROGRESS: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
      WAITING_CLIENT: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
      RESOLVED: 'bg-green-500/20 text-green-300 border border-green-500/30',
      CLOSED: 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
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
    if (hour < 12) return 'Buenos dias';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/70">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white mb-1">
            {getGreeting()}, {user?.name?.split(' ')[0]} 
          </h1>
          <p className="text-white/60">Aqui tienes el resumen de tu cuenta</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={loadDashboardData}
            className="p-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-all"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <Link 
            to="/portal/tickets/new"
            className="flex items-center gap-2 px-4 py-2 bg-white text-[#1a237e] rounded-lg font-semibold hover:bg-white/90 transition-all shadow-lg"
          >
            <Plus className="w-5 h-5" />
            NUEVO TICKET
          </Link>
        </div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert) => (
            <div 
              key={alert.id}
              className={`flex items-center gap-3 p-4 rounded-xl border backdrop-blur-md ${
                alert.type === 'warning' 
                  ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300' 
                  : 'bg-blue-500/10 border-blue-500/30 text-blue-300'
              }`}
            >
              {alert.type === 'warning' ? <AlertCircle className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
              <span className="text-sm flex-1">{alert.message}</span>
              <button className="text-xs opacity-70 hover:opacity-100">Descartar</button>
            </div>
          ))}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Link 
              key={index}
              to={stat.link}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-white/60 text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center ${stat.iconColor}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                {stat.trendUp !== null && (
                  stat.trendUp 
                    ? <TrendingUp className="w-4 h-4 text-green-400" />
                    : <TrendingDown className="w-4 h-4 text-red-400" />
                )}
                <span className={`text-sm ${stat.trendUp ? 'text-green-400' : stat.trendUp === false ? 'text-red-400' : 'text-white/60'}`}>
                  {stat.trend}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Tickets Chart */}
        <div className="lg:col-span-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-white">Tickets por Mes</h3>
              <p className="text-sm text-white/50">Ultimos 6 meses</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-cyan-500" />
                <span className="text-white/60">Creados</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-white/60">Resueltos</span>
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
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" fontSize={12} />
              <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0,0,0,0.8)', 
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                  color: '#fff'
                }} 
              />
              <Area type="monotone" dataKey="tickets" stroke="#06b6d4" fillOpacity={1} fill="url(#colorTickets)" strokeWidth={2} />
              <Area type="monotone" dataKey="resolved" stroke="#10b981" fillOpacity={1} fill="url(#colorResolved)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Payment Status Pie Chart */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
          <h3 className="font-semibold text-white mb-2">Estado de Pagos</h3>
          <p className="text-sm text-white/50 mb-4">Distribucion de facturas</p>
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
                  backgroundColor: 'rgba(0,0,0,0.8)', 
                  border: '1px solid rgba(255,255,255,0.2)',
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
                <span className="text-white/60">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
          <h3 className="font-semibold text-white mb-4">Actividad Reciente</h3>
          <div className="space-y-4">
            {recentActivity.map((activity) => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 ${activity.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{activity.action}</p>
                    <p className="text-xs text-white/50">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <button className="w-full mt-4 py-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
            Ver toda la actividad
          </button>
        </div>

        {/* Upcoming Renewals */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Proximas Renovaciones</h3>
            <Calendar className="w-5 h-5 text-white/50" />
          </div>
          <div className="space-y-3">
            {upcomingRenewals.map((renewal, index) => (
              <div 
                key={index} 
                className={`p-3 rounded-xl border ${
                  renewal.status === 'active' 
                    ? 'bg-green-500/10 border-green-500/30' 
                    : 'bg-white/5 border-white/10'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">{renewal.service}</p>
                    <p className="text-xs text-white/50 mt-1">{renewal.date}</p>
                  </div>
                  <span className="text-sm font-semibold text-cyan-400">{renewal.amount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
          <h3 className="font-semibold text-white mb-4">Acciones Rapidas</h3>
          <div className="grid grid-cols-2 gap-3">
            <Link 
              to="/portal/tickets/new"
              className="p-4 bg-white/10 hover:bg-white/20 rounded-xl border border-white/10 hover:border-cyan-500/50 transition-all"
            >
              <Ticket className="w-6 h-6 text-cyan-400 mb-2" />
              <p className="text-sm font-medium text-white">Nuevo Ticket</p>
            </Link>
            <Link 
              to="/portal/support"
              className="p-4 bg-white/10 hover:bg-white/20 rounded-xl border border-white/10 hover:border-cyan-500/50 transition-all"
            >
              <MessageCircle className="w-6 h-6 text-cyan-400 mb-2" />
              <p className="text-sm font-medium text-white">Chat AI</p>
            </Link>
            <Link 
              to="/portal/invoices"
              className="p-4 bg-white/10 hover:bg-white/20 rounded-xl border border-white/10 hover:border-cyan-500/50 transition-all"
            >
              <DollarSign className="w-6 h-6 text-cyan-400 mb-2" />
              <p className="text-sm font-medium text-white">Pagar Factura</p>
            </Link>
            <Link 
              to="/portal/services"
              className="p-4 bg-white/10 hover:bg-white/20 rounded-xl border border-white/10 hover:border-cyan-500/50 transition-all"
            >
              <Shield className="w-6 h-6 text-cyan-400 mb-2" />
              <p className="text-sm font-medium text-white">Servicios</p>
            </Link>
          </div>
          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="text-xs text-white/50 mb-3">Certificaciones</p>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded text-xs text-cyan-400">HIPAA</span>
              <span className="px-2 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded text-xs text-cyan-400">FedRAMP</span>
              <span className="px-2 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded text-xs text-cyan-400">CJIS</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Tickets Table */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h3 className="font-semibold text-white">Tickets Recientes</h3>
            <p className="text-sm text-white/50">Ultimas solicitudes de soporte</p>
          </div>
          <Link to="/portal/tickets" className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
            Ver todos
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {recentTickets.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Ticket className="w-8 h-8 text-white/40" />
            </div>
            <p className="text-white/60 mb-4">No tienes tickets todavia</p>
            <Link 
              to="/portal/tickets/new" 
              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-[#1a237e] rounded-lg font-semibold hover:bg-white/90 transition-all"
            >
              <Plus className="w-4 h-4" />
              Crear Primer Ticket
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-white/50 border-b border-white/10">
                  <th className="px-6 py-3 font-medium">Ticket</th>
                  <th className="px-6 py-3 font-medium">Categoria</th>
                  <th className="px-6 py-3 font-medium">Estado</th>
                  <th className="px-6 py-3 font-medium">Fecha</th>
                  <th className="px-6 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {recentTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-white">{ticket.title}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-white/60">{ticket.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(ticket.status)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-white/50">
                        {new Date(ticket.createdAt).toLocaleDateString('es')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link 
                        to={`/portal/tickets/${ticket.id}`}
                        className="text-cyan-400 hover:text-cyan-300 text-sm"
                      >
                        Ver
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
