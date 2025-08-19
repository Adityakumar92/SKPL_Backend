import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../axiosInstance";
import { toast } from "react-toastify";

function CreateNewBackendUser() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const userToEdit = state?.userToEdit;
  const userToView = state?.userToView;

  const isEditMode = !!userToEdit;
  const isViewMode = !!userToView;

  const [roles, setRoles] = useState([]);
  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    role_id: "",
  });

  useEffect(() => {
    // fetch all roles
    axios
      .get("/api/role")
      .then((res) => setRoles(res.data))
      .catch((err) => console.error("Error fetching roles:", err));

    if (isEditMode) {
      setForm({
        username: userToEdit.username || "",
        email: userToEdit.email || "",
        phone: userToEdit.phone || "",
        role_id: userToEdit.roleAndPermission?._id || "",
        password:"",
      });
    } else if (isViewMode) {
      setForm({
        username: userToView.username || "",
        email: userToView.email || "",
        phone: userToView.phone || "",
        role_id: userToView.roleAndPermission?._id || "",
        password:"",
      });
    }
  }, [isEditMode, isViewMode, userToEdit, userToView]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (isEditMode) {
        await axios.patch(`/api/user/${userToEdit._id}`, form);
        toast.success("User updated successfully ✅");
      } else {
        await axios.post("/api/user", form);
        toast.success("User created successfully 🎉");
      }
      navigate("/users/all");
    } catch (err) {
      console.error("Error saving user:", err);
      toast.error("Something went wrong ❌");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow-md">
      <h1 className="font-bold text-center text-2xl text-[#305361]">
        {isEditMode
          ? "Edit User"
          : isViewMode
          ? "View User"
          : "Create New User"}
      </h1>

      {/* Username */}
      <div className="mt-6">
        <label className="font-medium block mb-1">Username</label>
        <input
          name="username"
          disabled={isViewMode}
          placeholder="Enter username"
          value={form.username}
          onChange={handleChange}
          className="border border-gray-300 w-full rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-[#305361] disabled:bg-gray-100"
        />
      </div>

      {/* Email */}
      <div className="mt-4">
        <label className="font-medium block mb-1">Email</label>
        <input
          name="email"
          type="email"
          disabled={isViewMode}
          placeholder="Enter email"
          value={form.email}
          onChange={handleChange}
          className="border border-gray-300 w-full rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-[#305361] disabled:bg-gray-100"
        />
      </div>

      {/* Phone */}
      <div className="mt-4">
        <label className="font-medium block mb-1">Phone</label>
        <input
          name="phone"
          disabled={isViewMode}
          placeholder="Enter phone"
          value={form.phone}
          onChange={handleChange}
          className="border border-gray-300 w-full rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-[#305361] disabled:bg-gray-100"
        />
      </div>

      {/* Password (create only) */}
      {!isViewMode && (
        <div className="mt-4">
          <label className="font-medium block mb-1">Password</label>
          <input
            name="password"
            type="password"
            placeholder="Enter password"
            value={form.password}
            onChange={handleChange}
            className="border border-gray-300 w-full rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-[#305361]"
          />
        </div>
      )}

      {/* Role */}
      <div className="mt-4">
        <label className="font-medium block mb-1">Role</label>
        <select
          name="role_id"
          disabled={isViewMode}
          value={form.role_id}
          onChange={handleChange}
          className="border border-gray-300 w-full rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-[#305361] disabled:bg-gray-100"
        >
          <option value="">Select a role</option>
          {roles.map((role) => (
            <option key={role._id} value={role._id}>
              {role.role}
            </option>
          ))}
        </select>
      </div>

      {/* Submit */}
      {!isViewMode && (
        <div className="flex justify-end mt-8">
          <button
            disabled={
              !form.username?.trim() ||
              !form.email?.trim() ||
              (!isEditMode && !form.password?.trim()) ||
              !form.role_id
            }
            onClick={handleSubmit}
            className={`rounded-md px-6 py-2 text-white transition ${
              form.username?.trim() &&
              form.email?.trim() &&
              (isEditMode || form.password?.trim()) &&
              form.role_id
                ? "bg-[#305361] hover:bg-[#27464f] cursor-pointer"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {isEditMode ? "Update User" : "Create User"}
          </button>
        </div>
      )}
    </div>
  );
}

export default CreateNewBackendUser;