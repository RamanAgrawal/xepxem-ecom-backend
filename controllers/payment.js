import { Stripe } from "../config/stripe.js";
import { User } from "../models/user.model.js";


const payment = async (req, res) => {
    try {
        const { cartItems } = req.body;
        const user = await User.findOne({ _id: req.user });
        console.log("Product Details: ", cartItems);

        const params = {
            submit_type: 'pay',
            payment_method_types: ['card'],
            mode: 'payment',
            billing_address_collection: 'auto',
            shipping_options: [
                {
                    shipping_rate: "shr_1PVXVA013ehw3EA7zceBV42O"
                }
            ],
            customer_email: user.email,
            line_items: cartItems.map((item) => {
                return {
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: item.product.name,
                            images: [item.product.image],
                            metadata : {
                               productId : item.product._id,
                            }
                        },

                        unit_amount: item.product.price * 100
                    },

                    quantity: item.quantity
                }
            }),

            success_url: 'http://localhost:5173/success',
            cancel_url: 'http://localhost:5173/cancel',
           
        };

        const session = await Stripe.checkout.sessions.create(params);

        res.status(200).json(session);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
}

export default payment;
