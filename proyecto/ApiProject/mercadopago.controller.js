const ACCESS_TOKEN = "APP_USR-2813772825895965-112617-112db10aa30998457e1886b1f8cf6787-2114869553";
const sql = require('mssql');
const { getConnection } = require('./connection');

const createPreference = async (req, res) => {
  const { items, user } = req.body;

  try {
    const pool = await getConnection();
    const query = "SELECT UserId FROM Users WHERE Email = @Email";
    const result = await pool.request().input("Email", user.email).query(query);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    const userId = result.recordset[0].UserId;

    const preference = {
      items: items.map((item) => ({
        id: item.ProductId,
        title: item.title,
        quantity: Number(item.quantity),
        unit_price: item.unit_price,
        currency_id: "UYU",
      })),
      back_urls: {
        success: "https://jolly-flower-088dd821e.4.azurestaticapps.net/",
        failure: "https://jolly-flower-088dd821e.4.azurestaticapps.net/",
        pending: "https://jolly-flower-088dd821e.4.azurestaticapps.net/",
      },
      auto_return: "approved",
      binary_mode: true,
      external_reference: userId,
    };

    const { default: fetch } = await import("node-fetch");
    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
      body: JSON.stringify(preference),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error en la creación de preferencia: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return res.status(200).json({
      id: data.id,
      init_point: data.init_point,
      userId,
    });
  } catch (error) {
    console.error("Error al crear la preferencia:", error.message);
    return res.status(500).json({ error: "Error al procesar el pago" });
  }
};

module.exports = { createPreference };