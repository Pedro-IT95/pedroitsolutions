# Pedro IT Solutions - Portal Architecture

## Overview
Plataforma completa con sitio web público, portal de clientes con dashboard, y asistente AI integrado.

---

## Tech Stack

### Backend (Node.js + Express)
- **Runtime**: Node.js 20 LTS
- **Framework**: Express.js
- **Database**: PostgreSQL (puede correr en tus racks después)
- **ORM**: Prisma
- **Auth**: JWT + bcrypt
- **Payments**: Stripe API
- **AI**: Anthropic Claude API

### Frontend (React + Vite)
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State**: Zustand
- **Router**: React Router v6
- **Charts**: Recharts (para métricas)

### Deployment (Inicial)
- **Backend**: Render
- **Frontend**: Render Static Site
- **Database**: Render PostgreSQL
- **Futuro**: Migrar todo a tus racks con Ubuntu Server

---

## Project Structure

```
pedro-it-portal/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   ├── stripe.js
│   │   │   └── ai.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── clientController.js
│   │   │   ├── ticketController.js
│   │   │   ├── invoiceController.js
│   │   │   └── aiController.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── rateLimit.js
│   │   ├── models/
│   │   │   └── index.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── clients.js
│   │   │   ├── tickets.js
│   │   │   ├── invoices.js
│   │   │   └── ai.js
│   │   ├── services/
│   │   │   ├── aiService.js
│   │   │   ├── stripeService.js
│   │   │   └── emailService.js
│   │   └── app.js
│   ├── prisma/
│   │   └── schema.prisma
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Card.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   └── Modal.jsx
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   └── Footer.jsx
│   │   │   ├── dashboard/
│   │   │   │   ├── StatsCards.jsx
│   │   │   │   ├── TicketList.jsx
│   │   │   │   ├── InvoiceTable.jsx
│   │   │   │   └── ActivityFeed.jsx
│   │   │   └── ai/
│   │   │       ├── ChatWidget.jsx
│   │   │       ├── ChatMessage.jsx
│   │   │       └── ChatInput.jsx
│   │   ├── pages/
│   │   │   ├── public/
│   │   │   │   ├── Home.jsx
│   │   │   │   ├── Services.jsx
│   │   │   │   ├── About.jsx
│   │   │   │   └── Contact.jsx
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Register.jsx
│   │   │   └── portal/
│   │   │       ├── Dashboard.jsx
│   │   │       ├── Tickets.jsx
│   │   │       ├── NewTicket.jsx
│   │   │       ├── Invoices.jsx
│   │   │       ├── Services.jsx
│   │   │       ├── Settings.jsx
│   │   │       └── Support.jsx (AI Chat)
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useTickets.js
│   │   │   └── useAI.js
│   │   ├── stores/
│   │   │   ├── authStore.js
│   │   │   └── chatStore.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── styles/
│   │   │   └── globals.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── index.html
│
└── README.md
```

---

## Database Schema (PostgreSQL + Prisma)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  password      String
  name          String
  company       String?
  phone         String?
  role          Role      @default(CLIENT)
  stripeId      String?   @unique
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  tickets       Ticket[]
  invoices      Invoice[]
  services      ClientService[]
  chatHistory   ChatMessage[]
}

model Ticket {
  id          String       @id @default(cuid())
  title       String
  description String
  status      TicketStatus @default(OPEN)
  priority    Priority     @default(MEDIUM)
  category    String
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
  closedAt    DateTime?
  
  userId      String
  user        User         @relation(fields: [userId], references: [id])
  messages    TicketMessage[]
}

model TicketMessage {
  id        String   @id @default(cuid())
  content   String
  isStaff   Boolean  @default(false)
  isAI      Boolean  @default(false)
  createdAt DateTime @default(now())
  
  ticketId  String
  ticket    Ticket   @relation(fields: [ticketId], references: [id])
}

model Invoice {
  id          String        @id @default(cuid())
  stripeId    String?       @unique
  amount      Float
  status      InvoiceStatus @default(PENDING)
  description String
  dueDate     DateTime
  paidAt      DateTime?
  createdAt   DateTime      @default(now())
  
  userId      String
  user        User          @relation(fields: [userId], references: [id])
  items       InvoiceItem[]
}

model InvoiceItem {
  id          String  @id @default(cuid())
  description String
  quantity    Int
  unitPrice   Float
  
  invoiceId   String
  invoice     Invoice @relation(fields: [invoiceId], references: [id])
}

model Service {
  id          String   @id @default(cuid())
  name        String
  description String
  priceType   PriceType
  price       Float
  features    String[]
  isActive    Boolean  @default(true)
  
  clients     ClientService[]
}

model ClientService {
  id          String   @id @default(cuid())
  startDate   DateTime @default(now())
  endDate     DateTime?
  status      ServiceStatus @default(ACTIVE)
  
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  serviceId   String
  service     Service  @relation(fields: [serviceId], references: [id])
}

model ChatMessage {
  id        String   @id @default(cuid())
  role      String   // 'user' or 'assistant'
  content   String
  createdAt DateTime @default(now())
  
  userId    String
  user      User     @relation(fields: [userId], references: [id])
}

enum Role {
  CLIENT
  ADMIN
}

enum TicketStatus {
  OPEN
  IN_PROGRESS
  WAITING_CLIENT
  RESOLVED
  CLOSED
}

enum Priority {
  LOW
  MEDIUM
  HIGH
  URGENT
}

enum InvoiceStatus {
  DRAFT
  PENDING
  PAID
  OVERDUE
  CANCELLED
}

enum PriceType {
  ONE_TIME
  MONTHLY
  HOURLY
}

enum ServiceStatus {
  ACTIVE
  PAUSED
  CANCELLED
}
```

---

## API Endpoints

### Auth
- `POST /api/auth/register` - Registro de cliente
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Usuario actual
- `PUT /api/auth/password` - Cambiar contraseña

### Clients (Admin)
- `GET /api/clients` - Listar clientes
- `GET /api/clients/:id` - Detalle cliente
- `PUT /api/clients/:id` - Actualizar cliente
- `DELETE /api/clients/:id` - Eliminar cliente

### Tickets
- `GET /api/tickets` - Listar tickets (del usuario o todos si admin)
- `POST /api/tickets` - Crear ticket
- `GET /api/tickets/:id` - Detalle ticket
- `PUT /api/tickets/:id` - Actualizar ticket
- `POST /api/tickets/:id/messages` - Agregar mensaje

### Invoices
- `GET /api/invoices` - Listar facturas
- `GET /api/invoices/:id` - Detalle factura
- `POST /api/invoices/:id/pay` - Pagar factura (Stripe)
- `GET /api/invoices/:id/pdf` - Descargar PDF

### Services
- `GET /api/services` - Listar servicios disponibles
- `GET /api/services/my` - Servicios del cliente
- `POST /api/services/:id/subscribe` - Contratar servicio

### AI Chat
- `POST /api/ai/chat` - Enviar mensaje al AI
- `GET /api/ai/history` - Historial de chat

### Webhooks
- `POST /api/webhooks/stripe` - Stripe webhooks

---

## AI Integration

### Sistema del Asistente AI

El AI tendrá contexto sobre:
1. Información del cliente (nombre, servicios contratados, historial)
2. Tickets abiertos y su estado
3. Facturas pendientes
4. Servicios de Pedro IT Solutions

### System Prompt Base

```javascript
const getSystemPrompt = (client) => `
Eres el asistente virtual de Pedro IT Solutions, una empresa de servicios de IT y ciberseguridad.

INFORMACIÓN DEL CLIENTE:
- Nombre: ${client.name}
- Empresa: ${client.company || 'N/A'}
- Servicios activos: ${client.services.map(s => s.name).join(', ') || 'Ninguno'}
- Tickets abiertos: ${client.openTickets}

SERVICIOS QUE OFRECEMOS:
- Soporte técnico remoto y presencial
- Administración de servidores y redes
- Ciberseguridad y auditorías
- Consultoría IT para empresas
- Desarrollo de soluciones personalizadas

CAPACIDADES:
- Puedes ayudar con preguntas técnicas básicas
- Puedes explicar el estado de tickets y facturas
- Puedes guiar al cliente sobre nuestros servicios
- Para problemas complejos, recomienda abrir un ticket

TONO:
- Profesional pero amigable
- Respuestas concisas y útiles
- En español principalmente, inglés si el cliente lo prefiere

Si no puedes resolver algo, sugiere abrir un ticket de soporte.
`;
```

---

## Environment Variables

### Backend (.env)
```
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/pedroit"

# Auth
JWT_SECRET="tu-secret-muy-seguro"
JWT_EXPIRES_IN="7d"

# Stripe
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# AI
ANTHROPIC_API_KEY="sk-ant-..."

# Email (opcional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="tu-email"
SMTP_PASS="tu-password"

# Server
PORT=3000
NODE_ENV="production"
FRONTEND_URL="https://pedroitsolutions.com"
```

### Frontend (.env)
```
VITE_API_URL="https://api.pedroitsolutions.com"
VITE_STRIPE_PUBLIC_KEY="pk_live_..."
```

---

## Fases de Desarrollo

### Fase 1 - MVP (2-3 semanas)
- [ ] Setup proyecto (backend + frontend)
- [ ] Autenticación (registro, login)
- [ ] Dashboard básico
- [ ] Sistema de tickets
- [ ] UI del portal

### Fase 2 - Pagos (1-2 semanas)
- [ ] Integración Stripe
- [ ] Facturas y pagos
- [ ] Historial de transacciones

### Fase 3 - AI (1 semana)
- [ ] Chat widget
- [ ] Integración Anthropic API
- [ ] Contexto del cliente

### Fase 4 - Polish (1 semana)
- [ ] Notificaciones email
- [ ] PDF de facturas
- [ ] Optimización y testing

### Fase 5 - Migración a Racks (futuro)
- [ ] Setup Ubuntu Server
- [ ] PostgreSQL local
- [ ] Nginx reverse proxy
- [ ] SSL certificates
- [ ] Backup automatizado

---

## Próximos Pasos

1. Crear el backend base con Express y Prisma
2. Crear el frontend con React y el dashboard
3. Implementar autenticación
4. Sistema de tickets
5. Integrar Stripe
6. Agregar el AI chat

¿Por dónde empezamos?
