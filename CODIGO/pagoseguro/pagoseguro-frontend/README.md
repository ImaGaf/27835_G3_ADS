# Proyecto PagoSeguro - Frontend

Sistema de gestión de pagos y créditos para El Granito de AGROTAC.

## 🚀 Stack Tecnológico

- **React 18** - UI Library
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **Tailwind CSS** - Styling
- **React Router** - Routing
- **Zustand** - State Management
- **React Hook Form** - Form Handling
- **Zod** - Schema Validation
- **Axios** - HTTP Client
- **Lucide React** - Icons

## 📋 Prerequisitos

- Node.js >= 20.0.0
- npm >= 10.0.0

## ⚙️ Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones
```

## 🎯 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Iniciar servidor de desarrollo

# Build
npm run build            # Compilar para producción
npm run preview          # Preview de producción

# Linting
npm run lint             # Verificar código
```

## 🌐 Configuración

Edita el archivo `.env`:

```env
VITE_API_URL=http://localhost:3000/api/v1
VITE_ENV=development
```

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── auth/           # Componentes de autenticación
│   ├── common/         # Componentes comunes
│   └── layout/         # Layouts
├── pages/              # Páginas principales
│   ├── auth/           # Páginas de autenticación
│   └── dashboard/      # Dashboards por rol
├── hooks/              # Custom hooks
├── stores/             # Estado global (Zustand)
├── services/           # Servicios HTTP
├── schemas/            # Validaciones Zod
├── types/              # TypeScript types
├── utils/              # Utilidades
└── assets/             # Assets estáticos
```

## 🔐 Autenticación

El sistema implementa autenticación basada en JWT con:
- Access tokens (15 minutos)
- Refresh tokens (7 días)
- Rutas protegidas por rol
- Redirección automática

## 🎨 Diseño

- Paleta de colores verde institucional
- Diseño responsive
- Accesibilidad WCAG 2.1
- Componentes reutilizables con Tailwind

## 🧪 Testing

```bash
npm test                 # Ejecutar tests
npm run test:coverage    # Cobertura
```

## 📦 Build para Producción

```bash
npm run build
```

Los archivos optimizados estarán en la carpeta `dist/`

## 🚀 Deploy

El proyecto puede desplegarse en:
- Vercel
- Netlify
- GitHub Pages
- Servidor propio (Nginx/Apache)

## 📝 Licencia

MIT - Grupo 3 AGROTAC
