import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import api from '../../services/api';

export default function NewTicket() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    priority: 'MEDIUM',
    description: ''
  });

  const categories = [
    'Soporte Técnico',
    'Redes',
    'Servidores',
    'Software',
    'Hardware',
    'Seguridad',
    'Consulta General',
    'Otro'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { ticket } = await api.createTicket(formData);
      navigate(`/portal/tickets/${ticket.id}`);
    } catch (err) {
      setError(err.message || 'Error al crear el ticket');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="animate-fade-in max-w-2xl">
      <Link to="/portal/tickets" className="inline-flex items-center text-dark-400 hover:text-white mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver a tickets
      </Link>

      <h1 className="text-2xl font-bold text-white mb-6">Nuevo Ticket</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-dark-300 mb-2">
            Título *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            minLength={5}
            className="input"
            placeholder="Describe brevemente el problema"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Categoría *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="input"
            >
              <option value="">Selecciona una categoría</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Prioridad
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="input"
            >
              <option value="LOW">Baja</option>
              <option value="MEDIUM">Media</option>
              <option value="HIGH">Alta</option>
              <option value="URGENT">Urgente</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-300 mb-2">
            Descripción *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            minLength={10}
            rows={6}
            className="input resize-none"
            placeholder="Describe el problema en detalle. Incluye pasos para reproducirlo, mensajes de error, etc."
          />
        </div>

        <div className="flex justify-end gap-4">
          <Link to="/portal/tickets" className="btn-secondary">
            Cancelar
          </Link>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creando...
              </span>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Crear Ticket
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
