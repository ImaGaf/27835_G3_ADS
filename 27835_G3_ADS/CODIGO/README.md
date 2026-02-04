# Código Fuente - Pago Seguro AGROTAC

Este directorio contiene la implementación técnica del sistema de gestión de comprobantes y cartera para la empresa "El Granito de AGROTAC".

## Estructura del Repositorio

El código está organizado en una estructura de monorepositorio con separación clara de responsabilidades:

| Carpeta | Descripción | Tecnologías |
| :--- | :--- | :--- |
| **`pagoseguro-backend`** | API RESTful que maneja la lógica de negocio, seguridad y conexión a datos. | Node.js, Express, TypeScript, Prisma, PostgreSQL. |
| **`pagoseguro-frontend`** | Interfaz de usuario (SPA) responsiva para Clientes, Gerentes y Asistentes. | React, Vite, TailwindCSS, Zustand. |
| **`docker-compose.yml`** | Orquestación de contenedores para levantar el entorno completo. | Docker. |

## Instrucciones de Ejecución Rápida

### Prerrequisitos
* Node.js v18+
* Docker Desktop (corriendo)

### Pasos
1. **Base de Datos:**
   Levantar el contenedor de PostgreSQL.
   ```bash
   docker-compose up -d

2. **Backend**
npm install
npx prisma migrate dev
npm run dev
3. **Frontend**
npm install
npm run dev

**Equipo de Desarrollo (Grupo 3)**
Responsables de la construcción y mantenimiento del código en el Sprint actual:

Fernando Sandoval - DevOps / Backend Architecture
Simone Medina - Backend Development / Seguridad
Zaith Manangón - Frontend UI/UX
Oswaldo Tipán - Fullstack Integration / Líder