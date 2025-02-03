import React from "react";
import imagenCustom from "../imgs/imgHomeOption3.webp";
import "../css/home.css";

const Home = () => {
  return (
    <div className="hero border-1 pb-3">
      <div className="card bg-dark text-white border-0 mx-5">
        <img
          className="card-img img-fluid"
          src={imagenCustom}
          alt="Card"
        />
        <div className="card-img-overlay d-flex align-items-center overlay">
          <div className="container p-3 content">
            <h5 className="card-title fs-1 fw-bold title">Bienvenido {localStorage.userName}</h5>
            <p className="card-text fs-5 d-none d-sm-block subtitle">
              Velas, sahumerios, decoraciones, y mucho más. Todo lo que necesites para ambientar tu hogar de la mejor manera.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
