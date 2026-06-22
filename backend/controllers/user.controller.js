const { supabaseAdmin, supabaseService } = require("../supabase");

const getAllUsers = async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin.from("users").select("*");
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ mensaje: "Error al obtener usuarios" });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabaseAdmin.from("users").select("*").eq("id", id).single();
    if (error || !data) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }
    res.json(data);
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    res.status(500).json({ mensaje: "Error al obtener usuario" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({ mensaje: "No hay datos para actualizar" });
    }

    const { data: existing, error: existingError } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("id", id)
      .single();

    if (existingError || !existing) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    const { data, error } = await supabaseAdmin
      .from("users")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({ mensaje: "Error al actualizar usuario" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { data: existing, error: existingError } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("id", id)
      .single();

    if (existingError || !existing) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(id);
    if (authError) {
      console.error("Error al eliminar usuario en auth:", authError);
      return res.status(500).json({ mensaje: "No se pudo eliminar la cuenta de autenticación del usuario" });
    }

    const { error: deleteError } = await supabaseAdmin.from("users").delete().eq("id", id);
    if (deleteError) throw deleteError;

    res.json({ mensaje: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({ mensaje: "Error al eliminar usuario" });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
