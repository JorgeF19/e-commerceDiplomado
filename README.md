# E-commerce Diplomado - Armería Vanguard

Sistema completo de e-commerce desarrollado con **FastAPI** (backend) y **React** (frontend) para la venta de productos de armería.

## 🚀 Tecnologías

### Backend
- **FastAPI** - Framework web moderno y rápido
- **SQLite** - Base de datos
- **SQLAlchemy** - ORM
- **JWT** - Autenticación
- **Uvicorn** - Servidor ASGI

### Frontend
- **React 18** - Biblioteca de UI
- **React Router** - Navegación SPA
- **Bootstrap 5** - Framework CSS
- **Axios** - Cliente HTTP
- **Context API** - Gestión de estado

## 📁 Estructura del Proyecto

```
├── backend/                 # API FastAPI
│   ├── main.py             # Aplicación principal
│   ├── models.py           # Modelos de base de datos
│   ├── schemas.py          # Esquemas Pydantic
│   ├── database.py         # Configuración de BD
│   ├── auth_service.py     # Autenticación
│   ├── products_service.py # Gestión de productos
│   ├── cart_service.py     # Carrito de compras
│   └── orders_service.py   # Gestión de órdenes
├── frontend-react/          # Aplicación React
│   ├── src/
│   │   ├── components/     # Componentes reutilizables
│   │   ├── pages/          # Páginas principales
│   │   ├── context/        # Contexts de React
│   │   └── config/         # Configuración
│   └── public/             # Archivos estáticos
├── frontend/               # Frontend original (HTML/CSS/JS)
└── schema.sql              # Esquema de base de datos
```

## 🔧 Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone https://github.com/JorgeF19/e-commerceDiplomado.git
cd e-commerceDiplomado
```

### 2. Configurar Backend
```bash
# Crear entorno virtual
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate

# Instalar dependencias
pip install fastapi uvicorn sqlalchemy python-jose[cryptography] passlib[bcrypt] python-multipart

# Configurar base de datos
python backend/init_db.py

# Iniciar servidor
uvicorn backend.main:app --host 192.168.1.8 --port 8000 --reload
```

### 3. Configurar Frontend React
```bash
cd frontend-react
npm install
npm start  # Desarrollo en http://localhost:3000
```

## 🌟 Características

### 👤 Autenticación
- Sistema de login/logout
- Roles de usuario (cliente/administrador)
- Protección de rutas
- Tokens JWT

### 🛍️ E-commerce
- Catálogo de productos
- Filtrado por categorías
- Carrito de compras persistente
- Sistema de órdenes
- Gestión de inventario

### 👑 Panel de Administración
- CRUD de productos
- Gestión de categorías
- Vista de órdenes
- Control de usuarios

### 📱 Experiencia de Usuario
- Diseño responsive
- Navegación SPA
- Estados de carga
- Manejo de errores

## 🎯 Funcionalidades por Página

### 🏠 Home
- Lista de productos con imágenes
- Filtros por categoría
- Añadir productos al carrito
- Navegación a detalles del producto

### 🔐 Login
- Autenticación de usuarios
- Validación de formularios
- Redirección automática
- Manejo de errores

### 🛒 Carrito
- Visualización de productos
- Modificar cantidades
- Eliminar productos
- Resumen de precios
- Proceso de checkout

### 📦 Productos
- Vista detallada del producto
- Especificaciones completas
- Añadir al carrito con cantidad
- Navegación breadcrumb

### 📋 Órdenes
- Historial de compras
- Estados de pedidos
- Detalles de cada orden
- Seguimiento de entregas

### 👤 Perfil
- Información del usuario
- Enlaces rápidos
- Gestión de sesión
- Datos de cuenta

### ⚙️ Admin (Solo administradores)
- Gestión completa de productos
- Administración de categorías
- Vista de todas las órdenes
- Control de inventario

## 🔐 Usuarios de Prueba

### Administrador
- **Email**: admin@armeria.com
- **Password**: admin123

### Cliente
- **Email**: usuario@armeria.com
- **Password**: usuario123

## 🚀 Despliegue

### Desarrollo
```bash
# Backend
uvicorn backend.main:app --host 192.168.1.8 --port 8000 --reload

# Frontend
cd frontend-react
npm start
```

### Producción
```bash
# Frontend
cd frontend-react
npm run build
npm run serve

# Backend
uvicorn backend.main:app --host 0.0.0.0 --port 8000
```

## 📊 Base de Datos

### Tablas principales:
- **users**: Usuarios del sistema
- **categories**: Categorías de productos
- **products**: Catálogo de productos
- **orders**: Órdenes de compra
- **order_items**: Detalles de órdenes

### Relaciones:
- Usuarios → Órdenes (1:N)
- Órdenes → Items (1:N)
- Productos → Categorías (N:1)

## 🔄 API Endpoints

### Autenticación
- `POST /auth/login` - Iniciar sesión
- `GET /auth/me` - Obtener usuario actual

### Productos
- `GET /products/products/` - Listar productos
- `POST /products/products/` - Crear producto (admin)
- `GET /products/categories/` - Listar categorías

### Órdenes
- `GET /orders` - Obtener órdenes del usuario
- `POST /orders` - Crear nueva orden

## 🛠️ Desarrollo

### Comandos útiles:
```bash
# Backend
python backend/create_user.py     # Crear usuarios de prueba
uvicorn backend.main:app --reload # Desarrollo con hot reload

# Frontend
npm start                         # Servidor de desarrollo
npm run build                     # Build para producción
npm test                          # Ejecutar pruebas
```

## 📈 Mejoras Futuras

- [ ] Sistema de pagos (PayPal, Stripe)
- [ ] Notificaciones push
- [ ] Búsqueda avanzada
- [ ] Wishlist/Favoritos
- [ ] Reviews y ratings
- [ ] Chat de soporte
- [ ] PWA (Progressive Web App)
- [ ] Tests automatizados

## 🤝 Contribuir

1. Fork el repositorio
2. Crear rama de feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para detalles.

## 👨‍💻 Autor

**Jorge Flores**
- GitHub: [@JorgeF19](https://github.com/JorgeF19)
- Email: jorge@ejemplo.com

## 🙏 Agradecimientos

- Diplomado en Desarrollo Web
- Comunidad de FastAPI
- Documentación de React
- Bootstrap team

---

⭐ ¡Si te gusta este proyecto, dale una estrella!