import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../axiosInstance";
import { toast } from "react-toastify";

function CreateNewRole() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const roleToEdit = state?.roleToEdit;
  const roleToView = state?.roleToView;

  const isEditMode = !!roleToEdit;
  const isViewMode = !!roleToView;

  const [form, setForm] = useState({
    role: "",
    dashboard: false,
    submission: "NA",
    about:"NA",
    contact:"NA",
    siteManagement: "NA",
    buildingManagement: "NA",
    roleManagement: "NA",
    backendUserManagement: "NA",
    userManagement: "NA",
    checklistManagement: "NA",
    activityManagement: "NA",
    itemsMaterialManagement: "NA",
  });

  const itemsSections = [
    { key: "submission", label: "Submission" },
    { key: "about", label: "About" },
    { key: "contact", label: "Contact" },
  ];

  const managementSections = [
    { key: "siteManagement", label: "Site Management" },
    { key: "buildingManagement", label: "Building Management" },
    { key: "roleManagement", label: "Role Management" },
    { key: "backendUserManagement", label: "Backend User Management" },
    { key: "userManagement", label: "User Management" },
    { key: "checklistManagement", label: "Checklist Management" },
    { key: "activityManagement", label: "Activity Management" },
    { key: "itemsMaterialManagement", label: "Items & Material Management" },
  ];

  useEffect(() => {
    if (isEditMode) {
      setForm({ ...roleToEdit });
    } else if (isViewMode) {
      setForm({ ...roleToView });
    }
  }, [isEditMode, roleToEdit, isViewMode, roleToView]);

  const handleRoleChange = (e) =>
    setForm((prev) => ({ ...prev, role: e.target.value }));

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: checked }));
  };

  const handleRadioChange = (section, value) => {
    setForm((prev) => ({ ...prev, [section]: value }));
  };

  const hasAtLeastOnePermission =
    form.dashboard ||
    form.submission ||
    managementSections.some((sec) => form[sec.key] !== "NA");

  const handleSubmit = async () => {
    try {
      if (isEditMode) {
        await axios.patch(`/api/role/${roleToEdit._id}`, form);
        toast.success("Role updated successfully ✅");
      } else {
        await axios.post("/api/role", form);
        toast.success("Role created successfully 🎉");
      }
      navigate("/roles/all");
    } catch (err) {
      console.error("Error saving role:", err);
      toast.error("Something went wrong ❌");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow-md">
      {/* Title */}
      <h1 className="font-bold text-center text-2xl text-[#305361]">
        {isEditMode
          ? "Edit Role"
          : isViewMode
          ? "View Role"
          : "Create New Role"}
      </h1>

      {/* Role Name */}
      <div className="mt-6">
        <label className="font-medium block mb-1">Role Name</label>
        <input
          name="role"
          disabled={isViewMode}
          placeholder="Enter role name"
          value={form.role}
          onChange={handleRoleChange}
          className="border border-gray-300 w-full rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-[#305361] disabled:bg-gray-100"
        />
      </div>

      {/* Dashboard */}
      <div className="mt-8">
        <h3 className="font-semibold text-lg text-gray-700">Dashboard</h3>
        <label className="flex items-center gap-2 ml-4 mt-2">
          <input
            type="checkbox"
            disabled={isViewMode}
            name="dashboard"
            checked={form.dashboard}
            onChange={handleCheckboxChange}
            className="w-4 h-4"
          />
          <span>Dashboard Access</span>
        </label>
      </div>

      {/* Submission */}
      <div className="mt-8 space-y-6">
        {itemsSections.map((section) => (
          <div key={section.key}>
            <h3 className="font-semibold text-lg text-gray-700">
              {section.label}
            </h3>
            <div className="flex flex-wrap gap-4 ml-4 mt-2">
              {["view", "edit", "NA"].map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-2 capitalize"
                >
                  <input
                    type="radio"
                    name={section.key}
                    value={option}
                    disabled={isViewMode}
                    checked={form[section.key] === option}
                    onChange={() => handleRadioChange(section.key, option)}
                    className="w-4 h-4"
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Management Sections */}
      <div className="mt-8 space-y-6">
        {managementSections.map((section) => (
          <div key={section.key}>
            <h3 className="font-semibold text-lg text-gray-700">
              {section.label}
            </h3>
            <div className="flex flex-wrap gap-4 ml-4 mt-2">
              {["view", "edit", "all", "NA"].map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-2 capitalize"
                >
                  <input
                    type="radio"
                    name={section.key}
                    value={option}
                    disabled={isViewMode}
                    checked={form[section.key] === option}
                    onChange={() => handleRadioChange(section.key, option)}
                    className="w-4 h-4"
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Submit */}
      {!isViewMode && (
        <div className="flex justify-end mt-8">
          <button
            disabled={!form.role?.trim() || !hasAtLeastOnePermission}
            onClick={handleSubmit}
            className={`rounded-md px-6 py-2 text-white transition ${
              form.role?.trim() && hasAtLeastOnePermission
                ? "bg-[#305361] hover:bg-[#27464f] cursor-pointer"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {isEditMode ? "Update Role" : "Create Role"}
          </button>
        </div>
      )}
    </div>
  );
}

export default CreateNewRole;
