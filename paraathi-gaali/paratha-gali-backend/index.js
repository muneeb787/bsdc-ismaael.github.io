const express = require('express');
const stripe = require('stripe')('sk_test_51QOgcwAWI44r05bC9xKGFmvEI6bhq1CVjxcTEQ1swqa0fMbW953QXSRyuhXMzSBU5Xw0Xt98GqrwFihE01EfC9oM00NH0yA5ZU');  // Secret key

const app = express();
const port = 3000;

// Middleware
app.use(express.json());

// POST endpoint to create a checkout session
app.post('/create-checkout-session', async (req, res) => {
    try {
        const { items, totalAmount, currency } = req.body;

        // Create line items for checkout session
        const lineItems = items.map(item => ({
            price_data: {
                currency: currency,
                product_data: {
                    name: item.name,
                },
                unit_amount: item.price * 100, // Convert price to cents
            },
            quantity: 1,
        }));

        // Create a checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: 'http://localhost:3000/success',  // Redirect after success
            cancel_url: 'http://localhost:3000/cancel',    // Redirect if payment is canceled
        });

        res.json({ id: session.id }); // Send session ID back to the frontend
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
