import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layouts/DashboardLayout";

interface UserProfile {
  username: string;
}

const Profile = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const baseUrl = "http://localhost:5006";

  // Ambil profile dari backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(`${baseUrl}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Unauthorized");

        const data: UserProfile = await response.json();
        setUsername(data.username);
      } catch (err) {
        console.error(err);
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    fetchProfile();
  }, [navigate]);

  // Update profile
  const handleSave = async () => {
    if (!username.trim()) {
      alert("Username tidak boleh kosong");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await fetch(`${baseUrl}/api/users/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: username,
          password: password || null,
        }),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      setPassword("");
      alert("Profile berhasil diperbarui");
    } catch (err) {
      console.error(err);
      alert("Gagal update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="container mt-4 d-flex justify-content-center">
        <div
          className="card shadow"
          style={{ maxWidth: "550px", width: "100%" }}
        >
          {/* Header */}
          <div
            className="card-header text-white fw-semibold"
            style={{ backgroundColor: "#0b3a82" }}
          >
            User Profile
          </div>

          {/* Body */}
          <div className="card-body p-4">
            {/* Username */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Username</label>
              <input
                type="text"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {/* Password */}
            <div className="mb-3">
              <label className="form-label fw-semibold">
                New Password (Optional)
              </label>
              <input
                type="password"
                className="form-control"
                placeholder="Kosongkan jika tidak ingin ganti password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Buttons */}
            <div className="d-flex justify-content-between mt-4">
              <button
                className="btn btn-primary px-4"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
