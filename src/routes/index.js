const { Router } = require("express");
const gets = require("./gets");
const filters = require("./filters");
const register = require("./register");
const login = require("./login");
const loginGoogle = require("./googlelogin");
const patches = require("./patch");
const posts = require("./posts");
const adoptionMail = require("./send-email");
const conversations = require("./conversations");
const messages = require("./messages");
const payments = require("./payment");
const forgotPassword = require("./forgotPassword");
const resetPassword = require("./resetPassword");
const reports = require("./reports");
const errorHandler = require("../utils/middlewares/errorHandler");
const router = Router();

router.use(
  "/home",
  gets,
  filters,
  posts,
  conversations,
  messages,
  patches,
  reports
);

router.use("/linkpayment", payments);
router.use("/register", register);
router.use("/login", login);
router.use("/", loginGoogle);
router.use("/mail", adoptionMail);
router.use("/", forgotPassword, resetPassword);
router.use(errorHandler);

module.exports = router;
