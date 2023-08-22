require("dotenv").config();

const razorpay = require("razorpay");

const Order = require("../models/orders");

const usersController = require("./users");

exports.purchasePremium = async (req, res, next) => {
  try {
    const raz = new razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    const totalExpensesAmount = req.user.totalExpensesAmount;
    const amount = totalExpensesAmount;
    raz.orders.create({ amount, currency: "INR" }, (err, order) => {
      if (err) {
        throw new Error(JSON.stringify(err));
      }
      order = new Order({
        paymentid: "",
        orderid: order.id,
        status: "PENDING",
        userId: req.user._id,
      });
      order
        .save()
        .then(() => {
          return res.status(201).json({ order, key_id: raz.key_id });
        })
        .catch((err) => {
          throw new Error(err);
        });
    });
  } catch (err) {
    res.status(403).json({ message: "Something went wrong", error: err });
  }
};

exports.updateTransactionStatus = async (req, res, next) => {
  try {
    const userDetailId = req.user._id;
    const { payment_id, order_id, status } = req.body;
    return req.user
      .updatePremiumStatus(payment_id, status)
      .then(() => {
        return res.status(202).json({
          success: true,
          message: "Transaction Successful",
          token: usersController.generateAccessToken(
            userDetailId,
            undefined,
            true
          ),
        });
      })
      .catch((err) => {
        throw new Error(err);
      });
  } catch (err) {
    res.status(403).json({ message: "Something went wrong", error: err });
  }
};
