import React, { useState, useEffect } from "react";
import axios from "../../axiosInstance";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";

function CreateNewItemsMaterial() {
  const navigate = useNavigate();
  const location = useLocation();
  const itemToEdit = location.state?.itemToEdit;
  const itemToView = location.state?.itemToView;

  const [item, setItem] = useState("");
  const [checklistId, setChecklistId] = useState("");
  const [checklists, setChecklists] = useState([]);
  const isViewMode = Boolean(itemToView);

  // Fetch all checklists for dropdown
  useEffect(() => {
    const fetchChecklists = async () => {
      try {
        const res = await axios.get("/api/checklist");
        setChecklists(res.data.checklists || []);
      } catch (err) {
        console.error("Error fetching checklists:", err);
      }
    };
    fetchChecklists();
  }, []);

  // Prefill data for edit/view
  useEffect(() => {
    if (itemToEdit || itemToView) {
      setItem(itemToEdit?.item || itemToView?.item || "");
      setChecklistId(
        itemToEdit?.checklist_id?._id || itemToView?.checklist_id?._id || ""
      );
    }
  }, [itemToEdit, itemToView]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!item || !checklistId) {
        toast.error("Please fill all fields ❌");
        return;
      }

      if (itemToEdit) {
        await axios.put(`/api/item/${itemToEdit._id}`, {
          item,
          checklist_id: checklistId,
        });
        toast.success("Item updated successfully ✅");
      } else {
        await axios.post("/api/item", {
          item,
          checklist_id: checklistId,
        });
        toast.success("Item created successfully ✅");
      }
      navigate("/items_Material/all"); // go back to list
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Save failed ❌");
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">
        {isViewMode ? "View" : itemToEdit ? "Edit" : "Create"} Item Material
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Item Name */}
        <div>
          <label className="block font-semibold">Item Name</label>
          <input
            type="text"
            value={item}
            onChange={(e) => setItem(e.target.value)}
            disabled={isViewMode}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Checklist Dropdown */}
        <div>
          <label className="block font-semibold">Checklist</label>
          <select
            value={checklistId}
            onChange={(e) => setChecklistId(e.target.value)}
            disabled={isViewMode}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">-- Select Checklist --</option>
            {checklists.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        {!isViewMode && (
          <button
            type="submit"
            className="bg-indigo-500 text-white px-4 py-2 rounded"
          >
            {itemToEdit ? "Update" : "Create"}
          </button>
        )}
      </form>
    </div>
  );
}

export default CreateNewItemsMaterial;
