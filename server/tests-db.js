import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_fsCDwourB57T@ep-fancy-hall-addte01g-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
});

const test = async () => {
  try {
    const result = await pool.query("SELECT * FROM productos LIMIT 5");
    console.log("Conexión OK. Productos:", result.rows);
  } catch (err) {
    console.error("Error de conexión a Neon:", err);
  } finally {
    await pool.end();
  }
};

test();
