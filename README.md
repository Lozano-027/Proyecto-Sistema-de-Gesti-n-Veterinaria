# 🐾 Sistema de Gestión Veterinaria

> Proyecto full-stack — Programación Web 2026A

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Lozano-027/Proyecto-Sistema-de-Gesti-n-Veterinaria)

---

## 📋 Tabla de Contenidos

- [Descripción del Proyecto](#-descripción-del-proyecto)
- [Stack Tecnológico](#-stack-tecnológico)
- [Arquitectura](#-arquitectura)
- [Modelo de Datos](#-modelo-de-datos)
- [Plan de Releases](#-plan-de-releases)
- [Sprints e Historias de Usuario](#-sprints-e-historias-de-usuario)
- [Cronograma](#-cronograma)
- [Definition of Done (DoD)](#-definition-of-done-dod)
- [Tablero Kanban](#-tablero-kanban)
- [Instalación y Ejecución](#-instalación-y-ejecución)
- [Autores](#-autores)

---

## 📖 Descripción del Proyecto

El **Sistema de Gestión Veterinaria** es una aplicación web full-stack desarrollada para clínicas y consultorios veterinarios. Permite registrar y gestionar mascotas, propietarios, citas médicas, historiales clínicos y tratamientos, facilitando tanto la atención al cliente como el trabajo administrativo del personal veterinario.

### Alcance

| Aspecto | Detalle |
| --- | --- |
| **Tipo** | Proyecto de Aula — Nivel Básico |
| **Entidades** | 6 entidades con relaciones (ver modelo de datos) |
| **Historias de Usuario** | 10 HUs organizadas en 5 sprints |
| **Releases** | 2 releases alineados con los cortes académicos |
| **Casos de Uso** | 10 CUs (registro, citas, historial, tratamientos, reportes) |

### Funcionalidades Principales

- ✅ Registro e inicio de sesión de usuarios con autenticación JWT
- ✅ CRUD de Propietarios (clientes de la veterinaria)
- ✅ CRUD de Mascotas con asociación a su propietario
- ✅ Gestión de Citas médicas (fecha, hora, motivo, veterinario)
- ✅ Registro de Historial Clínico por mascota
- ✅ Gestión de Tratamientos y medicamentos asociados a cada consulta
- ✅ Consulta de historial médico por mascota
- ✅ Reporte de citas por rango de fechas
- ✅ Panel administrativo para el personal veterinario

---

## 🛠 Stack Tecnológico

| Capa | Tecnología | Propósito |
| --- | --- | --- |
| **Backend** | NestJS (Node.js + TypeScript) | API REST con arquitectura en capas |
| **Frontend** | Next.js 14+ (React + TypeScript) | Interfaz de usuario con App Router |
| **Base de Datos** | PostgreSQL 16 | Almacenamiento relacional |
| **ORM** | Prisma | Modelado de datos, migraciones y queries |
| **Contenedores** | Docker + Docker Compose | Orquestación de servicios |
| **Autenticación** | JWT + bcrypt | Seguridad y manejo de sesiones |
| **Validación** | class-validator + class-transformer | DTOs y validación de entrada |

---

## 🏗 Arquitectura

El proyecto sigue una **arquitectura en capas** con separación de responsabilidades:

```
Cliente HTTP → Controller (valida DTO + ruta) → Service (lógica de negocio) → Repository (acceso a datos) → Prisma / PostgreSQL
```

### Estructura del Proyecto

```
proyecto/
├── docker-compose.yml
├── .env.example
├── backend/                        # API REST con NestJS
│   ├── Dockerfile
│   ├── src/
│   │   ├── common/                 # Módulo compartido (cross-cutting)
│   │   │   ├── filters/            # Filtros de excepción globales
│   │   │   ├── interceptors/       # Interceptores de respuesta
│   │   │   ├── pipes/              # Pipes de validación
│   │   │   └── guards/             # Guards de autenticación JWT
│   │   ├── auth/                   # Módulo de autenticación
│   │   │   ├── strategies/         # JWT Strategy (Passport)
│   │   │   └── guards/             # AuthGuard
│   │   ├── prisma/                 # Módulo Prisma (acceso a BD)
│   │   └── modules/                # Módulos de dominio
│   │       └── [entidad]/
│   │           ├── controller/     # Solo manejo HTTP
│   │           ├── service/        # Lógica de negocio
│   │           ├── repository/     # Acceso a datos (Prisma)
│   │           ├── dto/            # Validación de entrada
│   │           └── entities/       # Representación del dominio
│   └── prisma/
│       ├── schema.prisma
│       └── migrations/
│
├── frontend/                       # Interfaz con Next.js
│   ├── Dockerfile
│   ├── src/
│   │   ├── app/                    # App Router (páginas)
│   │   ├── components/             # Componentes reutilizables
│   │   ├── services/               # Capa de acceso a la API
│   │   ├── interfaces/             # Tipos e interfaces TypeScript
│   │   └── lib/                    # Utilidades y helpers
│   └── package.json
│
└── README.md
```

---

## 📊 Modelo de Datos

### Diagrama de Relaciones

```
Usuario           1 ──── N  Cita
Propietario       1 ──── N  Mascota
Mascota           1 ──── N  Cita
Mascota           1 ──── N  HistorialClinico
Cita              1 ──── N  Tratamiento
HistorialClinico  1 ──── N  Tratamiento
```

### Entidades

| Entidad | Campos Principales |
| --- | --- |
| **Usuario** | id, nombre, correo (unique), contraseña, rol (veterinario/admin) |
| **Propietario** | id, nombres, apellidos, telefono, correo (unique), direccion |
| **Mascota** | id, nombre, especie, raza, fechaNacimiento, propietarioId |
| **Cita** | id, mascotaId, usuarioId, fecha, hora, motivo, estado |
| **HistorialClinico** | id, mascotaId, fecha, diagnostico, observaciones (unique: mascotaId + fecha) |
| **Tratamiento** | id, historialClinicoId, citaId, medicamento, dosis, duracion, indicaciones |

---

## 🚀 Plan de Releases

### Release 1 — Segundo Corte: Backend Base + Autenticación + Gestión de Pacientes

> **📅 Cierre: 17 de Abril de 2026** · Sprints 1, 2 y 3

**Objetivo:** Infraestructura Docker + Prisma, módulos CRUD de Usuario (con JWT), Propietario, Mascota y Cita. Common Module. Frontend con vistas base.

| Sprint | Período | HUs | Alcance |
| --- | --- | --- | --- |
| [Sprint 1](#sprint-1--infraestructura-usuarios-y-propietarios) | Mar 16 → Mar 29 | HU-01, HU-02, HU-03 | Docker, Prisma, Usuario, Auth JWT, Propietario |
| [Sprint 2](#sprint-2--mascotas-citas-y-common-module) | Mar 30 → Abr 10 | HU-04, HU-05, HU-06 | Mascota, Cita, Common Module |
| [Sprint 3](#sprint-3--historial-clínico-y-frontend-base) | Abr 13 → Abr 17 | HU-07 | HistorialClinico, frontend base |

### Release 2 — Tercer Corte: Tratamientos, Estadísticas e Integración Completa

> **📅 Cierre: 22 de Mayo de 2026** · Sprints 4 y 5

**Objetivo:** Módulo de Tratamientos, integración completa frontend ↔ backend, reportes de citas y panel administrativo. Despliegue funcional con Docker.

| Sprint | Período | HUs | Alcance |
| --- | --- | --- | --- |
| [Sprint 4](#sprint-4--frontend-avanzado-e-integración) | Abr 20 → May 8 | HU-08, HU-09 | Tratamientos, dashboard, navegación, layout |
| [Sprint 5](#sprint-5--reportes-y-cierre) | May 11 → May 22 | HU-10 | Reporte de citas, historial completo, E2E, Docker final |

---

## 📌 Sprints e Historias de Usuario

### Sprint 1 — Infraestructura, Usuarios y Propietarios

> 📅 **Mar 16 → Mar 29** · 🚫 Festivo: Mar 23 (San José)

| # | Historia de Usuario | Labels |
| --- | --- | --- |
| HU-01 | Gestión de Usuarios del Sistema | `user-story` `backend` `frontend` |
| HU-02 | Autenticación de Usuarios (JWT) | `user-story` `backend` `frontend` `auth` |
| HU-03 | Gestión de Propietarios | `user-story` `backend` `frontend` |

**Entregables:**

- Docker Compose con PostgreSQL, NestJS y Next.js
- Prisma schema con entidades Usuario y Propietario
- Migraciones ejecutadas
- Endpoints de Auth: `POST /auth/register`, `POST /auth/login`
- CRUD completo de Usuario y Propietario
- Páginas: `/auth/register`, `/auth/login`, `/usuarios`, `/propietarios`

---

### Sprint 2 — Mascotas, Citas y Common Module

> 📅 **Mar 30 → Abr 10** · 🚫 Festivos: Abr 2 (Jueves Santo), Abr 3 (Viernes Santo)

| # | Historia de Usuario | Labels |
| --- | --- | --- |
| HU-04 | Gestión de Mascotas | `user-story` `backend` `frontend` |
| HU-05 | Gestión de Citas Médicas | `user-story` `backend` `frontend` |
| HU-06 | Common Module: Filtros, Interceptores y Pipes | `user-story` `backend` `cross-cutting` |

**Entregables:**

- CRUD de Mascota con relación a Propietario
- CRUD de Cita con validación de disponibilidad horaria
- `common/filters/http-exception.filter.ts`
- `common/interceptors/response.interceptor.ts`
- `common/pipes/validation.pipe.ts` registrado globalmente en `main.ts`
- Páginas: `/mascotas`, `/mascotas/new`, `/mascotas/[id]`, `/citas`

---

### Sprint 3 — Historial Clínico y Frontend Base

> 📅 **Abr 13 → Abr 17** · 📝 Cierre Segundo Corte: Abr 17

| # | Historia de Usuario | Labels |
| --- | --- | --- |
| HU-07 | Registro de Historial Clínico | `user-story` `backend` `frontend` |

**Entregables:**

- CRUD de HistorialClinico con unicidad (mascotaId + fecha)
- Consulta de historial por mascota con paginación
- Páginas: `/historial/new`, listado de historiales por mascota

---

### Sprint 4 — Frontend Avanzado e Integración

> 📅 **Abr 20 → May 8** · 🚫 Festivo: May 1 (Día del Trabajo)

| # | Historia de Usuario | Labels |
| --- | --- | --- |
| HU-08 | Gestión de Tratamientos por Consulta | `user-story` `backend` `frontend` |
| HU-09 | Frontend: Dashboard, Navegación y Layout General | `user-story` `frontend` |

**Entregables:**

- Entidad Tratamiento en Prisma schema con relación a HistorialClinico y Cita
- Endpoint `GET /mascotas/:id/tratamientos`
- Dashboard administrativo con resumen de citas, mascotas y propietarios
- Layout con Sidebar/Navbar y rutas activas
- Diseño responsivo con Tailwind CSS

---

### Sprint 5 — Reportes y Cierre

> 📅 **May 11 → May 22** · 🚫 Festivo: May 18 (Día de la Ascensión) · 📝 Cierre Tercer Corte: May 22

| # | Historia de Usuario | Labels |
| --- | --- | --- |
| HU-10 | Reportes de Citas e Historial Completo | `user-story` `backend` `frontend` `reporte` |

**Entregables:**

- Endpoint `GET /reportes/citas` con filtro por fecha, veterinario y estado
- Endpoint `GET /mascotas/:id/historial-completo` con tratamientos incluidos
- Página `/reportes/citas` con filtros y tabla de resultados
- Página `/mascotas/[id]/historial` con historial y tratamientos completos
- Pruebas de integración E2E con Jest + Supertest
- Docker Compose validación final en entorno limpio

---

## 📅 Cronograma

```
┌──────────────────────────────────────────────────────────────────────────────┐
│              SEGUNDO CORTE (Release 1) — Cierre: 17 Abr 2026                │
│               Backend Base + Autenticación + Gestión de Pacientes            │
├─────────────────────┬─────────────────────┬──────────────────────────────────┤
│  Sprint 1           │    Sprint 2         │         Sprint 3                 │
│  Mar 16 → Mar 29    │  Mar 30 → Abr 10    │      Abr 13 → Abr 17            │
│                     │                     │                                  │
│ • Docker + Prisma   │ • Mascota           │ • HistorialClinico               │
│ • Usuario + JWT     │ • Cita              │ • Frontend: listados y forms     │
│ • Propietario       │ • Common Module     │                                  │
│                     │ • Filters/Pipes     │                                  │
│ 🚫 Mar 23          │ 🚫 Abr 2-3         │                                  │
│   (San José)        │   (Semana Santa)    │                                  │
├─────────────────────┴─────────────────────┴──────────────────────────────────┤
│              TERCER CORTE (Release 2) — Cierre: 22 May 2026                 │
│                    Tratamientos, Estadísticas e Integración                  │
├────────────────────────────────────┬─────────────────────────────────────────┤
│        Sprint 4                    │          Sprint 5                       │
│        Abr 20 → May 8             │          May 11 → May 22                │
│                                    │                                         │
│ • Módulo Tratamientos              │ • Reportes de citas                     │
│ • Dashboard administrativo         │ • Historial clínico completo            │
│ • Navegación y layout              │ • Pruebas E2E                           │
│ • Selects dinámicos                │ • Docker compose validación final       │
│                                    │                                         │
│ 🚫 May 1                          │ 🚫 May 18                              │
│   (Día del Trabajo)               │   (Día de la Ascensión)                │
└────────────────────────────────────┴─────────────────────────────────────────┘
```

### Festivos Colombianos (Marzo — Mayo 2026)

| Fecha | Festivo | Sprint Afectado |
| --- | --- | --- |
| Lunes 23 de Marzo | Día de San José | Sprint 1 |
| Jueves 2 de Abril | Jueves Santo | Sprint 2 |
| Viernes 3 de Abril | Viernes Santo | Sprint 2 |
| Viernes 1 de Mayo | Día del Trabajo | Sprint 4 |
| Lunes 18 de Mayo | Día de la Ascensión | Sprint 5 |

---

## ✅ Definition of Done (DoD)

Cada Historia de Usuario se considera **terminada** cuando cumple **todos** los siguientes criterios:

### Backend

- Endpoint(s) implementados con arquitectura en capas: Controller → Service → Repository
- DTOs con validaciones usando `class-validator` y `class-transformer`
- Manejo de errores con excepciones HTTP apropiadas (`NotFoundException`, `ConflictException`, `BadRequestException`)
- Respuestas con formato uniforme (interceptor aplicado)
- Endpoint probado manualmente con Postman/Thunder Client

### Frontend

- Página(s) implementada(s) con componentes reutilizables
- Consumo del API a través de la capa de `services/`
- Manejo de estados: carga (loading), éxito y error
- Formularios con validación del lado del cliente
- Diseño responsivo y navegable

### Infraestructura y Código

- Código versionado en GitHub con commits descriptivos
- El servicio funciona correctamente con `docker compose up`
- No hay errores de consola ni advertencias críticas
- Las migraciones de Prisma están aplicadas y el esquema es consistente

---

## 📊 Tablero Kanban

El seguimiento del proyecto se realiza mediante un tablero Kanban en GitHub Projects.

El tablero incluye:

- **Columnas:** Todo → In Progress → Done
- **Campos personalizados:** Sprint, Release, Prioridad
- **Vistas:** Board (Kanban), Table, Roadmap

---

## ⚙ Instalación y Ejecución

### Prerrequisitos

- [Docker](https://www.docker.com/products/docker-desktop/) y Docker Compose instalados
- [Git](https://git-scm.com/downloads)

### Clonar el repositorio

```bash
git clone https://github.com/Lozano-027/Proyecto-Sistema-de-Gesti-n-Veterinaria.git
cd Proyecto-Sistema-de-Gesti-n-Veterinaria
```

### Configurar variables de entorno

```bash
# Copiar el archivo de ejemplo
cp .env.example .env
```

```env
# .env.example
DB_USER=admin
DB_PASSWORD=admin123
DB_NAME=veterinaria_db
JWT_SECRET=supersecretkey
JWT_EXPIRES_IN=7d
```

### Levantar los servicios

```bash
# Levantar todos los servicios con Docker Compose
docker compose up

# O en modo detached (segundo plano)
docker compose up -d
```

### Acceder a los servicios

| Servicio | URL |
| --- | --- |
| **Frontend (Next.js)** | http://localhost:3000 |
| **Backend (NestJS API)** | http://localhost:3001 |
| **PostgreSQL** | `localhost:5432` |

### Ejecutar migraciones de Prisma

```bash
# Entrar al contenedor del backend
docker compose exec backend sh

# Ejecutar migraciones
npx prisma migrate dev

# Generar el cliente Prisma
npx prisma generate
```

### Endpoints principales de la API

| Método | Ruta | Descripción |
| --- | --- | --- |
| `POST` | `/auth/register` | Registro de nuevo usuario |
| `POST` | `/auth/login` | Inicio de sesión (retorna JWT) |
| `GET/POST` | `/propietarios` | Listar / Crear propietarios |
| `GET/POST` | `/mascotas` | Listar / Crear mascotas |
| `GET/POST` | `/citas` | Listar / Crear citas médicas |
| `GET/POST` | `/historial` | Listar / Crear registros clínicos |
| `GET/POST` | `/tratamientos` | Listar / Crear tratamientos |
| `GET` | `/mascotas/:id/historial-completo` | Historial clínico completo de una mascota |
| `GET` | `/reportes/citas` | Reporte de citas por rango de fechas |

---

## 👨‍💻 Autores

| Nombre | GitHub |
| --- | --- |
| **Andres Felipe Gomez Anacona** | [@Andresfg20](https://github.com/Andresfg20) |
| **Julio Cesar Lozano Lozano** | [@Lozano-027](https://github.com/Lozano-027) |

---

**Programación Web — Ingeniería de Sistemas — 2026A**  
*Andres Felipe Gomez Anacona · Julio Cesar Lozano Lozano*
