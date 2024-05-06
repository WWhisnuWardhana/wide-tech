const { User, Cart } = require("../models/index");
const authorization = async (req, res, next) => {
  try {
    const { userId } = req.loginInfo;
    const { id } = req.params;
    const user = await User.findByPk(userId);
    const cart = await Cart.findByPk(id);
    if (!user) {
      throw { name: "Forbidden" };
    }
    if (!cart) {
      throw { name: "NotFound" };
    }
    if (cart.userId !== userId) {
      throw { name: "Forbidden" };
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authorization;
