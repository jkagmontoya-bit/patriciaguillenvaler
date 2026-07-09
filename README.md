# Patricia Guillén Valer - Estética & Skin Care

Bienvenido al repositorio oficial de **Patricia Guillén Valer**, una plataforma web premium de E-commerce y Reserva de Citas para servicios de estética y skin care.

## 🌟 Características Principales

- **Diseño Premium:** Interfaz de usuario (UI) moderna, responsiva y en "Dark Mode" con detalles dorados para transmitir exclusividad.
- **Catálogo de Productos:** Exploración fluida de productos de cuidado de la piel.
- **Carrito y Checkout Inteligente:**
  - Carrito de compras integrado (Context API).
  - Flujo de pago en pasos (Acordeón) para máxima conversión.
  - Autocompletado de direcciones mediante **Google Maps API**.
  - Modal de resumen antes de confirmar compra.
- **Sistema de Usuarios (Firebase Auth):**
  - Autenticación con Google y correo electrónico.
  - Soporte para compras como "Invitado".
- **Dashboard de Cliente:**
  - Historial de pedidos en tiempo real.
  - Estado de las compras.
- **Panel Administrativo:**
  - Gestión y visualización de ventas, inventario y reservas.

## 🛠 Tecnologías Utilizadas

- **Frontend:** React.js, Vite
- **Estilos:** CSS3 (Custom Styles), Flexbox/Grid
- **Base de Datos & Auth:** Firebase (Firestore, Authentication)
- **Mapas:** `@react-google-maps/api`
- **Enrutamiento:** React Router DOM
- **Despliegue:** Vercel

## 🚀 Requisitos Previos

Asegúrate de tener instalado en tu máquina local:
- [Node.js](https://nodejs.org/) (Versión 18+ recomendada)
- NPM o Yarn

## ⚙️ Configuración y Ejecución Local

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/jkagmontoya-bit/patriciaguillenvaler.git
   cd patriciaguillenvaler
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Variables de Entorno:**
   Crea un archivo `.env` en la raíz del proyecto y agrega tus credenciales de Firebase y Google Maps:
   ```env
   VITE_FIREBASE_API_KEY=tu_api_key
   VITE_FIREBASE_AUTH_DOMAIN=tu_auth_domain
   VITE_FIREBASE_PROJECT_ID=tu_project_id
   VITE_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
   VITE_FIREBASE_APP_ID=tu_app_id
   VITE_GOOGLE_MAPS_API_KEY=tu_google_maps_api_key
   ```

4. **Ejecutar en modo desarrollo:**
   ```bash
   npm run dev
   ```
   Abre [http://localhost:5173](http://localhost:5173) en tu navegador para ver la aplicación.

## 🛡️ Reglas de Seguridad (Firebase)
Se provee un archivo `firestore.rules` en la raíz del proyecto. Este archivo contiene la configuración recomendada para asegurar que solo los usuarios autenticados puedan ver sus propios pedidos, mientras que el administrador (jkag.montoya@gmail.com) tiene acceso completo.

## 🏗️ Despliegue en Producción
Este proyecto está optimizado para su despliegue continuo en **Vercel**. Cualquier _push_ a la rama `main` generará un nuevo _build_ automáticamente.

1. Asegúrate de configurar las mismas Variables de Entorno (`.env`) en el panel de control de Vercel.
2. El comando de build es `npm run build` y el directorio de salida es `dist`.

---
*Desarrollado con ❤️ para Patricia Guillén Valer.*
