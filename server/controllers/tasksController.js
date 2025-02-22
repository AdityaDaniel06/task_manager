const TaskModel = require("../models/tasksModel");
const UserModel = require("../models/usersModel");

const getAllTasks = async (req, res) => {
  try {
    // Fetch all tasks and populate the assignToUser field
    const tasks = await TaskModel.find({}).populate(
      "assignTo",
      "name email role"
    );
    res.status(200).json({
      status: "success",
      data: {
        tasks,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(404).json({ status: "fail", message: err });
  }
};

const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, assignTo } = req.body;
    // console.log("assigned To", assignTo);
    // Check if assigned user exists
    const user = await UserModel.findOne({ name: assignTo });
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "Assigned user not found!",
      });
    }

    // Create new task
    const newTask = await TaskModel.create({
      title,
      description,
      dueDate,
      priority,
      assignTo: user._id,
      status: "Pending",
    });

    // Update user tasks list
    user.tasksAssigned.push(newTask._id);
    await user.save();

    // Respond with success
    res.status(201).json({
      status: "success",
      message: "Task created successfully",
      data: { task: newTask },
    });
  } catch (err) {
    console.error("Error creating task:", err);
    res.status(500).json({
      status: "fail",
      message: "Something went wrong. Please try again later.",
    });
  }
};

const getTaskById = async (req, res) => {
  try {
    const task = await TaskModel.findById(req.params.id).populate(
      "assignTo",
      "name email role"
    );
    if (!task) {
      return res.status(404).json({
        status: "fail",
        message: "Task not found!",
      });
    }
    res.status(200).json({
      status: "success",
      data: {
        task,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(404).json({ status: "fail", message: err });
  }
};

const updateTask = async (req, res) => {
  try {
    const updatedTask = await TaskModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.status(200).json({
      status: "success",
      data: {
        task: updatedTask,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(404).json({ status: "fail", message: err });
  }
};

const deleteTask = async (req, res) => {
  //   console.log("deleting ", req.params.id);
  try {
    const book = await TaskModel.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid Data sent!",
    });
  }
};

module.exports = {
  createTask,
  getAllTasks,
  updateTask,
  deleteTask,
  getTaskById,
};
