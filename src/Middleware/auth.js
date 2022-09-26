
//-------------------Import---------------------------------//
const jwt = require("jsonwebtoken");
const userModel = require("../Models/userSchema");
const validator = require("../Validator/validator");
const secretkey = "IEJSFKG7857843HGDF2TVFDVDNDNHGERGGAI343734RYF743";
//-------------------authentication---------------------------------//
const authentication = async function (req, res, next) {
  try {

    let bearerToken = req.headers["authorization"];
    if (!bearerToken) {
      return res
        .status(404)
        .send({ status: false, message: "Please pass token" });
    }
    let userId = req.params.userId;
    if (!userId) userId = req.query.userId
    if (!validator.isValidobjectId(userId)) {
      return res
        .status(400)
        .send({ status: false, message: "Error!: objectId is not valid" });
    }
    let userPresent = await userModel.findOne({
      _id: userId
    });
    if (!userPresent) {
      return res
        .status(404)
        .send({ status: false, msg: `user with this ID: ${userId} is not found` });
    }

    let token = bearerToken.split(" ")[1]

    jwt.verify(token, secretkey, function (error, decode) {
      if (error) {
        return res
          .status(400)
          .setHeader("Content-Type", "text/JSON")
          .send({ status: false, message: error.message });
      }
      req.token = decode
      next();
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
//---------------------------Authorization---------------------------------------------------------------//

const authorization = async function (req, res, next) {
  try {
    let decodedToken = req.token;
    let userId = req.params.userId;
    if (!userId) userId = req.query.userId
    if (userId != decodedToken.userId) {
      return res
        .status(403)
        .send({ status: false, message: "You are not authorized" });
    } else {
      next();
    }

  } catch (error) {

    return res.status(500).send({ status: false, message: error.message });

  }
};

module.exports.authorization = authorization;
module.exports.authentication = authentication;