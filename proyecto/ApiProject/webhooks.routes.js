const { Router } = require('express');
const { handleWebhook } = require('./webhook.controller.js');

const router = Router();

router.post("/webhook", handleWebhook);

module.exports = router;
