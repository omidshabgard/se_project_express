const express = require("express");
const mongoose = require("mongoose");
const app = express();
const { PORT = 3001 } = process.env;

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");
const userRouter = require("./routes/users");
app.use(express.json());
app.use("/api/users/", userRouter);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
