const express = require('express');
const productRoutes = require('./products.routes.js');
const userRoutes = require('./users.routes.js');
const categoriesRoutes = require('./categories.routes.js');
const suppliersRoutes = require('./suppliers.routes.js');
const mercadopagoRoutes = require('./mercadopago.routes.js');
const webhooksRoutes = require('./webhooks.routes.js');
const { loginUser, postUser } = require("./usersController.js");
const { createPreference } = require('./mercadopago.controller.js');

const app = express();
app.use(express.json());

app.use(productRoutes, userRoutes, categoriesRoutes, suppliersRoutes, mercadopagoRoutes, webhooksRoutes);
app.post("/login", loginUser);
app.post('/checkout', createPreference);

module.exports = app;
