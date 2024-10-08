const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const auth = require("./middlewares/auth");
const { createUser, login, updateUser } = require("./controllers/users");
const { getItems } = require("./controllers/clothingItems");

const routes = require("./routes/index");
const { NOT_FOUND } = require("./utils/errors");

const app = express();
app.use(cors());

const { PORT = 3001 } = process.env;

mongoose.set("strictQuery", false);

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to the database");
  })
  .catch(console.error);

app.use(express.json());

app.post("/signin", login);
app.post("/signup", createUser);
app.put("/updateUser", auth, updateUser);

app.get("/items", getItems);

app.use(auth);

app.use("/", routes);

app.use((req, res) => {
  res.status(NOT_FOUND).json({ message: "Requested resource not found" });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
