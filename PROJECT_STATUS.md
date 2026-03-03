app.get("/loads", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        l.id,
        l.origin_city,
        l.origin_state,
        l.destination_city,
        l.destination_state,
        l.cargo_type,
        l.vehicle_type,
        l.weight_kg,
        l.price,
        l.load_date,
        l.created_at,
        u.id AS user_id,
        u.name AS user_name,
        u.phone AS user_phone,
        u.email AS user_email
      FROM loads l
      JOIN users u ON l.created_by_user_id = u.id
      ORDER BY l.created_at DESC
    `);

    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar cargas" });
  }
});