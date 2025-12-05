import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, CheckCircle, Clock, XCircle, ArrowRight } from 'lucide-react';
import api from '../../services/api';

export default function MyServices() {
  const [myServices, setMyServices] = useState([]);
  const [allServices, setAllServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const [myData, allData] = await Promise.all([
        api.getMyServices(),
        api.getServices()
      ]);
      setMyServices(myData.services || []);
      setAllServices(allData.services || []);
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      ACTIVE: { icon: CheckCircle, text: 'Activo', class: 'bg-green-500/20 text-green-400' },
      PAUSED: { icon: Clock, text: 'Pausado', class: 'bg-yellow-500/20 text-yellow-400' },
      CANCELLED: { icon: XCircle, text: 'Cancelado', class: 'bg-red-500/20 text-red-400' }
    };
    const { icon: Icon, text, class: className } = config[status] || config.ACTIVE;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${className}`}>
        <Icon className="w-3 h-3" />
        {text}
      </span>
    );
  };

  const formatPrice = (price, type) => {
    const formatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
    const suffix = type === 'MONTHLY' ? '/mes' : type === 'HOURLY' ? '/hora' : '';
    return `${formatted}${suffix}`;
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
      <h1 className="text-2xl font-bold text-white mb-6">Mis Servicios</h1>

      {/* Active Services */}
      {myServices.length > 0 ? (
        <div className="mb-10">
          <h2 className="text-lg font-semibold text-white mb-4">Servicios Contratados</h2>
          <div className="grid gap-4">
            {myServices.map((cs) => (
              <div key={cs.id} className="card p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-white">{cs.service.name}</h3>
                      {getStatusBadge(cs.status)}
                    </div>
                    <p className="text-sm text-dark-400 mt-1">{cs.service.description}</p>
                    <p className="text-xs text-dark-500 mt-2">
                      Desde: {new Date(cs.startDate).toLocaleDateString('es')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary-400">
                      {formatPrice(cs.service.price, cs.service.priceType)}
                    </p>
                  </div>
                </div>
                {cs.service.features?.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-dark-800">
                    <ul className="grid sm:grid-cols-2 gap-2">
                      {cs.service.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-dark-400">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="card p-12 text-center mb-10">
          <Briefcase className="w-12 h-12 text-dark-600 mx-auto mb-4" />
          <p className="text-dark-400 mb-2">No tienes servicios activos</p>
          <p className="text-dark-500 text-sm">Explora nuestros servicios disponibles abajo</p>
        </div>
      )}

      {/* Available Services */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Servicios Disponibles</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allServices.map((service) => (
            <div key={service.id} className="card p-5 hover:border-dark-700 transition-colors">
              <h3 className="font-semibold text-white mb-1">{service.name}</h3>
              <p className="text-sm text-dark-400 mb-3 line-clamp-2">{service.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-primary-400 font-semibold">
                  {formatPrice(service.price, service.priceType)}
                </span>
                <Link to="/contact" className="text-sm text-primary-500 hover:text-primary-400 flex items-center gap-1">
                  Contratar
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
