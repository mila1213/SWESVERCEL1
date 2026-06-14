const express = require("express");
const { supabaseAdmin } = require("../supabase");
const { verifyToken, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/products", async (req, res) => {
  try {
    // Incluir explícitamente user_id
    const { data, error } = await supabaseAdmin
      .from("products")
      .select("id, name, description, price, image, user_id, category, sellername, sellerphone, created_at, updated_at, users(id, email, nombre, phone)");

    if (error) {
      console.error("Error al obtener productos:", error);
      return res.status(500).json({ message: "Error al obtener productos", detail: error.message });
    }

    // Mapear campos para compatibilidad con frontend (sellerPhone/sellerName)
    const mapped = (data || []).map((p) => ({
      ...p,
      sellerPhone: p.sellerphone || p.sellerPhone || p.seller_phone || p.users?.phone || null,
      sellerName: p.sellername || p.sellerName || p.seller_name || p.users?.nombre || p.users?.email || null,
    }));

    console.log('Productos devueltos:', mapped.length, '| Primer producto:', mapped[0] || 'ninguno');

    res.json(mapped);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ message: "Error al obtener productos" });
  }
});

router.get("/products/user/:userId", verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(`📊 GET /products/user/${userId}`);
    console.log('   Token presente:', !!req.headers.authorization);
    console.log('   Usuario del token:', req.user?.email);
    console.log('   UID solicitado:', userId);

    const { data, error } = await supabaseAdmin
      .from("products")
      .select("*, users(id, email, nombre, phone)")
      .eq("user_id", userId);
    
    if (error) {
      console.error('❌ Error Supabase:', error);
      throw error;
    }
    
    console.log('✅ Productos encontrados:', data?.length || 0);
    
    const mapped = (data || []).map((p) => ({
      ...p,
      sellerPhone: p.sellerphone || p.sellerPhone || p.seller_phone || p.users?.phone || null,
      sellerName: p.sellername || p.sellerName || p.seller_name || p.users?.nombre || p.users?.email || null,
    }));
    res.json(mapped);
  } catch (error) {
    console.error("❌ Error al obtener productos por usuario:", error);
    res.status(500).json({ message: "Error al obtener productos del usuario", detail: error.message });
  }
});

router.get("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabaseAdmin
      .from("products")
      .select("*, users(id, email, nombre, phone)")
      .eq("id", id)
      .single();
    if (error || !data) return res.status(404).json({ message: "Producto no encontrado" });
    const mappedProduct = {
      ...data,
      sellerPhone: data.sellerphone || data.sellerPhone || data.seller_phone || data.users?.phone || null,
      sellerName: data.sellername || data.sellerName || data.seller_name || data.users?.nombre || data.users?.email || null,
    };
    res.json(mappedProduct);
  } catch (error) {
    console.error("Error al obtener producto:", error);
    res.status(500).json({ message: "Error al obtener producto" });
  }
});

router.post("/products", verifyToken, authorizeRoles("emprendedor", "administrador"), async (req, res) => {
  try {
    const product = {
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price ? Number(req.body.price) : 0,
      image: req.body.image || null,
      sellername: req.body.sellerName || req.body.sellername || req.body.seller_name || null,
      sellerphone: req.body.sellerPhone || req.body.sellerphone || req.body.seller_phone || null,
      user_id: req.user.uid,
      created_at: new Date().toISOString(),
    };
    const { data, error } = await supabaseAdmin.from("products").insert(product).select().single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error("Error al crear producto:", JSON.stringify(error, null, 2));
    const message = error?.message || error?.msg || "Error al crear producto";
    res.status(500).json({ message: "Error al crear producto", detail: message, error });
  }
});

router.put("/products/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from("products")
      .select("user_id")
      .eq("id", id)
      .single();

    if (fetchError || !existing) return res.status(404).json({ message: "Producto no encontrado" });

    const isOwner = existing.user_id === req.user.uid;
    const isAdmin = req.user.role === "administrador";
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "No tienes permiso para actualizar este producto" });
    }

    const updates = {
      ...(req.body.name !== undefined ? { name: req.body.name } : {}),
      ...(req.body.description !== undefined ? { description: req.body.description } : {}),
      ...(req.body.category !== undefined ? { category: req.body.category } : {}),
      ...(req.body.price !== undefined ? { price: Number(req.body.price) } : {}),
      ...(req.body.image !== undefined ? { image: req.body.image } : {}),
      ...(req.body.sellerName !== undefined || req.body.sellername !== undefined || req.body.seller_name !== undefined
        ? { sellername: req.body.sellerName || req.body.sellername || req.body.seller_name || null }
        : {}),
      ...(req.body.sellerPhone !== undefined || req.body.sellerphone !== undefined || req.body.seller_phone !== undefined
        ? { sellerphone: req.body.sellerPhone || req.body.sellerphone || req.body.seller_phone || null }
        : {}),
      updated_at: new Date().toISOString(),
    };
    const { data, error } = await supabaseAdmin.from("products").update(updates).eq("id", id).select().single();
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    res.status(500).json({ message: "Error al actualizar producto", mensaje: "Error al actualizar producto" });
  }
});

router.delete("/products/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from("products")
      .select("user_id")
      .eq("id", id)
      .single();

    if (fetchError || !existing) return res.status(404).json({ message: "Producto no encontrado" });

    const isOwner = existing.user_id === req.user.uid;
    const isAdmin = req.user.role === "administrador";
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "No tienes permiso para eliminar este producto" });
    }

    const { error } = await supabaseAdmin.from("products").delete().eq("id", id);
    if (error) throw error;
    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({ message: "Error al eliminar producto" });
  }
});

router.get("/admin/stats", verifyToken, authorizeRoles("administrador"), async (req, res) => {
  try {
    const [{ count: totalProducts, error: totalError }, { data: products, error: productError }, { count: totalUsers, error: usersError }] = await Promise.all([
      supabaseAdmin.from("products").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("products").select("price"),
      supabaseAdmin.from("users").select("*", { count: "exact", head: true }),
    ]);

    if (totalError || productError || usersError) {
      throw totalError || productError || usersError;
    }

    const totalValue = (products || []).reduce((sum, p) => sum + (Number(p.price) || 0), 0);

    res.json({
      totalUsers: totalUsers || 0,
      totalProducts: totalProducts || 0,
      totalValue: totalValue.toFixed(2),
    });
  } catch (error) {
    console.error("Error al generar estadísticas de administrador:", error);
    res.status(500).json({ message: "Error interno al procesar las métricas" });
  }
});

module.exports = router;
