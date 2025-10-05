import { useState, useEffect } from "react";
import axios from "axios";

const API = import.meta.env.VITE_BACKEND_URLL;

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [form, setForm] = useState({
    name: "",
    website: "",
    industry: "",
    location: "",
    careersPage: "",
    contactEmail: "",
  });
  const [editingId, setEditingId] = useState(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
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

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API}/companies/${editingId}`, form, {
          headers: getAuthHeaders(),
        });
        setEditingId(null);
      } else {
        await axios.post(`${API}/companies`, form, {
          headers: getAuthHeaders(),
        });
      }
      setForm({
        name: "",
        website: "",
        industry: "",
        location: "",
        careersPage: "",
        contactEmail: "",
      });
      fetchCompanies();
    } catch (err) {
      console.error("saveCompany", err);
      alert("Error saving company");
    }
  };

  const handleEdit = (c) => {
    setEditingId(c.id);
    setForm({
      name: c.name || "",
      website: c.website || "",
      industry: c.industry || "",
      location: c.location || "",
      careersPage: c.careersPage || "",
      contactEmail: c.contactEmail || "",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this company?")) return;
    try {
      await axios.delete(`${API}/companies/${id}`, {
        headers: getAuthHeaders(),
      });
      fetchCompanies();
    } catch (err) {
      console.error("deleteCompany", err);
      alert("Delete failed");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Companies</h2>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-wrap gap-3 mb-8 p-4 bg-gray-50 rounded-lg shadow"
      >
        <input
          name="name"
          placeholder="Company name"
          value={form.name}
          onChange={handleChange}
          required
          className="px-3 py-2 border rounded-lg w-full sm:w-1/2 focus:ring focus:ring-indigo-200"
        />
        <input
          name="website"
          placeholder="Website"
          value={form.website}
          onChange={handleChange}
          className="px-3 py-2 border rounded-lg w-full sm:w-1/2 focus:ring focus:ring-indigo-200"
        />
        <input
          name="industry"
          placeholder="Industry"
          value={form.industry}
          onChange={handleChange}
          className="px-3 py-2 border rounded-lg w-full sm:w-1/2 focus:ring focus:ring-indigo-200"
        />
        <input
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          className="px-3 py-2 border rounded-lg w-full sm:w-1/2 focus:ring focus:ring-indigo-200"
        />
        <input
          name="careersPage"
          placeholder="Careers Page"
          value={form.careersPage}
          onChange={handleChange}
          className="px-3 py-2 border rounded-lg w-full sm:w-1/2 focus:ring focus:ring-indigo-200"
        />
        <input
          name="contactEmail"
          placeholder="Contact Email"
          value={form.contactEmail}
          onChange={handleChange}
          className="px-3 py-2 border rounded-lg w-full sm:w-1/2 focus:ring focus:ring-indigo-200"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          {editingId ? "Update" : "Add"} Company
        </button>
      </form>

      {/* Companies List */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          Your Companies
        </h3>
        {companies.map((c) => (
          <div
            key={c.id}
            className="border rounded-lg p-4 mb-4 shadow-sm bg-white"
          >
            <strong className="text-indigo-700">{c.name}</strong> —{" "}
            <span className="text-gray-600">{c.industry || "N/A"}</span>
            <br />
            📍 <span className="text-gray-700">{c.location || "Unknown"}</span>
            <br />
            {c.website && (
              <div>
                🌐{" "}
                <a
                  href={c.website}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Website
                </a>
              </div>
            )}
            {c.careersPage && (
              <div>
                💼{" "}
                <a
                  href={c.careersPage}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Careers Page
                </a>
              </div>
            )}
            {c.contactEmail && (
              <div>
                ✉️{" "}
                <a
                  href={`mailto:${c.contactEmail}`}
                  className="text-blue-600 hover:underline"
                >
                  {c.contactEmail}
                </a>
              </div>
            )}

            <div className="mt-3 flex gap-2">
              <button
                onClick={() => handleEdit(c)}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(c.id)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Companies;
