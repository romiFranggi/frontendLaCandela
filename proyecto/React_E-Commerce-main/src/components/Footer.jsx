import React from "react";
import "../css/footer.css";
import "bootstrap/dist/css/bootstrap.min.css";

const Footer = () => {

  return (
    <>
      <footer className="footer">
        <div className="container">
          <div className="row">
            {/* Red Social: Instagram */}
            <div className="col-md-4">
              <h5>Instagram</h5>
              <a
                href="https://www.instagram.com/candelavelas.uy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white social-link"
              >
                <i className="fab fa-instagram fa-2x"></i> Síguenos en Instagram
              </a>
            </div>

            {/* Red Social: Facebook */}
            <div className="col-md-4">
              <h5>Facebook</h5>
              <a
                href="https://www.facebook.com/lacandela.velas.7/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white social-link"
              >
                <i className="fab fa-facebook fa-2x"></i> Nuestro Facebook
              </a>
            </div>

            {/* Ubicación */}
            <div className="col-md-4">
              <h5>Ubicación</h5>
              <address>
                Ejido 1433 BIS, 11800 Montevideo, Montevideo
              </address>
              <a
                href="https://www.google.com/maps/place/La+Candela/@-34.9040565,-56.1871435,15z/data=!4m6!3m5!1s0x959f8162fae0c33d:0xd6ab6e121b365528!8m2!3d-34.9040565!4d-56.1871435!16s%2Fg%2F11j2_vdjk9?entry=ttu&g_ep=EgoyMDI0MTEwNi4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="text-map"
              >
                Ver en el mapa
              </a>
            </div>
          </div>

          {/* Footer de Derechos */}
          <div className="text-center mt-3">
            <small>© 2024 La Candela. Todos los derechos reservados.</small>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
