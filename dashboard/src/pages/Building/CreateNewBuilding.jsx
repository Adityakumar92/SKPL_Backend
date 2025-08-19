import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../axiosInstance";
import { toast } from "react-toastify";

function CreateNewBuilding() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const buildingToEdit = state?.buildingToEdit;
  const buildingToView = state?.buildingToView;

  const isEditMode = !!buildingToEdit;
  const isViewMode = !!buildingToView;

  const [form, setForm] = useState({
    building: "",
    floor: "",
    location: "",
    site_id: "",
  });

  const [sites, setSites] = useState([]);

  // Fetch sites for dropdown
  useEffect(() => {
    const fetchSites = async () => {
      try {
        const res = await axios.get("/api/site");
        setSites(res.data);
      } catch (err) {
        console.error("Error fetching sites:", err);
      }
    };
    fetchSites();
  }, []);

  // Load data for edit/view mode
  useEffect(() => {
    if (isEditMode) {
      setForm({
        building: buildingToEdit.building || "",
        floor: buildingToEdit.floor || "",
        location: buildingToEdit.location || "",
        site_id: buildingToEdit.site_id || "",
      });
    } else if (isViewMode) {
      setForm({
        building: buildingToView.building || "",
        floor: buildingToView.floor || "",
        location: buildingToView.location || "",
        site_id: buildingToView.site_id || "",
      });
    }
  }, [isEditMode, isViewMode, buildingToEdit, buildingToView]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (isEditMode) {
        await axios.put(`/api/building/${buildingToEdit._id}`, form);
        toast.success("Building updated successfully ✅");
      } else {
        await axios.post("/api/building", form);
        toast.success("Building created successfully 🎉");
      }
      navigate("/build/all");
    } catch (err) {
      console.error("Error saving building:", err);
      toast.error("Something went wrong ❌");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow-md">
      <h1 className="font-bold text-center text-2xl text-[#305361]">
        {isEditMode
          ? "Edit Building"
          : isViewMode
          ? "View Building"
          : "Create New Building"}
      </h1>

      {/* Building Name */}
      <div className="mt-6">
        <label className="font-medium block mb-1">Building Name</label>
        <input
          name="building"
          disabled={isViewMode}
          placeholder="Enter building name"
          value={form.building}
          onChange={handleChange}
          className="border border-gray-300 w-full rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-[#305361] disabled:bg-gray-100"
        />
      </div>

      {/* Floor */}
      <div className="mt-4">
        <label className="font-medium block mb-1">Floor</label>
        <input
          type="number"
          name="floor"
          disabled={isViewMode}
          placeholder="Enter number of floors"
          value={form.floor}
          onChange={handleChange}
          className="border border-gray-300 w-full rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-[#305361] disabled:bg-gray-100"
        />
      </div>

      {/* Location */}
      <div className="mt-4">
        <label className="font-medium block mb-1">Location</label>
        <input
          name="location"
          disabled={isViewMode}
          placeholder="Enter location"
          value={form.location}
          onChange={handleChange}
          className="border border-gray-300 w-full rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-[#305361] disabled:bg-gray-100"
        />
      </div>

      {/* Site Dropdown */}
      <div className="mt-4">
        <label className="font-medium block mb-1">Site</label>
        <select
          name="site_id"
          disabled={isViewMode}
          value={form.site_id}
          onChange={handleChange}
          className="border border-gray-300 w-full rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-[#305361] disabled:bg-gray-100"
        >
          <option value="">Select Site</option>
          {sites.map((s) => (
            <option key={s._id} value={s._id}>
              {s.site}
            </option>
          ))}
        </select>
      </div>

      {/* Submit */}
      {!isViewMode && (
        <div className="flex justify-end mt-8">
          <button
            disabled={
              !form.building?.trim() ||
              !form.floor ||
              !form.location?.trim() ||
              !form.site_id
            }
            onClick={handleSubmit}
            className={`rounded-md px-6 py-2 text-white transition ${
              form.building?.trim() &&
              form.floor &&
              form.location?.trim() &&
              form.site_id
                ? "bg-[#305361] hover:bg-[#27464f] cursor-pointer"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {isEditMode ? "Update Building" : "Create Building"}
          </button>
        </div>
      )}
    </div>
  );
}

export default CreateNewBuilding;
