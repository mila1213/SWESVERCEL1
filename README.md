# SWES

Descripcion: Desarrollo de un sistema web para la promoción, gestión y búsqueda de emprendimientos y servicios de los estudiantes de la Escuela Politecnica Nacional. 

## Estructura
* **/docs**: Diseños y mockups.
* **/frontend**: Interfaz de usuario creada con:
  1. React + Vite: Proporciona un renderizado eficiente de componentes y una velocidad de desarrollo superior gracias al hot-reload de Vite.
  2. Tailwind CSS: Framework principal de estilos dentro del frontend.
  3. Configuración Visual: El diseño se centra en los archivos **tailwind.config.js** e **index.css**
* **/backend**: Carpeta para la lógica del servidor.
* **.gitignore**: Configurado para no subir archivos innecesarios o pesados.

## Tecnologías
* **Base de Datos**: Firestone.
* **Autenticación**: Firebase.
* **Entorno**: Node.js v24.14.1 y npm 11.11.0.
* **Desarrollo de la interfaz de usuario del sistema**: Tailwind CSS

## Pasos para la ejecucion del proyecto:
1. Clona el repositorio en Visual Studio Code
2. En el proyecto abre una nueva terminal para cada carpeta:
   - Frontend
     1. Entra a la carpeta: `cd frontend`
     2. Instala todo lo necesario para el proyecto: `npm install`
     3. Ejecuta el fronted: `npm run dev`
     4. Resultado: `http://localhost:5178/`
  - Backend
    1. Entra a la carpeta: `cd backend`
    2. Instala todo lo necesario para el proyecto: `npm install`
    3. Ejecuta el fronted: `npm run dev`
    4. Resultado: Servidor corriendo en `http://localhost:8000/`
