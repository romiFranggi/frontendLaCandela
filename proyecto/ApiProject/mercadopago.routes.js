const { Router } = require('express');
const { createPreference } = require('./mercadopago.controller.js');

const router = Router();

router.post("/checkout", createPreference);

module.exports = router;
