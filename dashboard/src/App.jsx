import { Navigate, Outlet, useLocation } from "react-router-dom";
import Navbar from "./component/Navbar";
import Sidebar from "./component/Sidebar";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loadUserFromStorage } from "./redux/authSlice";

function App() {
  const [sideBarToggle, setSideBarToggle] = useState(true); // desktop sidebar
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false); // mobile sidebar
  const location = useLocation();
  const dispatch = useDispatch();

  const { token, isAuthChecked } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(loadUserFromStorage());
  }, [dispatch]);

  // Auto-close mobile sidebar when route changes
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (mobileSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [mobileSidebarOpen]);

  // Show loading screen until auth check is done
  if (!isAuthChecked) {
    return <div>Loading...</div>;
  }

  // Redirect after loading finishes
  if (!token) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header className="bg-white shadow p-4">
        <Navbar
          sideBarToggle={sideBarToggle}
          setSideBarToggle={setSideBarToggle}
          mobileSidebarOpen={mobileSidebarOpen}
          setMobileSidebarOpen={setMobileSidebarOpen}
        />
      </header>

      {/* Main Layout */}
      <div className="flex flex-1">
        {/* Mobile Sidebar */}
        <aside
          className={`fixed top-0 left-0 z-40 h-full w-64 bg-[#2d424a] text-white p-4 transform transition-transform duration-300 ease-in-out md:hidden
          ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <Sidebar isExpanded={true} />
        </aside>

        {/* Overlay for mobile */}
        {mobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-black opacity-40 z-30 md:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}

        {/* Desktop Sidebar */}
        <aside
          className={`hidden md:block bg-[#2d424a] text-white p-4 transition-all duration-300 overflow-y-auto ${sideBarToggle ? "w-[250px]" : "w-[60px]"
            }`}
        >
          <Sidebar isExpanded={sideBarToggle} />
        </aside>

        {/* Page Content */}
        <main className="flex-1 bg-gray-100 p-4 md:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default App;