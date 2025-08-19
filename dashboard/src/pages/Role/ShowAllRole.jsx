// src/pages/ShowAllRole.jsx
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import axios from "../../axiosInstance";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function ShowAllRole() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // 🔍 search state
  const navigate = useNavigate();

  const { roleAndPermission, isAuthChecked } = useSelector(
    (state) => state.auth
  );
  if (!isAuthChecked) {
    return <div>Loading...</div>;
  }

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/role"); // GET all roles
      setRoles(res.data); // adjust if backend returns {data: []}
    } catch (err) {
      console.error("Error fetching roles:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleView = (role) => {
    navigate("/roles/create", { state: { roleToView: role } });
  };

  const handleEdit = (role) => {
    navigate("/roles/create", { state: { roleToEdit: role } });
  };

  const handleDelete = async (roleId) => {
    if (!window.confirm("Are you sure you want to delete this role?")) return;
    try {
      await axios.delete(`/api/role/${roleId}`);
      fetchRoles();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const columns = [
    { name: "Role Name", selector: (row) => row.role, sortable: true },
    {
      name: "Actions",
      cell: (row) => {
        const isShow = roleAndPermission["roleManagement"];
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

  // 🔍 Filter roles by name
  const filteredRoles = roles.filter((r) =>
    r.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">All Roles</h2>
        {roleAndPermission["roleManagement"] === "all" && (
          <button
            className="bg-indigo-500 text-white px-4 py-2 rounded"
            onClick={() => navigate("/roles/create")}
          >
            Create Role
          </button>
        )}
      </div>

      {/* 🔍 Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by role name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 w-full rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredRoles}
        progressPending={loading}
        pagination
        highlightOnHover
        responsive
      />
    </div>
  );
}

export default ShowAllRole;
