const { User, Product, Cart } = require("../models/index");
const { Op, literal, fn, col } = require("sequelize");
const currencyFormat = require("../helpers/currency");

class cartConroller {
  static async addCart(req, res, next) {
    try {
      let { productId, qty } = req.body;
      let { userId } = req.loginInfo;
      let product = await Product.findByPk(productId);
      let user = await User.findByPk(userId);
      if (!productId || !qty) {
        console.log(req.query);
        throw { name: "InvalidInput" };
      }
      if (!product || !user) {
        throw { name: "NotFound" };
      }
      let cart = await Cart.findOne({
        where: { productId, userId },
      });

      if (cart) {
        await cart.increment("qty", {
          by: qty,
        });
      } else {
        await Cart.create({
          userId,
          productId,
          qty,
        });
      }

      res.status(201).json({
        message: `Product ${product.name} with quantity ${qty} added to cart`,
      });
    } catch (error) {
      next(error);
    }
  }

  static async findCarts(req, res, next) {
    try {
      const { userId } = req.loginInfo;
      let user = await User.findByPk(userId, {
        attributes: [`username`, `address`],
      });
      let carts = await Cart.findAll({
        where: { userId },
        attributes: [`id`, `qty`, [literal("qty * price"), "cost"]],
        include: {
          model: Product,
          attributes: [`name`, `type`, `price`],
        },
      });
      if (!carts) {
        throw { name: "NotFound" };
      }
      //   console.log(carts[0].dataValues.cost);
      let total = 0;
      for (let idx of carts) {
        total += idx.dataValues.cost;
      }

      res.status(200).json({
        user,
        carts:
          carts.length !== 0 ? carts : "There are no products in the Cart yet!",
        total: currencyFormat(total),
      });
    } catch (error) {
      next(error);
    }
  }

  static async addNewProduct(req, res, next) {
    try {
      const { name, type, price } = req.body;
      const product = await Product.findOne({ where: { name } });

      if (product) {
        throw { name: "ProductExist" };
      }
      const newProduct = await Product.create({
        name,
        type,
        price,
      });

      res
        .status(201)
        .json({ newProduct, message: "Product added successfully" });
    } catch (error) {
      next(error);
    }
  }

  static async updateQty(req, res, next) {
    try {
      const { id } = req.params;
      const cart = await Cart.findByPk(id, {
        include: { model: Product, attributes: [`name`, `price`] },
      });

      if (!cart) {
        throw { name: "NotFound" };
      } else {
        const { qty } = req.body;
        if (qty < 1 || !qty) {
          throw { name: "InvalidInput" };
        }
        await cart.update({
          qty,
        });

        res.status(200).json({
          message: `Quantity updated to ${qty} for ${cart.Product.name}`,
        });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  static async deleteCart(req, res, next) {
    try {
      const { id } = req.params;
      const cart = await Cart.findByPk(id, {
        include: { model: Product, attributes: [`name`, `price`] },
      });
      let product = cart.Product.name;

      if (!cart) {
        throw { name: "NotFound" };
      } else {
        await cart.destroy();
        res.status(200).json({
          message: `Product ${product} deleted successfully from cart`,
        });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}
module.exports = cartConroller;
