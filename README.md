# 🎨 ReciclaUPAO - Frontend Module

Aplicación web en Angular para la gestión de actividades de reciclaje con integración blockchain.

---

## 📋 Prerequisitos

- **Node.js:** v18 o superior
- **npm:** Incluido con Node.js
- **Angular CLI:** v16.x (se instala con npm install)

---

## ⚙️ Instalación

```bash
npm install
```

---

## 🚀 Ejecución

### Iniciar Servidor de Desarrollo

```bash
ng serve
```

O alternativamente:

```bash
npm start
```

**Acceder a la aplicación:**
```
http://localhost:4200
```

> 🔥 Hot Reload activado - Los cambios se reflejan automáticamente

---

## 🔧 Configuración

### Backend URL (`src/app/service/helper.ts`)

```typescript
let baserUrl = 'http://localhost:8080'
export default baserUrl;
```

> 📝 Cambia esta URL si el backend está en otro puerto

---

## 👥 Usuarios de Prueba

| Usuario | Contraseña | Rol | Funcionalidad |
|---------|-----------|-----|---------------|
| `centroacopio` | `centro123` | Centro de Acopio | Registrar actividades de estudiantes |
| `ong1` | `ong123` | ONG Validador 1 | Aprobar/rechazar actividades |
| `ong2` | `ong123` | ONG Validador 2 | Aprobar/rechazar actividades |
| `admin` | `admin123` | Administrador | Gestión completa del sistema |

---

## 🏗️ Estructura del Proyecto

```
recicla_app_front/src/app/
├── components/
│   ├── navbar/                  # Barra de navegación superior
│   ├── footer/                  # Pie de página
│   ├── slidebar/                # Menu lateral para estudiantes
│   ├── slidebar-centro/         # Menu lateral para centro de acopio
│   └── slidebar-administrador/  # Menu lateral para admin
│
├── pages/
│   ├── home/                    # Página de inicio
│   ├── login/                   # Inicio de sesión
│   ├── signup/                  # Registro de usuarios
│   ├── admin/                   # Dashboard administrador
│   ├── centro/
│   │   ├── centro-dashboard/    # Dashboard centro de acopio
│   │   └── registrar-actividad-centro/  # Registro de actividades
│   ├── panel-validacion-ong/    # Panel de validación ONGs
│   ├── ver-catalogo/            # Catálogo de recompensas
│   └── ...
│
├── service/
│   ├── blockchain.service.ts    # Servicios blockchain
│   ├── re-actividad.service.ts  # Servicios de actividades
│   ├── auth.service.ts          # Autenticación
│   └── helper.ts                # Configuración global
│
├── Modelo/
│   ├── actividad.ts             # Interface de actividad
│   ├── comunidad.ts             # Interface de comunidad
│   ├── recompensa.ts            # Interface de recompensa
│   └── residuo.ts               # Interface de residuo
│
└── guards/
    ├── auth.guard.ts            # Guard de autenticación
    ├── centro-acopio.guard.ts   # Guard para centro de acopio
    └── ...
```

---

## 🎯 Flujo de la Aplicación

### 1. Centro de Acopio Registra Actividad

**Login:** `centroacopio / centro123`

1. Ir a **"Registrar Actividad"**
2. Ingresar datos:
   - **Wallet Estudiante:** (Ej: `0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65`)
   - **Tipo de Material:** Plástico, Papel, Vidrio, etc.
   - **Peso (kg):** Cantidad de material reciclado
   - **Evidencia:** Foto del material
3. Click **"Registrar"**

### 2. ONG1 Valida (Primera Aprobación)

**Login:** `ong1 / ong123`

1. Ir a **"Panel de Validación"**
2. Ver actividades pendientes
3. Revisar evidencia (imagen en IPFS)
4. **Aprobar** o **Rechazar**

### 3. ONG2 Valida (Segunda Aprobación)

**Login:** `ong2 / ong123`

1. Ir a **"Panel de Validación"**
2. Ver actividades pendientes
3. **Aprobar** o **Rechazar**

> ✅ Con 2 aprobaciones → Tokens REC acuñados al estudiante

### 4. Estudiante Canjea Recompensas

**Login:** Usuario estudiante

1. Ver **"Catálogo de Recompensas"**
2. Seleccionar producto
3. Canjear con tokens REC

---

## 📝 Comandos Útiles

### Desarrollo

```bash
# Iniciar servidor
ng serve

# Iniciar en puerto específico
ng serve --port 4201

# Abrir automáticamente en navegador
ng serve --open
```

### Build

```bash
# Build de desarrollo
ng build

# Build de producción
ng build --configuration production
```

### Testing

```bash
# Ejecutar tests
ng test

# Tests con coverage
ng test --code-coverage
```

### Limpieza

```bash
# Limpiar cache de Angular
ng cache clean

# Reinstalar dependencias
Remove-Item -Recurse -Force node_modules
npm install
```

### Generación de Componentes

```bash
# Generar componente
ng generate component pages/nombre-componente

# Generar servicio
ng generate service service/nombre-servicio

# Generar guard
ng generate guard guards/nombre-guard
```

---

## 🎨 Librerías UI Disponibles

- **Angular Material:** Componentes UI
- **Bootstrap 5:** Grid system y utilidades
- **Chart.js:** Gráficas y visualizaciones
- **jsPDF:** Exportar a PDF
- **SweetAlert2:** Alertas modales bonitas

### Ejemplos de Uso

**Angular Material Button:**
```html
<button mat-raised-button color="primary">Click me</button>
```

**Bootstrap Grid:**
```html
<div class="row">
  <div class="col-md-6">Columna 1</div>
  <div class="col-md-6">Columna 2</div>
</div>
```

**SweetAlert:**
```typescript
import Swal from 'sweetalert2';

Swal.fire('¡Éxito!', 'Operación completada', 'success');
```

---

## 🛠️ Troubleshooting

### ❌ Error: "Cannot GET /"

**Causa:** Frontend no está corriendo.

**Solución:**
```bash
ng serve
```

### ❌ Error: "Http failure response for http://localhost:8080"

**Causa:** Backend no está corriendo o URL incorrecta.

**Solución:**

1. Verifica que backend esté en `http://localhost:8080`
2. Revisa `src/app/service/helper.ts`

### ❌ Error: "Port 4200 is already in use"

**Solución:**
```bash
# Usar otro puerto
ng serve --port 4201

# O cerrar el proceso
Get-Process -Id (Get-NetTCPConnection -LocalPort 4200).OwningProcess | Stop-Process
```

### ❌ Cambios no se reflejan

**Solución:**
```bash
# Detener servidor (Ctrl+C)
ng cache clean
ng serve
```

### ❌ Errores de compilación TypeScript

**Solución:**
```bash
# Reinstalar dependencias
Remove-Item -Recurse -Force node_modules, package-lock.json
npm install
```

### ❌ Error: "Module not found"

**Solución:**
```bash
npm install
```

---

## 🌐 Rutas de la Aplicación

| Ruta | Descripción | Guard |
|------|-------------|-------|
| `/home` | Página principal | - |
| `/login` | Inicio de sesión | - |
| `/signup` | Registro | - |
| `/admin/*` | Dashboard admin | AdminGuard |
| `/centro/*` | Dashboard centro | CentroAcopioGuard |
| `/ong/validacion` | Panel validación ONG | OngGuard |
| `/user/catalogo` | Catálogo estudiante | AuthGuard |

---

## 📚 Tecnologías

- **Angular:** 16.2.x
- **Angular Material:** 16.2.x
- **TypeScript:** 5.1.x
- **RxJS:** 7.8.x
- **Bootstrap:** 5.3.x
- **Chart.js:** 3.4.x
- **SweetAlert2:** Alertas modales
- **jsPDF:** Generación de PDFs

---

## 🔐 Seguridad

> ⚠️ **IMPORTANTE:** Este proyecto usa configuración de **DESARROLLO**

**NO usar en producción:**
- Tokens JWT en localStorage (vulnerable a XSS)
- Sin HTTPS/TLS
- CORS abierto en backend

**Para producción:**
1. Implementa HttpOnly cookies para JWT
2. Habilita HTTPS
3. Configura Content Security Policy (CSP)
4. Sanitiza todas las entradas de usuario
5. Implementa rate limiting en login

---

## ✅ Checklist de Configuración

- [ ] Node.js v18+ instalado
- [ ] `npm install` ejecutado sin errores
- [ ] Backend corriendo en `http://localhost:8080`
- [ ] Blockchain corriendo en `http://127.0.0.1:8545`
- [ ] `helper.ts` configurado con URL correcta
- [ ] `ng serve` inicia sin errores
- [ ] Login funciona con `centroacopio/centro123`
- [ ] Navegación entre páginas funcional

---

## 🎯 Para Desarrolladores Frontend

**Si solo trabajas en UI/UX:**

1. Asegúrate de que backend y blockchain estén corriendo
2. Enfócate en `/src/app/pages/` y `/src/app/components/`
3. Usa Angular Material y Bootstrap para componentes
4. Los servicios ya están configurados - solo consúmelos

**Ejemplos de mejoras UI:**
- Dashboard con gráficas (Chart.js)
- Galería de evidencias más visual
- Animaciones con Angular Animations
- Cards más atractivas para recompensas
- Drag & drop para archivos

---

**Puerto:** 4200  
**URL:** http://localhost:4200  
**Hot Reload:** ✅ Activado
