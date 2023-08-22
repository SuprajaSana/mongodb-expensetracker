const User = require("../models/users");

exports.getLeaderBoard = async (req, res, next) => {
  try {
    const leaderBoardDetails = await User.find().sort("totalExpensesAmount");
    leaderBoardDetails.reverse();
    res.status(200).json(leaderBoardDetails);
  } catch (err) {
    res.status(500).json(err);
  }
};
