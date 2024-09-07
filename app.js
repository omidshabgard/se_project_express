const express = require("express");
const mongoose = require("mongoose");


const routes = require("./routes/index");
const { NOT_FOUND } = require("./utils/errors");

const app = express();

const { PORT = 3001 } = process.env;

// mongoose.set('strictQuery', true);
mongoose.set('strictQuery', false);

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to the database");
  })
  .catch(console.error);

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: "66d73bd035cacfa3f8af938a",
  };
  next();
});

app.use("/", routes);

app.use((req, res) => {
  res.status(NOT_FOUND).json({ message: "Requested resource not found" });
});

app.listen(PORT, () => {
  // console.log(`Server is listening on port ${PORT}`);
});
