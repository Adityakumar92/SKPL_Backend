import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import axios from "../../axiosInstance";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

function ShowAllBuilding() {
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // 🔍 search state
  const navigate = useNavigate();

  const { roleAndPermission, isAuthChecked } = useSelector(
    (state) => state.auth
  );
  if (!isAuthChecked) {
    return <div>Loading...</div>;
  }

  const fetchBuildings = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/building");
      setBuildings(res.data.buildings || []);
    } catch (err) {
      console.error("Error fetching buildings:", err);
      toast.error("Failed to load buildings ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuildings();
  }, []);

  const handleView = (building) => {
    navigate("/build/create", { state: { buildingToView: building } });
  };

  const handleEdit = (building) => {
    navigate("/build/create", { state: { buildingToEdit: building } });
  };

  const handleDelete = async (buildingId) => {
    if (!window.confirm("Are you sure you want to delete this building?")) return;
    try {
      await axios.delete(`/api/building/${buildingId}`);
      toast.success("Building deleted ✅");
      fetchBuildings();
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete ❌");
    }
  };

  const columns = [
    { name: "Building", selector: (row) => row.building, sortable: true },
    { name: "Floor", selector: (row) => row.floor, sortable: true },
    { name: "Location", selector: (row) => row.location, sortable: true },
    { name: "Site", selector: (row) => row.site_id?.site || "", sortable: true },
    {
      name: "Actions",
      cell: (row) => {
        const activityPerm = roleAndPermission["buildingManagement"];
        return (
          <div className="flex gap-2">
            <button
              className="bg-green-500 text-white px-2 py-1 rounded"
              onClick={() => handleView(row)}
            >
              View
            </button>

            {(activityPerm === "edit" || activityPerm === "all") && (
              <button
                className="bg-blue-500 text-white px-2 py-1 rounded"
                onClick={() => handleEdit(row)}
              >
                Edit
              </button>
            )}

            {activityPerm === "all" && (
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

  // 🔍 Filter buildings based on search term
  const filteredBuildings = buildings.filter(
    (b) =>
      b.building?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.floor?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.site_id?.site?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">All Buildings</h2>
        {roleAndPermission["buildingManagement"] === "all" && (
          <button
            className="bg-indigo-500 text-white px-4 py-2 rounded"
            onClick={() => navigate("/build/create")}
          >
            Create Building
          </button>
        )}
      </div>

      {/* 🔍 Search bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by building, floor, location, or site..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 w-full rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredBuildings}
        progressPending={loading}
        pagination
        highlightOnHover
        responsive
      />
    </div>
  );
}

export default ShowAllBuilding;
