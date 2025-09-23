import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const [login, setLogin] = useState(false);
  const url = "http://myexpensetracker.info";

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!login) {
        const res = await axios.post(`${url}/signup`, formData);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        alert(res.data.message);
        navigate("/profile");
      } else {
        const res = await axios.post(`${url}/login`, formData);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        alert(res.data.message);
        navigate("/profile");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          {login ? "Log In" : "Sign Up"}
        </h2>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          {!login && (
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                name="name"
                onChange={handleChange}
                value={formData.name}
                id="name"
                type="text"
                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-200 focus:border-indigo-400"
                placeholder="Enter your name"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              name="email"
              onChange={handleChange}
              value={formData.email}
              id="email"
              type="email"
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-200 focus:border-indigo-400"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              name="password"
              onChange={handleChange}
              value={formData.password}
              id="password"
              type="password"
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-200 focus:border-indigo-400"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow hover:bg-indigo-700 transition"
          >
            {login ? "Log In" : "Sign Up"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => setLogin(!login)}
            className="text-sm text-indigo-600 hover:underline"
          >
            {login
              ? "Don't have an account? Sign Up"
              : "Already have an account? Log In"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
