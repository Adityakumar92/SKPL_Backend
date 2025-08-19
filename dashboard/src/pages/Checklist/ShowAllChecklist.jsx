import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import axios from "../../axiosInstance";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

function ShowAllChecklist() {
  const [checklists, setChecklists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // 🔍 search state
  const navigate = useNavigate();

  const { roleAndPermission, isAuthChecked } = useSelector(
    (state) => state.auth
  );
  if (!isAuthChecked) {
    return <div>Loading...</div>;
  }

  const fetchChecklists = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/checklist");
      setChecklists(res.data.checklists || []);
    } catch (err) {
      console.error("Error fetching checklists:", err);
      toast.error("Failed to load checklists");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChecklists();
  }, []);

  const handleView = (checklist) => {
    navigate("/checklist/create", { state: { checklistToView: checklist } });
  };

  const handleEdit = (checklist) => {
    navigate("/checklist/create", { state: { checklistToEdit: checklist } });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this checklist?")) return;
    try {
      await axios.delete(`/api/checklist/${id}`);
      toast.success("Checklist deleted ✅");
      fetchChecklists();
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete checklist");
    }
  };

  const columns = [
    { name: "Name", selector: (row) => row.name, sortable: true },
    { name: "Icon", selector: (row) => row.icon || "-", sortable: false },
    {
      name: "Requirements",
      selector: (row) =>
        [
          row.buildingReq && "Building",
          row.activityReq && "Activity",
          row.itemMaterialReq && "Item/Material",
          row.remarkReq && "Remark",
          row.workStatusReq && "Work Status",
          row.itemDescription && "Item Description",
          row.photoUrlReq && "Photo",
          row.pdfUrlReq && "PDF",
        ]
          .filter(Boolean)
          .join(", ") || "-",
      sortable: false,
      wrap: true,
    },
    {
      name: "Actions",
      cell: (row) => {
        const isShow = roleAndPermission["checklistManagement"];
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

  // 🔍 filter checklists by search
  const filteredChecklists = checklists.filter(
    (c) =>
      c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.icon?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.buildingReq && "building".includes(searchTerm.toLowerCase())) ||
      (c.activityReq && "activity".includes(searchTerm.toLowerCase())) ||
      (c.itemMaterialReq && "item".includes(searchTerm.toLowerCase())) ||
      (c.remarkReq && "remark".includes(searchTerm.toLowerCase())) ||
      (c.workStatusReq && "work status".includes(searchTerm.toLowerCase())) ||
      (c.itemDescription && "item description".includes(searchTerm.toLowerCase())) ||
      (c.photoUrlReq && "photo".includes(searchTerm.toLowerCase())) ||
      (c.pdfUrlReq && "pdf".includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">All Checklists</h2>
        {roleAndPermission["checklistManagement"] === "all" && (
          <button
            className="bg-indigo-500 text-white px-4 py-2 rounded"
            onClick={() => navigate("/checklist/create")}
          >
            Create Checklist
          </button>
        )}
      </div>

      {/* 🔍 search input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name, icon, or requirements..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 w-full rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredChecklists}
        progressPending={loading}
        pagination
        highlightOnHover
        responsive
      />
    </div>
  );
}

export default ShowAllChecklist;
