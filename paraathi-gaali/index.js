const express = require('express');
const stripe = require('stripe')('sk_test_51QOgcwAWI44r05bCmg1tOcbblz7VGA1uI2zEmpD72f3LInenzFAbG3cqFaVaBkOsZ4CDyMAGwb8OkXvbBg4mdGM700QiLRjNOf'); // Your Stripe secret key
const bodyParser = require('body-parser');
const cors = require('cors');

// Create an instance of the Express app
const app = express();
const port = 3000;

// Enable CORS
app.use(cors());

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Route to serve the root page (order.html)
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/order.html'); // Ensure this file exists
});

// Route to create Stripe checkout session
app.post('/create-checkout-session', async (req, res) => {
    try {
        const { amount, currency } = req.body;

        // Create a new Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: currency,  // GBP
                        product_data: {
                            name: 'Paratha Gali Order',
                        },
                        unit_amount: amount,  // Amount in cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: 'https://your-vercel-app-url/success',  // Replace with the actual success URL
            cancel_url: 'https://your-vercel-app-url/cancel',    // Replace with the actual cancel URL
        });

        // Send the session ID to frontend
        res.json({ id: session.id });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Export the Express app as a Vercel Serverless function
module.exports = app;
