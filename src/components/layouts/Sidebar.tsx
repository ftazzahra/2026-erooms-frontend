import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import logo from "../../assets/logo.png";

interface Props {
  role: "Admin" | "User";
}

const Sidebar = ({ role }: Props) => {
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState("");

  // Prefix path sesuai role
  const prefix = role === "Admin" ? "/admin" : "/user";

  const isActive = (path: string) =>
    location.pathname.startsWith(path) ? "active" : "";

  const menuItems = [
    {
      name: "Dashboard",
      path: `${prefix}/dashboard`,
      icon: "bi-house-door",
    },
    {
      name: "Rooms",
      path: `${prefix}/rooms`,
      icon: "bi-door-open",
    },
    {
      name: "Bookings",
      path: `${prefix}/bookings`,
      icon: "bi-calendar-check",
    },
    {
      name: "History",
      path: `${prefix}/history`,
      icon: "bi-clock-history",
    },
  ];

  // ===== FILTER SEARCH =====
  const filteredMenus = menuItems.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className="d-flex flex-column p-3 bg-white border-end"
      style={{
        width: collapsed ? "85px" : "260px",
        minHeight: "100vh",
        transition: "0.3s",
      }}
    >
      {/* ===== Brand + Toggle ===== */}
      <div className="d-flex align-items-center mb-4 justify-content-between">
        
        <div className="d-flex align-items-center">
          <img
            src={logo}
            alt="eRooms Logo"
            style={{
              width: "42px",
              height: "42px",
              objectFit: "contain",
            }}
            className="me-2"
          />

          {!collapsed && (
            <span className="fs-5 fw-bold">erooms</span>
          )}
        </div>

        <i
          className="bi bi-list fs-4 text-primary"
          role="button"
          onClick={() => setCollapsed(!collapsed)}
        ></i>
      </div>

      {/* ===== Search ===== */}
      {!collapsed && (
        <div className="mb-4">
          <div className="input-group">
            <span className="input-group-text bg-light border-0">
              <i className="bi bi-search text-muted"></i>
            </span>

            <input
              type="text"
              className="form-control bg-light border-0"
              placeholder="Search menu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* ===== Menu ===== */}
      <ul className="nav nav-pills flex-column mb-auto">

        {filteredMenus.length === 0 && !collapsed && (
          <span className="text-muted small px-2">
            Menu tidak ditemukan
          </span>
        )}

        {filteredMenus.map((item) => (
          <li key={item.name} className="nav-item mb-1">
            <Link
              to={item.path}
              className={`nav-link d-flex align-items-center ${isActive(item.path)}`}
            >
              <i className={`bi ${item.icon} fs-5`}></i>

              {!collapsed && (
                <span className="ms-2">{item.name}</span>
              )}
            </Link>
          </li>
        ))}

      </ul>
    </div>
  );
};

export default Sidebar;
