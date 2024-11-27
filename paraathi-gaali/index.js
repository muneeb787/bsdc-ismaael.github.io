const express = require('express');
const stripe = require('stripe')('sk_test_51QOgcwAWI44r05bCmg1tOcbblz7VGA1uI2zEmpD72f3LInenzFAbG3cqFaVaBkOsZ4CDyMAGwb8OkXvbBg4mdGM700QiLRjNOf'); // Your Stripe secret key
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;

// Enable CORS
app.use(cors());

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Serve static files from the current directory
app.use(express.static(__dirname)); // __dirname points to the current directory

// Route to serve the root page (order.html)
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/order.html'); // Make sure the file exists in the root directory
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
            success_url: 'http://localhost:3000/success',  // Replace with actual success URL
            cancel_url: 'http://localhost:3000/cancel',    // Replace with actual cancel URL
        });

        // Send the session ID to frontend
        res.json({ id: session.id });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
