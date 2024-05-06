const router = require("express").Router();
const cartController = require("../controllers/cartController");
const authorization = require("../middlewares/authorization");

router.post("/", cartController.addCart);
router.get("/", cartController.findCarts);
router.patch("/:id", authorization, cartController.updateQty);
router.delete("/:id", authorization, cartController.deleteCart);

module.exports = router;
