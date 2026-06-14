const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = require("./index");

const INITIAL_PORT = Number(process.env.PORT || process.env.BACKEND_PORT || 8000);
const MAX_PORT_ATTEMPTS = 5;
let serverInstance = null;

const gracefulShutdown = (signal) => {
  if (serverInstance) {
    console.log(`Recibiendo ${signal}. Cerrando servidor...`);
    serverInstance.close(() => {
      console.log('Servidor detenido correctamente.');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

const startServer = (port, attempt = 1) => {
  const server = app.listen(port, () => {
    serverInstance = server;
    console.log(`Servidor corriendo en http://localhost:${port}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      if (attempt < MAX_PORT_ATTEMPTS) {
        const nextPort = port + 1;
        console.warn(`Puerto ${port} en uso. Intentando iniciar en ${nextPort}... (intento ${attempt + 1}/${MAX_PORT_ATTEMPTS})`);
        startServer(nextPort, attempt + 1);
      } else {
        console.error(`Error: los puertos ${INITIAL_PORT} a ${INITIAL_PORT + MAX_PORT_ATTEMPTS - 1} están ocupados. Cambia BACKEND_PORT en backend/.env o detén el proceso que usa el puerto.`);
        process.exit(1);
      }
    } else {
      console.error('Error en el servidor:', err);
      process.exit(1);
    }
  });
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.once('SIGUSR2', () => {
  gracefulShutdown('SIGUSR2');
  process.kill(process.pid, 'SIGUSR2');
});

startServer(INITIAL_PORT);
