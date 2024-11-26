const express = require('express');
const stripe = require('stripe')('your-secret-key-here');  // Replace with your Stripe secret key

const app = express();
const port = 3000;

// Middlewares
app.use(express.json());

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
                        currency: currency,  // Currency type (GBP)
                        product_data: {
                            name: 'Paratha Gali Order',  // The product name
                        },
                        unit_amount: amount,  // Amount in cents
                    },
                    quantity: 1,  // Quantity of the product
                },
            ],
            mode: 'payment',  // Use payment mode
            success_url: 'http://localhost:3000/success',  // Redirect after success
            cancel_url: 'http://localhost:3000/cancel',    // Redirect if payment is canceled
        });

        res.json({ id: session.id });  // Send session ID to frontend
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Success and cancel pages (can be more detailed if needed)
app.get('/success', (req, res) => {
    res.send('Payment was successful!');
});

app.get('/cancel', (req, res) => {
    res.send('Payment was canceled.');
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
