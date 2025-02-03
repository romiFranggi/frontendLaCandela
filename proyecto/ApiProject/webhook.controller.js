const { updateProductStock } = require("./products.controllers.js");
const { postOrder } = require("./orders.controllers.js");
const ACCESS_TOKEN = "APP_USR-2813772825895965-112617-112db10aa30998457e1886b1f8cf6787-2114869553";

const processedEvents = new Set();

const handleWebhook = async (req, res) => {
  try {
    const orderId = req.body.id;
    const eventType = req.body.type;

    if (!eventType || !eventType.includes("topic_merchant_order_wh")) {
      console.error(`Tipo de evento no soportado: ${eventType}`);
      return res.status(400).json({ error: `Tipo de evento no soportado: ${eventType}` });
    }

    if (!orderId) {
      console.error("ID de la orden comercial no proporcionado.");
      return res.status(400).json({ error: "ID de la orden comercial no proporcionado." });
    }

    if (processedEvents.has(orderId)) {
      console.log(`Evento con ID ${orderId} ya procesado, se ignora.`);
      return res.status(200).send("Evento ya procesado.");
    }

    processedEvents.add(orderId);

    const orderResponse = await fetch(`https://api.mercadopago.com/merchant_orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    });

    if (!orderResponse.ok) {
      const errorMessage = await orderResponse.text();
      console.error(`Error al obtener detalles de la orden comercial: ${orderResponse.status} - ${errorMessage}`);
      return res.status(orderResponse.status).json({ error: `Error al procesar la orden comercial: ${errorMessage}` });
    }

    const orderDetails = await orderResponse.json();
    const items = orderDetails.items;
    const userId = orderDetails.external_reference;

    if (!userId) {
      console.error("userId no encontrado en external_reference.");
      return res.status(400).json({ error: "userId no encontrado en external_reference." });
    }

    for (const item of items) {
      const productId = item.id;
      const quantity = item.quantity;
      const color = item.metadata?.color; // Accede al color desde metadata

      if (!productId || !quantity || quantity <= 0) {
        console.error(`Datos inválidos para el producto: ${JSON.stringify(item)}`);
        return res.status(400).json({ error: "Datos inválidos para el producto." });
      }

      console.log(`Producto ID: ${productId}, Cantidad: ${quantity}, Color: ${color}`);

      const result = await updateProductStock(productId, quantity);
      if (!result.success) {
        console.error(`Error al actualizar el stock para el producto ${productId}: ${result.error}`);
        return res.status(400).json({ error: result.error });
      }
      console.log(`Stock actualizado para producto ${productId}: nuevo stock = ${result.newStock}`);
    }

    console.log("Estos son los items: ")
    console.log(items)
    const pedido = await postOrder(userId, items);
    if (!pedido.success) {
      console.error(`Error al crear pedido para el usuario ${userId}: ${pedido.error}`);
      return res.status(400).json({ error: pedido.error });
    }
    console.log(`Pedido creado para el usuario ${userId}: OrderId = ${pedido.OrderId}`);

    res.status(200).send("Stock correctamente actualizado.");
  } catch (error) {
    console.error("Error en el webhook:", error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

module.exports = { handleWebhook };