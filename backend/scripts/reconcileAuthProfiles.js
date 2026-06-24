const fs = require('fs');
const path = require('path');
const { supabaseAdmin } = require('../supabase');

async function listAllAuthUsers() {
  let page = 1;
  const users = [];
  while (page) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: 100 });
    if (error) throw error;
    users.push(...(data?.users || []));
    page = data?.nextPage || null;
  }
  return users;
}

async function run() {
  try {
    console.log('Obteniendo usuarios de auth...');
    const authUsers = await listAllAuthUsers();
    console.log('Total auth users:', authUsers.length);

    const report = {
      totalAuth: authUsers.length,
      mismatches: [],
      missingProfiles: [],
      orphanProfiles: [],
    };

    for (const au of authUsers) {
      const email = (au.email || '').toLowerCase().trim();
      // buscar perfil por id
      const { data: profileById, error: errById } = await supabaseAdmin.from('users').select('id,email,nombre,phone,role').eq('id', au.id).single();
      if (errById && errById.code !== 'PGRST116') {
        // PGRST116 o similar puede indicar no encontrado; ignore otherwise log
        // continue to email lookup
        console.warn('Warning checking profile by id:', errById.message || errById);
      }

      if (!profileById) {
        // buscar por email
        const { data: profileByEmail, error: errByEmail } = await supabaseAdmin.from('users').select('id,email,nombre,phone,role').eq('email', email).limit(1).maybeSingle();
        if (errByEmail) console.warn('Warning checking profile by email:', errByEmail.message || errByEmail);

        if (profileByEmail) {
          // mismatch: auth id != profile id but same email
          report.mismatches.push({ authId: au.id, authEmail: email, profileId: profileByEmail.id, profileEmail: profileByEmail.email });
        } else {
          // no profile at all
          report.missingProfiles.push({ authId: au.id, authEmail: email });
        }
      }
    }

    // buscar perfiles huérfanos (profiles without auth user)
    const { data: allProfiles } = await supabaseAdmin.from('users').select('id,email');
    for (const p of allProfiles || []) {
      const found = authUsers.find((a) => a.id === p.id);
      if (!found) {
        report.orphanProfiles.push({ profileId: p.id, profileEmail: p.email });
      }
    }

    const outPath = path.join(__dirname, 'reconcile_report.json');
    fs.writeFileSync(outPath, JSON.stringify(report, null, 2));
    console.log('Informe generado en', outPath);
    console.log('Resumen:', JSON.stringify({ mismatches: report.mismatches.length, missingProfiles: report.missingProfiles.length, orphanProfiles: report.orphanProfiles.length }));
  } catch (err) {
    console.error('Error generando informe:', err);
    process.exit(1);
  }
}

run();
