const express = require("express");
const mongoose = require("mongoose");

const routes = require("./routes/index");

const app = express();

const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to the database");
  })
  .catch(console.error);


app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: "66d95e0525ce3228576bf6ce",
  };
  next();
});

app.use("/", routes);

app.use((req, res) => {
  res.status(404).json({ message: "Requested resource not found" });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
