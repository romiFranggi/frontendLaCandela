const { Router } = require('express');
const {
  getOrders,
  putOrder,
  productosVendidos,
} = require('./orders.controllers.js');

const router = Router();

//#region Usuarios
router.get("/orders", getOrders);

router.put("/orders/:id", putOrder)

router.get("/productosVendidos", productosVendidos)

module.exports = router;