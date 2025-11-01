# 🍽️ FoodieRank - Frontend

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)


> **Plataforma web moderna para descubrir, calificar y rankear los mejores restaurantes de tu ciudad.**

FoodieRank es una aplicación frontend desarrollada con tecnologías web puras que permite a los usuarios explorar restaurantes, leer y escribir reseñas auténticas, y participar en una comunidad activa de amantes de la gastronomía.

---
El proyecto se puede visualizar y probar en: https://foodierank.vercel.app/

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Capturas de Pantalla](#-capturas-de-pantalla)
- [Demo en Vivo](#-demo-en-vivo)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Configuración de la API](#-configuración-de-la-api)
- [Guía de Uso](#-guía-de-uso)
- [Roles y Permisos](#-roles-y-permisos)
- [Funcionalidades Principales](#-funcionalidades-principales)
- [Mejores Prácticas Implementadas](#-mejores-prácticas-implementadas)
- [Troubleshooting](#-troubleshooting)
- [Autores](#-autores)

---

## ✨ Características

### 🔐 Autenticación y Gestión de Usuarios
- Sistema completo de registro e inicio de sesión
- Autenticación basada en JWT (JSON Web Tokens)
- Gestión segura de tokens en localStorage con expiración automática
- Perfiles de usuario personalizables
- Cierre de sesión automático al expirar el token

### 🏪 Exploración de Restaurantes
- **Catálogo completo** con paginación eficiente
- **Filtros avanzados** por:
  - Categoría (italiana, mexicana, japonesa, etc.)
  - Ciudad
  - Búsqueda por nombre
- **Ordenamiento** por popularidad, rating y fecha
- Vista detallada con información completa del restaurante

### ⭐ Sistema de Reseñas y Calificaciones
- Creación de reseñas con calificación de 1-5 estrellas
- Sistema de likes/dislikes en reseñas
- Edición y eliminación de reseñas propias
- Visualización de promedio de calificaciones
- Sistema de ranking ponderado

### 📊 Ranking y Estadísticas
- Top 10 restaurantes mejor calificados
- Estadísticas en tiempo real (total de restaurantes, reseñas, categorías)
- Algoritmo de ranking basado en popularidad y calificación

### 👨‍💼 Panel de Administración
- Gestión de categorías (crear, visualizar)
- Aprobación/rechazo de restaurantes pendientes
- Visualización de usuarios registrados
- Control de contenido de la plataforma

### 📱 Diseño Responsive
- Interfaz adaptable a dispositivos móviles, tablets y desktop
- Menú hamburguesa para navegación móvil
- Experiencia de usuario optimizada para todas las pantallas

### 🎨 Experiencia de Usuario
- Notificaciones toast para feedback visual
- Spinners de carga para mejor UX
- Validaciones en tiempo real
- Manejo de errores con mensajes descriptivos
- Imágenes placeholder para contenido sin imagen

---

## 📸 Capturas de Pantalla

<!-- Aquí puedes agregar tus capturas de pantalla -->

### Página Principal
![alt text](image-1.png)


### Catálogo de Restaurantes
```
[Agregar captura de pantalla aquí]
```

### Vista Detallada
```
[Agregar captura de pantalla aquí]
```

### Panel de Administración
![alt text](image-2.png)

## 🌐 Demo en Vivo

**Frontend:** https://foodierank.vercel.app/

**Backend API:**  https://github.com/Deamacevedo/Backend-FoodieRank

---

## 🛠️ Tecnologías Utilizadas

| Tecnología | Descripción |
|------------|-------------|
| **HTML5** | Estructura semántica y accesible |
| **CSS3** | Estilos modernos con variables CSS y diseño responsive |
| **JavaScript** | Lógica de aplicación con características modernas |
| **Fetch API** | Consumo de endpoints REST |
| **LocalStorage API** | Persistencia de autenticación y preferencias |


### Arquitectura de Código
- **Modular:** Separación clara entre servicios, utilidades y componentes
- **Orientada a servicios:** Servicios dedicados para API, autenticación y utilidades
- **Event-driven:** Manejo de eventos del DOM de forma eficiente


---

## 🚀 Instalación y Configuración

### Opción 1: Clonar el Repositorio

```bash
# Clonar el repositorio
git clone https://github.com/Jefersonlopezr/foodierank
```

### Opción 2: Descargar ZIP

1. Descarga el proyecto como archivo ZIP
2. Extrae el contenido en tu directorio de preferencia

### Configurar Variables de Entorno

El proyecto incluye un archivo de configuración en `assets/js/config.js`:

```javascript
const CONFIG = {
  API: {
    BASE_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? 'http://localhost:3000/api/v1'
      : 'https://backend-foodierank.onrender.com/api/v1',
    TIMEOUT: 30000,
    RETRY_ATTEMPTS: 3
  }
};
```

**Para desarrollo local:**
- Asegúrate de que el backend esté corriendo en `http://localhost:3000`
- El frontend detectará automáticamente localhost y usará la URL local


### Servir la Aplicación

#### Usando Live Server (VS Code)

1. Instala la extensión [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
2. Haz clic derecho en `index.html`
3. Selecciona "Open with Live Server"
4. La aplicación se abrirá en `http://localhost:5500` (o el puerto configurado)


#### Usando Node.js http-server

```bash
# Instalar http-server globalmente
npm install -g http-server

# Ejecutar el servidor
http-server -p 8000

# Abre en tu navegador: http://localhost:8000
```

---

## 📁 Estructura del Proyecto

```
foodierank-frontend/
│
├── assets/
│   ├── css/
│   │   ├── reset.css           # Reset de estilos del navegador
│   │   ├── variables.css       # Variables CSS (colores, fuentes, etc.)
│   │   ├── styles.css          # Estilos globales
│   │   ├── home.css            # Estilos de la página principal
│   │   ├── auth.css            # Estilos de login/registro
│   │   ├── restaurants.css     # Estilos del catálogo
│   │   ├── restaurant-detail.css # Estilos de vista detallada
│   │   ├── admin.css           # Estilos del panel admin
│   │   └── icons.css           # Iconos y elementos visuales
│   │
│   └── js/
│       ├── config.js           # Configuración global de la app
│       ├── api.js              # Servicio de API (endpoints)
│       ├── auth.js             # Servicio de autenticación
│       ├── utils.js            # Funciones utilitarias
│       ├── main.js             # Script principal (index.html)
│       ├── restaurants.js      # Lógica del catálogo
│       ├── restaurant-detail.js # Lógica de vista detallada
│       └── admin.js            # Lógica del panel admin
│
├── pages/
│   ├── login.html              # Página de inicio de sesión
│   ├── register.html           # Página de registro
│   ├── restaurants.html        # Catálogo de restaurantes
│   ├── restaurant-detail.html  # Vista detallada de restaurante
│   ├── profile.html            # Perfil de usuario
│   └── admin.html              # Panel de administración
│
├── index.html                  # Página principal
└── README.md                   # Este archivo
```

### Descripción de Archivos Clave

#### 🔧 Configuración

**`assets/js/config.js`**
- Configuración centralizada de la aplicación
- URLs de la API (desarrollo y producción)
- Constantes de validación
- Configuraciones de UI (timeouts, debounce, etc.)

#### 🌐 Servicios

**`assets/js/api.js`**
- Wrapper de Fetch API con manejo de errores
- Métodos HTTP: GET, POST, PUT, PATCH, DELETE
- Endpoints organizados por recurso:
  - `auth.*` - Autenticación
  - `restaurants.*` - Restaurantes
  - `reviews.*` - Reseñas
  - `categories.*` - Categorías
  - `users.*` - Usuarios

**`assets/js/auth.js`**
- Gestión de autenticación JWT
- Almacenamiento seguro de tokens
- Verificación de permisos (usuario/admin)
- Redirección automática según estado de autenticación

**`assets/js/utils.js`**
- Funciones utilitarias reutilizables
- Formateo de fechas, precios y ratings
- Generación de estrellas (rating visual)
- Sistema de notificaciones toast
- Validaciones (email, URL, etc.)
- Sanitización de HTML (prevención XSS)

#### 📄 Páginas y Scripts

**`assets/js/main.js`** (index.html)
- Carga de estadísticas
- Top 10 restaurantes
- Inicialización de navegación

**`assets/js/restaurants.js`** (restaurants.html)
- Sistema de filtrado y búsqueda
- Paginación
- Creación de restaurantes
- Renderizado de cards

**`assets/js/restaurant-detail.js`** (restaurant-detail.html)
- Información detallada del restaurante
- CRUD de reseñas
- Sistema de likes/dislikes
- Gestión de platos

**`assets/js/admin.js`** (admin.html)
- Panel de control administrativo
- Gestión de aprobaciones
- Creación de categorías
- Vista de usuarios

---

## 🔌 Configuración de la API

### Conexión con el Backend

El frontend se conecta al backend de FoodieRank mediante la configuración en `assets/js/config.js`.

#### Desarrollo Local

```javascript
// Asegúrate de que el backend esté corriendo en:
// http://localhost:3000

// El frontend detectará automáticamente localhost y usará:
BASE_URL: 'http://localhost:3000/api/v1'
```

#### Producción

```javascript
// Modifica la URL según tu deployment:
BASE_URL: 'https://backend-foodierank.onrender.com/api/v1'
```

### Endpoints Disponibles

#### Autenticación
```
POST   /auth/register          # Registrar nuevo usuario
POST   /auth/login             # Iniciar sesión
GET    /auth/profile           # Obtener perfil
PUT    /auth/profile           # Actualizar perfil
POST   /auth/logout            # Cerrar sesión
```

#### Restaurantes
```
GET    /restaurants            # Listar restaurantes
GET    /restaurants/:id        # Obtener restaurante
GET    /restaurants/ranking    # Top restaurantes
GET    /restaurants/stats      # Estadísticas
POST   /restaurants            # Crear restaurante
PUT    /restaurants/:id        # Actualizar restaurante
PATCH  /restaurants/:id/approve # Aprobar restaurante (admin)
DELETE /restaurants/:id        # Eliminar restaurante
```

#### Reseñas
```
GET    /restaurants/:id/reviews      # Reseñas de restaurante
POST   /restaurants/:id/reviews      # Crear reseña
PUT    /reviews/:id                  # Actualizar reseña
DELETE /reviews/:id                  # Eliminar reseña
POST   /reviews/:id/like             # Like/Unlike
POST   /reviews/:id/dislike          # Dislike/Undislike
```

#### Categorías
```
GET    /categories             # Listar categorías
POST   /categories             # Crear categoría (admin)
```

#### Usuarios (Admin)
```
GET    /users                  # Listar usuarios
GET    /users/:id              # Obtener usuario
PUT    /users/:id              # Actualizar usuario
DELETE /users/:id              # Eliminar usuario
```

### Autenticación y Tokens

Todas las peticiones autenticadas incluyen el header:

```javascript
Authorization: Bearer <token_jwt>
```

El token se almacena automáticamente en `localStorage` tras login/registro y se incluye en cada petición mediante el servicio API.

### Manejo de Errores

El frontend maneja los siguientes errores de API:

- **401 Unauthorized:** Token expirado → Redirección a login
- **403 Forbidden:** Sin permisos → Mensaje de error
- **404 Not Found:** Recurso no encontrado → Mensaje de error
- **500 Server Error:** Error del servidor → Mensaje genérico

---

## 📖 Guía de Uso

### Para Usuarios No Registrados

1. **Navegar a la página principal** (`index.html`)
2. **Explorar el Top 10** de restaurantes
3. **Ver estadísticas** generales de la plataforma
4. **Acceder al catálogo** sin restricciones de lectura

### Para Usuarios Registrados

#### Registro

1. Ir a **Registrarse** en la esquina superior derecha
2. Completar el formulario:
   - Username (mínimo 3 caracteres, alfanumérico)
   - Email (formato válido)
   - Contraseña (mínimo 8 caracteres, mayúscula, minúscula y número)
3. Hacer clic en **Registrarse**
4. Serás redirigido automáticamente al inicio con sesión activa

#### Iniciar Sesión

1. Ir a **Iniciar Sesión**
2. Ingresar email y contraseña
3. El sistema guardará tu sesión por 24 horas

#### Explorar Restaurantes

1. Ir a **Restaurantes** en el menú
2. **Filtrar** por:
   - Texto de búsqueda
   - Categoría
   - Ciudad
   - Ordenamiento (rating, fecha, nombre)
3. Navegar con **paginación**
4. Hacer clic en un restaurante para ver detalles

#### Crear un Restaurante

1. En la página de **Restaurantes**, hacer clic en **Agregar Restaurante**
2. Completar el formulario:
   - Nombre del restaurante
   - Descripción
   - Categoría
   - Dirección y ciudad
   - URL de imagen (opcional)
3. El restaurante quedará **pendiente de aprobación**
4. Los admins lo aprobarán para que sea visible

#### Escribir una Reseña

1. Entrar a la **vista detallada** de un restaurante
2. Hacer clic en **Escribir Reseña**
3. Seleccionar calificación (1-5 estrellas)
4. Escribir comentario (mínimo 10 caracteres)
5. Enviar

#### Interactuar con Reseñas

- **Like:** Hacer clic en el ícono de pulgar arriba
- **Dislike:** Hacer clic en el ícono de pulgar abajo
- **Editar/Eliminar:** Solo tus propias reseñas

#### Gestionar Perfil

1. Hacer clic en tu nombre de usuario (esquina superior derecha)
2. Seleccionar **Mi Perfil**
3. Actualizar información personal
4. Ver tus restaurantes creados (si tienes)

### Para Administradores

#### Acceder al Panel Admin

1. Iniciar sesión con cuenta de administrador
2. Ir a **Admin** en el menú de navegación
3. Verás tres pestañas:
   - **Pendientes:** Restaurantes por aprobar
   - **Categorías:** Gestión de categorías
   - **Usuarios:** Lista de usuarios registrados

#### Aprobar/Rechazar Restaurantes

1. En la pestaña **Pendientes**
2. Revisar información del restaurante
3. **Aprobar:** Hace visible el restaurante en el catálogo
4. **Rechazar:** Elimina el restaurante permanentemente

#### Crear Categorías

1. En la pestaña **Categorías**
2. Hacer clic en **Agregar Categoría**
3. Ingresar nombre y descripción
4. Las categorías estarán disponibles inmediatamente

---

## 🔑 Roles y Permisos

### Usuario Estándar (`user`)

**Puede:**
- ✅ Ver restaurantes y reseñas
- ✅ Crear restaurantes (requieren aprobación)
- ✅ Escribir, editar y eliminar sus propias reseñas
- ✅ Dar like/dislike a reseñas
- ✅ Editar su perfil

**No puede:**
- ❌ Aprobar/rechazar restaurantes
- ❌ Crear categorías
- ❌ Modificar/eliminar contenido de otros usuarios
- ❌ Acceder al panel de administración

### Administrador (`admin`)

**Puede hacer todo lo de usuario estándar más:**
- ✅ Aprobar/rechazar restaurantes pendientes
- ✅ Crear y gestionar categorías
- ✅ Ver lista completa de usuarios
- ✅ Acceder al panel de administración
- ✅ Eliminar cualquier restaurante o reseña

---

## 🎯 Funcionalidades Principales

### Sistema de Autenticación JWT

```javascript
// Almacenamiento seguro del token
localStorage.setItem('foodierank_token', token);
localStorage.setItem('foodierank_user', JSON.stringify(user));
localStorage.setItem('foodierank_token_expiry', expiryTime);

// Validación automática de expiración
if (new Date().getTime() > parseInt(expiry)) {
  AuthService.logout();
  return false;
}
```

### Filtrado Dinámico con Debounce

```javascript
// Evita llamadas excesivas a la API
const debouncedSearch = Utils.debounce(() => {
  currentFilters.search = searchInput.value.trim();
  loadRestaurants();
}, 500);
```

### Sistema de Rating Interactivo

```javascript
// Generación dinámica de estrellas
Utils.generateStars(rating, interactive = true)
// Resultado: ★★★★☆ (4.5 estrellas)
```

### Sanitización de HTML

```javascript
// Prevención de ataques XSS
const sanitized = Utils.sanitizeHTML(userInput);
// Convierte <script> en &lt;script&gt;
```

### Manejo de Imágenes con Placeholder

```javascript
// Fallback automático si la imagen falla
<img
  src="${restaurant.imageUrl}"
  onerror="Utils.handleImageError(this, 'restaurant')"
>
```

### Notificaciones Toast

```javascript
// Feedback visual amigable
Utils.showToast('Reseña creada con éxito', 'success');
Utils.showToast('Error al procesar solicitud', 'error');
Utils.showToast('Sesión expirada', 'warning');
```

---

## ✅ Mejores Prácticas Implementadas

### Seguridad

- ✅ **Sanitización de HTML** para prevenir XSS
- ✅ **Validación de datos** en el cliente antes de enviar
- ✅ **Expiración automática de tokens** (24 horas)
- ✅ **Redirección automática** si el token expira
- ✅ **HTTPS en producción** (recomendado)

### Rendimiento

- ✅ **Debounce en búsquedas** para reducir llamadas a la API
- ✅ **Paginación** para evitar cargas pesadas
- ✅ **Lazy loading** de datos según navegación
- ✅ **Minificación de archivos** en producción (recomendado)

### UX/UI

- ✅ **Feedback visual inmediato** (toasts, spinners)
- ✅ **Diseño responsive** sin media queries complejas
- ✅ **Validaciones en tiempo real**
- ✅ **Mensajes de error descriptivos**
- ✅ **Estados de carga** para operaciones async

### Código Limpio

- ✅ **Separación de responsabilidades** (servicios, utils, componentes)
- ✅ **Código modular y reutilizable**
- ✅ **Nomenclatura consistente** en español
- ✅ **Comentarios descriptivos** en funciones complejas
- ✅ **Manejo centralizado de errores**

### Accesibilidad

- ✅ **HTML semántico** (header, nav, main, footer)
- ✅ **Atributos alt** en imágenes
- ✅ **Contraste de colores** adecuado
- ✅ **Navegación por teclado** funcional

---

## 🐛 Troubleshooting

### Error: "No se puede conectar con la API"

**Problema:** El frontend no puede comunicarse con el backend.

**Soluciones:**
1. Verifica que el backend esté corriendo:
   ```bash
   # Deberías poder acceder a:
   http://localhost:3000/api/v1
   ```
2. Revisa la configuración en `assets/js/config.js`
3. Verifica problemas de CORS en el backend
4. Comprueba la consola del navegador para ver el error exacto

### Error: "Sesión expirada"

**Problema:** El token JWT ha expirado después de 24 horas.

**Solución:**
- Simplemente vuelve a iniciar sesión
- El sistema te redirigirá automáticamente al login

### Las imágenes no cargan

**Problema:** Las URLs de imágenes son inválidas o el servidor no responde.

**Solución:**
- El sistema cargará automáticamente un placeholder
- Verifica que las URLs sean válidas y accesibles
- Considera usar un servicio CDN para imágenes

### Restaurante no aparece después de crearlo

**Problema:** Los restaurantes nuevos requieren aprobación.

**Solución:**
- Los restaurantes creados por usuarios están en estado "pendiente"
- Un administrador debe aprobarlos desde el panel admin
- Una vez aprobados, aparecerán en el catálogo

### Error 401 en las peticiones

**Problema:** Token no válido o faltante.

**Soluciones:**
1. Cierra sesión y vuelve a iniciar
2. Limpia el localStorage:
   ```javascript
   localStorage.clear();
   ```
3. Verifica que el backend esté aceptando el token

### Estilos no se aplican correctamente

**Problema:** Los archivos CSS no cargan en orden.

**Solución:**
- Verifica que el orden de importación en el HTML sea:
  ```html
  <link rel="stylesheet" href="assets/css/reset.css">
  <link rel="stylesheet" href="assets/css/variables.css">
  <link rel="stylesheet" href="assets/css/styles.css">
  ```
- Limpia la caché del navegador (Ctrl + Shift + R)

### Problemas de CORS

**Problema:** El navegador bloquea peticiones entre orígenes.

**Solución:**
- Asegúrate de que el backend tenga configurado CORS:
  ```javascript
  app.use(cors({
    origin: ['http://localhost:5500', 'https://tu-frontend.com']
  }));
  ```

---


## 👨‍💻 Autores

**Jeferson Lopez & Dylan Acevedo**
