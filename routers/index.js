const router = require("express").Router();
const productRouter = require("./productRouter");
const cartRouter = require("./cartRouter");

const authentication = require("../middlewares/authentication");
const userController = require("../controllers/userController");

router.post("/register", userController.register);
router.post("/login", userController.login);

router.use(authentication);

router.use("/products", productRouter);
router.use("/carts", cartRouter);

module.exports = router;
