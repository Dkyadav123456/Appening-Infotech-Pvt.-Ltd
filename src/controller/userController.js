const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const {
  isValid,
  isValidName,
  isValidPhone,
  isValidEmail,
  isValidPincode,
  isValidPassword,
  isValidReqBody,
} = require("../validator/validation");

//**************************[User-Register-Function's]****************************//
const registerUser = async function (req, res) {
  try {
    // data sent through request body
    let data = req.body;

    // if request body is empty
    if (!isValidReqBody(data)) {
      return res
        .status(400)
        .send({ status: false, message: " Please enter user details" });
    }

    let title = data.title;
    let name = data.name;
    let phone = data.phone;
    let email = data.email?.toLowerCase();
    let password = data.password;
    let street = data.address?.street;
    let city = data.address?.city;
    let pincode = data.address?.pincode;

    // VALIDATIONS:

    // if title is empty
    if (isValid(title) === false) {
      return res.status(400).send({
        status: false,
        message: " Please enter title(required field)",
      });
    }
    // if title is invalid
    // AMBIGUITY: avoid shifting to validator; TITLE is also used for book's title
    let enumArr = ["Mr", "Mrs", "Miss"];
    if (!enumArr.includes(title)) {
      return res
        .status(400)
        .send({
          status: false,
          message: `Please enter valid title like:["Mr", "Mrs", "Miss"]`,
        });
    }
    // if phone is empty
    if (isValid(name) === false) {
      return res
        .status(400)
        .send({ status: false, message: "Please enter name(required field) " });
    }
    // name validation
    if (!isValidName(name)) {
      return res
        .status(400)
        .send({ status: false, msg: "plesae give a valid name" });
    }

    // if phone is empty
    if (isValid(phone) === false)
      return res.status(400).send({
        status: false,
        message: "Please enter the phone number(required field)",
      });
    // if phone is invalid
    if (isValidPhone(phone) === false)
      return res.status(400).send({
        status: false,
        message: `${phone} is not a valid phone number; Please provide a valid phone number`,
      });
    // phone duplication check
    let phoneCheck = await userModel.findOne({
      phone: phone,
    });
    if (phoneCheck)
      return res
        .status(400)
        .send({ status: false, message: "Phone number is already used!" });

    // if email is empty
    if (isValid(email) === false) {
      return res.status(400).send({
        status: false,
        message: " Please Enter email(required field)",
      });
    }
    // if email is invalid
    if (isValidEmail(email) === false) {
      return res
        .status(400)
        .send({ status: false, message: " Please enter valid email" });
    }
    // email duplication check
    let emaildb = await userModel.findOne(
      { email: email },
      { email: 1, _id: 0 }
    );
    if (emaildb) {
      return res.status(400).send({
        status: false,
        message: "We are sorry; this email is already used",
      });
    }

    // is password is empty
    if (isValid(password) === false) {
      return res.status(400).send({
        status: false,
        message: " Please enter password(required field)",
      });
    }

    // if password is invalid
    if (isValidPassword(password) === false) {
      let length = "";
      if (password.length < 8) length = "less than 8 characters";
      else if (password.length > 15) length = "greater than 15 characters";
      return res.status(400).send({
        status: false,
        message: `password cannot be ${length}`,
      });
    }

    if (data.address) {
      // if street only has whitespace characters
      if (!street?.trim()) {
        return res
          .status(400)
          .send({ status: false, message: "street is invalid" });
      }
      // if city only has whitespace characters
      if (!city?.trim()) {
        return res
          .status(400)
          .send({ status: false, message: "city is invalid" });
      }
      // pincode validation
      if (isValidPincode(pincode) === false) {
        return res
          .status(400)
          .send({ status: false, message: "Please enter valid pincode" });
      }
    }

    // registering user
    let registeredUser = await userModel.create(data);

    // response
    res.status(201).send({ status: true, message: registeredUser });
  } catch (err) {
    res.status(500).send({
      status: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

//*****************************[User-Login-Function's]****************************//
const loginUser = async function (req, res) {
  try {
    // login credentials sent through request body
    let email = req.body.email;
    let password = req.body.password;

    // if email is empty
    if (isValid(email) === false) {
      return res.status(400).send({
        status: false,
        message: "Please enter email!",
      });
    }

    // if password is empty
    if (isValid(password) === false) {
      return res.status(400).send({
        status: false,
        message: "Please enter password!",
      });
    }

    // user document satisfying the login credentials
    let loginCredentials = await userModel.findOne({
      email: email,
      password: password,
    });

    // if login credentials are not correct
    if (!loginCredentials)
      return res.status(400).send({
        status: false,
        error: "email or password is incorrect",
      });

    // JWT generation using sign function
    let token = jwt.sign(
      {
        email: loginCredentials.email.toString(),
        userId: loginCredentials._id,
      },
      "DharmendraKumarYadavRatanpura841506", //secreat key
      {
        expiresIn: "24h",
      }
    );

    // JWT generated sent back in response header
    res.setHeader("x-api-key", token);

    res.status(200).send({
      status: true,
      message: "Login Successfull! Token sent in header 'x-api-key'",
      token: token,
    });
  } catch (err) {
    res.status(500).send({
      status: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

//*************************[User-Function's Publically]***************************//
module.exports = { registerUser, loginUser };
