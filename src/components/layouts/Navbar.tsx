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
        return "Bookings";
      case "/user/history":
        return "History";
      case "/profile":
        return "My Profile";
      default:
        return "Dashboard";
    }
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  return (
    <nav className="navbar navbar-expand navbar-light bg-white shadow-sm px-4">
      <span className="navbar-brand mb-0 h5 fw-bold">
        {getTitle()}
      </span>

      <div className="ms-auto">
        <button
        className="btn border-0 rounded-circle d-flex align-items-center justify-content-center"
        onClick={handleProfileClick}
        style={{
            width: "40px",
            height: "40px",
            backgroundColor: "#fff3cd", 
        }}
        >
        <i
            className="bi bi-person-fill"
            style={{ color: "#b8860b", fontSize: "18px" }} 
        ></i>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;