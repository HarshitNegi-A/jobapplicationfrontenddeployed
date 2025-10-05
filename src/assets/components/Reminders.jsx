import { useState, useEffect } from "react";
import axios from "axios";

const API = import.meta.env.VITE_BACKEND_URLL; // ✅ corrected env variable

const Reminders = () => {
  const [reminders, setReminders] = useState([]);
  const [apps, setApps] = useState([]);
  const [form, setForm] = useState({
    applicationId: "",
    note: "",
    remindAt: "",
  });

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
  };

  // Fetch reminders
  const fetchReminders = async () => {
    try {
      const res = await axios.get(`${API}/reminders`, {
        headers: getAuthHeaders(),
      });
      setReminders(res.data);
    } catch (err) {
      console.error("fetchReminders", err);
      alert("Error fetching reminders");
    }
  };

  // Fetch applications
  const fetchApps = async () => {
    try {
      const res = await axios.get(`${API}/applications`, {
        headers: getAuthHeaders(),
      });
      setApps(res.data);
    } catch (err) {
      console.error("fetchApps", err);
      alert("Error fetching applications");
    }
  };

  useEffect(() => {
    fetchReminders();
    fetchApps();
  }, []);

  // Handle input change
  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // Submit reminder
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Frontend remindAt:", form.remindAt);
    console.log("Frontend ISO being sent:", new Date(form.remindAt).toISOString());
    if (!form.remindAt) {
      alert("Please select a date and time");
      return;
    }

    // ✅ Convert to ISO (UTC)
    const localDate = new Date(form.remindAt);
    if (isNaN(localDate.getTime())) {
      alert("Invalid date/time");
      return;
    }

    const isoDate = localDate.toISOString();

    try {
      await axios.post(
        `${API}/reminders`,
        { ...form, remindAt: isoDate },
        { headers: getAuthHeaders() }
      );

      alert("Reminder added successfully");
      setForm({ applicationId: "", note: "", remindAt: "" });
      fetchReminders();
    } catch (err) {
      console.error("createReminder", err);
      alert(err.response?.data?.message || "Error creating reminder");
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this reminder?")) return;
    try {
      await axios.delete(`${API}/reminders/${id}`, { headers: getAuthHeaders() });
      fetchReminders();
    } catch (err) {
      console.error("deleteReminder", err);
      alert("Delete failed");
    }
  };

  // Dismiss
  const handleDismiss = async (id) => {
    try {
      await axios.post(`${API}/reminders/${id}/dismiss`, {}, { headers: getAuthHeaders() });
      fetchReminders();
    } catch (err) {
      console.error("dismissReminder", err);
      alert("Dismiss failed");
    }
  };

  // Find app info
  const getAppInfo = (appId) => {
    const app = apps.find((a) => a.id === appId);
    if (!app) return { company: "Unknown Company", title: "Unknown Role" };
    return {
      company: app.Company?.name || app.company || "Unknown Company",
      title: app.title || "Unknown Role",
    };
  };

  // ✅ Format time safely
  const formatRemindAt = (dateStr) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "Invalid date";
    return d.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Reminders</h2>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow p-4 mb-6 flex flex-col gap-3"
      >
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Application</span>
          <select
            name="applicationId"
            value={form.applicationId}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-200"
          >
            <option value="">Select Application</option>
            {apps.map((app) => (
              <option key={app.id} value={app.id}>
                {app.Company?.name || app.company} — {app.title}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Remind at</span>
          <input
            type="datetime-local"
            name="remindAt"
            value={form.remindAt}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-200"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Note (optional)</span>
          <input
            type="text"
            name="note"
            placeholder="Reminder note"
            value={form.note}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-200"
          />
        </label>

        <div className="flex items-center gap-3 mt-1">
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Add Reminder
          </button>
          <button
            type="button"
            onClick={() => setForm({ applicationId: "", note: "", remindAt: "" })}
            className="px-3 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Reset
          </button>
        </div>
      </form>

      {/* Reminders list */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          Your Reminders
        </h3>
        {reminders.length === 0 && (
          <p className="text-sm text-gray-500">No reminders set</p>
        )}

        <div className="flex flex-col gap-4">
          {reminders.map((r) => {
            const appInfo = getAppInfo(r.applicationId);
            return (
              <div key={r.id} className="border rounded-lg p-4 bg-white shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-600">
                      <strong className="text-gray-800">Application:</strong>{" "}
                      <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-semibold px-2 py-1 rounded mr-2">
                        {appInfo.company}
                      </span>
                      {appInfo.title}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      <strong className="text-gray-800">Note:</strong>{" "}
                      {r.note || "—"}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      <strong className="text-gray-800">Remind At:</strong>{" "}
                      {formatRemindAt(r.remindAt)}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      <strong className="text-gray-800">Status:</strong>{" "}
                      {r.status}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => handleDelete(r.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                    >
                      Delete
                    </button>
                    {r.status === "pending" && (
                      <button
                        onClick={() => handleDismiss(r.id)}
                        className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
                      >
                        Dismiss
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Reminders;
