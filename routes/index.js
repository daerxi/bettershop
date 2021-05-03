const express = require('express');
const router = express.Router();

module.exports = router;

router.post('/donate', async function (req, res, next) {
    try {
        const amount = req.body.amount
        const stripe = require('stripe')(process.env.STRIPE_SECRETKEY);
        stripe.customers.create({
            name: req.body.name,
            email: req.body.email,
            source: req.body.stripeToken
        }).then(customer => stripe.charges.create({
            amount: amount * 100,
            currency: req.body.currency,
            customer: customer.id,
            receipt_email: req.body.email
        })).then(response => {
            // send email
            res.status(201).json(response)
        });
    } catch (error) {
        res.status(400).json({error: error.toString()});
    }
});