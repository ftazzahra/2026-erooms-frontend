import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Password does not match");
      return;
    }

    setLoading(true);

    try {
      await axios.post("http://localhost:5006/api/auth/register", {
        username,
        password,
      });

      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="vh-100 d-flex align-items-center"
      style={{
        background: "linear-gradient(150deg, #000000, #639ad4)",
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5 col-lg-4">
            <div className="card shadow-lg border-0 rounded-4">

              <div
                className="card-header text-center text-white rounded-top-4"
                style={{ backgroundColor: "#133aa7" }}
              >
                <h5 className="mb-0">Create Account</h5>
              </div>

              <div className="card-body">

                {error && (
                  <div className="alert alert-danger text-center py-2">
                    {error}
                  </div>
                )}

                <form onSubmit={handleRegister}>

                  <div className="mb-1">
                    <label className="form-label fw-semibold">
                      Username
                    </label>
                    <input
                      type="text"
                      className="form-control rounded-3"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3 mt-3">
                    <label className="form-label fw-semibold">
                      Password
                    </label>
                    <input
                        type="password"
                        className="form-control rounded-3"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-semibold">
                      Confirm Password
                    </label>
                    <input
                        type="password"
                        className="form-control rounded-3"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn w-100 fw-semibold"
                    disabled={loading}
                    style={{
                      backgroundColor: "#ffbf1d",
                      color: "#5e4b00",
                    }}
                  >
                    {loading ? "Registering..." : "Register"}
                  </button>

                </form>
              </div>

              <div className="text-center">
                <small>
                  Already have an account?{" "}
                  <Link to="/login" className="text-primary fw-semibold">
                    Login
                  </Link>
                </small>
              </div>

              <div className="card-footer text-center small text-muted mt-3">
                © 2026 PENS Room Booking
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
