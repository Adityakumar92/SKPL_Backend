import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import axios from "../../axiosInstance";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

function ShowAllBackendUser() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // 🔍 search state
  const navigate = useNavigate();

  const { roleAndPermission, isAuthChecked } = useSelector(
    (state) => state.auth
  );
  if (!isAuthChecked) {
    return <div>Loading...</div>;
  }

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/user");
      setUsers(res.data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleView = (user) => {
    navigate("/backendusers/create", { state: { userToView: user } });
  };

  const handleEdit = (user) => {
    navigate("/backendusers/create", { state: { userToEdit: user } });
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`/api/user/${userId}`);
      toast.success("User deleted ✅");
      fetchUsers();
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete ❌");
    }
  };

  const columns = [
    { name: "Username", selector: (row) => row.username, sortable: true },
    { name: "Email", selector: (row) => row.email, sortable: true },
    { name: "Phone", selector: (row) => row.phone || "-", sortable: true },
    {
      name: "Role",
      selector: (row) => row.roleAndPermission?.role || "-",
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => {
        const isShow = roleAndPermission["userManagement"];
        return (
          <div className="flex gap-2">
            <button
              className="bg-green-500 text-white px-2 py-1 rounded"
              onClick={() => handleView(row)}
            >
              View
            </button>

            {(isShow === "edit" || isShow === "all") && (
              <button
                className="bg-blue-500 text-white px-2 py-1 rounded"
                onClick={() => handleEdit(row)}
              >
                Edit
              </button>
            )}

            {isShow === "all" && (
              <button
                className="bg-red-500 text-white px-2 py-1 rounded"
                onClick={() => handleDelete(row._id)}
              >
                Delete
              </button>
            )}
          </div>
        );
      },
    },
  ];

  // 🔍 Filter users based on search
  const filteredUsers = users.filter(
    (user) =>
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.roleAndPermission?.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">All Users</h2>
        {roleAndPermission["userManagement"] === "all" && (
          <button
            className="bg-indigo-500 text-white px-4 py-2 rounded"
            onClick={() => navigate("/backendusers/create")}
          >
            Create User
          </button>
        )}
      </div>

      {/* 🔍 Search input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by username, email, phone, or role..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 w-full rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredUsers}
        progressPending={loading}
        pagination
        highlightOnHover
        responsive
        persistTableHead
      />
    </div>
  );
}

export default ShowAllBackendUser;
