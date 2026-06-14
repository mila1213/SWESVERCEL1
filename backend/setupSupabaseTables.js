const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Error: SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY deben estar configurados en backend/.env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const tables = ['users', 'password_reset_codes', 'products'];

async function checkTables() {
  console.log('Validando tablas en Supabase...');

  for (const table of tables) {
    const { error } = await supabase.from(table).select('id', { head: true, count: 'exact' });
    if (error) {
      console.error(`- Tabla "${table}" no encontrada o no accesible.`);
      console.error('  Ejecuta el SQL en backend/supabase_tables.sql en tu proyecto Supabase.');
      console.error('  Asegúrate de que la tabla exista y que las políticas de RLS permitan la consulta con la clave de servicio.');
      process.exit(1);
    } else {
      console.log(`- Tabla "${table}" encontrada.`);
    }
  }

  console.log('Las tablas necesarias existen en Supabase.');
  console.log('Si aún hay errores de conexión, revisa que BACKEND_PORT=8000 y VITE_BACKEND_URL apunten al mismo backend.');
}

checkTables().catch((err) => {
  console.error('Error de validación:', err.message || err);
  process.exit(1);
});
