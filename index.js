const express = require('express');
const app = express();

//Ruta
const paymentRoutes = require('./routes/payment.routes');

app.use(express.json());
app.use(paymentRoutes);

app.listen(3000, () => {
    console.log('Server on port 3000');
});
