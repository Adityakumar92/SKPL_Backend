import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../axiosInstance";
import { toast } from "react-toastify";

function CreateNewSite() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const siteToEdit = state?.siteToEdit;
  const siteToView = state?.siteToView;

  const isEditMode = !!siteToEdit;
  const isViewMode = !!siteToView;

  const [form, setForm] = useState({
    site: "",
  });

  useEffect(() => {
    if (isEditMode) {
      setForm({ site: siteToEdit.site || "" });
    } else if (isViewMode) {
      setForm({ site: siteToView.site || "" });
    }
  }, [isEditMode, isViewMode, siteToEdit, siteToView]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (isEditMode) {
        await axios.put(`/api/site/${siteToEdit._id}`, form);
        toast.success("Site updated successfully ✅");
      } else {
        await axios.post("/api/site", form);
        toast.success("Site created successfully 🎉");
      }
      navigate("/site/all");
    } catch (err) {
      console.error("Error saving site:", err);
      toast.error("Something went wrong ❌");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow-md">
      <h1 className="font-bold text-center text-2xl text-[#305361]">
        {isEditMode
          ? "Edit Site"
          : isViewMode
          ? "View Site"
          : "Create New Site"}
      </h1>

      {/* Site Name */}
      <div className="mt-6">
        <label className="font-medium block mb-1">Site Name</label>
        <input
          name="site"
          disabled={isViewMode}
          placeholder="Enter site name"
          value={form.site}
          onChange={handleChange}
          className="border border-gray-300 w-full rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-[#305361] disabled:bg-gray-100"
        />
      </div>

      {/* Submit */}
      {!isViewMode && (
        <div className="flex justify-end mt-8">
          <button
            disabled={!form.site?.trim()}
            onClick={handleSubmit}
            className={`rounded-md px-6 py-2 text-white transition ${
              form.site?.trim()
                ? "bg-[#305361] hover:bg-[#27464f] cursor-pointer"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {isEditMode ? "Update Site" : "Create Site"}
          </button>
        </div>
      )}
    </div>
  );
}

export default CreateNewSite;
