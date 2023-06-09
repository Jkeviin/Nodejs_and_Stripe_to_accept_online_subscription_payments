const Stripe = require('stripe');

const stripe = new Stripe('sk_test_51NGX3mAzE9bVeUHyQbjX0akNdeBAu6W3RobMsdYo2ta65bvdh9wXE5USzG1WT4ZrKrlfy5mYYXQOPtlfrRqV8Z5H00OD9GP1Nl');

const crearSesionPago = async (req, res) => {
  let id = "PRUEBA2"
  const session = await stripe.checkout.sessions.create({
    client_reference_id: id, // ID del usuario
    payment_method_types: ['card'], // Tipo de pago
    line_items: [{
      price: 'price_1NGqR2AzE9bVeUHyLDJSMXpt', // ID del precio, viene de Stripe
      quantity: 1, // Cantidad de productos a comprar
    }],
    mode: 'subscription',
    success_url: 'http://localhost:3000/pago-exitoso',
    cancel_url: 'http://localhost:3000/cancelar-pago',
    subscription_data: {
      trial_period_days: 14,
    },
  });
  res.json({ id: session.id, status: session.status, session: session });
}

const webhook = async (req, res) => {
  let event;
  try {
    event = req.body; // Obtener el evento
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;

      // Obtener el ID del usuario del client_reference_id
      const userId = session.client_reference_id;

      // Actualizar el estado del usuario en la base de datos para reflejar que ha pagado
      //await Usuario.findByIdAndUpdate(userId, { haPagado: true });

      console.log(`🔔 Payment received! Customer: ${userId}`);
      break;
    case 'customer.subscription.deleted':
      const subscription = event.data.object;
      const canceledCustomerId = subscription.customer;
      // Actualizar el estado del usuario en la base de datos para reflejar que su membresía ha expirado
      //await Usuario.findOneAndUpdate({ customerId: canceledCustomerId }, { haPagado: false });
      console.log(`🔔 Subscription canceled! Customer: ${canceledCustomerId}`);
      break;

    // SI EL PAGO FALLA POR FALTA DE SALDO
    case 'invoice.payment_failed':
      const invoice = event.data.object;
      const failedPaymentCustomerId = invoice.customer;
      // Obtener la dirección de correo electrónico del cliente
      const customer = await stripe.customers.retrieve(failedPaymentCustomerId);
      const email = customer.email;
      // Enviar un correo electrónico al cliente con un enlace para actualizar su información de pago
      //sendPaymentFailedEmail(email);
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  res.json({ received: true });  // Eso quiere decir que recibimos el evento
}

module.exports = {
  crearSesionPago,
  webhook
}
