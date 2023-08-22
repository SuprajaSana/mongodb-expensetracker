const Expense = require("../models/expenses");
const UserServices = require("../services/userservices");
const S3Services = require("../services/s3services");

require("dotenv").config();

exports.getExpenses = async (req, res, next) => {
  await Expense.find({
    userId: req.user._id,
  })
    .then((expenses) => {
      res.status(200).json({ expenses: expenses });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

exports.postAddExpenses = async (req, res, next) => {
  const expense = new Expense({
    description: req.body.description,
    category: req.body.category,
    amount: req.body.amount,
    userId: req.user._id,
  });
  await expense
    .save()
    .then(() => {
      return req.user.addExpenses(expense);
    })
    .then((expenses) => {
      res.status(201).json({ expenses: expenses });
    })
    .catch((err) => console.log(err));
};

exports.postDeleteExpenses = async (req, res, next) => {
  const expId = req.params.id;
  await req.user
    .deleteExpenses(expId)
    .then(() => {
      return Expense.findByIdAndRemove(expId);
    })
    .then((expenses) => {
      res.status(200).json({ expenses: expenses });
    })
    .catch((err) => console.log(err));
};

exports.downloadExpenses = async (req, res) => {
  try {
    const expenses = await UserServices.getExpenses(req);
    const stringifyExpenses = JSON.stringify(expenses);
    const userId = req.user._id;
    const fileName = `ExpenseMongodb${userId}/${new Date()}.txt`;
    const fileURL = await S3Services.uploadToS3(stringifyExpenses, fileName);
    res.status(200).json({ fileURL, success: true });
  } catch (err) {
    res.status(500).json({ fileURL: "", success: false, err: err });
  }
};
