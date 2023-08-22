const express = require("express");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");

var cors = require("cors");

const app = express();

app.use(cors());

const userRoutes = require("./routes/users");
const expensesRoutes = require("./routes/expenses");
const purchaseRoutes = require("./routes/purchase");
const premiumRoutes = require("./routes/premium");

app.use(bodyParser.json({ extended: false }));

app.use(userRoutes);
app.use(expensesRoutes);
app.use(purchaseRoutes);
app.use(premiumRoutes);

mongoose
  .connect(
    "mongodb+srv://sanasupraja:Saana@cluster0.xoelnru.mongodb.net/expensetracker?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(5000);
  })
  .catch((err) => {
    console.log(err);
  });
