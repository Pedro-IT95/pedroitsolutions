import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, Ticket, AlertCircle } from 'lucide-react';
import api from '../../services/api';

export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      const data = await api.getTickets();
      setTickets(data.tickets || []);
    } catch (error) {
      console.error('Error loading tickets:', error);
    } finally {
      setLoading(false);
    }
  };

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
      <span className={`px-2 py-1 rounded text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const filteredTickets = filter === 'ALL' 
    ? tickets 
    : tickets.filter(t => t.status === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Mis Tickets</h1>
          <p className="text-white/60 text-sm">Gestiona tus solicitudes de soporte</p>
        </div>
        <Link
          to="/portal/tickets/new"
          className="flex items-center justify-center gap-2 px-4 py-2 bg-white text-[#1a237e] rounded-lg font-semibold hover:bg-white/90 transition-all shadow-lg"
        >
          <Plus className="w-5 h-5" />
          NUEVO TICKET
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === status
                ? 'bg-white text-[#1a237e]'
                : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
            }`}
          >
            {status === 'ALL' ? 'Todos' : status === 'OPEN' ? 'Abiertos' : status === 'IN_PROGRESS' ? 'En Progreso' : 'Resueltos'}
          </button>
        ))}
      </div>

      {/* Tickets List */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden">
        {filteredTickets.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Ticket className="w-8 h-8 text-white/40" />
            </div>
            <p className="text-white/60 mb-4">No hay tickets</p>
            <Link
              to="/portal/tickets/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-[#1a237e] rounded-lg font-semibold hover:bg-white/90 transition-all"
            >
              <Plus className="w-4 h-4" />
              Crear Ticket
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-white/50 border-b border-white/10">
                  <th className="px-6 py-4 font-medium">Ticket</th>
                  <th className="px-6 py-4 font-medium">Categoria</th>
                  <th className="px-6 py-4 font-medium">Prioridad</th>
                  <th className="px-6 py-4 font-medium">Estado</th>
                  <th className="px-6 py-4 font-medium">Fecha</th>
                  <th className="px-6 py-4 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-white">{ticket.title}</p>
                      <p className="text-sm text-white/50 truncate max-w-xs">{ticket.description}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-white/60">{ticket.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm ${
                        ticket.priority === 'URGENT' ? 'text-red-400' :
                        ticket.priority === 'HIGH' ? 'text-orange-400' :
                        ticket.priority === 'MEDIUM' ? 'text-yellow-400' : 'text-green-400'
                      }`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(ticket.status)}</td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-white/50">
                        {new Date(ticket.createdAt).toLocaleDateString('es')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        to={`/portal/tickets/${ticket.id}`}
                        className="text-cyan-400 hover:text-cyan-300 text-sm font-medium"
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
