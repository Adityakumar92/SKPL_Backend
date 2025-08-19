import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  MdDashboard,
  MdInfo,
  MdContactMail,
  MdManageAccounts,
  MdSend,
  MdBusiness,
  MdApartment,
  MdInventory,
  MdEventNote
} from "react-icons/md";
import { FaChevronDown, FaChevronUp, FaUsersCog } from "react-icons/fa";
import { HiOutlineClipboardList } from "react-icons/hi";
import { useSelector } from "react-redux";

function Sidebar({ isExpanded }) {
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const { roleAndPermission, isAuthChecked } = useSelector(
    (state) => state.auth
  );

  // Wait until auth is checked to prevent flash of unauthorized
  if (!isAuthChecked) {
    return <div>Loading...</div>;
  }

  const toggleSubMenu = (name) => {
    setOpenSubMenu(openSubMenu === name ? null : name);
  };

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: MdDashboard, view: roleAndPermission["dashboard"] },
    { name: "Submission", path: "/submission", icon: MdSend, view: roleAndPermission["submission"] },
  ];

  const managementsItems = [
    {
      name: "Role Management",
      icon: MdManageAccounts,
      subItems: [
        { name: "Create New Role", path: "/roles/create", view: roleAndPermission["roleManagement"] },
        { name: "Show All Roles", path: "/roles/all", view: roleAndPermission["roleManagement"] },
      ],
      view: roleAndPermission["roleManagement"]
    },
    {
      name: "Backend User Management",
      icon: FaUsersCog,
      subItems: [
        { name: "Create New Backend User", path: "/backendusers/create", view: roleAndPermission["backendUserManagement"] },
        { name: "Show All Backend Users", path: "/backendusers/all", view: roleAndPermission["backendUserManagement"] },
      ],
      view: roleAndPermission["backendUserManagement"]
    },
    {
      name: "User Management",
      icon: FaUsersCog,
      subItems: [
        { name: "Create New User", path: "/users/create", view: roleAndPermission["userManagement"] },
        { name: "Show All Users", path: "/users/all", view: roleAndPermission["userManagement"] },
      ],
      view: roleAndPermission["userManagement"]
    },
    {
      name: "Site Management",
      icon: MdBusiness,
      subItems: [
        { name: "Create New Site", path: "/site/create", view: roleAndPermission["siteManagement"] },
        { name: "Show All Sites", path: "/site/all", view: roleAndPermission["siteManagement"] },
      ],
      view: roleAndPermission["siteManagement"]
    },
    {
      name: "Building Management",
      icon: MdApartment,
      subItems: [
        { name: "Create New building", path: "/build/create", view: roleAndPermission["buildingManagement"] },
        { name: "Show All Buildings", path: "/build/all", view: roleAndPermission["buildingManagement"] },
      ],
      view: roleAndPermission["buildingManagement"]
    },
    {
      name: "Checklist Management",
      icon: HiOutlineClipboardList,
      subItems: [
        { name: "Create New Checklist", path: "/checklist/create", view: roleAndPermission["checklistManagement"] },
        { name: "Show All Checklists", path: "/checklist/all", view: roleAndPermission["checklistManagement"] },
      ],
      view: roleAndPermission["checklistManagement"]
    },
    {
      name: "Activity Management",
      icon: MdEventNote,
      subItems: [
        { name: "Create New Activity", path: "/activity/create", view: roleAndPermission["activityManagement"] },
        { name: "Show All Activity", path: "/activity/all", view: roleAndPermission["activityManagement"] },
      ],
      view: roleAndPermission["activityManagement"]
    },
    {
      name: "Items/Material Management",
      icon: MdInventory,
      subItems: [
        { name: "Create New Items/Material", path: "/items_Material/create", view: roleAndPermission["itemsMaterialManagement"] },
        { name: "Show All Items/Material", path: "/items_Material/all", view: roleAndPermission["itemsMaterialManagement"] },
      ],
      view: roleAndPermission["itemsMaterialManagement"]
    },
    {
      name: "About",
      icon: MdInfo,
      subItems: [
        { name: "View About", path: "/about", view: roleAndPermission["about"] },
        { name: "Edit About", path: "/about/edit", view: roleAndPermission["about"] },
      ],
      view: roleAndPermission["about"]
    },
    {
      name: "Contact",
      icon: MdContactMail,
      subItems: [
        { name: "View Contact", path: "/contact", view: roleAndPermission["contact"] },
        { name: "Edit Contact", path: "/contact/edit", view: roleAndPermission["contact"] },
      ],
      view: roleAndPermission["contact"]
    },
  ];

  return (
    <div className="space-y-4">
      {/* Sidebar Brand */}
      <h2 className={`text-xl font-bold px-3 py-2 ${isExpanded ? "" : "hidden md:block"}`}>
        {isExpanded ? "SKPL" : ""}
      </h2>

      {/* Main Menu */}
      <ul className="space-y-1">
        {/* Top level */}
        {menuItems
          .filter(item => (item.view !== 'NA' || item.view === true)) // Only show if parent allowed
          .map(({ name, path, icon: Icon }) => (
            <li key={path}>
              <NavLink
                to={path}
                title={!isExpanded ? name : ""}
                className={({ isActive }) =>
                  `w-full flex items-center transition-colors ${isExpanded
                    ? "justify-start px-3 py-2 rounded-md"
                    : "justify-center w-10 h-10 rounded-full"
                  } ${isActive
                    ? "bg-[#3a5a63] text-white"
                    : "hover:bg-[#3a5a63] text-gray-100"
                  }`
                }
              >
                <div className="w-6 h-6 flex items-center justify-center">
                  <Icon size={24} />
                </div>
                {isExpanded && <span className="ml-3">{name}</span>}
              </NavLink>
            </li>
          ))
        }

        {/* Management items */}
        {managementsItems
          .filter(item => item.view !== 'NA') // Parent must be allowed
          .map(item => (
            <li key={item.name}>
              <button
                onClick={() => toggleSubMenu(item.name)}
                className={`w-full flex items-center transition-colors ${isExpanded
                    ? "justify-start px-3 py-2 rounded-md"
                    : "justify-center w-10 h-10 rounded-full"
                  } hover:bg-[#3a5a63] text-gray-100`}
              >
                <div className="w-6 h-6 flex items-center justify-center">
                  <item.icon size={24} />
                </div>
                {isExpanded && (
                  <>
                    <span className="ml-3 flex-1 text-left">{item.name}</span>
                    {openSubMenu === item.name ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
                  </>
                )}
              </button>

              {openSubMenu === item.name && isExpanded && (
                <ul className="ml-8 mt-1 space-y-1">
                  {item.subItems
                    .filter(sub => {
                      if (sub.view === 'NA') return false; // No access at all
                      if (sub.path.includes("/create") && sub.view === "view") return false; // View-only can't create
                      return true; // Otherwise show
                    })
                    .map(sub => (
                      <li key={sub.path}>
                        <NavLink
                          to={sub.path}
                          className={({ isActive }) =>
                            `block px-2 py-1 rounded hover:bg-[#3a5a63] ${isActive
                              ? "bg-[#3a5a63] text-white"
                              : "text-gray-100"
                            }`
                          }
                        >
                          {sub.name}
                        </NavLink>
                      </li>
                    ))}
                </ul>
              )}
            </li>
          ))
        }
      </ul>
    </div>
  );
}

export default Sidebar;



























// import React, { useState } from "react";
// import { NavLink } from "react-router-dom";
// import {
//   MdDashboard,
//   MdChecklist,
//   MdInfo,
//   MdContactMail,
//   MdSettings,
//   MdManageAccounts,
// } from "react-icons/md";
// import { FaChevronDown, FaChevronUp } from "react-icons/fa";
// import { FaUsersCog } from "react-icons/fa";
// import { HiOutlineClipboardList } from "react-icons/hi";


// function Sidebar({ isExpanded }) {
//   const [managementsOpen, setManagementsOpen] = useState(false);

//   const menuItems = [
//     { name: "Dashboard", path: "/dashboard", icon: MdDashboard },
//     { name: "Checklist", path: "/checklist", icon: MdChecklist },
//     { name: "About", path: "/about", icon: MdInfo },
//     { name: "Contact", path: "/contact", icon: MdContactMail },
//     { name: "Setting", path: "/setting", icon: MdSettings },
//   ];

//   const managementsItems = [
//     { name: "Role Management", path: "/roles", icon: MdManageAccounts },
//     { name: "User Management", path: "/users", icon: FaUsersCog },
//     { name: "Checklist Management", path: "/checklist", icon: HiOutlineClipboardList },
//   ];

//   return (
//     <div className="space-y-4">
//       {/* Sidebar Brand */}
//       <h2 className={`text-xl font-bold px-3 py-2 ${isExpanded ? "" : "hidden md:block"}`}>
//         {isExpanded ? "SKPL" : ""}
//       </h2>

//       {/* Main Menu */}
//       <ul className="space-y-1">
//         {menuItems.map(({ name, path, icon: Icon }) => (
//           <li key={path}>
//             <NavLink
//               to={path}
//               title={!isExpanded ? name : ""}
//               className={({ isActive }) =>
//                 `w-full flex items-center transition-colors ${isExpanded
//                   ? "justify-start px-3 py-2 rounded-md"
//                   : "justify-center w-10 h-10 rounded-full"
//                 } ${isActive ? "bg-[#3a5a63] text-white" : "hover:bg-[#3a5a63] text-gray-100"}`
//               }
//             >
//               <div className="w-6 h-6 flex items-center justify-center">
//                 <Icon size={24} />
//               </div>
//               {isExpanded && <span className="ml-3">{name}</span>}
//             </NavLink>
//           </li>
//         ))}

//         <li>
//           <button
//             onClick={() => setManagementsOpen(!managementsOpen)}
//             className={`w-full flex items-center transition-colors ${isExpanded
//               ? "justify-start px-3 py-2 rounded-md"
//               : "justify-center w-10 h-10 rounded-full"
//               } hover:bg-[#3a5a63] text-gray-100`}
//           >
//             <div className="w-6 h-6 flex items-center justify-center">
//               <MdManageAccounts size={24} />
//             </div>
//             {isExpanded && (
//               <>
//                 <span className="ml-3 flex-1 text-left">Managements</span>
//                 {managementsOpen ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
//               </>
//             )}
//           </button>

//           {/* Submenu */}
//           {managementsOpen && isExpanded && (
//             <ul className="ml-8 mt-1 space-y-1">
//               {managementsItems.map((item) => (
//                 <li key={item.path}>
//                   <NavLink
//                     to={item.path}
//                     className={({ isActive }) =>
//                       `flex items-center gap-2 px-2 py-1 rounded hover:bg-[#3a5a63]
//              ${isActive ? "bg-[#3a5a63] text-white" : "text-gray-100"}`
//                     }
//                   >
//                     <item.icon className="text-lg" />
//                     {item.name}
//                   </NavLink>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </li>
//       </ul>
//     </div>
//   );
// }

// export default Sidebar;