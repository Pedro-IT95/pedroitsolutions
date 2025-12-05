import { useState, useEffect } from 'react';
import { FileText, Download, CreditCard, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../../services/api';

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      const data = await api.getInvoices();
      setInvoices(data.invoices || []);
    } catch (error) {
      console.error('Error loading invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      PAID: { icon: CheckCircle, class: 'bg-green-500/20 text-green-300 border-green-500/30', label: 'Pagada' },
      PENDING: { icon: Clock, class: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30', label: 'Pendiente' },
      OVERDUE: { icon: AlertCircle, class: 'bg-red-500/20 text-red-300 border-red-500/30', label: 'Vencida' }
    };
    const { icon: Icon, class: className, label } = config[status] || config.PENDING;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border ${className}`}>
        <Icon className="w-3 h-3" />
        {label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Mis Facturas</h1>
        <p className="text-white/60 text-sm">Historial de pagos y facturas</p>
      </div>

      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden">
        {invoices.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-white/40" />
            </div>
            <p className="text-white/60">No tienes facturas todavia</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-white/50 border-b border-white/10">
                  <th className="px-6 py-4 font-medium">Factura</th>
                  <th className="px-6 py-4 font-medium">Servicio</th>
                  <th className="px-6 py-4 font-medium">Monto</th>
                  <th className="px-6 py-4 font-medium">Estado</th>
                  <th className="px-6 py-4 font-medium">Fecha</th>
                  <th className="px-6 py-4 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-white">#{invoice.invoiceNumber}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-white/60">{invoice.description}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-lg font-semibold text-white">${invoice.amount}</span>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(invoice.status)}</td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-white/50">
                        {new Date(invoice.createdAt).toLocaleDateString('es')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {invoice.status === 'PENDING' && (
                          <button className="px-3 py-1 bg-white text-[#1a237e] rounded-lg text-sm font-medium hover:bg-white/90 transition-all">
                            Pagar
                          </button>
                        )}
                        <button className="p-2 text-white/60 hover:text-white transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
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
