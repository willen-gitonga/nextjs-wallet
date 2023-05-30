const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

app.get("/data", (req, res) => {
  res.json([1, 2, 3]);
});

module.exports = app;
