import React from "react";
import { Footer, Navbar } from "../components";
import { useSelector, useDispatch } from "react-redux";
import { addCart, delCart } from "../redux/action";
import { Link } from "react-router-dom";
import "../css/cartPage.css";

const Cart = () => {
  const state = useSelector((state) => state.handleCart);
  const dispatch = useDispatch();

  const EmptyCart = () => {
    return (
      <div className="container">
        <div className="row">
          <div className="card col-md-12 py-5 bg-light text-center">
            <h4 className="p-3 display-5">Tu carrito está vacío</h4>
            <div className="d-flex justify-content-center">
              <Link to="/" className="btn btn-outline-dark mx-5 w-50">
                <i className="fa fa-arrow-left"></i> Continuar comprando
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const addItem = (product) => {
    dispatch(addCart(product));
  };

  const removeItem = (product) => {
    dispatch(delCart(product));
  };

  let isOverStock = false;

  const ShowCart = () => {
    let subtotal = 0;
    let totalItems = 0;

    // Calcular subtotal y total de artículos
    state.forEach((item) => {
      subtotal += item.Price * item.qty;
      totalItems += item.qty;

      if (item.qty > item.Quantity) {
        isOverStock = true;
      }
    });

    return (
      <>
        <section className="h-100 gradient-custom">
          <div className="container py-5">
            <div className="row d-flex justify-content-center my-4">
              <div className="col-md-8">
                <div className="card mb-4">
                  <div className="card-header py-3">
                    <h5 className="mb-0">Lista de productos</h5>
                  </div>
                  <div className="card-body">
                    {state.map((item, index) => (
                      <div key={`${item.ProductId}-${index}`}>
                        <div className="row d-flex align-items-center">
                          <div className="col-lg-3 col-md-12">
                            <img
                              src={item.ImageUrl}
                              alt={item.Name}
                              width={100}
                              height={75}
                            />
                          </div>
                          <div className="col-lg-5 col-md-6">
                            <p>
                              <strong>{item.Name}</strong>
                            </p>
                            <p>Color: {item.Color || "No especificado"}</p>
                          </div>
                          <div className="col-lg-4 col-md-6">
                            <div className="d-flex align-items-center justify-content-center">
                              <button
                                className="btn px-3"
                                onClick={() => removeItem(item)}
                              >
                                <i className="fas fa-minus"></i>
                              </button>
                              <p className="mx-3 mb-0">{item.qty}</p>
                              <button
                                className="btn px-3"
                                onClick={() => addItem(item)}
                              >
                                <i className="fas fa-plus"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                        <hr className="my-4" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Resumen del carrito */}
              <div className="col-md-4">
                <div className="card mb-4">
                  <div className="card-header py-3 bg-light">
                    <h5 className="mb-0">Resumen de compra</h5>
                  </div>
                  <div className="card-body">
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                        Productos ({totalItems})
                        <span>${Math.round(subtotal)}</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 mb-3">
                        <div>
                          <strong>Total</strong>
                        </div>
                        <span>
                          <strong>${Math.round(subtotal)}</strong>
                        </span>
                      </li>
                    </ul>
                    <Link
                      to="/checkout"
                      className={`btn btn-lg btn-block ${
                        isOverStock ? "btn-secondary disabled" : "btn-dark"
                      }`}
                      onClick={(e) => {
                        if (isOverStock) e.preventDefault();
                      }}
                    >
                      Ir a pagar
                    </Link>
                    {isOverStock && (
                      <p className="text-danger mt-2">
                        La cantidad seleccionada excede el stock disponible.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  };

  return (
    <div className="cartPageDiv">
      <Navbar />
      <div className="container my-5 py-5">
        <h1 className="text-center">Carrito</h1>
        <hr />
        {state.length > 0 ? <ShowCart /> : <EmptyCart />}
      </div>
      <div className="my-5 py-4"></div>
      <Footer />
    </div>
  );
};

export default Cart;
