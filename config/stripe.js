import stripe from 'stripe'

const Stripe = new stripe('sk_test_51PVWkQ013ehw3EA7DDaE8ZWraQaUsW424sTGNaqn30ryUCKmLbRKjMHB7PwRcV8hv8wkHkIORvjf8I52MaLRFruI00OVFuRyXQ')
// console.log("Stripe Secret Key:.................... ", process.env.STRIPE_SECRET_KEY);


export {Stripe}

