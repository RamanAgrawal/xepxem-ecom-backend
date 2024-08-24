import Order from '../models/order.model.js';
import Cart from '../models/cart.model.js';

export const placeOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ user: userId }).populate('items.product');

    if (!cart || !cart.items.length) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const totalAmount = cart.items.reduce((total, item) => total + item.product.price * item.quantity, 0);

    const newOrder = new Order({
      user: userId,
      items: cart.items,
      totalAmount,
    });

    await newOrder.save();

    // Clear the cart after placing the order
    cart.items = [];
    await cart.save();

    res.status(201).json({ message: 'Order placed successfully', order: newOrder });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};

export const getOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const orders = await Order.find({ user: userId }).populate('items.product');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};
