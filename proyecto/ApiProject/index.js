const express = require('express');
const { PORT } = require('./config');
const productRoutes = require('./products.routes.js');
const userRoutes = require('./users.routes.js');
const categoriesRoutes = require('./categories.routes.js');
const suppliersRoutes = require('./suppliers.routes.js');
const mercadopagoRoutes = require('./mercadopago.routes.js');
const webhooksRoutes = require('./webhooks.routes.js');
const orders = require('./orders.routes.js');
// const { createPreference } = require('./controllers/mercadopago.controller');
const cors = require('cors');
require('dotenv').config();


const app = express();
app.use(cors());
app.use(express.json());

const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

app.use(cors(corsOptions));

app.use(productRoutes, userRoutes, categoriesRoutes, suppliersRoutes, mercadopagoRoutes, webhooksRoutes, orders);

app.listen(PORT, () => {
    console.log('Servidor iniciado... Puerto: ', PORT);
});
