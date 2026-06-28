const Wishlist = require("../model/Wishlist");

exports.addToWishlist = async (req, res) => {

  try {

    const { userId, productId } = req.body;

    const exists = await Wishlist.findOne({
      user: userId,
      product: productId
    });

    if (exists) {
      return res.status(400).json({
        message: "Already in wishlist"
      });
    }

    await Wishlist.create({
      user: userId,
      product: productId
    });

    res.status(200).json({
      message: "Added to wishlist"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }

};

exports.getWishlist = async (req, res) => {

  try {

    const { userId } = req.params;

    const wishlist = await Wishlist.find({
      user: userId
    }).populate("product");

    res.status(200).json(wishlist);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

exports.removeWishlist = async (req, res) => {

    try {

        const wishlistItem =
            await Wishlist.findByIdAndDelete(req.params.id);

        if (!wishlistItem) {
            return res.status(404).json({
                message: "Wishlist Item Not Found"
            });
        }

        res.status(200).json({
            message: "Removed From Wishlist"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};