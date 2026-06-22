const { supabaseAnon, supabaseService, supabaseAdmin } = require("../supabase");
const { sendEmail } = require("../utils/sendEmail");

const FRONTEND_VERIFY_URL = process.env.FRONTEND_VERIFY_URL || "http://localhost:5173/verify";
const FRONTEND_RESET_URL = process.env.FRONTEND_RESET_URL || "http://localhost:5173/reset-password";

const findAuthUserByEmail = async (email) => {
  try {
    let page = 1;
    const perPage = 100;

    while (page) {
      const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage });
      if (error) {
        return { user: null, error };
      }

      const users = data?.users || [];
      const foundUser = users.find((user) => user?.email?.toLowerCase() === email);
      if (foundUser) {
        return { user: foundUser, error: null };
      }

      page = data?.nextPage || null;
      if (!page || page <= 0) break;
    }

    return { user: null, error: null };
  } catch (err) {
    return { user: null, error: err };
  }
};

const buildFrontendUrl = (fallback, path, req) => {
  const origin = req?.get("origin") || req?.headers?.origin;
  const base = origin && origin !== 'null' ? origin.replace(/\/+$/, '') : String(fallback || '').replace(/\/+$/, '');
  return `${base}${path}`;
};

const generateRecoveryCode = () => Math.floor(100000 + Math.random() * 900000).toString();

const createPasswordResetRecord = async (userId, email, code, minutes = 20) => {
  const expiresAt = new Date(Date.now() + minutes * 60 * 1000).toISOString();
  return supabaseAdmin
    .from("password_reset_codes")
    .insert([{ user_id: userId, email, code, expires_at: expiresAt }])
    .select()
    .single();
};

const getPasswordResetRecord = async (email, code) => {
  return supabaseAdmin
    .from("password_reset_codes")
    .select("*")
    .eq("email", email)
    .eq("code", code)
    .eq("used", false)
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false })
    .limit(1)
    .single();
};

const isMissingResetTableError = (error) => {
  if (!error) return false;
  const msg = String(error.message || error.details || "").toLowerCase();
  return msg.includes("could not find the table") || msg.includes("pgrst205") || msg.includes("password_reset_codes");
};

const ADMIN_EMAILS = [
  "leonor.yumi@epn.edu.ec",
  "camila.bueno@epn.edu.ec",
  "concepcion.arequipa@epn.edu.ec",
].map((email) => email.toLowerCase());

const getRoleByEmail = (email) => {
  if (!email) return "visitante";
  const normalized = email.toLowerCase().trim();
  if (ADMIN_EMAILS.includes(normalized)) return "administrador";
  if (normalized.endsWith("@epn.edu.ec")) return "emprendedor";
  return "visitante";
};

const normalizePhone = (phone) => {
  if (!phone) return "";
  return String(phone).replace(/\D/g, "");
};

const register = async (req, res) => {
  try {
    const { email, password, nombre, role, phone } = req.body;
    const normalizedEmail = email?.toLowerCase().trim();
    const normalizedPhone = normalizePhone(phone);
    const inferredRole = getRoleByEmail(normalizedEmail);
    const selectedRole = role || inferredRole || "visitante";

    if (!normalizedEmail || !password || !nombre) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "La contraseña debe tener mínimo 6 caracteres" });
    }
    if (selectedRole === "emprendedor" && !normalizedEmail.endsWith("@epn.edu.ec")) {
      return res.status(400).json({ message: "El correo debe ser institucional @epn.edu.ec para registrarse como emprendedor" });
    }
    if (selectedRole === "emprendedor" && !normalizedPhone) {
      return res.status(400).json({ message: "El teléfono es obligatorio para emprendedores" });
    }
    if (selectedRole === "administrador") {
      return res.status(403).json({ message: "No puedes registrar administradores" });
    }

    let user;
    let registrationMessage = "Usuario registrado. Revisa tu correo para verificar tu cuenta.";

    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      let adminData;
      let adminError;
      try {
        const result = await supabaseService.auth.admin.createUser({
          email: normalizedEmail,
          password,
          email_confirm: true,
          email_confirmed: true,
          user_metadata: {
            nombre: nombre.trim(),
            role: selectedRole,
            phone: normalizedPhone,
          },
        });
        adminData = result.data;
        adminError = result.error;
      } catch (err) {
        adminError = err;
      }

      const message = adminError?.message || adminError?.msg || "Error desconocido";
      const lowerMessage = String(message).toLowerCase();
      if (lowerMessage.includes("already") && lowerMessage.includes("registered")) {
        return res.status(400).json({ message: "El correo ya está registrado" });
      }
      if (adminError) {
        return res.status(500).json({ message: "Error al registrar usuario", detail: message });
      }

      user = adminData.user || adminData.data?.user || adminData.data;
      registrationMessage = "Usuario creado y confirmado. Ya puedes iniciar sesión.";
    } else {
      const { data, error } = await supabaseAnon.auth.signUp(
        {
          email: normalizedEmail,
          password,
        },
        {
          data: { nombre: nombre.trim(), role: selectedRole, phone: normalizedPhone },
          emailRedirectTo: buildFrontendUrl(FRONTEND_VERIFY_URL, '', req),
        }
      );

      if (error) {
        if (error.message?.includes("already registered") || error.message?.includes("already been registered")) {
          return res.status(400).json({ message: "El correo ya está registrado" });
        }
        return res.status(500).json({ message: "Error al registrar usuario", detail: error.message });
      }

      user = data.user;
    }

    const userId = user?.id;
    if (userId) {
      const { error: profileError } = await supabaseAdmin.from("users").upsert({
        id: userId,
        email: normalizedEmail,
        nombre: nombre.trim(),
        role: selectedRole,
        phone: normalizedPhone,
        created_at: new Date().toISOString(),
      }, { onConflict: 'id' });
      if (profileError) {
        if (profileError.code === '42501') {
          console.warn("Advertencia RLS al guardar perfil inicial en register:", profileError.message);
        } else {
          console.error("Error guardando perfil:", profileError);
        }
      }
    }

    res.status(201).json({ message: registrationMessage });
  } catch (error) {
    console.error("Error en register:", error);
    res.status(500).json({ message: "Error interno del servidor", detail: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email?.toLowerCase().trim();

    if (!normalizedEmail || !password) {
      return res.status(400).json({ message: "Correo y contraseña requeridos" });
    }

    const { data, error } = await supabaseService.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    if (error) {
      console.error('signInWithPassword error details:', error, data);
      const errorMessage = (error.message || "Credenciales inválidas").toString();
      if (errorMessage.includes("Email not confirmed")) {
        return res.status(403).json({ message: "Correo no verificado. Revisa tu bandeja de entrada y confirma tu cuenta." });
      }

      const lowerMessage = errorMessage.toLowerCase();
      if (lowerMessage.includes("invalid login credentials") || lowerMessage.includes("invalid password") || lowerMessage.includes("no active account") || lowerMessage.includes("user not found")) {
        const { data: profileCheck, error: profileError } = await supabaseService
          .from("users")
          .select("id")
          .eq("email", normalizedEmail)
          .single();

        if (!profileCheck || profileError) {
          return res.status(401).json({ message: "Usuario no registrado" });
        }

        return res.status(401).json({ message: "Correo o contraseña incorrectos" });
      }

      return res.status(401).json({ message: errorMessage });
    }

    const userId = data.user?.id;
    const currentAccessToken = data.session?.access_token;
    if (currentAccessToken) {
      const { error: signOutOthersError } = await supabaseAdmin.auth.admin.signOut(currentAccessToken, 'others');
      if (signOutOthersError) {
        console.warn("No se pudo cerrar otras sesiones del usuario:", signOutOthersError.message || signOutOthersError);
      }
    }

    let role = getRoleByEmail(normalizedEmail);
    let phone = "";
    let nombre = data.user?.user_metadata?.nombre || "";

    if (userId) {
      const { data: profile, error: profileError } = await supabaseAdmin
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (profileError && profileError.code !== "PGRST116") {
        console.error("Error leyendo perfil:", profileError);
      }

      if (profile) {
        role = getRoleByEmail(normalizedEmail) === "administrador" ? "administrador" : profile.role || role;
        phone = profile.phone || "";
        nombre = profile.nombre || nombre;
      } else {
        if (getRoleByEmail(normalizedEmail) === "administrador") {
          role = "administrador";
        }
        const { error: insertError } = await supabaseAdmin.from("users").upsert({
          id: userId,
          email: normalizedEmail,
          nombre: nombre || "",
          role,
          phone: "",
          created_at: new Date().toISOString(),
        }, { onConflict: 'id' });
        if (insertError) {
          if (insertError.code === '42501') {
            console.warn("Advertencia RLS al crear perfil inicial en login:", insertError.message);
          } else {
            console.error("Error creando perfil inicial:", insertError);
          }
        }
      }
    }

    res.json({
      message: "Login exitoso",
      token: data.session?.access_token,
      uid: data.user?.id,
      email: data.user?.email,
      role,
      phone,
      name: nombre,
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

const verifyAccount = async (req, res) => {
  try {
    const token = req.query.token || req.query.oobCode || req.params.token;
    if (!token) return res.status(400).json({ message: "Falta el token de verificación" });

    const { data, error } = await supabaseService.auth.verifyOtp({
      type: "signup",
      token,
    });

    if (error) {
      return res.status(400).json({ message: error.message || "Token inválido o expirado" });
    }

    res.json({ message: "Cuenta verificada correctamente", email: data.user?.email });
  } catch (error) {
    console.error("Error en verifyAccount:", error);
    res.status(500).json({ message: "Error al verificar la cuenta" });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "El correo es obligatorio" });

    const normalizedEmail = email.toLowerCase().trim();
    const { user, error: lookupError } = await findAuthUserByEmail(normalizedEmail);
    if (lookupError) {
      console.error("Error buscando usuario para recuperación:", lookupError);
    }

    let previewUrl;
    if (user?.id) {
      const code = generateRecoveryCode();
      const { error: insertError } = await createPasswordResetRecord(user.id, normalizedEmail, code);

      if (insertError) {
        console.error("Error guardando código de recuperación:", insertError);
        if (isMissingResetTableError(insertError)) {
          const { error: fallbackError } = await supabaseAnon.auth.resetPasswordForEmail(normalizedEmail, {
            redirectTo: buildFrontendUrl(FRONTEND_RESET_URL, '', req),
          });
          if (fallbackError) {
            console.error("Fallback de enlace de recuperación falló:", fallbackError);
          }
          return res.json({
            message: "Si el correo existe, se ha enviado un enlace de recuperación a tu correo.",
            method: 'link',
          });
        }
        return res.status(500).json({ message: "Error al preparar la recuperación de contraseña" });
      }

      const emailBody = `
        <p>Hola,</p>
        <p>Recibimos una solicitud para restablecer tu contraseña. Usa este código de verificación:</p>
        <h2 style="font-size: 24px; letter-spacing: 2px;">${code}</h2>
        <p>Ingresa este código en la aplicación para establecer una nueva contraseña.</p>
        <p>Si no solicitaste este cambio, ignora este correo.</p>
      `;

      try {
        const result = await sendEmail({
          to: normalizedEmail,
          subject: "Código de verificación para restablecer tu contraseña",
          html: emailBody,
        });
        previewUrl = result?.previewUrl;
      } catch (sendError) {
        console.error("Error enviando correo de recuperación:", sendError);
      }
    }

    res.json({
      message: "Si el correo existe, se ha enviado un código de recuperación a tu correo.",
      method: 'code',
      previewUrl,
    });
  } catch (error) {
    console.error("Error en forgotPassword:", error);
    res.status(500).json({ message: "Error al solicitar recuperación de contraseña" });
  }
};

const resetPasswordWithCode = async (req, res) => {
  try {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return res.status(500).json({ message: "Falta SUPABASE_SERVICE_ROLE_KEY en backend/.env. No se puede cambiar la contraseña." });
    }

    const { email, code, newPassword } = req.body;
    if (!email || !code || !newPassword) {
      return res.status(400).json({ message: "Correo, código y nueva contraseña son obligatorios" });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: "La contraseña debe tener mínimo 6 caracteres" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const { data: resetEntry, error: resetError } = await getPasswordResetRecord(normalizedEmail, code);
    if (resetError) {
      console.error("Error buscando código de recuperación:", resetError);
      return res.status(500).json({ message: "Error al validar el código de recuperación" });
    }
    if (!resetEntry) {
      return res.status(400).json({ message: "Código inválido o caducado" });
    }

    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(resetEntry.user_id, {
      password: newPassword,
    });

    if (updateError) {
      console.error("Error al actualizar contraseña del usuario:", updateError);
      return res.status(500).json({ message: "Error al cambiar la contraseña" });
    }

    const { error: markUsedError } = await supabaseAdmin
      .from("password_reset_codes")
      .update({ used: true })
      .eq("id", resetEntry.id);

    if (markUsedError) {
      console.warn("No se pudo marcar el código como usado:", markUsedError);
    }

    res.json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    console.error("Error en resetPasswordWithCode:", error);
    res.status(500).json({ message: "Error al restablecer contraseña" });
  }
};

const resetPasswordMobile = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token) return res.status(400).json({ message: "Falta el token de restablecimiento" });
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: "La contraseña debe tener mínimo 6 caracteres" });
    }

    const { data, error } = await supabaseService.auth.verifyOtp({
      type: "recovery",
      token,
    });

    if (error) {
      return res.status(400).json({ message: error.message || "Token inválido o expirado" });
    }

    const sessionAccessToken = data?.session?.access_token;
    if (!sessionAccessToken) {
      return res.status(400).json({ message: "No se pudo establecer sesión con el token proporcionado" });
    }

    const clientWithToken = require('@supabase/supabase-js').createClient(
      process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
      sessionAccessToken
    );

    const { error: updateError } = await clientWithToken.auth.updateUser({ password: newPassword });
    if (updateError) {
      return res.status(500).json({ message: updateError.message || "Error al actualizar la contraseña" });
    }

    res.json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    console.error("Error en resetPasswordMobile:", error);
    res.status(500).json({ message: "Error al restablecer contraseña" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token: bodyToken, newPassword } = req.body;
    const token = bodyToken || req.params.token || req.query.token || req.query.oobCode || req.query.access_token;

    if (!token) return res.status(400).json({ message: "Falta el token de restablecimiento" });
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: "La contraseña debe tener mínimo 6 caracteres" });
    }

    const createClient = require('@supabase/supabase-js').createClient;
    let userId;
    let sessionAccessToken;

    const isLikelyAccessToken = typeof token === 'string' && token.split('.').length >= 2;

    if (isLikelyAccessToken) {
      const clientWithToken = createClient(
        process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
        token
      );

      const { data: userData, error: userError } = await clientWithToken.auth.getUser();
      if (userError || !userData?.user?.id) {
        return res.status(400).json({ message: userError?.message || "Token inválido o expirado" });
      }

      userId = userData.user.id;
      sessionAccessToken = token;
    } else {
      const { data, error } = await supabaseAnon.auth.verifyOtp({
        type: "recovery",
        token,
      });

      if (error || !data?.user?.id) {
        return res.status(400).json({ message: error?.message || "Token inválido o expirado" });
      }

      userId = data.user.id;
      sessionAccessToken = data.session?.access_token;
    }

    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const { error: updateError } = await supabaseService.auth.admin.updateUserById(userId, {
        password: newPassword,
      });
      if (updateError) {
        return res.status(500).json({ message: updateError.message || "Error al actualizar la contraseña" });
      }
    } else {
      if (!sessionAccessToken) {
        return res.status(400).json({ message: "No se pudo establecer sesión con el token proporcionado" });
      }

      const clientWithToken = createClient(
        process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
        sessionAccessToken
      );

      const { error: updateError } = await clientWithToken.auth.updateUser({ password: newPassword });
      if (updateError) {
        return res.status(500).json({ message: updateError.message || "Error al actualizar la contraseña" });
      }
    }

    res.json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    console.error("Error en resetPassword:", error);
    res.status(500).json({ message: "Error al restablecer contraseña" });
  }
};

const changePassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const userId = req.user?.uid;

    if (!userId) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: "La contraseña debe tener mínimo 6 caracteres" });
    }

    const { data, error } = await supabaseService.auth.admin.updateUserById(userId, {
      password: newPassword,
    });

    if (error) {
      return res.status(400).json({ message: error.message || "Error al cambiar la contraseña" });
    }

    res.json({ message: "Contraseña cambiada correctamente" });
  } catch (error) {
    console.error("Error en changePassword:", error);
    res.status(500).json({ message: "Error interno al cambiar la contraseña" });
  }
};

const googleSignIn = async (req, res) => {
  try {
    const accessToken = req.body.accessToken || req.body.idToken;
    if (!accessToken) return res.status(400).json({ message: "Falta accessToken o idToken" });

    const { data: userData, error } = await supabaseService.auth.getUser(accessToken);
    if (error || !userData.user) {
      return res.status(401).json({ message: "Token inválido" });
    }

    const user = userData.user;
    const normalizedEmail = user.email?.toLowerCase().trim();
    let role = getRoleByEmail(normalizedEmail);

    const { data: existingProfile, error: profileError } = await supabaseService
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError && profileError.code !== "PGRST116") {
      console.error("Error leyendo perfil de Google:", profileError);
    }

    if (existingProfile) {
      role = getRoleByEmail(normalizedEmail) === "administrador" ? "administrador" : existingProfile.role || role;
    } else {
      if (getRoleByEmail(normalizedEmail) === "administrador") {
        role = "administrador";
      }
      const { error: insertError } = await supabaseAdmin.from("users").upsert({
        id: user.id,
        email: normalizedEmail,
        nombre: user.user_metadata?.full_name || "",
        role,
        phone: "",
        created_at: new Date().toISOString(),
      }, { onConflict: 'id' });
      if (insertError) {
        console.error("Error creando perfil Google:", insertError);
      }
    }

    res.json({
      message: "Google login exitoso",
      uid: user.id,
      email: normalizedEmail,
      role,
      name: user.user_metadata?.full_name || "",
    });
  } catch (error) {
    console.error("Error en googleSignIn:", error);
    res.status(500).json({ message: "Error en Google Sign-In", detail: error.message });
  }
};

module.exports = { register, verifyAccount, forgotPassword, resetPassword, resetPasswordWithCode, changePassword, login, googleSignIn };