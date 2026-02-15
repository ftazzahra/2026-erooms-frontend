import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  return (
    <nav className="navbar navbar-expand navbar-light bg-white shadow-sm px-4">
      <span className="navbar-brand mb-0 h5">Dashboard</span>

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
