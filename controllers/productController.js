const { Product } = require("../models/index");
const { Op } = require("sequelize");
const currencyFormat = require("../helpers/currency");

class productController {
  static async productList(req, res, next) {
    try {
      let { page, sort, limit, filter, search } = req.query;

      if (!limit) {
        limit = 10;
      }

      if (!Number(page)) {
        page = 1;
      }

      let queryOption = {
        limit: limit,
        offset: (page - 1) * limit,
        order: [["id", "ASC"]],
        where: [],
      };

      if (sort) {
        if (sort !== "" && typeof sort !== "undefined") {
          if (sort.charAt(0) !== "-") {
            queryOption.order = [[sort, "ASC"]];
          } else {
            queryOption.order = [[sort.slice(1), "DESC"]];
          }
        }
      }

      if (filter) {
        queryOption.where.push({
          type: { [Op.iLike]: `%${filter}%` },
        });
      }

      if (search) {
        queryOption.where.push({
          name: { [Op.iLike]: `%${search}%` },
        });
      }

      let { count, rows } = await Product.findAndCountAll(
        { attributes: { exclude: ["createdAt", "updatedAt"] } },
        queryOption
      );
      let products = {
        total: count,
        size: limit,
        currentPage: page,
        data: rows,
      };
      products.totalPage = Math.ceil(products.total / products.size);

      res.status(200).json({ products });
    } catch (error) {
      next(error);
    }
  }

  static async findProductById(req, res, next) {
    try {
      const { id } = req.params;
      let product = await Product.findByPk(id);
      if (!product) {
        throw { name: "NotFound" };
      }
      res.status(200).json({ product });
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

  static async updatePriceById(req, res, next) {
    try {
      const { id } = req.params;
      const product = await Product.findByPk(id);

      if (!product) {
        throw { name: "NotFound" };
      } else {
        const { price } = req.body;
        const updatedProduct = await product.update({
          price,
        });

        res.status(200).json({
          product: updatedProduct,
          message: `Price updated to ${currencyFormat(price)}`,
        });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  static async deleteById(req, res, next) {
    try {
      const { id } = req.params;
      const product = await Product.findByPk(id, {
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });
      if (!product) {
        throw { name: "NotFound" };
      } else {
        await product.destroy();
        res
          .status(200)
          .json({ message: `${product.name} deleted successfully` });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}
module.exports = productController;
