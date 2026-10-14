# 💎 Vibes Parfum Bolivia — Plataforma E-Commerce de Alta Perfumería & Decants

> **Plataforma web de lujo para comercio electrónico de perfumería nicho, árabe y diseñador en Bolivia**, con selector dinámico de decants (5ml, 10ml, frasco completo), integración con WhatsApp comercial, cotizador para los 9 departamentos, cobros con QR Simple BCP, generación de comprobantes PDF oficiales y panel de control administrativo blindado con Bcrypt.

---

## 👨‍💻 Dirección Técnica & Autoría
- **Ingeniería de Software & Arquitectura:** [ToshiFPrime](https://github.com/ToshiFPrime)
- **Contacto WhatsApp Directo:** [+591 77072603](https://wa.me/59177072603)
- **GitHub:** [https://github.com/ToshiFPrime](https://github.com/ToshiFPrime)

---

## 🚀 Stack Tecnológico

| Capa | Tecnología |
| :--- | :--- |
| **Framework Web** | [Next.js 16](https://nextjs.org/) (App Router, Server Actions, Turbopack) |
| **Librería UI** | [React 19](https://react.dev/) |
| **Estilos & Diseño** | [Tailwind CSS v4](https://tailwindcss.com/) (Paleta Obsidian, Champagne Gold & Zinc) |
| **Lenguaje** | [TypeScript 5](https://www.typescriptlang.org/) (Strict Mode) |
| **Seguridad & Hash** | [Bcrypt](https://www.npmjs.com/package/bcryptjs) (Cost Factor 12) + HttpOnly SameSite Cookies |
| **Validación de Datos** | [Zod v4](https://zod.dev/) en todos los endpoints y formularios |
| **Comprobantes PDF** | [`pdf-lib`](https://pdf-lib.js.org/) (A4 Luxury Layout con sellos de autenticidad) |
| **Base de Datos & ORM** | [PostgreSQL](https://www.postgresql.org/) en [Supabase](https://supabase.com/) (`pgcrypto`, RLS) + [Drizzle ORM](https://orm.drizzle.team/) |
| **Iconos & Animaciones** | [Lucide React](https://lucide.dev/) + Canvas Confetti |

---

## ✨ Características Principales

### 🛍️ Experiencia de Compra de Lujo
- **Catálogo Interactivo con Búsqueda Instantánea**: Búsqueda debounced en tiempo real por nombre, casa perfumista, familia olfativa y notas (salida, corazón, fondo).
- **Selector de Presentaciones & Decants**: Variantes configurables de 5ml, 10ml y frascos sellados de 100ml con control de existencias individual.
- **Carrito Optimista & LocalStorage**: Sincronización instantánea de estado (0ms de latencia) y persistencia segura en navegador.
- **Checkout Especializado para Bolivia**:
  - Tarifario oficial para los 9 departamentos (La Paz, Santa Cruz, Cochabamba, Oruro, Potosí, Chuquisaca, Tarija, Beni, Pando).
  - Umbrales de envío gratuito automatizados.
  - Generador de mensaje formateado directo para WhatsApp con los números oficiales de la boutique (`65947174` y `65867500`).
  - Integración informativa para pagos con QR Simple oficial.

### 📄 Generador de Comprobantes PDF
- Genera comprobantes formales en tamaño estándar A4 con diseño Obsidian & Oro Champagne.
- Descarga directa en el navegador para el cliente al confirmar su orden.
- Descarga de guías de despacho en 1 clic para el administrador desde el panel de pedidos.
- Streaming binario en servidor mediante endpoint `GET /api/orders/[id]/receipt` y `POST /api/orders/receipt`.

### 🛡️ Seguridad & Control Administrativo
- **Hash de Contraseñas con Bcrypt (Rounds: 12)**: Inmune a ataques de temporización (*Timing Attacks*) y ataques de diccionario.
- **Protección de Rutas `/admin`**: Middleware de Next.js que valida cookies de sesión activas y expiración de tokens.
- **Panel Administrativo Completo**:
  - Control de existencias con edición rápida y ajuste por teclado.
  - Log de auditoría de movimientos de stock.
  - Gestión de pedidos, estados de entrega y notificación directa a WhatsApp.
  - Moderación de reseñas de clientes.
  - Métricas de ventas y configuración de cuentas bancarias BCP.

---

## 🛠️ Instalación y Ejecución Local

### Prerrequisitos
- Node.js 20+ o 22+
- npm o pnpm

### Pasos
```bash
# 1. Clonar el repositorio
git clone https://github.com/ToshiFPrime/PerfumeriaVibesParfum.git
cd PerfumeriaVibesParfum

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor de desarrollo
npm run dev

# 4. Abrir en el navegador
# http://localhost:3000
```

### Comandos de Calidad y Producción
```bash
# Ejecutar análisis estático (0 errores garantizados)
npm run lint

# Generar compilación de producción optimizada
npm run build

# Iniciar servidor de producción
npm run start
```

---

## 📂 Estructura del Proyecto

```
├── public/                 # Favicons, PWA manifests, logos e imágenes de fragancias
├── src/
│   ├── actions/            # Server Actions seguras (autenticación con Bcrypt)
│   ├── app/                # Next.js 16 App Router (Rutas de página y API Routes)
│   │   ├── admin/          # Panel de administración de boutique
│   │   ├── api/            # 13 endpoints REST seguros protegidos con Zod
│   │   ├── catalogo/       # Catálogo con filtros olfativos y búsqueda
│   │   ├── envios/         # Cotizador para los 9 departamentos de Bolivia
│   │   ├── login/          # Portal de inicio de sesión con Bcrypt
│   │   └── producto/       # Ficha de producto dinámica con notas y decants
│   ├── components/         # Componentes modulares (Admin, Modals, Product, Layout)
│   ├── context/            # Contextos de React (Carrito optimista)
│   ├── hooks/              # Custom Hooks (`useProducts`, `useOrders`, `useReceipt`, etc.)
│   ├── lib/
│   │   ├── auth/           # Utilidades de Bcrypt y generación de sesiones
│   │   ├── db/             # Esquema Drizzle ORM
│   │   ├── pdf/            # Motor de comprobantes PDF con `pdf-lib`
│   │   ├── supabase/       # Esquema PostgreSQL de 14 tablas con RLS (`schema.sql`)
│   │   └── validation/     # Esquemas de validación Zod
│   ├── middleware.ts       # Guardia de rutas administrativas
│   └── types/              # Definiciones TypeScript estrictas
└── README.md
```

---

## 📜 Licencia y Derechos

© 2026 **Vibes Parfum Bolivia**. Todos los derechos reservados.  
Diseño de arquitectura y desarrollo de software por [**ToshiFPrime**](https://github.com/ToshiFPrime).
