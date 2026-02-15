import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/authService";

const Login = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const decodeRole = (token: string) => {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return (
      payload[
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
      ] || payload.role
    );
  };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const data = await login(username, password);

            if (!data?.token) {
            throw new Error("Token not found");
            }

            localStorage.setItem("token", data.token);

            const role = decodeRole(data.token);

            // 🔥 ROUTE FINAL
            if (role === "Admin") {
            navigate("/admin/dashboard");
            } else {
            navigate("/user/dashboard");
            }

        } catch (err: any) {
            setError(err.message || "Username or Password incorrect");
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
                <h5 className="mb-0">Room Booking Login</h5>
              </div>

              <div className="card-body">

                {error && (
                  <div className="alert alert-danger text-center py-2">
                    {error}
                  </div>
                )}

                <form onSubmit={handleLogin}>

                  <div className="mb-3">
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

                  <div className="mb-4">
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

                  <button
                    type="submit"
                    className="btn w-100 fw-semibold"
                    disabled={loading}
                    style={{
                      backgroundColor: "#ffbf1d",
                      color: "#5e4b00",
                    }}
                  >
                    {loading ? "Loading..." : "Login"}
                  </button>

                </form>
              </div>

              <div className="text-center mb-3">
                <small>
                  Don't have an account?{" "}
                  <Link to="/register" className="text-primary fw-semibold">
                    Register
                  </Link>
                </small>
              </div>

              <div className="card-footer text-center small text-muted">
                © 2026 PENS Room Booking
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
