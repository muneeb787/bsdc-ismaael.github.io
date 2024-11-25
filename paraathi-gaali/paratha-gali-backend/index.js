// Required packages
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const stripe = require('stripe')('sk_test_51QOgcwAWI44r05bCmg1tOcbblz7VGA1uI2zEmpD72f3LInenzFAbG3cqFaVaBkOsZ4CDyMAGwb8OkXvbBg4mdGM700QiLRjNOf');  // Replace with your secret key

const app = express();
const port = 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Serve static files (optional)
app.use(express.static('public'));

// POST endpoint to create a checkout session
app.post('/create-checkout-session', async (req, res) => {
  try {
    const { amount, currency } = req.body;

    // Create the Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],  // Accept card payments
      line_items: [
        {
          price_data: {
            currency: currency,  // Pass the currency (e.g., GBP)
            product_data: {
              name: 'Paratha Gali Order',  // Name of the product being purchased
            },
            unit_amount: amount,  // Amount in cents (e.g., £10.00 is 1000)
          },
          quantity: 1,  // Number of items in the cart
        },
      ],
      mode: 'payment',  // Set mode as 'payment'
      success_url: 'http://localhost:3000/success',  // Success URL after payment
      cancel_url: 'http://localhost:3000/cancel',    // URL to redirect if payment is canceled
    });

    res.json({ id: session.id });  // Send session ID to frontend
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Handle successful payment redirection
app.get('/success', (req, res) => {
    res.send('Payment was successful!');  // You can customize this message or render a success page
});

// Handle cancel redirection
app.get('/cancel', (req, res) => {
    res.send('Payment was canceled.');  // You can customize this message or render a cancel page
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
