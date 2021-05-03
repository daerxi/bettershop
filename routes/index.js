const express = require('express');
const router = express.Router();

module.exports = router;

router.post('/donate', async function (req, res, next) {
    try {
        const stripe = require('stripe')(process.env.STRIPE_SECRETKEY);
        stripe.customers.create({
            name: req.body.name,
            email: req.body.email,
            source: req.body.stripeToken
        }).then(customer => stripe.charges.create({
            amount: req.body.amount.toFixed(2) * 100,
            currency: req.body.currency,
            customer: customer.id,
            description: 'Thank you for your Donation.'
        })).then(() => {
            // send email
        });
    } catch (error) {
        res.status(400).json({error: error.toString()});
    }
});