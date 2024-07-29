const express = require("express");
const { createUser, GetAllUser, GetFiltredUser, GetUserById, deleteUser, updateUser } = require("../controllers/user.controller");


const router = express.Router();

router.route("/user").post(createUser);
router.route("/user/:cid").get(GetAllUser);
router.route("/user/getbyId/:id").get(GetUserById);
router.route("/user/delete/:id").delete(deleteUser);
router.route("/user/update/:id").put(updateUser);
router.route("/user/search/:cid").get(GetFiltredUser);

module.exports = router;
