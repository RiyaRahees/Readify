const Cart = require("../model/Cart");

// Add Product To Cart

const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    const existingItem = await Cart.findOne({
      user: userId,
      product: productId,
    });

    if (existingItem) {
      existingItem.quantity += quantity || 1;

      await existingItem.save();

      return res.status(200).json({
        success: true,
        message: "Quantity Updated",
      });
    }

    const cartItem = await Cart.create({
      user: userId,
      product: productId,
      quantity,
    });

    res.status(201).json({
      success: true,
      cartItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Cart

const getCart = async (req, res) => {
  try {
    const { userId } = req.params;

    const cart = await Cart.find({
      user: userId,
    }).populate("product");

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Remove Cart Item

const removeCartItem = async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Item Removed",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Cart Quantity

const updateCartQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (quantity <= 0) {
      await Cart.findByIdAndDelete(id);
      return res.status(200).json({
        success: true,
        message: "Item Removed",
      });
    }

    const cartItem = await Cart.findByIdAndUpdate(
      id,
      { quantity },
      { new: true }
    );

    res.status(200).json({
      success: true,
      cartItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addToCart,
  getCart,
  removeCartItem,
  updateCartQuantity,
};