# 🍽️ Sistema de Punto de Venta - App

Sistema de punto de venta desarrollado con Ionic/Angular (Frontend) y Laravel (Backend) para gestión de vales y transacciones.

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (v16 o superior) y **npm**
- **PHP** (v8.0 o superior)
- **Composer** (gestor de dependencias de PHP)
- **Git**

## 🚀 Instalación y Configuración

### 1. Clonar el Repositorio

```bash
git clone https://github.com/vicentearaya/app.git
cd app
```

### 2. Frontend (Ionic/Angular)

```bash
# Navegar a la carpeta del frontend
cd app

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start
# o alternativamente:
ionic serve
```

El frontend estará disponible en: **http://localhost:4200**

### 3. Backend (Laravel)

#### 3.1. Instalar Dependencias

```bash
# Navegar a la carpeta del backend
cd primeroproyectolaravel

# Instalar dependencias de PHP
composer install
```

#### 3.2. Configurar Base de Datos

El proyecto está configurado para usar **SQLite** por defecto (más fácil para desarrollo).

```bash
# Crear archivo de base de datos SQLite (si no existe)
touch database/database.sqlite
```

Si prefieres usar MySQL, edita el archivo `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=nombre_base_datos
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_contraseña
```

#### 3.3. Ejecutar Migraciones y Seeders

```bash
# Ejecutar migraciones y poblar la base de datos con datos de prueba
php artisan migrate:fresh --seed
```

Esto creará las tablas y agregará:
- 15 productos de ejemplo (bebidas, desayunos, almuerzos, cenas, postres)
- 4 vales de prueba (VALE001, VALE002, VALE003, VALE004)

#### 3.4. Iniciar Servidor

```bash
# Iniciar servidor Laravel
php artisan serve --host=0.0.0.0 --port=8000
```

El backend estará disponible en: **http://localhost:8000**

La API estará disponible en: **http://localhost:8000/api/v1**

## 📚 Estructura del Proyecto

```
app/
├── src/
│   ├── app/
│   │   ├── caja/              # Punto de venta
│   │   ├── home/              # Página principal
│   │   ├── login/             # Login
│   │   ├── totem/             # Solicitar vale
│   │   ├── reportes/          # Reportes
│   │   ├── models/            # Modelos TypeScript
│   │   └── services/          # Servicios API
│   └── environments/          # Configuración de entornos
│
primeroproyectolaravel/
├── app/
│   ├── Http/
│   │   └── Controllers/
│   │       └── Api/           # Controladores API
│   └── Models/                # Modelos Eloquent
├── database/
│   ├── migrations/             # Migraciones de BD
│   └── seeders/               # Seeders con datos de prueba
└── routes/
    └── api.php                # Rutas de la API
```

## 🔌 Endpoints de la API

### Productos
- `GET /api/v1/productos` - Listar todos los productos
- `GET /api/v1/productos?categoria=bebida` - Filtrar por categoría
- `GET /api/v1/productos/{id}` - Obtener un producto
- `POST /api/v1/productos` - Crear producto
- `PUT /api/v1/productos/{id}` - Actualizar producto
- `DELETE /api/v1/productos/{id}` - Eliminar producto

### Vales
- `GET /api/v1/vales` - Listar todos los vales
- `GET /api/v1/vales/{id}` - Obtener un vale
- `POST /api/v1/vales` - Crear vale
- `POST /api/v1/vales/buscar` - Buscar vale por código
- `GET /api/v1/vales/user/{userId}` - Obtener vales de un usuario
- `PUT /api/v1/vales/{id}` - Actualizar vale
- `DELETE /api/v1/vales/{id}` - Eliminar vale

### Transacciones
- `GET /api/v1/transacciones` - Listar todas las transacciones
- `GET /api/v1/transacciones/{id}` - Obtener una transacción
- `POST /api/v1/transacciones` - Crear transacción
- `GET /api/v1/transacciones/vale/{valeId}` - Obtener transacciones de un vale
- `DELETE /api/v1/transacciones/{id}` - Eliminar transacción

## 🧪 Datos de Prueba

### Vales de Prueba
- **VALE001**: $10,000 disponibles
- **VALE002**: $10,000 disponibles (de $15,000)
- **VALE003**: $20,000 disponibles
- **VALE004**: Usado (sin saldo)

### Productos de Prueba
- **Bebidas**: Café Americano ($1,500), Café con Leche ($1,800), Jugo Natural ($2,000), Agua Mineral ($1,000)
- **Desayunos**: Huevos Revueltos ($3,500), Pan con Palta ($2,500), Avena con Frutas ($3,000)
- **Almuerzos**: Sandwich Mixto ($4,000), Ensalada César ($4,500), Pollo a la Plancha ($5,500)
- **Cenas**: Pasta Carbonara ($5,000), Pizza Margherita ($6,000)
- **Postres**: Tarta de Manzana ($2,500), Helado de Vainilla ($2,000), Brownie con Helado ($3,000)

## 🧪 Ejecutar Tests

```bash
# Desde la carpeta del frontend
cd app
npm test
```

## 🛠️ Tecnologías Utilizadas

### Frontend
- **Ionic 8** - Framework UI
- **Angular 20** - Framework TypeScript
- **TypeScript** - Lenguaje de programación
- **RxJS** - Programación reactiva

### Backend
- **Laravel 9** - Framework PHP
- **SQLite** - Base de datos (desarrollo)
- **Eloquent ORM** - ORM de Laravel

## 📝 Notas Importantes

1. **CORS**: El backend está configurado para aceptar peticiones desde `http://localhost:4200`
2. **Base de Datos**: Por defecto usa SQLite, pero puedes cambiar a MySQL editando el `.env`
3. **Puertos**: 
   - Frontend: `4200`
   - Backend: `8000`
4. **Ambiente**: El frontend está configurado para conectarse a `http://localhost:8000/api/v1`

## 🐛 Solución de Problemas

### Error: "No se pudieron cargar los productos"
- Verifica que el backend esté corriendo en `http://localhost:8000`
- Revisa la consola del navegador (F12) para ver errores de conexión
- Asegúrate de que CORS esté configurado correctamente

### Error: "Access denied for user 'root'@'localhost'"
- El proyecto usa SQLite por defecto, no MySQL
- Si quieres usar MySQL, configura las credenciales en `.env`

### Error al ejecutar migraciones
- Asegúrate de que el archivo `database/database.sqlite` exista
- Verifica los permisos de escritura en la carpeta `database`

## 📄 Licencia

Este proyecto es de código abierto.

## 👥 Contribuidores

- [vicentearaya](https://github.com/vicentearaya)
