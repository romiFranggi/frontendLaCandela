import React, { useState } from "react";
import { Footer, Navbar } from "../components";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import API_URL from "../config";
import "../css/checkout.css";

const Checkout = () => {
  const state = useSelector((state) => state.handleCart);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePurchase = async () => {
    setLoading(true);

    try {
      const cartItems = state.map((item) => ({
        ProductId: item.ProductId,
        title: item.Name,   
        quantity: Number(item.qty),
        unit_price: Number(item.Price),
        color: item.color,
      }));

      const userData = {
        email: localStorage.getItem("email"), 
      };

      const response = await axios.post(`${API_URL}/checkout`, {
        items: cartItems,
        user: userData,
      });

      const checkoutUrl = response.data.init_point;
      window.location.href = checkoutUrl;
    } catch (err) {
      console.error("Error al procesar la compra:", err);
      setError("Error al procesar la compra. Inténtalo más tarde.");
    } finally {
      setLoading(false);
    }
    localStorage.removeItem("cart");
  
  };

  const EmptyCart = () => (
    <div className="container">
      <div className="row">
        <div className="col-md-12 py-5 bg-light text-center">
          <h4 className="p-3 display-5">No hay productos en el carrito</h4>
          <Link to="/" className="btn btn-outline-dark mx-4">
            <i className="fa fa-arrow-left"></i> Continua Comprando
          </Link>
        </div>
      </div>
    </div>
  );

  const ShowCheckout = () => {
    let subtotal = 0;
    let totalItems = 0;
    state.forEach((item) => {
      subtotal += item.Price * item.qty;
      totalItems += item.qty;
    });

    return (
      <div className="container py-5" id="contenedor">
        <div className="row my-4">
          <div className="col-md-7 col-lg-8">
            <h4 className="mb-3">Pago</h4>
            <hr className="my-4" />
            {loading ? (
              <button className="w-100 btn btn-primary" disabled>
                Procesando...
              </button>
            ) : (
              <button className="w-100 btn btn-primary" onClick={handlePurchase}>
                Realizar Compra
              </button>
            )}
            {error && <p className="text-danger mt-3">{error}</p>}
          </div>
          <div className="col-md-5 col-lg-4">
            <div className="card mb-4">
              <div className="card-header py-3 bg-light">
                <h5 className="mb-0">Resumen de orden</h5>
              </div>
              <div className="card-body">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                    Productos ({totalItems})
                    <span>${Math.round(subtotal)}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 mb-3">
                    <div>
                      <strong>Precio Total</strong>
                    </div>
                    <span>
                      <strong>${Math.round(subtotal)}</strong>
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <h1 className="text-center">Checkout</h1>
        <hr />
        {state.length ? <ShowCheckout /> : <EmptyCart />}
      </div>
      <Footer />
    </>
  );
};

export default Checkout;
