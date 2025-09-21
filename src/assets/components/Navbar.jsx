import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-indigo-600 text-white px-6 py-3 flex items-center justify-between shadow-md">
      {/* Left side links */}
      <div className="flex space-x-6">
        <Link
          to="/home"
          className="hover:text-indigo-200 font-medium transition-colors"
        >
          Home
        </Link>
        <Link
          to="/dash"
          className="hover:text-indigo-200 font-medium transition-colors"
        >
          Dashboard
        </Link>
        <Link
          to="/profile"
          className="hover:text-indigo-200 font-medium transition-colors"
        >
          Profile
        </Link>
        <Link
          to="/applications"
          className="hover:text-indigo-200 font-medium transition-colors"
        >
          Applications
        </Link>
        <Link
          to="/reminders"
          className="hover:text-indigo-200 font-medium transition-colors"
        >
          Reminders
        </Link>
        <Link
          to="/companies"
          className="hover:text-indigo-200 font-medium transition-colors"
        >
          Companies
        </Link>
        {!token && (
          <Link
            to="/"
            className="hover:text-indigo-200 font-medium transition-colors"
          >
            SignUp
          </Link>
        )}
      </div>

      {/* Right side logout */}
      {token && (
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          Logout
        </button>
      )}
    </nav>
  );
};

export default Navbar;
