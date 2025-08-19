import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../axiosInstance";
import { toast } from "react-toastify";

function CreateNewChecklist() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const checklistToEdit = state?.checklistToEdit;
  const checklistToView = state?.checklistToView;

  const isEditMode = !!checklistToEdit;
  const isViewMode = !!checklistToView;

  const [form, setForm] = useState({
    name: "",
    icon: "",
    buildingReq: false,
    activityReq: false,
    itemMaterialReq: false,
    remarkReq: false,
    workStatusReq: false,
    itemDescription: false,
    photoUrlReq: false,
    pdfUrlReq: false,
  });

  useEffect(() => {
    if (isEditMode) {
      setForm({
        name: checklistToEdit.name || "",
        icon: checklistToEdit.icon || "",
        buildingReq: !!checklistToEdit.buildingReq,
        activityReq: !!checklistToEdit.activityReq,
        itemMaterialReq: !!checklistToEdit.itemMaterialReq,
        remarkReq: !!checklistToEdit.remarkReq,
        workStatusReq: !!checklistToEdit.workStatusReq,
        itemDescription: !!checklistToEdit.itemDescription,
        photoUrlReq: !!checklistToEdit.photoUrlReq,
        pdfUrlReq: !!checklistToEdit.pdfUrlReq,
      });
    } else if (isViewMode) {
      setForm({
        name: checklistToView.name || "",
        icon: checklistToView.icon || "",
        buildingReq: !!checklistToView.buildingReq,
        activityReq: !!checklistToView.activityReq,
        itemMaterialReq: !!checklistToView.itemMaterialReq,
        remarkReq: !!checklistToView.remarkReq,
        workStatusReq: !!checklistToView.workStatusReq,
        itemDescription: !!checklistToView.itemDescription,
        photoUrlReq: !!checklistToView.photoUrlReq,
        pdfUrlReq: !!checklistToView.pdfUrlReq,
      });
    }
  }, [isEditMode, checklistToEdit, isViewMode, checklistToView]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      toast.error("Checklist name is required");
      return;
    }

    try {
      if (isEditMode) {
        await axios.put(`/api/checklist/${checklistToEdit._id}`, form);
        toast.success("Checklist updated successfully ✅");
      } else {
        await axios.post("/api/checklist", form);
        toast.success("Checklist created successfully 🎉");
      }
      navigate("/checklist/all");
    } catch (err) {
      console.error("Error saving checklist:", err);
      const msg = err.response?.data?.message || "Something went wrong";
      toast.error(msg);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow-md">
      <h1 className="font-bold text-center text-2xl text-[#305361]">
        {isEditMode ? "Edit Checklist" : isViewMode ? "View Checklist" : "Create New Checklist"}
      </h1>

      {/* Name */}
      <div className="mt-6">
        <label className="font-medium block mb-1">Checklist Name</label>
        <input
          name="name"
          disabled={isViewMode}
          placeholder="Enter checklist name"
          value={form.name}
          onChange={handleChange}
          className="border border-gray-300 w-full rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-[#305361] disabled:bg-gray-100"
        />
      </div>

      {/* Icon */}
      <div className="mt-4">
        <label className="font-medium block mb-1">Icon (optional)</label>
        <input
          name="icon"
          disabled={isViewMode}
          placeholder="Icon name or URL"
          value={form.icon}
          onChange={handleChange}
          className="border border-gray-300 w-full rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-[#305361] disabled:bg-gray-100"
        />
      </div>

      {/* Boolean requirements */}
      <div className="mt-6 space-y-3">
        {[
          { key: "buildingReq", label: "Building Required" },
          { key: "activityReq", label: "Activity Required" },
          { key: "itemMaterialReq", label: "Item / Material Required" },
          { key: "remarkReq", label: "Remark Required" },
          { key: "workStatusReq", label: "Work Status Required" },
          { key: "itemDescription", label: "Item Description Required" },
          { key: "photoUrlReq", label: "Photo URL Required" },
          { key: "pdfUrlReq", label: "PDF URL Required" },
        ].map((field) => (
          <label key={field.key} className="flex items-center gap-2">
            <input
              type="checkbox"
              name={field.key}
              checked={!!form[field.key]}
              disabled={isViewMode}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <span className="text-gray-700">{field.label}</span>
          </label>
        ))}
      </div>

      {/* Submit */}
      {!isViewMode && (
        <div className="flex justify-end mt-8">
          <button
            onClick={handleSubmit}
            className={`rounded-md px-6 py-2 text-white transition ${
              form.name?.trim()
                ? "bg-[#305361] hover:bg-[#27464f] cursor-pointer"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            disabled={!form.name?.trim()}
          >
            {isEditMode ? "Update Checklist" : "Create Checklist"}
          </button>
        </div>
      )}
    </div>
  );
}

export default CreateNewChecklist;
