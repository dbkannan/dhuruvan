const Cart = require("../models/cartModel");

class CartController {
  static async handleCartUpdate(req, res) {
    try {
      const { userId, items } = req.body; // Destructure the request body
      const { title, price, image, quantity } = items; // Extract item properties

      // Find existing cart for the user
      const existingCart = await Cart.findOne({ userId });
      console.log(existingCart);
      if (existingCart) {
        // Find if the item already exists in the cart
        const existingItem = existingCart.items.find(
          (item) => item.title === title && item.price === price
        );

        if (existingItem) {
          // If item exists, update quantity
          existingItem.quantity += quantity;

          // If quantity is 0, remove the item
          if (existingItem.quantity <= 0) {
            await Cart.updateOne(
              { userId },
              { $pull: { items: { title, price } } }
            );
          } else {
            await Cart.updateOne(
              { userId, "items.title": title, "items.price": price },
              { $inc: { "items.$.quantity": quantity } }
            );
          }
        } else {
          // If item doesn't exist, add it to the cart
          await Cart.updateOne(
            { userId },
            { $push: { items: { title, price, image, quantity } } }
          );
        }

        // Fetch the updated cart
        const updatedCart = await Cart.findOne({ userId });

        // If the cart is empty, delete it
        if (updatedCart && updatedCart.items.length === 0) {
          await Cart.deleteOne({ userId });
          return res
            .status(204)
            .json({ message: "Cart deleted, no items left" });
        }

        return res.status(200).json({ result: updatedCart });
      } else {
        // If no cart exists for the user, create a new one
        const newCart = await Cart.create({
          userId,
          items: [{ title, price, image, quantity }],
        });

        return res.status(201).json({ result: newCart });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async deleteItemFromCart(req, res) {
    const { userId, ItemId } = req.body;
    await Cart.updateOne(
      { userId: { $eq: userId } },
      { $pull: { items: { _id: ItemId } } }
    );
    return res.status(200).json({ message: "Product deleted" });
  }

  static async getCartItems(req, res) {
    const { userId } = req.params;
    const userCart = await Cart.findOne({ userId });
    if (userCart && userCart.items) {
      return res.json({ userCart });
    } else {
      return res.json({ result: [] });
    }
  }
}

module.exports = CartController;
