const express = require('express');
const router = express.Router();
const { supabaseAnon, supabaseAdmin } = require('../supabase');

router.get('/debug/supabase', async (req, res) => {
  try {
    const hasServiceKey = !!(process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.SUPABASE_SERVICE_ROLE_KEY.trim());

    const results = {};

    try {
      const { data, error } = await supabaseAdmin.from('users').select('id').limit(1);
      results.adminSelect = { ok: !error, error: error ? { message: error.message, code: error.code } : null, sample: data || null };
    } catch (err) {
      results.adminSelect = { ok: false, error: { message: err.message || err }, sample: null };
    }

    try {
      const { data, error } = await supabaseAnon.from('users').select('id').limit(1);
      results.anonSelect = { ok: !error, error: error ? { message: error.message, code: error.code } : null, sample: data || null };
    } catch (err) {
      results.anonSelect = { ok: false, error: { message: err.message || err }, sample: null };
    }

    res.json({ hasServiceKey, results });
  } catch (error) {
    res.status(500).json({ message: 'Error interno al ejecutar debug', detail: error.message });
  }
});

module.exports = router;
