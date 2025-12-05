import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123456', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'pedro@pedroitsolutions.com' },
    update: {},
    create: {
      email: 'pedro@pedroitsolutions.com',
      password: adminPassword,
      name: 'Pedro',
      company: 'Pedro IT Solutions',
      role: 'ADMIN'
    }
  });
  console.log('✅ Admin user created:', admin.email);

  // Create services
  const services = [
    {
      name: 'Soporte Técnico Remoto',
      description: 'Soporte técnico remoto para resolver problemas de software, configuración y troubleshooting general.',
      priceType: 'HOURLY',
      price: 50,
      features: [
        'Acceso remoto seguro',
        'Diagnóstico de problemas',
        'Instalación de software',
        'Configuración de sistemas',
        'Respuesta en menos de 4 horas'
      ]
    },
    {
      name: 'Soporte Técnico Presencial',
      description: 'Visita técnica presencial para problemas de hardware, redes y configuraciones complejas.',
      priceType: 'HOURLY',
      price: 75,
      features: [
        'Visita en sitio',
        'Reparación de hardware',
        'Instalación de equipos',
        'Configuración de redes',
        'Cableado estructurado'
      ]
    },
    {
      name: 'Plan de Soporte Básico',
      description: 'Plan mensual de soporte con horas incluidas y respuesta prioritaria.',
      priceType: 'MONTHLY',
      price: 199,
      features: [
        '5 horas de soporte incluidas',
        'Respuesta prioritaria',
        'Monitoreo básico',
        'Reportes mensuales',
        'Soporte por email y chat'
      ]
    },
    {
      name: 'Plan de Soporte Empresarial',
      description: 'Plan completo para empresas con soporte ilimitado y SLA garantizado.',
      priceType: 'MONTHLY',
      price: 499,
      features: [
        'Soporte ilimitado',
        'SLA 99.9%',
        'Respuesta en 1 hora',
        'Monitoreo 24/7',
        'Backups automatizados',
        'Soporte telefónico directo'
      ]
    },
    {
      name: 'Administración de Servidores',
      description: 'Gestión completa de servidores Windows y Linux, actualizaciones y mantenimiento.',
      priceType: 'MONTHLY',
      price: 299,
      features: [
        'Actualizaciones de seguridad',
        'Monitoreo de recursos',
        'Gestión de backups',
        'Optimización de rendimiento',
        'Reportes semanales'
      ]
    },
    {
      name: 'Auditoría de Seguridad',
      description: 'Evaluación completa de la seguridad de tu infraestructura con recomendaciones detalladas.',
      priceType: 'ONE_TIME',
      price: 1500,
      features: [
        'Análisis de vulnerabilidades',
        'Pruebas de penetración básicas',
        'Revisión de políticas',
        'Reporte ejecutivo',
        'Plan de remediación'
      ]
    },
    {
      name: 'Setup de Infraestructura',
      description: 'Diseño e implementación de infraestructura de red y servidores desde cero.',
      priceType: 'ONE_TIME',
      price: 2500,
      features: [
        'Diseño de arquitectura',
        'Configuración de servidores',
        'Setup de red y firewall',
        'Documentación completa',
        '30 días de soporte post-implementación'
      ]
    },
    {
      name: 'Consultoría IT',
      description: 'Asesoría estratégica para optimizar tu infraestructura tecnológica.',
      priceType: 'HOURLY',
      price: 100,
      features: [
        'Evaluación de necesidades',
        'Recomendaciones de tecnología',
        'Planificación de presupuesto',
        'Roadmap tecnológico',
        'Selección de proveedores'
      ]
    }
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { 
        id: service.name.toLowerCase().replace(/\s+/g, '-') 
      },
      update: service,
      create: {
        id: service.name.toLowerCase().replace(/\s+/g, '-'),
        ...service
      }
    });
  }
  console.log('✅ Services created:', services.length);

  // Create demo client
  const clientPassword = await bcrypt.hash('demo123456', 12);
  const demoClient = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      password: clientPassword,
      name: 'Cliente Demo',
      company: 'Demo Company LLC',
      phone: '555-123-4567',
      role: 'CLIENT'
    }
  });
  console.log('✅ Demo client created:', demoClient.email);

  console.log('🎉 Seeding complete!');
  console.log('');
  console.log('Admin login: pedro@pedroitsolutions.com / admin123456');
  console.log('Demo login: demo@example.com / demo123456');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
