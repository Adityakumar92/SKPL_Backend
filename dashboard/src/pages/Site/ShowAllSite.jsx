import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import axios from "../../axiosInstance";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

function ShowAllSite() {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // 🔍 search state
  const navigate = useNavigate();

  const { roleAndPermission, isAuthChecked } = useSelector(
    (state) => state.auth
  );
  if (!isAuthChecked) {
    return <div>Loading...</div>;
  }

  const fetchSites = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/site");
      setSites(res.data);
    } catch (err) {
      console.error("Error fetching sites:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSites();
  }, []);

  const handleView = (site) => {
    navigate("/site/create", { state: { siteToView: site } });
  };

  const handleEdit = (site) => {
    navigate("/site/create", { state: { siteToEdit: site } });
  };

  const handleDelete = async (siteId) => {
    if (!window.confirm("Are you sure you want to delete this site?")) return;
    try {
      await axios.delete(`/api/site/${siteId}`);
      toast.success("Site deleted ✅");
      fetchSites();
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete ❌");
    }
  };

  const columns = [
    { name: "Site", selector: (row) => row.site, sortable: true },
    {
      name: "Actions",
      cell: (row) => {
        const isShow = roleAndPermission["siteManagement"];
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

  // 🔍 Filter sites by name
  const filteredSites = sites.filter((s) =>
    s.site?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">All Sites</h2>
        {roleAndPermission["siteManagement"] === "all" && (
          <button
            className="bg-indigo-500 text-white px-4 py-2 rounded"
            onClick={() => navigate("/site/create")}
          >
            Create Site
          </button>
        )}
      </div>

      {/* 🔍 Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search sites..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 w-full rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredSites}
        progressPending={loading}
        pagination
        highlightOnHover
        responsive
      />
    </div>
  );
}

export default ShowAllSite;
