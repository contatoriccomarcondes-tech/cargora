const express = require("express")
const cors = require("cors")
const { Pool } = require("pg")

const app = express()

app.use(cors())
app.use(express.json())

/* ================================
   CONEXÃO COM BANCO (Render)
================================ */

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
})

/* ================================
   DISTÂNCIA ENTRE CIDADES
================================ */

function calcularDistancia(cidade1, cidade2) {

  const mapa = {
    "REGISTRO-SP:CURITIBA-PR": 408,
    "CURITIBA-PR:REGISTRO-SP": 408,

    "COLOMBO-PR:SÃO PAULO-SP": 326,
    "SÃO PAULO-SP:COLOMBO-PR": 326,

    "CAJATI-SP:REGISTRO-SP": 40,
    "REGISTRO-SP:CAJATI-SP": 40
  }

  const chave = `${cidade1}:${cidade2}`

  return mapa[chave] || null
}

/* ================================
   LISTAR CARGAS
================================ */

app.get("/cargas", async (req, res) => {

  try {

    const result = await pool.query(`
      SELECT * FROM cargas
      ORDER BY id DESC
    `)

    const cargas = result.rows.map(c => {

      const origem = `${c.origem_cidade}-${c.origem_estado}`
      const destino = `${c.destino_cidade}-${c.destino_estado}`

      const distancia = calcularDistancia(origem, destino)

      return {
        ...c,
        distancia
      }

    })

    res.json(cargas)

  } catch (err) {

    console.error(err)
    res.status(500).json({ erro: "Erro ao buscar cargas" })

  }

})

/* ================================
   PUBLICAR CARGA
================================ */

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
    } = req.body

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

    )

    res.json(result.rows[0])

  } catch (err) {

    console.error(err)
    res.status(500).json({ erro: "Erro ao publicar carga" })

  }

})

/* ================================
   STATUS API
================================ */

app.get("/", (req,res)=>{
  res.send("API Cargora rodando 🚛")
})

/* ================================
   PORTA
================================ */

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log("Servidor rodando na porta", PORT)
})