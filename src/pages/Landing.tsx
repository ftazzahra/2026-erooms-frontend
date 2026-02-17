import { useNavigate } from "react-router-dom";
import roomImage from "../assets/img_landing.png";

const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="vh-100 d-flex align-items-center bg-dark text-white">
      <div className="container">
        <div className="row align-items-center">

          <div className="col-lg-6 text-center text-lg-start mb-4 mb-lg-0">
            <h1 className="display-4 fw-bold">
              Book Rooms <br />
              <span className="text-primary">Smart & Easy</span>
            </h1>

            <p className="lead mt-3">
              Sistem Peminjaman Ruangan Kampus yang memudahkan mahasiswa dan
              staff dalam melakukan reservasi ruangan secara cepat dan efisien.
            </p>
            <button
              className="btn btn-outline-warning btn-lg mt-3"
              onClick={() => navigate("/login")}
            >
              Get Started
            </button>
          </div>

          <div className="col-lg-6 text-center">
            <img src={roomImage} alt="Landing" className="img-fluid" />
          </div>

        </div>
      </div>
    </section>
  );
};

export default Landing;
