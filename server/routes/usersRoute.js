const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const usersController = require("../controllers/usersController");

router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.post("/createUser", usersController.createUser);
router.get("/getAllUsers", usersController.getAllUsers);
router.get("/getUserById/:id", usersController.getUserById);
router.get("/getTasksByUser/:userId", usersController.getTasksByUser);

router.delete("/deleteUser/:id", usersController.deleteUser);

module.exports = router;
