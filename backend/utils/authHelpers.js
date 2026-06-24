const { supabaseAdmin } = require("../supabase");

const ADMIN_EMAILS = [
  "leonor.yumi@epn.edu.ec",
  "camila.bueno@epn.edu.ec",
  "concepcion.arequipa@epn.edu.ec",
].map((email) => email.toLowerCase());

// Roles y emails
const getRoleByEmail = (email) => {
  if (!email) return "visitante";
  const normalized = email.toLowerCase().trim();
  if (ADMIN_EMAILS.includes(normalized)) return "administrador";
  if (normalized.endsWith("@epn.edu.ec")) return "emprendedor";
  return "visitante";
};

// Normalizar datos
const normalizePhone = (phone) => (phone ? String(phone).replace(/\D/g, "") : "");

const normalizeEmail = (email) => email?.toLowerCase().trim() || "";

// Validaciones comunes
const validateUserInput = (email, password, nombre) => {
  if (!email || !password || !nombre) {
    return "Email, contraseña y nombre son obligatorios";
  }
  if (password.length < 6) {
    return "La contraseña debe tener mínimo 6 caracteres";
  }
  return null;
};

// URL del frontend
const buildFrontendUrl = (fallback, path, req) => {
  const origin = req?.get("origin") || req?.headers?.origin;
  const base = origin && origin !== 'null' ? origin.replace(/\/+$/, '') : String(fallback || '').replace(/\/+$/, '');
  return `${base}${path}`;
};

// Código de recuperación
const generateRecoveryCode = () => Math.floor(100000 + Math.random() * 900000).toString();

// Recuperación de contraseña en BD
const createPasswordResetRecord = async (userId, email, code, minutes = 20) => {
  const expiresAt = new Date(Date.now() + minutes * 60 * 1000).toISOString();
  // use maybeSingle to avoid throwing when driver returns no rows
  return supabaseAdmin
    .from("password_reset_codes")
    .insert([{ user_id: userId, email, code, expires_at: expiresAt, used: false }])
    .select()
    .maybeSingle();
};

const getPasswordResetRecord = async (email, code) => {
  // Prefer using maybeSingle to avoid throwing when no rows exist.
  const nowIso = new Date().toISOString();
  const { data, error } = await supabaseAdmin
    .from("password_reset_codes")
    .select("*")
    .eq("email", email)
    .eq("code", code)
    .eq("used", false)
    .gt("expires_at", nowIso)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.warn("getPasswordResetRecord: error querying with used=false", error.message || error);
    // try fallback without used filter (in case some rows have null used)
    const { data: fallbackData, error: fallbackError } = await supabaseAdmin
      .from("password_reset_codes")
      .select("*")
      .eq("email", email)
      .eq("code", code)
      .gt("expires_at", nowIso)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    return { data: fallbackData, error: fallbackError };
  }

  // If no row matched with used=false, try fallback to accept null used
  if (!data) {
    const { data: fallbackData, error: fallbackError } = await supabaseAdmin
      .from("password_reset_codes")
      .select("*")
      .eq("email", email)
      .eq("code", code)
      .gt("expires_at", nowIso)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    return { data: fallbackData, error: fallbackError };
  }

  return { data, error: null };
};

// Perfil de usuario
const createOrUpdateUserProfile = async (userId, email, nombre, role, phone = "") => {
  try {
    const { data, error } = await supabaseAdmin
      .from("users")
      .upsert(
        {
          id: userId,
          email,
          nombre: nombre.trim(),
          role,
          phone,
          created_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      )
      .select()
      .limit(1);

    if (error) {
      // If email unique constraint prevents upsert, return the existing user by email
      if (error.code === "23505" && String(error.details || "").includes("email")) {
        const { data: existing } = await supabaseAdmin.from("users").select("*").eq("email", email).limit(1).single();
        return { error: null, profile: existing };
      }
      return { error, profile: null };
    }

    // data may be array from supabase upsert select
    const profile = Array.isArray(data) ? data[0] : data;
    return { error: null, profile };
  } catch (err) {
    return { error: err, profile: null };
  }
};

const getUserProfile = async (userId) => {
  return supabaseAdmin.from("users").select("*").eq("id", userId).single();
};

module.exports = {
  getRoleByEmail,
  normalizePhone,
  normalizeEmail,
  validateUserInput,
  buildFrontendUrl,
  generateRecoveryCode,
  createPasswordResetRecord,
  getPasswordResetRecord,
  createOrUpdateUserProfile,
  getUserProfile,
  ADMIN_EMAILS,
};
