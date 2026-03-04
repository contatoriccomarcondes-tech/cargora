const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();

app.use(cors());
app.use(express.json());

/*
=========================
CONEXÃO COM POSTGRESQL
=========================
*/

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

/*
=========================
TESTE DE CONEXÃO
=========================
*/

pool.connect()
  .then(() => console.log("✅ Conectado ao PostgreSQL"))
  .catch(err => console.error("❌ Erro ao conectar:", err));

/*
=========================
ROTA PRINCIPAL
=========================
*/

app.get("/", (req, res) => {
  res.send("🚛 API Cargora funcionando");
});

/*
=========================
LISTAR CARGAS
=========================
*/

app.get("/cargas", async (req, res) => {
  try {

    const result = await pool.query("SELECT * FROM cargas");

    res.json(result.rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      erro_real: error.message
    });

  }
});

/*
=========================
CRIAR CARGA
=========================
*/

app.post("/cargas", async (req, res) => {

  try {

    const {
      origem_estado,
      origem_cidade,
      destino_estado,
      destino_cidade
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO cargas
      (origem_estado, origem_cidade, destino_estado, destino_cidade)
      VALUES ($1,$2,$3,$4)
      RETURNING *
      `,
      [origem_estado, origem_cidade, destino_estado, destino_cidade]
    );

    res.json(result.rows[0]);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Erro ao criar carga"
    });

  }

});

/*
=========================
SERVIDOR
=========================
*/

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});app.post("/cargas", async (req, res) => {

  const {
    origem_estado,
    origem_cidade,
    destino_estado,
    destino_cidade,
    valor
  } = req.body;

  try {

    const result = await pool.query(
      `
      INSERT INTO cargas
      (origem_estado, origem_cidade, destino_estado, destino_cidade, valor, status)
      VALUES ($1,$2,$3,$4,$5,'aberta')
      RETURNING *
      `,
      [origem_estado, origem_cidade, destino_estado, destino_cidade, valor]
    );

    res.json(result.rows[0]);

  } catch (error) {

    console.error(error);
    res.status(500).json({erro:"Erro ao criar carga"});

  }

});