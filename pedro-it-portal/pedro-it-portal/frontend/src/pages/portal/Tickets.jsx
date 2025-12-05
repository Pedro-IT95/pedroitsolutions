import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Ticket as TicketIcon } from 'lucide-react';
import api from '../../services/api';

export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadTickets();
  }, [filter]);

  const loadTickets = async () => {
    try {
      const params = filter !== 'all' ? { status: filter } : {};
      const { tickets } = await api.getTickets(params);
      setTickets(tickets || []);
    } catch (error) {
      console.error('Error loading tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      OPEN: 'bg-yellow-500/20 text-yellow-400',
      IN_PROGRESS: 'bg-blue-500/20 text-blue-400',
      WAITING_CLIENT: 'bg-purple-500/20 text-purple-400',
      RESOLVED: 'bg-green-500/20 text-green-400',
      CLOSED: 'bg-dark-600 text-dark-400'
    };
    const labels = {
      OPEN: 'Abierto',
      IN_PROGRESS: 'En Progreso',
      WAITING_CLIENT: 'Esperando',
      RESOLVED: 'Resuelto',
      CLOSED: 'Cerrado'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const styles = {
      LOW: 'text-dark-400',
      MEDIUM: 'text-yellow-400',
      HIGH: 'text-orange-400',
      URGENT: 'text-red-400'
    };
    return <span className={`text-xs ${styles[priority]}`}>{priority}</span>;
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-white">Mis Tickets</h1>
        <Link to="/portal/tickets/new" className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Ticket
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['all', 'OPEN', 'IN_PROGRESS', 'RESOLVED'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === status
                ? 'bg-primary-600 text-white'
                : 'bg-dark-800 text-dark-400 hover:text-white'
            }`}
          >
            {status === 'all' ? 'Todos' : status === 'OPEN' ? 'Abiertos' : status === 'IN_PROGRESS' ? 'En Progreso' : 'Resueltos'}
          </button>
        ))}
      </div>

      {/* Tickets List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : tickets.length === 0 ? (
        <div className="card p-12 text-center">
          <TicketIcon className="w-12 h-12 text-dark-600 mx-auto mb-4" />
          <p className="text-dark-400 mb-4">No hay tickets {filter !== 'all' ? 'con este estado' : ''}</p>
          <Link to="/portal/tickets/new" className="btn-primary">
            Crear Ticket
          </Link>
        </div>
      ) : (
        <div className="card divide-y divide-dark-800">
          {tickets.map((ticket) => (
            <Link
              key={ticket.id}
              to={`/portal/tickets/${ticket.id}`}
              className="flex items-center justify-between p-4 hover:bg-dark-800/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <p className="font-medium text-white truncate">{ticket.title}</p>
                  {getPriorityBadge(ticket.priority)}
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-dark-500">
                    {new Date(ticket.createdAt).toLocaleDateString('es')}
                  </span>
                  <span className="text-xs text-dark-600">•</span>
                  <span className="text-xs text-dark-500">{ticket.category}</span>
                  <span className="text-xs text-dark-600">•</span>
                  <span className="text-xs text-dark-500">{ticket._count?.messages || 0} mensajes</span>
                </div>
              </div>
              <div className="ml-4">
                {getStatusBadge(ticket.status)}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
