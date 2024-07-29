const express = require("express");
const { registration, login } = require("../controllers/auth.controller");


const router = express.Router();

router.route("/auth/registration").post(registration);
router.route("/auth/login").post(login);

module.exports = router;
