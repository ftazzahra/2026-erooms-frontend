import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getTitle = () => {
    switch (location.pathname) {
      case "/admin/dashboard":
        return "Dashboard";

      case "/admin/rooms":
        return "Rooms";

      case "/admin/bookings":
        return "Bookings";

      case "/admin/history":
        return "History";

      case "/user/dashboard":
        return "User Dashboard";

      case "/user/bookings":
        return "My Bookings";

      default:
        return "Dashboard";
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  return (
    <nav className="navbar navbar-expand navbar-light bg-white shadow-sm px-4">
      <span className="navbar-brand mb-0 h5 fw-bold">
        {getTitle()}
      </span>

      <div className="ms-auto">
        <button
          className="btn btn-outline-warning fw-semibold"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
