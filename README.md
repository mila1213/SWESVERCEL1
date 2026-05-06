# SWES - Sistema Web de Emprendimientos Estudiantiles

Descripcion del proyecto: SWES es una plataforma web tipo mini marketplace diseñada para la promoción, gestión y búsqueda de emprendimientos y servicios ofrecidos por estudiantes de la Escuela Politécnica Nacional.

El sistema permite a los usuarios registrarse e iniciar sesión para acceder a sus funcionalidades. Una vez dentro, los estudiantes pueden publicar y administrar sus propios emprendimientos, así como explorar los servicios ofrecidos por otros usuarios.

La plataforma organiza los emprendimientos en distintas categorías, como tecnología, educación y comida, facilitando la búsqueda y navegación. De esta manera, SWES fomenta la colaboración, visibilidad y crecimiento de iniciativas estudiantiles dentro de la comunidad universitaria.

## Funcionalidades
- Registro e inicio de sesión de usuarios
- Publicación de emprendimientos
- Visualización de servicios
- Clasificación por categorías (tecnología, educación, comida)
- Navegación entre usuarios y servicios
## Arquitectura del sistema

El sistema sigue una arquitectura cliente-servidor:

- Frontend: React + Vite
- Backend: Node.js + Express
- Base de datos: Firebase Firestore
- Autenticación: Firebase Auth
  
## Estructura
* **/docs**: Diseños y mockups.
* **/frontend**: Interfaz de usuario creada con:
  1. React + Vite: Proporciona un renderizado eficiente de componentes y una velocidad de desarrollo superior gracias al hot-reload de Vite.
  2. Tailwind CSS: Framework principal de estilos dentro del frontend.
  3. Configuración Visual: El diseño se centra en los archivos **tailwind.config.js** e **index.css**
* **/backend**: Carpeta para la lógica del servidor.
* **.gitignore**: Configurado para no subir archivos innecesarios o pesados.

## Tecnologías
* **Base de Datos**: Firestore.
* **Autenticación**: Firebase.
* **Entorno**: Node.js v24.14.1 y npm 11.11.0.
* **Desarrollo de la interfaz de usuario del sistema**: Tailwind CSS

## Variables de entorno

- Este proyecto utiliza variables de entorno para la configuración.
- El archivo `.env` no está incluido en el repositorio por seguridad.
  Ejemplo de variables necesarias:
  ```env
  PORT=8000
  FIREBASE_API_KEY=tu_api_key
  FIREBASE_AUTH_DOMAIN=tu_dominio
  FIREBASE_PROJECT_ID=tu_proyecto

## Pasos para la ejecucion del proyecto:
1. Clona el repositorio en Visual Studio Code
2. En el proyecto abre una nueva terminal para cada carpeta:
   - Frontend
     1. Entra a la carpeta: `cd frontend`
     2. Instala todo lo necesario para el proyecto: `npm install`
     3. Ejecucion del frontend: `npm run dev`
     4. Resultado: `http://localhost:5173/ ` (puede variar según el entorno)
  - Backend
    1. Entra a la carpeta: `cd backend`
    2. Instala todo lo necesario para el proyecto: `npm install`
    3. Ejecucion del backend: `npm run dev`
    4. Resultado: Servidor corriendo en `http://localhost:8000/`

## Problemas conocidos
- El sistema requiere configuración manual de Firebase
- No incluye archivo `serviceAccountKey.json` por seguridad

## Capturas del sistema

1. Registro de cuenta
   
   <img width="959" height="500" alt="image" src="https://github.com/user-attachments/assets/c858c9ed-aaf8-4cce-a101-8ca08302a070" />

   <img width="959" height="499" alt="image" src="https://github.com/user-attachments/assets/1226b376-373c-40cd-a84a-ac3dd7fc5694" />

3. Inicio de sesion
   
   <img width="959" height="500" alt="image" src="https://github.com/user-attachments/assets/fb567b24-f2a9-4d5a-803d-40fba4086585" />

## Autores
- Nombres: Concepcion Arequipa, Camila Bueno y Leonor Yumi
- Institución: Escuela Politécnica Nacional




   
