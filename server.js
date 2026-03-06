const express = require("express")
const cors = require("cors")
const { Pool } = require("pg")

const app = express()

app.use(cors())
app.use(express.json())

const pool = new Pool({
connectionString: process.env.DATABASE_URL,
ssl: {
rejectUnauthorized: false
}
})

app.get("/", (req,res)=>{
res.send("Servidor Cargora rodando 🚛")
})

/* LISTAR CARGAS */

app.get("/cargas", async (req,res)=>{

try{

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
created_at
FROM cargas
ORDER BY id DESC
`)

res.json(result.rows)

}catch(err){

console.error(err)

res.status(500).json({erro:"Erro ao buscar cargas"})

}

})

/* PUBLICAR CARGA */

app.post("/cargas", async (req,res)=>{

try{

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
INSERT INTO cargas(

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

}catch(err){

console.error(err)

res.status(500).json({erro:"Erro ao inserir carga"})

}

})

/* PORTA */

const PORT = process.env.PORT || 10000

app.listen(PORT, ()=>{

console.log("Servidor rodando na porta", PORT)

})