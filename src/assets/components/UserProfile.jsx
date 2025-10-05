import { useState, useEffect } from "react";
import axios from "axios";

const UserProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    careerGoal: "",
    phone: "",
    linkedin: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData(res.data);
      } catch (err) {
        console.error("Profile fetch error:", err);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/profile`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">My Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-200 focus:border-indigo-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            name="email"
            value={formData.email}
            readOnly
            className="mt-1 block w-full px-3 py-2 border rounded-md bg-gray-100 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-200 focus:border-indigo-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">LinkedIn</label>
          <input
            name="linkedin"
            value={formData.linkedin}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-200 focus:border-indigo-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Career Goal</label>
          <textarea
            name="careerGoal"
            value={formData.careerGoal}
            onChange={handleChange}
            rows="4"
            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-200 focus:border-indigo-400"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow hover:bg-indigo-700 transition"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default UserProfile;
