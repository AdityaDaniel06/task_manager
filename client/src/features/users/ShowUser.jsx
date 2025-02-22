import { message, Modal } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
// import { useNavigate } from "react-router";

function ShowUser() {
  //   const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(7);

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://127.0.0.1:8000/api/v1/users/getAllUsers"
      );
      setUsers(response.data);
    } catch (e) {
      message.error("Failed to fetch users");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  //   const handleEdit = (id) => navigate(`/admin/edit/${id}`);

  const deleteUser = (id) => {
    axios
      .delete(`http://127.0.0.1:8000/api/v1/users/deleteUser/${id}`)
      .then(() => {
        message.info("User deleted successfully");
        fetchAllUsers();
      })
      .catch(() => {
        message.error("Error while deleting user");
      });
  };

  const handleDeleteConfirm = () => {
    if (userToDelete) {
      deleteUser(userToDelete);
      setIsModalVisible(false);
      setUserToDelete(null);
    }
  };

  const showDeleteConfirm = (id) => {
    setUserToDelete(id);
    setIsModalVisible(true);
  };

  const totalUsers = users.length;
  const totalPages = Math.ceil(totalUsers / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const goToPage = (page) => setCurrentPage(page);
  const goToNextPage = () => {
    if (currentPage < totalPages - 1) setCurrentPage((prev) => prev + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 0) setCurrentPage((prev) => prev - 1);
  };

  if (loading) return <div className="text-center text-xl">Loading...</div>;

  return (
    <div className="container mx-auto my-10 p-5">
      <h1 className="text-2xl font-semibold text-emerald-700 mb-5">
        All Users ({totalUsers})
      </h1>

      <div className="overflow-x-auto rounded-lg shadow-lg bg-white">
        {users.length > 0 ? (
          <table className="w-full border border-gray-200 rounded-lg">
            <thead className="bg-emerald-700 text-white text-sm uppercase">
              <tr>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Role</th>
                <th className="p-4 text-left">Tasks Assigned</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.slice(startIndex, endIndex).map((user, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-gray-100 transition duration-150"
                >
                  <td className="p-4 text-gray-700 text-left">{user.name}</td>
                  <td className="p-4 text-gray-700 text-left">{user.email}</td>
                  <td className="p-4 text-gray-700 text-left">{user.role}</td>
                  <td className="p-4 text-gray-700 text-left">
                    {user.tasksAssigned.length}
                  </td>
                  <td className="p-4 text-left">
                    <button
                      onClick={() => showDeleteConfirm(user._id)}
                      className="bg-red-500 text-white py-2 px-4 rounded-lg text-sm hover:bg-red-600 transition duration-200 focus:outline-none disabled:bg-slate-600 disabled:cursor-not-allowed focus:ring-2 focus:ring-red-400"
                      disabled={user.role === "Admin"}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-6 bg-gray-100 text-gray-600 rounded-lg text-center shadow-inner">
            <p className="text-lg font-medium">No users found.</p>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-5 space-x-2">
          <button
            onClick={goToPrevPage}
            disabled={currentPage === 0}
            className="px-3 py-1 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:opacity-50"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => goToPage(i)}
              className={`px-3 py-1 rounded-md transition ${
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
            className="px-3 py-1 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Confirmation Modal */}
      <Modal
        title="Confirm Deletion"
        open={isModalVisible}
        onOk={handleDeleteConfirm}
        onCancel={() => setIsModalVisible(false)}
        okText="Yes"
        cancelText="No"
        okButtonProps={{
          style: { backgroundColor: "#288b48", color: "white" },
        }}
        cancelButtonProps={{
          style: { backgroundColor: "#e0e0e0", color: "#000" },
        }}
      >
        <p>Are you sure you want to delete this user?</p>
      </Modal>
    </div>
  );
}

export default ShowUser;
