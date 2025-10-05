import { useState, useEffect } from "react";
import axios from "axios";

const API = process.env.REACT_APP_BACKEND_URLL; // adjust if different

const Applications = () => {
  const [apps, setApps] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [form, setForm] = useState({
    title: "",
    companyId: "",
    location: "",
    status: "applied",
  });
  const [editingId, setEditingId] = useState(null);
  const [filters, setFilters] = useState({ status: "", q: "" });
  const [noteInputs, setNoteInputs] = useState({}); // track note input per app

  useEffect(() => {
    fetchApps();
    fetchCompanies();
  }, [filters]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
  };

  const fetchApps = async () => {
    try {
      const res = await axios.get(`${API}/applications`, {
        headers: getAuthHeaders(),
        params: filters,
      });
      setApps(res.data);
    } catch (err) {
      console.error("fetchApps", err);
      alert(err.response?.data?.message || "Error fetching applications");
    }
  };

  const fetchCompanies = async () => {
    try {
      const res = await axios.get(`${API}/companies`, {
        headers: getAuthHeaders(),
      });
      setCompanies(res.data);
    } catch (err) {
      console.error("fetchCompanies", err);
      alert("Error fetching companies");
    }
  };

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API}/applications/${editingId}`, form, {
          headers: getAuthHeaders(),
        });
        setEditingId(null);
      } else {
        await axios.post(`${API}/applications`, form, {
          headers: getAuthHeaders(),
        });
      }
      setForm({ title: "", companyId: "", location: "", status: "applied" });
      fetchApps();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error saving application");
    }
  };

  const handleEdit = (app) => {
    setEditingId(app.id);
    setForm({
      title: app.title || "",
      companyId: app.companyId || "",
      location: app.location || "",
      status: app.status || "applied",
    });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this application?")) return;
    try {
      await axios.delete(`${API}/applications/${id}`, {
        headers: getAuthHeaders(),
      });
      fetchApps();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  // ---------------- Notes ----------------
  const handleAddNote = async (appId) => {
    try {
      await axios.post(
        `${API}/applications/${appId}/notes`,
        { content: noteInputs[appId] },
        { headers: getAuthHeaders() }
      );
      setNoteInputs({ ...noteInputs, [appId]: "" });
      fetchApps();
    } catch (err) {
      console.error("addNote", err);
      alert("Error adding note");
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await axios.delete(`${API}/notes/${noteId}`, {
        headers: getAuthHeaders(),
      });
      fetchApps();
    } catch (err) {
      console.error("deleteNote", err);
      alert("Error deleting note");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Applications</h2>

      {/* 🔹 Filters Section */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by title/company/location"
          value={filters.q}
          onChange={(e) => setFilters({ ...filters, q: e.target.value })}
          className="px-3 py-2 border rounded-lg w-full sm:w-1/2 focus:ring focus:ring-indigo-200"
        />
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="px-3 py-2 border rounded-lg w-full sm:w-1/3 focus:ring focus:ring-indigo-200"
        >
          <option value="">All statuses</option>
          <option value="applied">Applied</option>
          <option value="phone">Phone</option>
          <option value="interview">Interview</option>
          <option value="offer">Offer</option>
          <option value="rejected">Rejected</option>
        </select>
        <button
          onClick={() => setFilters({ status: "", q: "" })}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium"
        >
          Clear Filters
        </button>
      </div>

      {/* Form for Add/Edit */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-wrap gap-3 mb-8 p-4 bg-gray-50 rounded-lg shadow"
      >
        <input
          name="title"
          placeholder="Job title"
          value={form.title}
          onChange={handleChange}
          required
          className="px-3 py-2 border rounded-lg w-full sm:w-1/3 focus:ring focus:ring-indigo-200"
        />
        <select
          name="companyId"
          value={form.companyId}
          onChange={handleChange}
          required
          className="px-3 py-2 border rounded-lg w-full sm:w-1/3 focus:ring focus:ring-indigo-200"
        >
          <option value="">-- Select Company --</option>
          {companies.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <input
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          className="px-3 py-2 border rounded-lg w-full sm:w-1/3 focus:ring focus:ring-indigo-200"
        />
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="px-3 py-2 border rounded-lg w-full sm:w-1/3 focus:ring focus:ring-indigo-200"
        >
          <option value="applied">Applied</option>
          <option value="phone">Phone</option>
          <option value="interview">Interview</option>
          <option value="offer">Offer</option>
          <option value="rejected">Rejected</option>
        </select>
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          {editingId ? "Update" : "Add"}
        </button>
      </form>

      {/* Applications List */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          Your applications
        </h3>
        {apps.map((app) => (
          <div
            key={app.id}
            className="border rounded-lg p-4 mb-4 shadow-sm bg-white"
          >
            <div className="flex justify-between items-center">
              <div>
                <strong className="text-indigo-700">{app.title}</strong> @{" "}
                <span className="font-medium">
                  {app.Company?.name || "Unknown"}
                </span>{" "}
                — <em className="text-sm text-gray-500">{app.status}</em>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(app)}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(app.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>

            {/* Notes Section */}
            <div className="mt-4">
              <h4 className="font-semibold text-gray-700 mb-2">Notes</h4>

              {/* Add note */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddNote(app.id);
                }}
                className="flex gap-2 mb-3"
              >
                <input
                  type="text"
                  placeholder="Add a note..."
                  value={noteInputs[app.id] || ""}
                  onChange={(e) =>
                    setNoteInputs({ ...noteInputs, [app.id]: e.target.value })
                  }
                  className="flex-1 px-3 py-2 border rounded-md focus:ring focus:ring-indigo-200"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Add
                </button>
              </form>

              {/* Notes list */}
              <ul className="space-y-2">
                {app.Notes?.map((note) => (
                  <li
                    key={note.id}
                    className="flex justify-between items-center bg-gray-50 border p-2 rounded"
                  >
                    <span>{note.content}</span>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="text-red-500 hover:underline text-sm"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Applications;
