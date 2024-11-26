// Required packages
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const stripe = require('stripe')('sk_test_51QOgcwAWI44r05bCmg1tOcbblz7VGA1uI2zEmpD72f3LInenzFAbG3cqFaVaBkOsZ4CDyMAGwb8OkXvbBg4mdGM700QiLRjNOf');  // Replace with your Stripe Secret Key

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());  // Parse incoming request bodies in JSON format

// Serve static files (optional)
app.use(express.static('public'));  // Serve any static files from 'public' folder

// Root route to confirm server is running
app.get('/', (req, res) => {
    res.send('Server is up and running!');
});

// Success route after payment
app.get('/success', (req, res) => {
    res.send('Payment was successful!');
});

// Cancel route if payment fails or is canceled
app.get('/cancel', (req, res) => {
    res.send('Payment was canceled.');
});

// POST endpoint to create a checkout session
app.post('/create-checkout-session', async (req, res) => {
    try {
        const { amount, currency } = req.body;  // Extract amount and currency from the request body

        // Create a Stripe Checkout session
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
            mode: 'payment',  // Set the mode as 'payment' (for one-time payments)
            success_url: 'http://localhost:3000/success',  // URL to redirect on successful payment
            cancel_url: 'http://localhost:3000/cancel',    // URL to redirect if payment is canceled
        });

        res.json({ id: session.id });  // Send the session ID to the frontend
    } catch (error) {
        console.error('Error creating checkout session:', error);  // Log the error
        res.status(500).send('Internal Server Error');  // Send error response
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
