import express from "express";
import cors from "cors";
import pkg from "pg";
const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());
import nodemailer from "nodemailer";

// Crear el transporter de Nodemailer
const transporter = nodemailer.createTransport({
  service: "yahoo",
  auth: {
    user: "carritocompras@yahoo.com",
    pass: "tecnicatura16-",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

transporter.verify()
  .then(() => console.log("✅ Servidor de correo listo"))
  .catch(err => console.error("❌ Error con el correo:", err));

// 🔹 Conexión a Neon
const pool = new Pool({
  connectionString:
    "postgresql://neondb_owner:npg_fsCDwourB57T@ep-fancy-hall-addte01g-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require",
});

// 🔹 Ruta principal
app.get("/", (req, res) => {
  res.send("Servidor CandyLand funcionando 🚀");
});

// 🔹 1. Listar productos
app.get("/api/productos", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id_producto AS id,
        nombre_producto AS title,
        precio as price,
        id_categoria,
        unidad_medida,
        peso
      FROM productos
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Error al traer productos:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// 🔹 2. Registrar usuario
app.post("/api/usuarios/registro", async (req, res) => {
  const { nombre_usuario, contraseña } = req.body;
  try {
    const existe = await pool.query(
      "SELECT * FROM usuarios WHERE nombre_usuario = $1",
      [nombre_usuario]
    );
    if (existe.rows.length > 0) {
      return res.status(400).json({ error: "El usuario ya existe" });
    }
    await pool.query(
      "INSERT INTO usuarios (nombre_usuario, contraseña) VALUES ($1, $2)",
      [nombre_usuario, contraseña]
    );
    res.json({ mensaje: "Usuario registrado correctamente" });
  } catch (err) {
    console.error("Error al registrar usuario:", err);
    res.status(500).json({ error: "Error en el registro" });
  }
});

// 🔹 3. Login usuario
app.post("/api/usuarios/login", async (req, res) => {
  const { nombre_usuario, contraseña } = req.body;
  try {
    const result = await pool.query(
      "SELECT * FROM usuarios WHERE nombre_usuario = $1 AND contraseña = $2",
      [nombre_usuario, contraseña]
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
    }
    res.json({ mensaje: "Login exitoso", usuario: result.rows[0] });
  } catch (err) {
    console.error("Error al iniciar sesión:", err);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
});

// 🔹 4. ✨ Crear pedido SIN login (anónimo)
app.post("/api/orders", async (req, res) => {
  const { nombre_cliente, email_cliente, direccion_envio, products } = req.body;

  // Validaciones
  if (!nombre_cliente || !email_cliente || !direccion_envio || !products || products.length === 0) {
    return res.status(400).json({ 
      error: "Faltan datos: nombre, email, dirección y productos son requeridos" 
    });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Calcular total
    const total = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);

    // Insertar pedido (sin id_usuario)
    const pedidoResult = await client.query(
      `INSERT INTO pedidos (nombre_cliente, email_cliente, fecha_hora, direccion_envio, total, estado) 
       VALUES ($1, $2, NOW(), $3, $4, 'pendiente') 
       RETURNING id`,
      [nombre_cliente, email_cliente, direccion_envio, total]
    );

    const id_pedido = pedidoResult.rows[0].id;

    // Insertar cada producto en detalle_pedido
    for (const producto of products) {
      const subtotal = producto.price * producto.quantity;
      await client.query(
        `INSERT INTO detalle_pedido (id_producto, cantidad, precio_venta, subtotal, id_pedido) 
         VALUES ($1, $2, $3, $4, $5)`,
        [producto.id, producto.quantity, producto.price, subtotal, id_pedido]
      );
    }

    await client.query("COMMIT");
    
    console.log(`✅ Pedido ${id_pedido} creado para ${nombre_cliente}`);

    // 📧 Enviar email de confirmación
    try {
      await transporter.sendMail({
        from: '"CandyLand" <carritocompras@yahoo.com>',
        to: email_cliente,
        subject: `Pedido #${id_pedido} confirmado`,
        html: `
          <h2>¡Gracias por tu compra, ${nombre_cliente}!</h2>
          <p>Tu pedido #${id_pedido} ha sido registrado exitosamente.</p>
          <p><strong>Total:</strong> $${total.toFixed(2)}</p>
          <p><strong>Dirección de envío:</strong> ${direccion_envio}</p>
          <p>Te notificaremos cuando esté en camino.</p>
        `
      });
      console.log(`📧 Email enviado a ${email_cliente}`);
    } catch (emailErr) {
      console.error("⚠️ Error al enviar email:", emailErr);
      // No falla el pedido si falla el email
    }

    res.json({ 
      mensaje: "Pedido creado exitosamente", 
      id_pedido,
      total 
    });

  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Error al crear pedido:", err);
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// 🔹 5. Ver pedidos de un usuario
app.get("/api/pedidos/:id_usuario", async (req, res) => {
  const { id_usuario } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM pedidos WHERE id_usuario = $1 ORDER BY fecha_hora DESC",
      [id_usuario]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener pedidos:", err);
    res.status(500).json({ error: "Error al obtener pedidos" });
  }
});

// 🔹 6. Ver detalle de un pedido
app.get("/api/pedidos/:id_pedido/detalle", async (req, res) => {
  const { id_pedido } = req.params;
  try {
    const result = await pool.query(
      `SELECT dp.*, p.nombre_producto 
       FROM detalle_pedido dp
       JOIN productos p ON dp.id_producto = p.id_producto
       WHERE dp.id_pedido = $1`,
      [id_pedido]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener detalle:", err);
    res.status(500).json({ error: "Error al obtener detalle" });
  }
});

// 🔹 Iniciar servidor
app.listen(3001, () => {
  console.log("✅ Servidor escuchando en http://localhost:3001");
});