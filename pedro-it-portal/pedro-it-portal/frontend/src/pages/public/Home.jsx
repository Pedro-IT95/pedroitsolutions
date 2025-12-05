import { Link } from 'react-router-dom';
import { 
  Shield, 
  Server, 
  Headphones, 
  Code, 
  ArrowRight,
  CheckCircle,
  Zap,
  Lock,
  Clock
} from 'lucide-react';

export default function Home() {
  const services = [
    {
      icon: Headphones,
      title: 'Soporte Técnico',
      description: 'Soporte remoto y presencial para resolver cualquier problema técnico de manera rápida y eficiente.'
    },
    {
      icon: Server,
      title: 'Administración de Servidores',
      description: 'Gestión completa de servidores Windows y Linux, mantenimiento y optimización.'
    },
    {
      icon: Shield,
      title: 'Ciberseguridad',
      description: 'Protege tu empresa con auditorías de seguridad, políticas y compliance (HIPAA, CJIS).'
    },
    {
      icon: Code,
      title: 'Desarrollo',
      description: 'Soluciones de software personalizadas, integraciones y automatización de procesos.'
    }
  ];

  const features = [
    { icon: Zap, text: 'Respuesta rápida' },
    { icon: Lock, text: 'Seguridad garantizada' },
    { icon: Clock, text: 'Soporte 24/7 disponible' },
    { icon: CheckCircle, text: 'Satisfacción garantizada' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-dark-950 via-dark-900 to-primary-950/20" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMDI5M2EiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLThoLTJ2LTRoMnY0em0tOCA4aC0ydi00aDJ2NHptMC04aC0ydi00aDJ2NHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-full text-primary-400 text-sm mb-6">
                <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
                Servicios IT Profesionales
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Soluciones IT para 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600"> tu empresa</span>
              </h1>
              
              <p className="text-lg text-dark-300 mb-8 max-w-xl">
                Soporte técnico, ciberseguridad y administración de infraestructura. 
                Protege y optimiza tu negocio con Pedro IT Solutions.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link to="/contact" className="btn-primary text-lg px-8 py-3">
                  Contactar
                  <ArrowRight className="w-5 h-5 ml-2 inline" />
                </Link>
                <Link to="/services" className="btn-secondary text-lg px-8 py-3">
                  Ver Servicios
                </Link>
              </div>

              <div className="flex flex-wrap gap-6 mt-10">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div key={index} className="flex items-center gap-2 text-dark-400">
                      <Icon className="w-5 h-5 text-primary-500" />
                      <span className="text-sm">{feature.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative hidden lg:block">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-transparent rounded-3xl blur-3xl" />
              <div className="relative bg-dark-900/80 backdrop-blur border border-dark-700 rounded-3xl p-8">
                <div className="grid grid-cols-2 gap-4">
                  {services.map((service, index) => {
                    const Icon = service.icon;
                    return (
                      <div 
                        key={index}
                        className="p-4 bg-dark-800/50 rounded-xl border border-dark-700 hover:border-primary-500/50 transition-colors"
                      >
                        <Icon className="w-8 h-8 text-primary-500 mb-3" />
                        <h3 className="font-semibold text-white text-sm">{service.title}</h3>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-dark-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Nuestros Servicios
            </h2>
            <p className="text-dark-400 max-w-2xl mx-auto">
              Soluciones completas de IT para empresas de todos los tamaños
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div 
                  key={index}
                  className="group card-hover p-6"
                >
                  <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-500/20 transition-colors">
                    <Icon className="w-6 h-6 text-primary-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{service.title}</h3>
                  <p className="text-dark-400 text-sm">{service.description}</p>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link to="/services" className="btn-primary">
              Ver todos los servicios
              <ArrowRight className="w-4 h-4 ml-2 inline" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-gradient-to-r from-primary-600 to-primary-700 rounded-3xl p-8 md:p-12 overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLThoLTJ2LTRoMnY0em0tOCA4aC0ydi00aDJ2NHptMC04aC0ydi00aDJ2NHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
            
            <div className="relative text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                ¿Listo para optimizar tu infraestructura?
              </h2>
              <p className="text-primary-100 mb-8 max-w-xl mx-auto">
                Regístrate en nuestro portal para acceder a soporte, 
                seguimiento de tickets y nuestro asistente AI.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/register" className="btn bg-white text-primary-700 hover:bg-primary-50 px-8 py-3">
                  Crear Cuenta Gratis
                </Link>
                <Link to="/contact" className="btn bg-primary-800 text-white hover:bg-primary-900 px-8 py-3">
                  Hablar con Experto
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
