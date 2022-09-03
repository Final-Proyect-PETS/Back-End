const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    informerId: String,
    informerFirstName: String,
    informerLastName: String,
    reportedUserId: String,
    reportedFirstName: String,
    reportedLastName: String,
    reason: String,
    deleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const UserReport = mongoose.model("UserReport", messageSchema);

module.exports = UserReport;
