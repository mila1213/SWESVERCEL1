const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { createClient } = require('@supabase/supabase-js');
const supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
(async () => {
  try {
    const table = 'password_reset_codes';
    const { data, error } = await supabaseAdmin
      .from('information_schema.columns')
      .select('column_name,data_type')
      .eq('table_name', table);
    console.log('schema error:', error);
    console.log('schema data:', data);

    const { data: rows, error: rowsError } = await supabaseAdmin
      .from(table)
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);
    console.log('rows error:', rowsError);
    console.log('rows data:', rows);
  } catch (err) {
    console.error('script error', err);
  }
})();