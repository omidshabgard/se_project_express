const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const { errors } = require("celebrate");

const auth = require("./middlewares/auth");
const { createUser, login } = require("./controllers/users");
const { getItems } = require("./controllers/clothingItems");
const routes = require("./routes/index");
const { notFoundError } = require("./utils/errors");
const errorHandler = require("./middlewares/errorHandler");
const {
  validateUserCreation,
  validateUserLogin,
} = require("./middlewares/validation");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const app = express();

const corsOptions = {
  origin: "http://localhost:3000",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  allowedHeaders: "*",
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

const { PORT = 3001 } = process.env;

mongoose.set("strictQuery", false);
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to the database");
  })
  .catch(console.error);

app.use(requestLogger);

app.use(express.json());

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

app.post("/signin", validateUserLogin, login);
app.post("/signup", validateUserCreation, createUser);

app.get("/items", getItems);

app.use(auth);

app.use("/", routes);

app.use((req, res, next) => {
  next(new notFoundError("Requested resource not found"));
});

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
