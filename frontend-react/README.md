# Frontend React - Armería Vanguard

Esta es la aplicación frontend de Armería Vanguard construida con React.

## Estructura del Proyecto

```
src/
├── components/         # Componentes reutilizables
│   └── Navbar.js      # Barra de navegación principal
├── config/            # Configuración de la aplicación
│   └── api.js         # Configuración de API
├── context/           # Contexts de React
│   ├── AuthContext.js # Gestión de autenticación
│   └── CartContext.js # Gestión del carrito
├── pages/             # Páginas principales
│   ├── Home.js        # Página principal con productos
│   ├── Login.js       # Página de inicio de sesión
│   ├── Admin.js       # Panel de administración
│   ├── Cart.js        # Carrito de compras
│   ├── Product.js     # Detalles del producto
│   ├── Orders.js      # Historial de órdenes
│   └── Profile.js     # Perfil del usuario
├── App.js             # Componente principal
├── App.css            # Estilos principales
└── index.js           # Punto de entrada
```

## Características

- **Autenticación JWT**: Sistema de login/logout con tokens
- **Gestión de Estado**: Contexts para auth y carrito
- **Navegación**: React Router para SPA
- **Responsive**: Diseño adaptable con Bootstrap
- **API Integration**: Conexión con backend FastAPI
- **Carrito**: Persistencia en localStorage
- **Panel Admin**: CRUD de productos y categorías

## Tecnologías Utilizadas

- React 18
- React Router DOM
- Axios para HTTP requests
- Bootstrap 5 para estilos
- Font Awesome para iconos

## Instalación y Uso

1. Instalar dependencias:

```bash
npm install
```

2. Iniciar la aplicación en modo desarrollo:

```bash
npm start
```

3. Construir para producción:

```bash
npm run build
```

## Configuración

La aplicación se conecta por defecto al backend en `http://192.168.1.8:8000`.
Puedes cambiar esta configuración en `src/config/api.js`.

## Funcionalidades por Página

### Home

- Lista todos los productos disponibles
- Filtrado por categorías
- Añadir productos al carrito
- Vista responsive con cards

### Login

- Formulario de autenticación
- Manejo de errores
- Redirección automática

### Admin (Solo administradores)

- Gestión de productos (CRUD)
- Gestión de categorías (CRUD)
- Vista de órdenes
- Interfaz con tabs

### Cart

- Visualización de productos en el carrito
- Modificar cantidades
- Eliminar productos
- Resumen de precios
- Checkout (básico)

### Profile

- Información del usuario
- Enlaces rápidos a otras secciones
- Cerrar sesión

### Product

- Vista detallada del producto
- Añadir al carrito con cantidad personalizada
- Breadcrumb de navegación

### Orders

- Historial de compras del usuario
- Estado de las órdenes
- Detalles de cada compra

## Contextos de React

### AuthContext

- Gestión del estado de autenticación
- Login/logout
- Persistencia del token
- Verificación de roles

### CartContext

- Gestión del carrito de compras
- Persistencia en localStorage
- Operaciones CRUD del carrito
- Cálculos de totales

## Notas de Migración

Este frontend React es una conversión completa del frontend HTML/JS/CSS original.
Todas las funcionalidades han sido migradas manteniendo la misma experiencia de usuario
pero con las ventajas de React:

- Componentes reutilizables
- Estado centralizado
- Mejor organización del código
- Hot reloading en desarrollo
- Optimización para producción

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
