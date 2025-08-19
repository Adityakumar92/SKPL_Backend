import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../axiosInstance";
import { toast } from "react-toastify";

function CreateNewActivity() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const activityToEdit = state?.activityToEdit;
  const activityToView = state?.activityToView;

  const isEditMode = !!activityToEdit;
  const isViewMode = !!activityToView;

  const [form, setForm] = useState({
    activity: "",
    checklist_id: ""
  });

  const [checklists, setChecklists] = useState([]);

  // Fetch checklists for dropdown
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get("/api/checklist");
        setChecklists(res.data.checklists || []);
      } catch (err) {
        console.error("Error fetching checklists:", err);
      }
    })();
  }, []);

  // Populate form if editing or viewing
  useEffect(() => {
    if (isEditMode) setForm({ ...activityToEdit });
    else if (isViewMode) setForm({ ...activityToView });
  }, [isEditMode, activityToEdit, isViewMode, activityToView]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (isEditMode) {
        await axios.put(`/api/activity/${activityToEdit._id}`, form);
        toast.success("Activity updated successfully ✅");
      } else {
        await axios.post("/api/activity", form);
        toast.success("Activity created successfully 🎉");
      }
      navigate("/activity/all");
    } catch (err) {
      console.error("Error saving activity:", err);
      toast.error("Something went wrong ❌");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow-md">
      <h1 className="font-bold text-center text-2xl text-[#305361]">
        {isEditMode
          ? "Edit Activity"
          : isViewMode
          ? "View Activity"
          : "Create New Activity"}
      </h1>

      {/* Activity Name */}
      <div className="mt-6">
        <label className="font-medium block mb-1">Activity Name</label>
        <input
          name="activity"
          disabled={isViewMode}
          placeholder="Enter activity name"
          value={form.activity}
          onChange={handleChange}
          className="border border-gray-300 w-full rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-[#305361] disabled:bg-gray-100"
        />
      </div>

      {/* Checklist Selection */}
      <div className="mt-6">
        <label className="font-medium block mb-1">Select Checklist</label>
        <select
          name="checklist_id"
          disabled={isViewMode}
          value={form.checklist_id}
          onChange={handleChange}
          className="border border-gray-300 w-full rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-[#305361] disabled:bg-gray-100"
        >
          <option value="">-- Select Checklist --</option>
          {checklists.map((cl) => (
            <option key={cl._id} value={cl._id}>
              {cl.name}
            </option>
          ))}
        </select>
      </div>

      {/* Submit */}
      {!isViewMode && (
        <div className="flex justify-end mt-8">
          <button
            disabled={!form.activity?.trim() || !form.checklist_id}
            onClick={handleSubmit}
            className={`rounded-md px-6 py-2 text-white transition ${
              form.activity?.trim() && form.checklist_id
                ? "bg-[#305361] hover:bg-[#27464f] cursor-pointer"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {isEditMode ? "Update Activity" : "Create Activity"}
          </button>
        </div>
      )}
    </div>
  );
}

export default CreateNewActivity;
