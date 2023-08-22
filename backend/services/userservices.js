const expenses = require("../models/expenses");

const getExpenses = (req, where) => {
  return expenses.find({ userId: req.user._id });
};

module.exports = {
  getExpenses,
};
