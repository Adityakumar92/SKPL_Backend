import React, { useEffect, useState } from "react";
import axios from "../../axiosInstance";
import { FaEye, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import DataTable from "react-data-table-component";
import { useSelector } from "react-redux";

function Submission() {
  const [submissions, setSubmissions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const { roleAndPermission, isAuthChecked } = useSelector(
      (state) => state.auth
    );
    if (!isAuthChecked) {
      return <div>Loading...</div>;
    }

  // Filter states
  const [filterStatus, setFilterStatus] = useState("");
  const [filterActivity, setFilterActivity] = useState("");
  const [filterItem, setFilterItem] = useState("");
  const [filterUser, setFilterUser] = useState("");
  const [filterBuilding, setFilterBuilding] = useState("");

  // Filter option lists
  const [activities, setActivities] = useState([]);
  const [items, setItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [buildings, setBuildings] = useState([]);

  // ✅ Fetch all submissions
  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/input");
      setSubmissions(res.data.userInputs || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch submissions");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch filter options
  const fetchFilters = async () => {
    try {
      const [act, bld, itm, usr] = await Promise.all([
        axios.get("/api/activity"),
        axios.get("/api/building"),
        axios.get("/api/item"),
        axios.get("/api/user"),
      ]);
      setActivities(act.data.activities || []);
      setBuildings(bld.data.buildings || []);
      setItems(itm.data.items || []);
      setUsers(usr.data || []);
    } catch (error) {
      toast.error("Failed to load filter options");
    }
  };

  useEffect(() => {
    fetchSubmissions();
    fetchFilters();
  }, []);

  // ✅ Update status
  const handleStatusChange = async (id, status) => {
    try {
      await axios.patch(`/api/input/${id}`, { status });
      toast.success(`Status updated to ${status}`);
      fetchSubmissions();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  // ✅ Open modal
  const handleView = (submission) => {
    setSelected(submission);
    setModalOpen(true);
  };

  // ✅ Table columns
  // const columns = [
  //   {
  //     name: "#",
  //     selector: (row, index) => index + 1,
  //     width: "60px",
  //   },
  //   {
  //     name: "User",
  //     selector: (row) => row.user_id?.username || "-",
  //     sortable: true,
  //   },
  //   {
  //     name: "Building",
  //     selector: (row) => row.building_id?.building || "-",
  //     sortable: true,
  //   },
  //   {
  //     name: "Activity",
  //     selector: (row) => row.activity_id?.activity || "-",
  //     sortable: true,
  //   },
  //   {
  //     name: "Item",
  //     selector: (row) => row.item_id?.item || "-",
  //     sortable: true,
  //   },
  //   {
  //     name: "Status",
  //     cell: (row) =>
  //       row.status === "Approved" ? (
  //         <FaCheckCircle color="green" />
  //       ) : row.status === "Reject" ? (
  //         <FaTimesCircle color="red" />
  //       ) : (
  //         row.status
  //       ),
  //     sortable: true,
  //   },
  //   {
  //     name: "Details",
  //     cell: (row) => (
  //       <button onClick={() => handleView(row)} className="text-blue-600">
  //         <FaEye />
  //       </button>
  //     ),
  //   },
  //   {name: "Actions",
  //     cell: (row) => {
  //       return(
  //       <>
  //         <button
  //           onClick={() => handleStatusChange(row._id, "Approved")}
  //           className="bg-green-500 text-white px-2 py-1 rounded mr-2"
  //         >
  //           <FaCheckCircle />
  //         </button>
  //         <button
  //           onClick={() => handleStatusChange(row._id, "Reject")}
  //           className="bg-red-500 text-white px-2 py-1 rounded"
  //         >
  //           <FaTimesCircle />
  //         </button>
  //       </>
  //     )},
  //   },
  // ];/
  const columns = [
  {
    name: "#",
    selector: (row, index) => index + 1,
    width: "60px",
  },
  {
    name: "User",
    selector: (row) => row.user_id?.username || "-",
    sortable: true,
  },
  {
    name: "Building",
    selector: (row) => row.building_id?.building || "-",
    sortable: true,
  },
  {
    name: "Activity",
    selector: (row) => row.activity_id?.activity || "-",
    sortable: true,
  },
  {
    name: "Item",
    selector: (row) => row.item_id?.item || "-",
    sortable: true,
  },
  {
    name: "Status",
    cell: (row) =>
      row.status === "Approved" ? (
        <FaCheckCircle color="green" />
      ) : row.status === "Reject" ? (
        <FaTimesCircle color="red" />
      ) : (
        row.status
      ),
    sortable: true,
  },
  {
    name: "Details",
    cell: (row) => (
      <button onClick={() => handleView(row)} className="text-blue-600">
        <FaEye />
      </button>
    ),
  },
];

// ✅ Only add "Actions" column if permission is edit or all
if (["edit", "all"].includes(roleAndPermission?.submission?.toLowerCase())) {
  columns.push({
    name: "Actions",
    cell: (row) => (
      <>
        <button
          onClick={() => handleStatusChange(row._id, "Approved")}
          className="bg-green-500 text-white px-2 py-1 rounded mr-2"
        >
          <FaCheckCircle />
        </button>
        <button
          onClick={() => handleStatusChange(row._id, "Reject")}
          className="bg-red-500 text-white px-2 py-1 rounded"
        >
          <FaTimesCircle />
        </button>
      </>
    ),
  });
}


  // ✅ Apply all filters
  const filteredData = submissions.filter((sub) => {
    return (
      (!filterStatus || sub.status === filterStatus) &&
      (!filterActivity || sub.activity_id?._id === filterActivity) &&
      (!filterItem || sub.item_id?._id === filterItem) &&
      (!filterUser || sub.user_id?._id === filterUser) &&
      (!filterBuilding || sub.building_id?._id === filterBuilding)
    );
  });

  return (
    <div className="bg-white p-4 rounded shadow">
      <h1 className="text-xl font-semibold mb-4">All Submissions</h1>

      {/* Filter Dropdowns */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="border p-1 rounded">
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Reject">Reject</option>
        </select>

        <select value={filterActivity} onChange={(e) => setFilterActivity(e.target.value)} className="border p-1 rounded">
          <option value="">All Activities</option>
          {activities.map((act) => (
            <option key={act._id} value={act._id}>
              {act.activity}
            </option>
          ))}
        </select>

        <select value={filterItem} onChange={(e) => setFilterItem(e.target.value)} className="border p-1 rounded">
          <option value="">All Items</option>
          {items.map((itm) => (
            <option key={itm._id} value={itm._id}>
              {itm.item}
            </option>
          ))}
        </select>

        <select value={filterUser} onChange={(e) => setFilterUser(e.target.value)} className="border p-1 rounded">
          <option value="">All Users</option>
          {users.map((usr) => (
            <option key={usr._id} value={usr._id}>
              {usr.username}
            </option>
          ))}
        </select>

        <select value={filterBuilding} onChange={(e) => setFilterBuilding(e.target.value)} className="border p-1 rounded">
          <option value="">All Buildings</option>
          {buildings.map((bld) => (
            <option key={bld._id} value={bld._id}>
              {bld.building}
            </option>
          ))}
        </select>
      </div>

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={filteredData}
        pagination
        highlightOnHover
        striped
        progressPending={loading}
        persistTableHead
      />

      {/* Modal */}
      {modalOpen && selected && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 relative">
            <h2 className="text-lg font-semibold mb-4">Submission Details</h2>
            <p><strong>User:</strong> {selected.user_id?.username || "-"}</p>
            <p><strong>Building:</strong> {selected.building_id?.building || "-"}</p>
            <p><strong>Activity:</strong> {selected.activity_id?.activity || "-"}</p>
            <p><strong>Item:</strong> {selected.item_id?.item || "-"}</p>
            <p><strong>Description:</strong> {selected.item_description || "-"}</p>
            <p><strong>Remark:</strong> {selected.remark || "-"}</p>
            <p><strong>Work Status:</strong> {selected.work_status || "-"}</p>
            <p><strong>Status:</strong> {selected.status || "-"}</p>

            {selected.photo_url && (
              <div className="mt-2">
                <img src={selected.photo_url} alt="submission" className="w-full h-auto border" />
              </div>
            )}

            {selected.pdf && (
              <div className="mt-2">
                <a href={selected.pdf} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                  View PDF
                </a>
              </div>
            )}

            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Submission;
