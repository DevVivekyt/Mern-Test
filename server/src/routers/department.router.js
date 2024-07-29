const express = require("express");
const { createDepatment, GetAllDepatment, GetDepatmentById, deleteDepartment, updateDepartment } = require("../controllers/department.controller");


const router = express.Router();

router.route("/department").post(createDepatment);
router.route("/departments/:cid").get(GetAllDepatment);
router.route("/departments/getbyId/:id").get(GetDepatmentById);
router.route("/departments/delete/:id").delete(deleteDepartment);
router.route("/departments/update/:id").put(updateDepartment);

module.exports = router;
