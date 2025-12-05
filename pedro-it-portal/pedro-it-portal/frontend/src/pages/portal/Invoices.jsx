import { useState, useEffect } from 'react';
import { FileText, Download, CreditCard, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import api from '../../services/api';

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      const { invoices } = await api.getInvoices();
      setInvoices(invoices || []);
    } catch (error) {
      console.error('Error loading invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async (invoiceId) => {
    try {
      const { url } = await api.payInvoice(invoiceId);
      window.location.href = url;
    } catch (error) {
      console.error('Error initiating payment:', error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PAID': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'PENDING': return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'OVERDUE': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default: return <FileText className="w-5 h-5 text-dark-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      PAID: 'bg-green-500/20 text-green-400',
      PENDING: 'bg-yellow-500/20 text-yellow-400',
      OVERDUE: 'bg-red-500/20 text-red-400',
      DRAFT: 'bg-dark-600 text-dark-400',
      CANCELLED: 'bg-dark-600 text-dark-400'
    };
    const labels = {
      PAID: 'Pagada',
      PENDING: 'Pendiente',
      OVERDUE: 'Vencida',
      DRAFT: 'Borrador',
      CANCELLED: 'Cancelada'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-white mb-6">Mis Facturas</h1>

      {invoices.length === 0 ? (
        <div className="card p-12 text-center">
          <FileText className="w-12 h-12 text-dark-600 mx-auto mb-4" />
          <p className="text-dark-400">No tienes facturas todavía</p>
        </div>
      ) : (
        <div className="space-y-4">
          {invoices.map((invoice) => (
            <div key={invoice.id} className="card p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  {getStatusIcon(invoice.status)}
                  <div>
                    <div className="flex items-center gap-3">
                      <p className="font-semibold text-white">{invoice.number}</p>
                      {getStatusBadge(invoice.status)}
                    </div>
                    <p className="text-sm text-dark-400 mt-1">{invoice.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-dark-500">
                      <span>Emitida: {new Date(invoice.createdAt).toLocaleDateString('es')}</span>
                      <span>Vence: {new Date(invoice.dueDate).toLocaleDateString('es')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <p className="text-2xl font-bold text-white">{formatCurrency(invoice.amount)}</p>
                  
                  {invoice.status === 'PENDING' && (
                    <button
                      onClick={() => handlePay(invoice.id)}
                      className="btn-primary"
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Pagar
                    </button>
                  )}
                  
                  {invoice.status === 'PAID' && (
                    <span className="text-sm text-green-400">
                      Pagada el {new Date(invoice.paidAt).toLocaleDateString('es')}
                    </span>
                  )}
                </div>
              </div>

              {/* Invoice Items */}
              {invoice.items?.length > 0 && (
                <div className="mt-4 pt-4 border-t border-dark-800">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-dark-500">
                        <th className="text-left py-2">Descripción</th>
                        <th className="text-center py-2">Cantidad</th>
                        <th className="text-right py-2">Precio</th>
                        <th className="text-right py-2">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoice.items.map((item) => (
                        <tr key={item.id} className="text-dark-300">
                          <td className="py-2">{item.description}</td>
                          <td className="text-center py-2">{item.quantity}</td>
                          <td className="text-right py-2">{formatCurrency(item.unitPrice)}</td>
                          <td className="text-right py-2">{formatCurrency(item.quantity * item.unitPrice)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
