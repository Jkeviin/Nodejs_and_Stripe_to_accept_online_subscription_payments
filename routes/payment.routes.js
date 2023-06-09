const { Router } = require('express');
const router = Router();

const { crearSesionPago, webhook } = require('../controllers/payment.controller');

router.get('/crear-sesion-pago', crearSesionPago);
router.get('/pago-exitoso', (req, res) => { res.send('Pago exitoso') });
router.get('/cancelar-pago', (req, res) => { res.send('Pago cancelado') });
router.post('/webhook', webhook);

module.exports = router;
