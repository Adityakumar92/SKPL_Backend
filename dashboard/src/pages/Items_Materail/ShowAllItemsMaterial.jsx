import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import axios from "../../axiosInstance";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

function ShowAllItemsMaterial() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // 🔍 search state
  const navigate = useNavigate();

  const { roleAndPermission, isAuthChecked } = useSelector(
    (state) => state.auth
  );
  if (!isAuthChecked) {
    return <div>Loading...</div>;
  }

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/item");
      setItems(res.data.itemMaterials || []);
    } catch (err) {
      console.error("Error fetching items:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleView = (item) => {
    navigate("/items_Material/create", { state: { itemToView: item } });
  };

  const handleEdit = (item) => {
    navigate("/items_Material/create", { state: { itemToEdit: item } });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await axios.delete(`/api/item/${id}`);
      toast.success("Item deleted successfully ✅");
      fetchItems();
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Delete failed ❌");
    }
  };

  const columns = [
    { name: "Item", selector: (row) => row.item, sortable: true },
    { name: "Checklist", selector: (row) => row.checklist_id?.name || "—", sortable: true },
    {
      name: "Created At",
      selector: (row) => new Date(row.createdAt).toLocaleDateString(),
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => {
        const isShow = roleAndPermission["itemsMaterialManagement"];
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

  // 🔍 Filter items by item name or checklist name
  const filteredItems = items.filter(
    (i) =>
      i.item?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.checklist_id?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      new Date(i.createdAt)
        .toLocaleDateString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">All Item Materials</h2>
        {roleAndPermission["itemsMaterialManagement"] === "all" && (
          <button
            className="bg-indigo-500 text-white px-4 py-2 rounded"
            onClick={() => navigate("/items_Material/create")}
          >
            Create Item
          </button>
        )}
      </div>

      {/* 🔍 Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by item, checklist, or date..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 w-full rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredItems}
        progressPending={loading}
        pagination
        highlightOnHover
        responsive
      />
    </div>
  );
}

export default ShowAllItemsMaterial;
