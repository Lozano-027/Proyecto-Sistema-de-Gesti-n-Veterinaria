# 🐾 Sistema de Gestión Veterinaria  
Proyecto full-stack — Programación Web 2026A  

NestJS · Next.js · PostgreSQL · Docker · Prisma  

---

## 📋 Tabla de Contenidos

- Descripción del Proyecto  
- Stack Tecnológico  
- Arquitectura  
- Modelo de Datos  
- Plan de Releases  
- Sprints e Historias de Usuario  
- Cronograma  
- Definition of Done (DoD)  
- Instalación y Ejecución  

---

## 📖 Descripción del Proyecto

El Sistema de Gestión Veterinaria es una aplicación web full-stack que permite administrar los procesos de una clínica veterinaria: gestión de propietarios, mascotas, citas médicas, historiales clínicos, tratamientos y reportes.

### 🎯 Alcance

| Aspecto | Detalle |
|--------|--------|
| Tipo | Proyecto académico |
| Entidades | Propietario, Mascota, Veterinario, Cita, Historial, Tratamiento, Medicamento |
| Historias de Usuario | 10 HUs en 5 sprints |
| Casos de Uso | CRUD + lógica clínica |
| Releases | 2 (Segundo y Tercer corte) |

---

## 🛠 Stack Tecnológico

| Capa | Tecnología | Propósito |
|------|----------|----------|
| Backend | NestJS | API REST |
| Frontend | Next.js | Interfaz web |
| Base de Datos | PostgreSQL | Persistencia |
| ORM | Prisma | Modelado y consultas |
| Contenedores | Docker | Orquestación |

---

## 🏗 Arquitectura

Arquitectura en capas:

Cliente → Controller → Service → Repository → Prisma → PostgreSQL  

### 📂 Estructura del Proyecto

## 📊 Modelo de Datos

### 🔗 Relaciones

- Propietario 1 ─── N Mascota  
- Mascota 1 ─── N Cita  
- Veterinario 1 ─── N Cita  
- Cita 1 ─── 1 Historial Clínico  
- Historial 1 ─── N Tratamiento  
- Tratamiento 1 ─── N Medicamento  

---

## 🚀 Plan de Releases

### 🟢 Release 1 — Segundo Corte  
📅 Cierre: 17 Abril 2026  

**Objetivo:** Backend completo + frontend base  

| Sprint | Alcance |
|------|--------|
| Sprint 1 | Propietario, Mascota, Docker, Prisma |
| Sprint 2 | Citas, Veterinarios |
| Sprint 3 | Historial clínico, tratamientos |

---

### 🔵 Release 2 — Tercer Corte  
📅 Cierre: 22 Mayo 2026  

**Objetivo:** Integración + reportes + frontend completo  

| Sprint | Alcance |
|------|--------|
| Sprint 4 | Frontend avanzado |
| Sprint 5 | Reportes + pruebas |

---

## 📌 Sprints e Historias de Usuario

### 🟡 Sprint 1 — Base del sistema  
📅 Mar 16 → Mar 29  

- HU-01: Gestión de propietarios  
- HU-02: Gestión de mascotas  

✔ CRUD completo  
✔ Validaciones  

---

### 🟡 Sprint 2 — Agenda veterinaria  
📅 Mar 30 → Abr 10  

- HU-03: Agendar citas  
- HU-04: Historial clínico  

✔ Control de agenda  
✔ Estados de cita  

---

### 🟡 Sprint 3 — Tratamientos  
📅 Abr 13 → Abr 17  

- HU-05: Tratamientos  
- HU-06: Historial completo  

✔ Medicamentos  
✔ Seguimiento clínico  

---

### 🟡 Sprint 4 — Frontend  
📅 Abr 20 → May 8  

- HU-07: Veterinarios  
- HU-08: Agenda diaria  

✔ UI avanzada  
✔ Navegación  

---

### 🟡 Sprint 5 — Reportes  
📅 May 11 → May 22  

- HU-09: Cancelar/reprogramar citas  
- HU-10: Reportes  

✔ Reportes estadísticos  
✔ Pruebas E2E  

---

## 📅 Cronograma

---

## ✅ Definition of Done (DoD)

### Backend
- Endpoints funcionales (Controller → Service → Repository)  
- Validaciones con DTOs  
- Manejo de errores correcto  

### Frontend
- Formularios funcionales  
- Consumo de API  
- Estados (loading, error, success)  

### Proyecto
- Funciona con Docker  
- Código en GitHub  
- Sin errores críticos  

---

## ⚙ Instalación y Ejecución

### 🔧 Prerrequisitos

- Docker  
- Node.js  
- Git  

---

### 📥 Clonar repositorio

```bash
git clone https://github.com/Lozano-027/Proyecto-Sistema-de-Gesti-n-Veterinaria.git
cd Proyecto-Sistema-de-Gesti-n-Veterinaria
