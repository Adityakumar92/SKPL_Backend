import React from "react";
import {
  MdOutlineKeyboardDoubleArrowLeft,
  MdOutlineKeyboardDoubleArrowRight,
  MdMenu,
} from "react-icons/md";
import { useNavigate } from "react-router-dom"; // for redirect after logout
import { useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';

function Navbar({
  sideBarToggle,
  setSideBarToggle,
  mobileSidebarOpen,
  setMobileSidebarOpen,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    // Remove token from localStorage
    // localStorage.removeItem("token");

    // (Optional) remove any stored user info
    // localStorage.removeItem("user");

    dispatch(logout());

    // Redirect to login page
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-between">
      {/* Left - Toggle Sidebar */}
      <div className="flex items-center gap-3">
        {/* Mobile Sidebar Toggle */}
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="md:hidden text-gray-700 hover:bg-gray-200 p-2 rounded-full transition"
          aria-label="Open Mobile Sidebar"
        >
          <MdMenu size={26} />
        </button>

        {/* Desktop Sidebar Toggle */}
        <button
          onClick={() => setSideBarToggle((prev) => !prev)}
          className="hidden md:inline text-gray-700 hover:bg-gray-200 p-2 rounded-full transition"
          aria-label="Toggle Desktop Sidebar"
        >
          {sideBarToggle ? (
            <MdOutlineKeyboardDoubleArrowLeft size={26} />
          ) : (
            <MdOutlineKeyboardDoubleArrowRight size={26} />
          )}
        </button>

        <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>
  );
}

export default Navbar;
