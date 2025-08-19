import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import axios from "../../axiosInstance";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

function ShowAllActivity() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // 🔍 search state
  const navigate = useNavigate();

  const { roleAndPermission, isAuthChecked } = useSelector(
    (state) => state.auth
  );
  if (!isAuthChecked) {
    return <div>Loading...</div>;
  }

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/activity");
      setActivities(res.data.activities || []);
    } catch (err) {
      console.error("Error fetching activities:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleView = (activity) => {
    navigate("/activity/create", { state: { activityToView: activity } });
  };

  const handleEdit = (activity) => {
    navigate("/activity/create", { state: { activityToEdit: activity } });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this activity?")) return;
    try {
      await axios.delete(`/api/activity/${id}`);
      toast.success("Activity deleted successfully ✅");
      fetchActivities();
    } catch (err) {
      console.error("Error deleting activity:", err);
      toast.error("Delete failed ❌");
    }
  };

  const columns = [
    { name: "Activity", selector: (row) => row.activity, sortable: true },
    { name: "Checklist", selector: (row) => row.checklist_id?.name || "—", sortable: true },
    {
      name: "Created At",
      selector: (row) => new Date(row.createdAt).toLocaleDateString(),
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => {
        const isShow = roleAndPermission["activityManagement"];
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

  // 🔍 Filtered activities
  const filteredActivities = activities.filter(
    (activity) =>
      activity.activity?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.checklist_id?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      new Date(activity.createdAt).toLocaleDateString().includes(searchTerm)
  );

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">All Activities</h2>
        {roleAndPermission["activityManagement"] === "all" && (
          <button
            className="bg-indigo-500 text-white px-4 py-2 rounded"
            onClick={() => navigate("/activity/create")}
          >
            Create Activity
          </button>
        )}
      </div>

      {/* 🔍 Search box */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by activity, checklist, or date..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 w-full rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredActivities}
        progressPending={loading}
        pagination
        highlightOnHover
        responsive
        persistTableHead
      />
    </div>
  );
}

export default ShowAllActivity;
