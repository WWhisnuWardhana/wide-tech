const router = require("express").Router();
const productController = require("../controllers/productController");

router.get("/", productController.productList);
router.get("/:id", productController.findProductById);
router.post("/", productController.addNewProduct);
router.patch("/:id", productController.updatePriceById);
router.delete("/:id", productController.deleteById);

module.exports = router;
