import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Send, Clock, Tag, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import { useAuthStore } from '../../stores/authStore';

export default function TicketDetail() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadTicket();
  }, [id]);

  const loadTicket = async () => {
    try {
      const { ticket } = await api.getTicket(id);
      setTicket(ticket);
    } catch (error) {
      console.error('Error loading ticket:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setSending(true);
    try {
      await api.addTicketMessage(id, message);
      setMessage('');
      loadTicket();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      OPEN: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      IN_PROGRESS: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      WAITING_CLIENT: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      RESOLVED: 'bg-green-500/20 text-green-400 border-green-500/30',
      CLOSED: 'bg-dark-700 text-dark-400 border-dark-600'
    };
    const labels = {
      OPEN: 'Abierto',
      IN_PROGRESS: 'En Progreso',
      WAITING_CLIENT: 'Esperando Respuesta',
      RESOLVED: 'Resuelto',
      CLOSED: 'Cerrado'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-dark-600 mx-auto mb-4" />
        <p className="text-dark-400">Ticket no encontrado</p>
        <Link to="/portal/tickets" className="btn-primary mt-4">
          Volver a tickets
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <Link to="/portal/tickets" className="inline-flex items-center text-dark-400 hover:text-white mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver a tickets
      </Link>

      {/* Header */}
      <div className="card p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-white mb-2">{ticket.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-dark-400">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {new Date(ticket.createdAt).toLocaleString('es')}
              </span>
              <span className="flex items-center gap-1">
                <Tag className="w-4 h-4" />
                {ticket.category}
              </span>
            </div>
          </div>
          {getStatusBadge(ticket.status)}
        </div>
        <div className="mt-4 p-4 bg-dark-800 rounded-lg">
          <p className="text-dark-300 whitespace-pre-wrap">{ticket.description}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="card mb-6">
        <div className="p-4 border-b border-dark-800">
          <h2 className="font-semibold text-white">Conversación</h2>
        </div>
        
        <div className="p-4 space-y-4 max-h-[400px] overflow-y-auto">
          {ticket.messages?.length === 0 ? (
            <p className="text-center text-dark-500 py-8">No hay mensajes aún</p>
          ) : (
            ticket.messages?.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.isStaff ? 'justify-start' : 'justify-end'}`}
              >
                <div className={`max-w-[80%] ${
                  msg.isStaff 
                    ? 'bg-dark-800 rounded-tl-sm' 
                    : 'bg-primary-600 rounded-tr-sm'
                } rounded-2xl px-4 py-3`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-medium ${msg.isStaff ? 'text-primary-400' : 'text-primary-200'}`}>
                      {msg.isStaff ? 'Pedro IT' : 'Tú'}
                    </span>
                    <span className="text-xs text-dark-500">
                      {new Date(msg.createdAt).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className={msg.isStaff ? 'text-dark-200' : 'text-white'}>{msg.content}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Reply Form */}
        {ticket.status !== 'CLOSED' && (
          <form onSubmit={handleSendMessage} className="p-4 border-t border-dark-800">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Escribe un mensaje..."
                className="input flex-1"
                disabled={sending}
              />
              <button type="submit" disabled={!message.trim() || sending} className="btn-primary">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
