import { useEffect, useState } from "react";
import axios from "axios";
import { message } from "antd";

function CreateTask() {
  const [taskInput, setTaskInput] = useState({});
  const [users, setUsers] = useState([]); // array to store list of user

  const fetchUserName = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/v1/users/getAllUsers"
      );
      //   console.log(response.data);
      const userNames = response.data.map((user) => user.name);
      setUsers(userNames);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchUserName();
  }, []);

  const handleInput = (e) => {
    setTaskInput((values) => ({ ...values, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    // console.log(taskInput);
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/v1/tasks/createTask",
        taskInput
      );
      console.log(response);
      message.success("Task created successfully!");
      setTaskInput({
        title: "",
        description: "",
        priority: "",
        dueDate: "",
        assignTo: "",
      });
    } catch (e) {
      message.error("Failed to create task.");
      console.error(e);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-4">
        <h2 className="text-2xl font-bold text-emerald-700 mb-4 text-center">
          Create a New Task
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              className="text-gray-700 text-sm font-semibold mb-1 block"
              htmlFor="title"
            >
              Task Title
            </label>
            <input
              className="border border-gray-300 rounded-lg w-full p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              type="text"
              id="title"
              name="title"
              value={taskInput.title}
              onChange={handleInput}
              placeholder="Enter task title"
              required
            />
          </div>
          <div>
            <label
              className="text-gray-700 text-sm font-semibold mb-1 block"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              className="border border-gray-300 rounded-lg w-full p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              id="description"
              name="description"
              value={taskInput.description}
              onChange={handleInput}
              placeholder="Enter task description"
              rows="3"
              required
            />
          </div>
          <div>
            <label
              className="text-gray-700 text-sm font-semibold mb-1 block"
              htmlFor="dueDate"
            >
              Due Date
            </label>
            <input
              className="border border-gray-300 rounded-lg w-full p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              type="date"
              id="dueDate"
              name="dueDate"
              value={taskInput.dueDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={handleInput}
              required
            />
          </div>
          <div>
            <label
              className="text-gray-700 text-sm font-semibold mb-1 block"
              htmlFor="priority"
            >
              Priority
            </label>
            <select
              className="border border-gray-300 rounded-lg w-full p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              id="priority"
              name="priority"
              value={taskInput.priority}
              onChange={handleInput}
              required
            >
              <option value="">Select Priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div>
            <label
              className="text-gray-700 text-sm font-semibold mb-1 block"
              htmlFor="assignTo"
            >
              Assign to
            </label>
            <select
              className="border border-gray-300 rounded-lg w-full p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              id="assignTo"
              name="assignTo"
              value={taskInput.assignTo}
              onChange={handleInput}
              required
            >
              <option value="">Select User task should be assigned to</option>
              {users.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              className="text-gray-700 text-sm font-semibold mb-1 block"
              htmlFor="status"
            >
              Status
            </label>
            <input
              className="border border-gray-300 rounded-lg w-full p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              type="text"
              id="status"
              name="status"
              //   value={input.dueDate || ""}
              value={"Pending"}
              onChange={handleInput}
              disabled
            />
          </div>
          <div className="text-center mt-6">
            <button
              type="submit"
              className="bg-emerald-700 text-white py-2 px-4 rounded-lg hover:bg-emerald-800 transition duration-200"
            >
              Create Task
            </button>
            {/* LATER: if any input is empty make button disabled */}
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTask;
