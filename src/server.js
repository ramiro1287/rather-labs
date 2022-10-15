require('dotenv').config();
const express = require('express');
const cors = require("cors");
const app = express();


// Midlewares
app.use(cors({ origin: "http://localhost:8081" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Apis
app.use('/orders', require('./routes/orders_api'));
app.use('/trader', require('./routes/trade_api'));

// Start Server
const { SERVER_IP, SERVER_PORT } = process.env;

app.listen(SERVER_PORT, SERVER_IP, () => {
	console.log(`Server On: http://${SERVER_IP}:${SERVER_PORT}/`);
});

module.exports = app;
