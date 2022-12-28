const express = require("express");
const bodyParser = require("body-parser");
const route = require("./routes/routes");
const mongoose = require("mongoose");
const app = express();

app.use(bodyParser.json()); //Convert JSON Form

//*****************************[MongoDB-Connected]********************************//
mongoose
  .connect(
    "mongodb+srv://Dharmendra:dkyadav123@cluster0.kq9bu.mongodb.net/Appening",
    {
      useNewUrlParser: true,
    }
  )
  .then((result) => console.log("Hello Mr Dkyadav MongoDb is connected"))
  .catch((err) => console.log(err));

app.use("/", route);

//********************************[Port Created]**********************************//
app.listen(process.env.PORT || 3000, function () {
  console.log("Express app running on port " + (process.env.PORT || 3000));
});
