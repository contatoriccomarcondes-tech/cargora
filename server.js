const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

app.get("/", (req, res) => {
  res.send("API Cargora funcionando 🚚");
});


// LISTAR CARGAS
app.get("/cargas", async (req, res) => {

  try {

    const result = await pool.query(`
      SELECT 
        id,
        origem_estado,
        origem_cidade,
        destino_estado,
        destino_cidade,
        toneladas,
        valor,
        tipo_frete,
        status,
        created_at
      FROM cargas
      ORDER BY created_at DESC
    `);

    res.json(result.rows);

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: "Erro ao buscar cargas" });

  }

});


// CRIAR CARGA
app.post("/cargas", async (req, res) => {

  try {

    const {
      origem_estado,
      origem_cidade,
      destino_estado,
      destino_cidade,
      toneladas,
      valor,
      tipo_frete
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO cargas
      (
        origem_estado,
        origem_cidade,
        destino_estado,
        destino_cidade,
        toneladas,
        valor,
        tipo_frete
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *
      `,
      [
        origem_estado,
        origem_cidade,
        destino_estado,
        destino_cidade,
        toneladas,
        valor,
        tipo_frete
      ]
    );

    res.json(result.rows[0]);

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: "Erro ao criar carga" });

  }

});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});