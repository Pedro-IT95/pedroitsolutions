import { Link } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';

export default function Services() {
  const services = [
    {
      name: 'Soporte Técnico Remoto',
      price: '$50',
      unit: '/hora',
      description: 'Soporte técnico remoto para resolver problemas de software y configuración.',
      features: [
        'Acceso remoto seguro',
        'Diagnóstico de problemas',
        'Instalación de software',
        'Configuración de sistemas',
        'Respuesta en menos de 4 horas'
      ],
      popular: false
    },
    {
      name: 'Plan de Soporte Básico',
      price: '$199',
      unit: '/mes',
      description: 'Plan mensual de soporte con horas incluidas y respuesta prioritaria.',
      features: [
        '5 horas de soporte incluidas',
        'Respuesta prioritaria',
        'Monitoreo básico',
        'Reportes mensuales',
        'Soporte por email y chat'
      ],
      popular: true
    },
    {
      name: 'Plan Empresarial',
      price: '$499',
      unit: '/mes',
      description: 'Plan completo para empresas con soporte ilimitado y SLA garantizado.',
      features: [
        'Soporte ilimitado',
        'SLA 99.9%',
        'Respuesta en 1 hora',
        'Monitoreo 24/7',
        'Backups automatizados',
        'Soporte telefónico directo'
      ],
      popular: false
    }
  ];

  const additionalServices = [
    { name: 'Soporte Presencial', price: '$75/hora' },
    { name: 'Administración de Servidores', price: 'desde $299/mes' },
    { name: 'Auditoría de Seguridad', price: 'desde $1,500' },
    { name: 'Setup de Infraestructura', price: 'desde $2,500' },
    { name: 'Consultoría IT', price: '$100/hora' },
    { name: 'Desarrollo Personalizado', price: 'Consultar' },
  ];

  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Nuestros Servicios
          </h1>
          <p className="text-dark-400 max-w-2xl mx-auto text-lg">
            Soluciones IT profesionales adaptadas a las necesidades de tu empresa
          </p>
        </div>

        {/* Main Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {services.map((service, index) => (
            <div 
              key={index}
              className={`card p-8 relative ${
                service.popular ? 'border-primary-500 ring-1 ring-primary-500' : ''
              }`}
            >
              {service.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-primary-500 text-white text-sm font-medium px-4 py-1 rounded-full">
                    Más Popular
                  </span>
                </div>
              )}

              <h3 className="text-xl font-bold text-white mb-2">{service.name}</h3>
              <p className="text-dark-400 text-sm mb-6">{service.description}</p>
              
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">{service.price}</span>
                <span className="text-dark-400">{service.unit}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {service.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                    <span className="text-dark-300 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link 
                to="/contact"
                className={`w-full text-center block ${
                  service.popular ? 'btn-primary' : 'btn-secondary'
                }`}
              >
                Contactar
              </Link>
            </div>
          ))}
        </div>

        {/* Additional Services */}
        <div className="bg-dark-900/50 rounded-2xl p-8 md:p-12">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            Servicios Adicionales
          </h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {additionalServices.map((service, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-4 bg-dark-800/50 rounded-xl border border-dark-700"
              >
                <span className="text-white font-medium">{service.name}</span>
                <span className="text-primary-400 font-semibold">{service.price}</span>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <p className="text-dark-400 mb-4">
              ¿Necesitas una solución personalizada?
            </p>
            <Link to="/contact" className="btn-primary">
              Solicitar Cotización
              <ArrowRight className="w-4 h-4 ml-2 inline" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
