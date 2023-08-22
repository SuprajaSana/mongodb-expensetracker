const express = require("express");

const expensesController = require("../controllers/expenses");

const userAuthentication = require("../middleware/auth");

const router = express.Router();

router.get(
  "/get/expenses",
  userAuthentication.authenticate,
  expensesController.getExpenses
);

router.post(
  "/add/expenses",
  userAuthentication.authenticate,
  expensesController.postAddExpenses
);

router.delete(
  "/delete/expenses/:id",
  userAuthentication.authenticate,
  expensesController.postDeleteExpenses
);

router.get(
  "/download/expenses",
  userAuthentication.authenticate,
  expensesController.downloadExpenses
);

module.exports = router;
