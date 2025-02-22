import { message, Modal } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

function ShowTask() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(5);

  const fetchAllTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://127.0.0.1:8000/api/v1/tasks/getAllTasks"
      );
      setTasks(response.data.data.tasks);
    } catch (e) {
      message.error("Failed to fetch tasks");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTasks();
  }, []);

  const handleEdit = (id) => navigate(`/admin/edit/${id}`);

  const deleteTask = (id) => {
    axios
      .delete(`http://127.0.0.1:8000/api/v1/tasks/deleteTask/${id}`)
      .then(() => {
        message.success("Task deleted successfully");
        fetchAllTasks();
      })
      .catch(() => {
        message.error("Error deleting task");
      });
  };

  const handleDeleteConfirm = () => {
    if (taskToDelete) {
      deleteTask(taskToDelete);
      setIsModalVisible(false);
      setTaskToDelete(null);
    }
  };

  const showDeleteConfirm = (id) => {
    setTaskToDelete(id);
    setIsModalVisible(true);
  };

  const totalTasks = tasks.length;
  const totalPages = Math.ceil(totalTasks / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const goToPage = (page) => setCurrentPage(page);
  const goToNextPage = () => {
    if (currentPage < totalPages - 1) setCurrentPage((prev) => prev + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 0) setCurrentPage((prev) => prev - 1);
  };
  if (loading) return <h1>Loading...</h1>;

  return (
    <div className="container mx-auto my-10 p-5 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold text-center text-emerald-700 mb-5">
        All Tasks {tasks.length > 0 ? `(${tasks.length})` : " - No Tasks"}
      </h1>

      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="w-full border border-gray-300 rounded-lg">
          <thead className="bg-emerald-700 text-white">
            <tr>
              {[
                "No.",
                "Title",
                "Description",
                "Priority",
                "Status",
                "Assigned To",
                "Completed",
                "Created Date",
                "Due Date",
                "Actions",
              ].map((header, i) => (
                <th key={i} className="p-3 text-sm font-semibold text-center">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tasks.slice(startIndex, endIndex).map((task, index) => (
              <tr
                key={task._id}
                className="border-b text-center hover:bg-gray-100 transition"
              >
                <td className="p-3 text-sm">{index + 1}</td>
                <td className="p-3 text-sm font-semibold">{task.title}</td>
                <td className="p-3 text-sm truncate max-w-xs">
                  {task.description}
                </td>
                <td
                  className={`p-3 text-sm font-semibold ${
                    task.priority === "High"
                      ? "text-red-600"
                      : task.priority === "Medium"
                      ? "text-yellow-600"
                      : "text-green-600"
                  }`}
                >
                  {task.priority}
                </td>
                <td className="p-3 text-sm font-semibold">{task.status}</td>
                <td className="p-3 text-sm">
                  {task.assignTo?.name ?? "Not Assigned"}
                </td>
                <td className="p-3 text-sm">{task.completed ? "✔" : "✖"}</td>
                <td className="p-3 text-sm">{task.createdAt?.split("T")[0]}</td>
                <td className="p-3 text-sm">{task.dueDate?.split("T")[0]}</td>
                <td className="p-3 flex gap-2 justify-center">
                  <button
                    onClick={() => handleEdit(task._id)}
                    className="bg-blue-500 text-white py-1.5 px-3 rounded-md text-sm hover:bg-blue-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => showDeleteConfirm(task._id)}
                    className="bg-red-500 text-white py-1.5 px-2 rounded-md text-sm hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-5 space-x-2">
          <button
            onClick={goToPrevPage}
            disabled={currentPage === 0}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:opacity-50"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => goToPage(i)}
              className={`px-4 py-2 rounded-md transition ${
                currentPage === i
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages - 1}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Modal */}
      <Modal
        title="Confirm Deletion"
        open={isModalVisible}
        onOk={handleDeleteConfirm}
        onCancel={() => setIsModalVisible(false)}
        okText="Yes"
        cancelText="No"
      >
        <p>Are you sure you want to delete this task?</p>
      </Modal>
    </div>
  );
}

export default ShowTask;
