const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: "localhost",
  port: 5432,
  user: "cargora",
  password: "123456",
  database: "cargora",
});

// Teste de conexão
pool.connect()
  .then(() => console.log("✅ Conectado ao PostgreSQL"))
  .catch(err => console.error("❌ Erro ao conectar:", err));

/* ============================
   HEALTHCHECK
============================ */
app.get("/", (req, res) => {
  res.json({
    ok: true,
    name: "Cargora API",
    time: new Date().toISOString()
  });
});

/* ============================
   USERS
============================ */

// Criar usuário
app.post("/users", async (req, res) => {
  try {
    const { id, name, email, phone } = req.body;

    await pool.query(
      "INSERT INTO users (id, name, email, phone) VALUES ($1, $2, $3, $4)",
      [id, name, email, phone]
    );

    res.status(201).json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar usuário" });
  }
});

// Listar usuários
app.get("/users", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM users ORDER BY created_at DESC"
    );

    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar usuários" });
  }
});

/* ============================
   LOADS (CARGAS)
============================ */

// Criar carga
app.post("/loads", async (req, res) => {
  try {
    const {
      id,
      createdByUserId,
      originCity,
      originState,
      destinationCity,
      destinationState,
      cargoType,
      vehicleType,
      weightKg,
      price,
      loadDate
    } = req.body;

    await pool.query(
      `INSERT INTO loads
      (id, created_by_user_id, origin_city, origin_state,
       destination_city, destination_state,
       cargo_type, vehicle_type,
       weight_kg, price, load_date)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
      [
        id,
        createdByUserId,
        originCity,
        originState,
        destinationCity,
        destinationState,
        cargoType,
        vehicleType,
        weightKg,
        price,
        loadDate
      ]
    );

    res.status(201).json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar carga" });
  }
});

// Listar cargas
app.get("/loads", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM loads ORDER BY created_at DESC"
    );

    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar cargas" });
  }
});

// Deletar carga
app.delete("/loads/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      "DELETE FROM loads WHERE id = $1",
      [id]
    );

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao deletar carga" });
  }
});

/* ============================
   SERVER
============================ */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando: http://localhost:${PORT}`);
});