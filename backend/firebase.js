const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

const serviceAccountPath = (() => {
  const envPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  if (!envPath) {
    return path.join(__dirname, "serviceAccountKey.json");
  }
  // Normalize path - if it starts with ./, remove it
  let normalizedPath = envPath.startsWith("./") ? envPath.slice(2) : envPath;
  // If not absolute, resolve relative to __dirname
  return path.isAbsolute(normalizedPath) ? normalizedPath : path.resolve(__dirname, normalizedPath);
})();

const normalizePrivateKey = (key) => {
  if (!key) return key;
  return key.replace(/\\n/g, "\n");
};

const loadServiceAccountFromEnv = () => {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    try {
      return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    } catch (error) {
      throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON debe ser JSON válido");
    }
  }

  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON_BASE64) {
    try {
      const raw = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_JSON_BASE64, "base64").toString("utf8");
      return JSON.parse(raw);
    } catch (error) {
      throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON_BASE64 debe ser JSON Base64 válido");
    }
  }

  if (
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY
  ) {
    return {
      type: process.env.FIREBASE_SERVICE_ACCOUNT_TYPE || "service_account",
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID || "",
      private_key: normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID || "",
      auth_uri: process.env.FIREBASE_AUTH_URI || "https://accounts.google.com/o/oauth2/auth",
      token_uri: process.env.FIREBASE_TOKEN_URI || "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url:
        process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL || "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL || "",
    };
  }

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS && fs.existsSync(process.env.GOOGLE_APPLICATION_CREDENTIALS)) {
    return require(path.resolve(process.env.GOOGLE_APPLICATION_CREDENTIALS));
  }

  if (fs.existsSync(serviceAccountPath)) {
    try {
      const fileContent = fs.readFileSync(serviceAccountPath, "utf8");
      return JSON.parse(fileContent);
    } catch (error) {
      console.error(`[firebase.js] Error al leer ${serviceAccountPath}:`, error.message);
      return null;
    }
  }

  return null;
};

const createMissingFirebaseProxy = (message) => {
  const handler = {
    get() {
      throw new Error(message);
    },
    apply() {
      throw new Error(message);
    },
  };

  return new Proxy(() => {
    throw new Error(message);
  }, handler);
};

const createMissingDbProxy = (message) => {
  const createStubCollection = () => {
    return new Proxy(
      {},
      {
        get: () => {
          return () => {
            throw new Error(message);
          };
        },
      }
    );
  };

  return new Proxy(
    {},
    {
      get: (target, prop) => {
        if (prop === "collection") {
          return createStubCollection;
        }
        return () => {
          throw new Error(message);
        };
      },
    }
  );
};

const missingMessage =
  "Firebase no está configurado. Agrega una cuenta de servicio en backend/.env con FIREBASE_SERVICE_ACCOUNT_PATH, FIREBASE_SERVICE_ACCOUNT_JSON, FIREBASE_SERVICE_ACCOUNT_JSON_BASE64, o GOOGLE_APPLICATION_CREDENTIALS.";

const serviceAccount = loadServiceAccountFromEnv();

let auth;
let db;

if (!serviceAccount) {
  console.warn("[firebase.js] Atención: no se encontró la cuenta de servicio de Firebase. El servidor seguirá activo, pero las operaciones de Firebase fallarán hasta configurar correctamente la cuenta.");

  auth = createMissingFirebaseProxy(missingMessage);
  db = createMissingDbProxy(missingMessage);
} else {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  auth = admin.auth();
  db = admin.firestore();
}

module.exports = { auth, db };
