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

// Depuración: buscar usuario por email en auth y en tabla public.users
router.get('/debug/user', async (req, res) => {
  try {
    const email = (req.query.email || '').toLowerCase().trim();
    if (!email) return res.status(400).json({ message: 'Falta parámetro email' });

    // Buscar en auth (paginado)
    let foundAuth = null;
    let page = 1;
    while (page) {
      const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: 100 });
      if (error) return res.status(500).json({ message: 'Error listando usuarios de auth', detail: error.message });
      const u = (data?.users || []).find((x) => x?.email?.toLowerCase() === email);
      if (u) {
        foundAuth = u;
        break;
      }
      page = data?.nextPage || null;
    }

    // Buscar en tabla users
    const { data: profile, error: profileError } = await supabaseAdmin.from('users').select('*').eq('email', email).single();
    if (profileError && profileError.code !== 'PGRST116') {
      // PGRST116 = no rows (PostgREST)
    }

    res.json({ email, authUser: foundAuth || null, profile: profile || null });
  } catch (err) {
    console.error('Debug /debug/user error:', err);
    res.status(500).json({ message: 'Error interno', detail: err.message });
  }
});

module.exports = router;
