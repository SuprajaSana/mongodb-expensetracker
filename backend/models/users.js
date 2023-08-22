const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  totalExpensesAmount: {
    type: Number,
    required: true,
  },
  isPremiumUser: {
    type: Boolean,
    required: true,
  },
  expenses: {
    expenses: [
      {
        expenseId: {
          type: Schema.Types.ObjectId,
          ref: "Expense",
          required: true,
        },
        expamount: {
          type: Number,
          ref: "Expense",
          required: true,
        },
      },
    ],
  },
  orders: {
    payment_id: {
      type: String,
      ref: "Order",
    },
    status: {
      type: String,
      ref: "Order",
    },
  },
});

userSchema.methods.addExpenses = function (expense) {
  let updatedExpenses = [...this.expenses.expenses];

  updatedExpenses.push({
    expenseId: expense._id,
    expamount: expense.amount,
  });

  const updatedExpensesList = { expenses: updatedExpenses };

  this.totalExpensesAmount = this.totalExpensesAmount + expense.amount;
  this.expenses = updatedExpensesList;
  return this.save();
};

userSchema.methods.deleteExpenses = function (expId) {
  let updatedExpenses = this.expenses.expenses.filter((expense) => {
    return expense.expenseId.toString() !== expId.toString();
  });

  let deletedExpense = this.expenses.expenses.filter((expense) => {
    return expense.expenseId.toString() === expId.toString();
  });

  const updatedExpensesList = { expenses: updatedExpenses };

  this.totalExpensesAmount =
    this.totalExpensesAmount - deletedExpense[0].expamount;
  this.expenses = updatedExpensesList;
  return this.save();
};

userSchema.methods.updatePremiumStatus = function (payment_id, status) {
  let order = {
    payment_id: payment_id,
    status: status,
  };
  this.orders = order;
  this.isPremiumUser = true;
  return this.save();
};

module.exports = mongoose.model("User", userSchema);
