const express = require("express");
const router = express.Router();

const tasksController = require("../controllers/tasksController");

router.post("/createTask", tasksController.createTask);
router.get("/getAllTasks", tasksController.getAllTasks);

router.delete("/deleteTask/:id", tasksController.deleteTask);
// PUT = to update a task
router.put("/updateTask/:id", tasksController.updateTask);
// GET = to gettask by id
router.get("/getTaskById/:id", tasksController.getTaskById);

module.exports = router;
