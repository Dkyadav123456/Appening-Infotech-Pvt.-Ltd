/************************************REQUIRE LIBARARY AND FILE*********************************/
const jwt = require("jsonwebtoken");
const blogModel = require("../models/userModel");
const mongoose = require("mongoose");

/************************************AUTHENTICATION********************************************/
const authentication = function (req, res, next) {
  try {
    let token = req.headers["x-api-key"];

    if (!token)
      return res.status(400).send({ status: false, msg: "token not found" });

    let decodedToken = jwt.verify(token, "IUBGIU22NKJWWEW89NO2ODWOIDH2"); //verify token

    if (!decodedToken)
      return res.status(401).send({ status: false, msg: "invalid token" });

    next();
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

/************************************AUTHORIZATION********************************************/
const authorization = async function (req, res, next) {
  try {
    let token = req.headers["x-api-key"];

    if (!token)
      return res.status(400).send({ status: false, msg: "token not found" });

    let decodedToken = jwt.verify(token, "DharmendraKumarYadavRatanpura841506");

    if (!decodedToken)
      return res.status(401).send({ status: false, msg: "invalid token" });

    let blog_Id = req.params.blogId;
    let userId = decodedToken.userId;
    let data = req.query;

    if (blog_Id) {
      if (!mongoose.isValidObjectId(blog_Id))
        return res
          .status(400)
          .send({ status: false, msg: "Enter a Valid BlogId" });
      let authorData = await blogModel.findOne({
        _id: blog_Id,
        authorId: userId,
      });
      if (!authorData)
        return res.send({ status: false, msg: "you are not authorized" });
    }

    if (data.authorId) {
      if (!mongoose.isValidObjectId(data.authorId))
        return res
          .status(400)
          .send({ status: false, msg: "Enter a Valid authorId" });
      if (data.authorId != userId)
        return res.send({ status: false, msg: "you are not authorized" });
    }

    if (data.category) {
      let authorData = await blogModel.find({
        category: data.category,
        authorId: userId,
      });
      if (!authorData.length)
        return res.send({ status: false, msg: "you are not authorized" });
    }

    if (data.subcategory) {
      let authorData = await blogModel.find({
        subcategory: data.subcategory,
        authorId: userId,
      });
      if (!authorData.length)
        return res.send({ status: false, msg: "you are not authorized" });
    }

    if (data.tags) {
      let authorData = await blogModel.find({
        tags: data.tags,
        authorId: userId,
      });
      if (!authorData.length)
        return res.send({ status: false, msg: "you are not authorized" });
    }

    if (data.isPublished) {
      let authorData = await blogModel.find({
        isPublished: data.isPublished,
        authorId: userId,
      });
      if (!authorData.length)
        return res.send({ status: false, msg: "you are not authorized" });
    }

    next();
  } catch (error) {
    res.status(500).send(error.message);
  }
};

/*******************************PUBLICALLY IN METHODS*****************************************/
module.exports = { authentication, authorization };
