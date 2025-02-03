import React from 'react'
import { Footer, Navbar } from "../components";
import "../css/aboutUsPage.css";

const AboutPage = () => {
  return (
    <div className='aboutPageDiv'>
      <Navbar />
      <div className="container my-3 py-3">
        <h1 className="text-center">Sobre nosotros</h1>
        <hr />
        <p className="lead text-center">
          En La Candela, nos especializamos en ofrecer productos que transforman y ambientan tu hogar con un toque único de calidez y estilo. Nuestra tienda es el lugar ideal para encontrar velas, sahumerios, decoraciones y todo lo que necesitas para crear un ambiente acogedor, relajante y lleno de energía positiva.
          <br />
          Cada uno de nuestros productos está cuidadosamente seleccionado para garantizar calidad y originalidad, desde las velas aromáticas que llenan de fragancia tu espacio, hasta las decoraciones más delicadas que aportan ese toque especial que hace único a tu hogar.
          <br />
          En La Candela, nos apasiona ofrecer artículos que te ayuden a crear un ambiente donde puedas relajarte, disfrutar y sentirte en paz. Ya sea que estés buscando un regalo especial o simplemente desees embellecer tu hogar, en nuestra tienda encontrarás todo lo necesario para hacerlo.
          <br />
          Visítanos y descubre cómo nuestros productos pueden iluminar, perfumar y decorar tu vida de una manera única.
        </p>

        <h2 className="text-center py-4">Nuestros productos</h2>
        <div className="row justify-content-center">
          <div className="col-md-3 col-sm-6 mb-3 px-3">
            <div className="card h-100">
              <img className="card-img-top img-fluid" src="https://dinorank.com/img/dinobrain/136619/imagen04b9352040171770f4dd69238ab1c561.jpg" alt="" style={{ height: '220px', objectFit: 'cover' }} />
              <div className="card-body">
                <h5 className="card-title text-center">Velas</h5>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-6 mb-3 px-3">
            <div className="card h-100">
              <img className="card-img-top img-fluid" src="https://www.idos.com.uy/wp-content/uploads/2022/07/en-polvo.png" alt="" style={{ height: '220px', objectFit: 'cover' }} />
              <div className="card-body">
                <h5 className="card-title text-center">Sahumerios</h5>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-6 mb-3 px-3">
            <div className="card h-100">
              <img className="card-img-top img-fluid" src="https://divinosyesos.cl/wp-content/uploads/2024/05/figuras-de-yesospintadas-e1715313913435.jpg" alt="" style={{ height: '220px', objectFit: 'cover' }} />
              <div className="card-body">
                <h5 className="card-title text-center">Decoraciones</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default AboutPage;
