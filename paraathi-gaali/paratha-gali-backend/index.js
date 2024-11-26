const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const stripe = require('stripe')('your-secret-key-here');  // Use your actual Stripe secret key

const app = express();
const port = 3000;

// Enable CORS for local development
const corsOptions = {
    origin: 'http://localhost:3000', // Allow requests from the frontend (localhost)
    methods: 'GET,POST',  // Allow GET and POST methods
    allowedHeaders: 'Content-Type',  // Allow specific headers
};

// Middlewares
app.use(cors(corsOptions));  // Use the updated CORS options
app.use(bodyParser.json());

// Serve static files (optional)
app.use(express.static('public'));

// Root route to confirm server is running
app.get('/', (req, res) => {
    res.send('Server is up and running!');
});

// Success route
app.get('/success', (req, res) => {
    res.send('Payment was successful!');
});

// Cancel route
app.get('/cancel', (req, res) => {
    res.send('Payment was canceled.');
});

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

// Start the server using HTTP (not HTTPS)
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
