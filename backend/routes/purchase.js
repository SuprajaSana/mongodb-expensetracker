const express = require("express");

const purchaseController = require("../controllers/purchases");

const userAuthentication = require("../middleware/auth");

const router = express.Router();

router.get(
  "/purchase/premium",
  userAuthentication.authenticate,
  purchaseController.purchasePremium
);

router.post(
  "/purchase/updatetransactionstatus",
  userAuthentication.authenticate,
  purchaseController.updateTransactionStatus
);

module.exports = router;
