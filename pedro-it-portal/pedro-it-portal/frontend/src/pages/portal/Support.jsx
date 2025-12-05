import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Trash2, Sparkles } from 'lucide-react';

// Sistema de respuestas predefinidas para Pedro IT Solutions
const findResponse = (message) => {
  const msg = message.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  const responses = [
    {
      keywords: ['hola', 'hi', 'hello', 'buenos', 'buenas', 'saludos', 'hey'],
      response: `👋 ¡Hola! Bienvenido a Pedro IT Solutions.

Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?

• Información sobre servicios
• Precios y planes
• Abrir un ticket de soporte
• Consultas generales

Escribe tu pregunta y te ayudaré.`
    },
    {
      keywords: ['precio', 'costo', 'cuanto', 'tarifa', 'cobran', 'vale', 'rate'],
      response: `💰 **Nuestros Precios:**

• Soporte Remoto: **$50/hora**
• Soporte Presencial: **$75/hora**
• Plan Básico: **$199/mes** (5 horas incluidas)
• Plan Enterprise: **$499/mes** (soporte ilimitado)
• Administración de Servidores: **$299/mes**
• Auditoría de Seguridad: **$1,500**
• Configuración de Infraestructura: **$2,500**
• Consultoría IT: **$100/hora**

¿Te interesa algún servicio en particular?`
    },
    {
      keywords: ['servicio', 'servicios', 'ofrecen', 'hacen', 'pueden', 'service'],
      response: `🖥️ **Nuestros Servicios:**

• **Soporte Técnico Remoto** - 24/7 para toda USA
• **Soporte Presencial** - Odessa, TX y alrededores
• **Hosting en Nube Privada** - Servidores propios
• **Ciberseguridad** - HIPAA, FedRAMP, CJIS
• **Desarrollo de Software** - Windows, Android, iOS
• **Backup y Recuperación** - Protección de datos
• **Administración de Redes** - Diseño y gestión
• **Consultoría IT** - Estrategia tecnológica

¿Sobre cuál quieres más información?`
    },
    {
      keywords: ['horario', 'hora', 'atienden', 'abierto', 'disponible', 'hours'],
      response: `🕐 **Horarios de Atención:**

• **Lunes a Viernes:** 8:00 AM - 6:00 PM (CST)
• **Soporte de Emergencia:** 24/7

Para emergencias fuera de horario, llámanos al:
📞 **(432) 232-6946**`
    },
    {
      keywords: ['contacto', 'contactar', 'llamar', 'telefono', 'email', 'correo', 'contact'],
      response: `📞 **Información de Contacto:**

• **Teléfono:** (432) 232-6946
• **Email:** contact@pedroitsolutions.com
• **Ubicación:** Odessa, TX 79761

🇺🇸 Sirviendo a negocios en todo Estados Unidos

¿Prefieres que te contactemos nosotros?`
    },
    {
      keywords: ['ticket', 'problema', 'ayuda', 'soporte', 'error', 'falla', 'no funciona', 'issue', 'help'],
      response: `🎫 **¿Necesitas ayuda técnica?**

Puedes abrir un ticket de soporte desde el menú:
**"Tickets" → "Nuevo Ticket"**

Describe tu problema con el mayor detalle posible.

⏱️ **Tiempos de respuesta:**
• Plan Enterprise: < 1 hora
• Plan Básico: < 4 horas
• Sin plan: < 24 horas

¿Es una emergencia? Llama al (432) 232-6946`
    },
    {
      keywords: ['pago', 'pagar', 'factura', 'stripe', 'tarjeta', 'metodo', 'payment', 'invoice'],
      response: `💳 **Métodos de Pago:**

• Tarjeta de crédito/débito (Visa, Mastercard, Amex)
• Transferencia bancaria
• ACH

🔒 Todas las transacciones son seguras y procesadas por Stripe.

Puedes ver y pagar tus facturas en:
**Menú → "Facturas"**`
    },
    {
      keywords: ['seguridad', 'hipaa', 'fedramp', 'cjis', 'cumplimiento', 'compliance', 'security'],
      response: `🔒 **Certificaciones de Seguridad:**

✅ **HIPAA** - Cumplimiento para sector salud
✅ **FedRAMP** - Listo para gobierno federal
✅ **CJIS** - Seguridad para justicia criminal
✅ **SSL/TLS** - Encriptación de datos
✅ **Firewall Empresarial** - Protección avanzada

Tus datos están protegidos con los más altos estándares de seguridad empresarial.`
    },
    {
      keywords: ['emergencia', 'urgente', 'caido', 'offline', 'critico', 'emergency', 'down'],
      response: `🚨 **¿Es una emergencia?**

Para soporte de emergencia 24/7:

📞 **Llama AHORA:** (432) 232-6946

O abre un ticket con prioridad **"URGENTE"** y te atenderemos de inmediato.

⚡ Clientes Enterprise tienen garantía de respuesta < 1 hora.`
    },
    {
      keywords: ['plan', 'planes', 'suscripcion', 'mensual', 'contratar', 'subscription'],
      response: `📋 **Planes Disponibles:**

**🔹 Plan Básico - $199/mes**
• 5 horas de soporte incluidas
• Monitoreo básico
• Respuesta < 4 horas
• Email y teléfono

**🔸 Plan Enterprise - $499/mes**
• Soporte ILIMITADO
• SLA 99.9% uptime
• Respuesta < 1 hora
• Prioridad máxima
• Gestor de cuenta dedicado

¿Quieres contratar algún plan?`
    },
    {
      keywords: ['quien', 'empresa', 'about', 'sobre', 'ustedes', 'pedro'],
      response: `🏢 **Sobre Pedro IT Solutions:**

Somos una empresa de servicios IT con sede en **Odessa, Texas**, sirviendo a negocios locales y clientes remotos en todo Estados Unidos.

**✨ Lo que nos distingue:**
• +12 años de experiencia en IT
• Infraestructura propia (no dependemos de la nube)
• Cumplimiento empresarial (HIPAA, FedRAMP, CJIS)
• Soporte 24/7 real
• Precios transparentes

🇺🇸 Proudly serving American businesses`
    },
    {
      keywords: ['gracias', 'thanks', 'thank', 'genial', 'excelente', 'perfecto', 'great'],
      response: `😊 ¡Con gusto! Estamos aquí para ayudarte.

Si tienes más preguntas, no dudes en escribirme.

¿Hay algo más en lo que pueda asistirte?`
    },
    {
      keywords: ['adios', 'bye', 'chao', 'hasta luego', 'nos vemos', 'goodbye'],
      response: `👋 ¡Hasta pronto!

Recuerda que estamos disponibles:
• Lunes - Viernes: 8am - 6pm
• Emergencias: 24/7

¡Gracias por confiar en Pedro IT Solutions! 🚀`
    },
    {
      keywords: ['remoto', 'remote', 'distancia', 'online'],
      response: `🌐 **Soporte Remoto:**

Ofrecemos soporte técnico remoto 24/7 para clientes en todo Estados Unidos.

**Incluye:**
• Conexión segura a tu equipo
• Resolución de problemas en tiempo real
• Sin necesidad de visita presencial
• Disponible fuera de horario

**Precio:** $50/hora

¿Necesitas soporte remoto ahora?`
    },
    {
      keywords: ['servidor', 'server', 'hosting', 'cloud', 'nube'],
      response: `☁️ **Servicios de Servidor:**

**Administración de Servidores - $299/mes**
• Windows Server y Linux
• Actualizaciones y parches
• Monitoreo 24/7
• Backups automáticos

**Hosting en Nube Privada**
• Servidores propios (no AWS/Azure)
• Control total de tus datos
• Cumplimiento HIPAA/CJIS
• Uptime 99.9% garantizado

¿Te interesa migrar a nuestra infraestructura?`
    }
  ];

  // Buscar coincidencia
  for (const item of responses) {
    for (const keyword of item.keywords) {
      if (msg.includes(keyword)) {
        return item.response;
      }
    }
  }

  // Respuesta por defecto
  return `🤔 No estoy seguro de entender tu pregunta.

Puedo ayudarte con:
• **Precios** - Escribe "precios"
• **Servicios** - Escribe "servicios"
• **Contacto** - Escribe "contacto"
• **Abrir ticket** - Escribe "ticket"
• **Emergencias** - Escribe "emergencia"

O si prefieres hablar con una persona, llama al:
📞 **(432) 232-6946**`;
};

export default function Support() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    // Cargar historial del localStorage
    try {
      const saved = localStorage.getItem('pedroit_chat_history');
      if (saved) {
        setMessages(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('No se pudo cargar historial:', e);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Guardar historial
    if (messages.length > 0) {
      try {
        localStorage.setItem('pedroit_chat_history', JSON.stringify(messages));
      } catch (e) {
        console.warn('No se pudo guardar historial:', e);
      }
    }
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: input.trim(),
      createdAt: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simular delay de respuesta
    setTimeout(() => {
      const response = findResponse(userMessage.content);
      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response,
        createdAt: new Date().toISOString()
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 800 + Math.random() * 700);
  };

  const clearHistory = () => {
    if (confirm('¿Estás seguro de que quieres borrar toda la conversación?')) {
      setMessages([]);
      localStorage.removeItem('pedroit_chat_history');
    }
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('es', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatMessage = (text) => {
    // Negrita
    text = text.replace(/\*\*([^*]+)\*\*/g, '<strong class="text-white">$1</strong>');
    // Cursiva
    text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    // Saltos de línea
    text = text.replace(/\n/g, '<br/>');
    return text;
  };

  const suggestedQuestions = [
    "¿Qué servicios ofrecen?",
    "¿Cuáles son los precios?",
    "¿Cómo abro un ticket?",
    "¿Tienen soporte 24/7?"
  ];

  return (
    <div className="animate-fade-in h-[calc(100vh-12rem)]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Soporte AI</h1>
          <p className="text-gray-400 text-sm">Asistente virtual disponible 24/7</p>
        </div>
        <button
          onClick={clearHistory}
          className="flex items-center gap-2 px-4 py-2 bg-[#1e293b] hover:bg-[#334155] rounded-lg text-gray-400 hover:text-white transition-colors text-sm"
        >
          <Trash2 className="w-4 h-4" />
          Limpiar
        </button>
      </div>

      <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl h-[calc(100%-5rem)] flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#0f172a]">
          {messages.length === 0 && !isTyping && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-cyan-500" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">¿En qué puedo ayudarte?</h3>
              <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">
                Soy el asistente virtual de Pedro IT Solutions. Puedo responder preguntas sobre
                nuestros servicios, precios, y ayudarte con soporte básico.
              </p>

              <div className="flex flex-wrap justify-center gap-2">
                {suggestedQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setInput(q);
                      inputRef.current?.focus();
                    }}
                    className="px-4 py-2 bg-[#1e293b] hover:bg-[#334155] border border-[#334155] hover:border-cyan-500/50 rounded-full text-sm text-gray-300 hover:text-white transition-all"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-4 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.role === 'user' ? 'bg-cyan-600' : 'bg-[#1e293b]'
              }`}>
                {message.role === 'user'
                  ? <User className="w-5 h-5 text-white" />
                  : <Bot className="w-5 h-5 text-cyan-400" />
                }
              </div>
              <div className={`flex-1 max-w-[80%] ${message.role === 'user' ? 'text-right' : ''}`}>
                <div className={`inline-block px-5 py-3 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-cyan-600 text-white rounded-tr-sm'
                    : 'bg-[#1e293b] text-gray-100 rounded-tl-sm border border-[#334155]'
                }`}>
                  <p
                    className="whitespace-pre-wrap text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1 px-2">
                  {formatTime(message.createdAt)}
                </p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-[#1e293b] rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="bg-[#1e293b] border border-[#334155] px-5 py-4 rounded-2xl rounded-tl-sm">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-[#1e293b] bg-[#0f172a]">
          <div className="flex gap-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu mensaje..."
              className="flex-1 bg-[#1e293b] border border-[#334155] focus:border-cyan-500 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none transition-colors"
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-medium transition-all"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
