const express = require('express');
const stripe = require('stripe')('sk_test_51QOgcwAWI44r05bCmg1tOcbblz7VGA1uI2zEmpD72f3LInenzFAbG3cqFaVaBkOsZ4CDyMAGwb8OkXvbBg4mdGM700QiLRjNOf'); // Replace with your Stripe Secret Key
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// POST endpoint for creating a Stripe Checkout session
app.post('/create-checkout-session', async (req, res) => {
    const { cart } = req.body;

    try {
        // Map cart items to Stripe line items
        const lineItems = cart.map(item => ({
            price_data: {
                currency: 'gbp',
                product_data: {
                    name: item.name,
                },
                unit_amount: Math.round(item.price * 100), // Convert to cents
            },
            quantity: 1,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: 'http://127.0.0.1:5500/paraathi-gaali/success.html', // Corrected path
            cancel_url: 'http://127.0.0.1:5500/paraathi-gaali/cancel.html',   // Corrected path
        });
               
        res.status(200).json({ url: session.url });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

// Start the server
const PORT = 4242;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
