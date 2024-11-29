const stripe = require('stripe')('sk_test_51QOgcwAWI44r05bCmg1tOcbblz7VGA1uI2zEmpD72f3LInenzFAbG3cqFaVaBkOsZ4CDyMAGwb8OkXvbBg4mdGM700QiLRjNOf');
const cors = require('cors');

module.exports = async (req, res) => {
    const corsMiddleware = cors({
        origin: '*', // Temporarily allow all origins for debugging
        methods: ['POST'],
        allowedHeaders: ['Content-Type'],
    });

    corsMiddleware(req, res, async () => {
        if (req.method === 'POST') {
            try {
                const { cart } = req.body;

                const lineItems = cart.map(item => ({
                    price_data: {
                        currency: 'gbp',
                        product_data: {
                            name: item.name,
                        },
                        unit_amount: Math.round(item.price * 100),
                    },
                    quantity: 1,
                }));

                const session = await stripe.checkout.sessions.create({
                    payment_method_types: ['card'],
                    line_items: lineItems,
                    mode: 'payment',
                    success_url: 'https://bsdc-ismaael.github.io/paraathi-gaali/success.html',
                    cancel_url: 'https://bsdc-ismaael.github.io/paraathi-gaali/cancel.html',
                });

                res.status(200).json({ url: session.url });
            } catch (error) {
                console.error('Stripe Error:', error);
                res.status(500).json({ error: 'Something went wrong' });
            }
        } else {
            res.setHeader('Allow', ['POST']);
            res.status(405).end('Method Not Allowed');
        }
    });
};
