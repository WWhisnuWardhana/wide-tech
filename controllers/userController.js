const { User, Fund } = require("../models/index");
const { validatePassword } = require("../helpers/bcrypt");
const { createToken } = require("../helpers/jwt");

class userController {
  static async register(req, res, next) {
    try {
      const { username, password, address } = req.body;
      const newUser = await User.create({
        username,
        password,
        address: address ? address : "Jl. Pattimura",
      });

      res.status(201).json({ newUser });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { username, password } = req.body;
      if (!username || username.length === 0) {
        throw { name: "ReqUser" };
      }
      if (!password || password.length === 0) {
        throw { name: "ReqPass" };
      }
      let user = await User.findOne({ where: { username } });
      if (!user) {
        throw { name: "UserNotFound" };
      } else {
        const validPassword = validatePassword(password, user.password);
        if (!validPassword) {
          throw { name: "InvalidLogin" };
        } else {
          const payload = {
            id: user.id,
            username: user.username,
          };
          const access_token = createToken(payload);
          res.status(200).json({ access_token });
        }
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

module.exports = userController;
