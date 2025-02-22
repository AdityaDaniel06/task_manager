import axios from "axios";
import { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router";
import { Modal, message } from "antd";
import { IoSettingsOutline } from "react-icons/io5";
import { FaTasks } from "react-icons/fa";
import { SlLogout } from "react-icons/sl";

function UserDashboard() {
  const [tasks, setTasks] = useState([]);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const navigate = useNavigate();
  const { userId } = useParams();

  // Fetch tasks from API
  const fetchTasks = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/v1/users/getTasksByUser/${userId}`
      );
      const fetchedTasks = response.data.data.userTasks.tasksAssigned;
      const updatedTasks = fetchedTasks.map((task) => ({
        ...task,
        selectedStatus: task.status,
      }));
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Update task status
  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await axios.put(
        `http://127.0.0.1:8000/api/v1/tasks/updateTask/${taskId}`,
        { status: newStatus }
      );

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, status: newStatus } : task
        )
      );
      message.success("Task status successfully updated!");
    } catch (error) {
      console.error(error);
      message.error("Error updating task status. Please try again.");
    }
  };

  const handleStatusChange = (taskId, newStatus) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === taskId ? { ...task, selectedStatus: newStatus } : task
      )
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "text-red-600";
      case "In-Progress":
        return "text-yellow-500";
      case "Completed":
        return "text-green-600";
      default:
        return "text-gray-500";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "text-red-600";
      case "Medium":
        return "text-yellow-500";
      case "Low":
        return "text-green-600";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="bg-emerald-700 text-white w-1/5 p-4 flex flex-col space-y-4">
        <h2 className="text-lg font-semibold text-center">Welcome User</h2>
        <nav>
          <ul className="space-y-3">
            <li className="hover:bg-emerald-700 p-2 rounded">
              <NavLink className="flex gap-3 items-center text-sm">
                <FaTasks className="text-xl" />
                My Tasks
              </NavLink>
            </li>
            <li className="hover:bg-emerald-700 p-2 rounded">
              <NavLink className="flex gap-3 items-center text-sm">
                <IoSettingsOutline className="text-xl" />
                Settings
              </NavLink>
            </li>
            <li className="hover:bg-emerald-700 p-2 rounded">
              <NavLink
                onClick={() => setIsLogoutModalVisible(true)}
                to="#"
                className="flex gap-3 items-center text-sm"
              >
                <SlLogout className="text-xl" />
                Logout
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="flex-1 p-5 bg-white overflow-y-auto">
        <header className="bg-emerald-600 text-white p-4 rounded mb-4">
          <h1 className="text-lg font-semibold">Your Assigned Tasks</h1>
        </header>

        <section className="p-3">
          {tasks.length > 0 ? (
            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task._id}
                  className="bg-gray-100 shadow-md p-4 hover:shadow-lg"
                >
                  <h3 className="text-lg font-medium text-gray-700">
                    {task.title}
                  </h3>
                  <p className="text-gray-600">{task.description}</p>
                  <div className="mt-4 flex justify-between text-sm text-gray-500">
                    <span
                      className={`font-semibold ${getPriorityColor(
                        task.priority
                      )}`}
                    >
                      Priority: {task.priority}
                    </span>
                    <span
                      className={`font-semibold ${getStatusColor(task.status)}`}
                    >
                      Status: {task.status}
                    </span>
                    <span className="font-semibold">
                      Created Date:
                      {new Date(task.createdAt).toLocaleDateString("en-GB")}
                    </span>
                    <span className="font-semibold">
                      Due Date:
                      {new Date(task.dueDate).toLocaleDateString("en-GB")}
                    </span>
                  </div>

                  <div className="mt-4">
                    <label
                      className="text-sm font-semibold block mb-2"
                      htmlFor={`status-${task._id}`}
                    >
                      Update Task Status
                    </label>
                    <select
                      className="border border-gray-300 rounded p-2 w-full"
                      id={`status-${task._id}`}
                      name="status"
                      value={task.selectedStatus}
                      onChange={(e) =>
                        handleStatusChange(task._id, e.target.value)
                      }
                      required
                    >
                      <option value="Pending">Pending</option>
                      <option value="In-Progress">In-Progress</option>
                      <option value="Completed">Completed</option>
                    </select>

                    <button
                      onClick={() =>
                        updateTaskStatus(task._id, task.selectedStatus)
                      }
                      className="mt-3 bg-emerald-600 text-white py-2 px-4 rounded"
                    >
                      Update Status
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No tasks available.</p>
          )}
        </section>
      </main>

      {/* Logout Confirmation Modal */}
      <Modal
        title="Confirm Logout"
        visible={isLogoutModalVisible}
        onOk={() => {
          navigate("/login");
          window.localStorage.removeItem("name");
          window.localStorage.removeItem("email");
          setIsLogoutModalVisible(false);
        }}
        onCancel={() => setIsLogoutModalVisible(false)}
        okText="Yes"
        cancelText="No"
      >
        <p>Are you sure you want to logout?</p>
      </Modal>
    </div>
  );
}

export default UserDashboard;
