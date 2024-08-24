import Cart from '../models/cart.model.js';
import Product from '../models/product.model.js';

// ...................................................................Add item to cart
export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user._id;

  try {
    let cart = await Cart.findOne({ user: userId });
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (cart) {
      // Cart exists for user
      const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

      if (itemIndex > -1) {
        // Product exists in the cart, update the quantity
        let productItem = cart.items[itemIndex];
        productItem.quantity += quantity;
        cart.items[itemIndex] = productItem;
      } else {
        // Product does not exists in cart, add new item
        cart.items.push({ product: productId, quantity });
      }
      cart = await cart.save();
      return res.status(201).json(cart);
    } else {
      // No cart for user, create new cart
      const newCart = await Cart.create({
        user: userId,
        items: [{ product: productId, quantity }]
      });
      return res.status(201).json(newCart);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




//.................................................................................................. Get user's cart
export const getCart = async (req, res) => {
  const userId = req.user._id;
  try {
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




// ..............................................................................................................Remove item from cart
export const removeFromCart = async (req, res) => {
  const { productId } = req.body;
  const userId = req.user._id;

  try {
    let cart = await Cart.findOne({ user: userId });
    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

    if (itemIndex > -1) {
      cart.items.splice(itemIndex, 1);
      cart = await cart.save();
      return res.status(201).json(cart);
    } else {
      return res.status(404).json({ message: 'Item not found in cart' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//................................................................................

export const updateCartItem = async (req, res) => {
    try {
      const { productId, quantity } = req.body;
      const cart = await Cart.findOne({ user: req.user._id });
  
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
  
      const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
      if (itemIndex === -1) {
        return res.status(404).json({ message: 'Item not found in cart' });
      }
  
      cart.items[itemIndex].quantity = quantity;
      await cart.save();
  
      res.status(200).json(cart);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };