import React, { useEffect, useState } from "react";
import { Sidebar, Navbar } from "../components";
import API_URL from "../config";
import axios from "axios";
import toast from "react-hot-toast";
import emailjs from "@emailjs/browser";
import Spinner from '../components/Spinner.jsx';

export const Orders = () => {
  const [pedidos, setPedidos] = useState([]);
  const [filteredPedidos, setFilteredPedidos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedPedido, setExpandedPedido] = useState(null);
  const [estadoFiltro, setEstadoFiltro] = useState("");
  const [productoDetalles, setProductoDetalles] = useState({});

  useEffect(() => {
    const getPedidos = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/orders`);
        const pedidosConEstado = response.data.map((pedido) => ({
          ...pedido,
          ListoDeshabilitar: false,
          EntregadoDeshabilitar: false,
        }));
        setPedidos(pedidosConEstado);
        setFilteredPedidos(pedidosConEstado);
      } catch (error) {
        console.error("Error al cargar los pedidos", error);
        toast.error("Hubo un error al cargar los pedidos.");
      } finally {
        setLoading(false);
      }
    };

    getPedidos();
  }, []);

  useEffect(() => {
    const cargarDetallesProductos = async () => {
      for (const pedido of pedidos) {
        for (const producto of pedido.products) {
          if (!productoDetalles[producto.ProductId]) {
            const detalles = await ObtenerDatosProducto(producto.ProductId);

            if (detalles) {
              setProductoDetalles((prev) => ({
                ...prev,
                [producto.ProductId]: detalles,
              }));
            }
          }
        }
      }
    };

    if (pedidos.length > 0) {
      cargarDetallesProductos();
    }
  }, [pedidos, productoDetalles]);

  const handleFiltroCambio = (e) => {
    const filtro = e.target.value;
    setEstadoFiltro(filtro);

    if (filtro === "") {
      setFilteredPedidos(pedidos);
    } else {
      setFilteredPedidos(pedidos.filter((pedido) => pedido.Status === filtro));
    }
  };

  const CambiarEstado = async (id, nuevoEstado) => {
    const confirmacion = window.confirm(`¿Estás seguro que quieres cambiar el estado a '${nuevoEstado}'?`);

    if (confirmacion) {
      try {
        const response = await axios.put(`${API_URL}/orders/${id}`, { Status: nuevoEstado });

        if (response.status === 200) {
          toast.success(`Estado cambiado a '${nuevoEstado}'`);

          setPedidos((prevPedidos) =>
            prevPedidos.map((pedido) =>
              pedido.OrderId === id
                ? { ...pedido, Status: nuevoEstado }
                : pedido
            )
          );

          setFilteredPedidos((prevPedidos) =>
            prevPedidos.map((pedido) =>
              pedido.OrderId === id
                ? { ...pedido, Status: nuevoEstado }
                : pedido
            )
          );

          if (nuevoEstado === "Listo para entregar") {
            const { UserEmail } = response.data;

            if (!UserEmail) {
              console.error("Correo electrónico no encontrado en la respuesta.");
              return;
            }

            const serviceID = "service_ghsaj1i";
            const templateID = "template_li0bc01";
            const userID = "emxX7VUerELw595yb";

            const templateParams = {
              to_email: UserEmail,
              order_id: id,
              status: nuevoEstado,
            };

            emailjs.send(serviceID, templateID, templateParams, userID).catch((error) => {
              console.error("Error al enviar el correo:", error);
            });
          }
        } else {
          toast.error("No se pudo cambiar el estado del pedido.");
        }
      } catch (error) {
        console.error("Error al cambiar el estado del pedido", error);
        toast.error("No se pudo cambiar el estado del pedido.");
      }
    }
  };


  const ObtenerDatosProducto = async (ProductId) => {
    try {
      const response = await axios.get(`${API_URL}/productos/${ProductId}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener los datos del producto", error);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div>
      <Navbar />
      <Sidebar />

      <div className="provider-table-container" style={{ margin: "0 auto", width: "90%" }}>
        <div className="d-flex justify-content-center">
          <div className="table-responsive" style={{ width: "100%" }}>
            <label htmlFor="estadoFiltro" style={{ marginRight: "10px" }}>Filtrar por estado:</label>
            <select
              id="estadoFiltro"
              value={estadoFiltro}
              onChange={handleFiltroCambio}
              style={{ padding: "5px" }}>
              <option value="">Todos</option>
              <option value="En preparación">En preparación</option>
              <option value="Listo para entregar">Listo para entregar</option>
              <option value="Entregado">Entregado</option>
            </select>
         
          <table className="table table-striped table-hover" style={{ width: "100%" }}>
            <thead className="table-dark">
              <tr>
                <th>Cliente</th>
                <th>Email</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Detalles</th>
                <th>Listo para entregar</th>
                <th>Entregado</th>
              </tr>
            </thead>
            <tbody>
              {filteredPedidos.map((pedido) => (
                <React.Fragment key={pedido.OrderId}>
                  <tr>
                    <td>{pedido.UserName}</td>
                    <td>{pedido.UserEmail}</td>
                    <td>{new Date(pedido.OrderDate).toLocaleDateString("es-UY")}</td>
                    <td>${pedido.Total}</td>
                    <td>{pedido.Status}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-info"
                        onClick={() =>
                          setExpandedPedido(expandedPedido === pedido.OrderId ? null : pedido.OrderId)
                        }>
                        {expandedPedido === pedido.OrderId ? "Ocultar detalles" : "Ver detalles"}
                      </button>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => CambiarEstado(pedido.OrderId, "Listo para entregar")}
                        disabled={pedido.Status !== "En preparación"}
                        style={pedido.Status !== "En preparación" ? { backgroundColor: "#d3d3d3", borderColor: "#d3d3d3", color: "#808080", cursor: "not-allowed" } : {}}>
                        Listo para entregar
                      </button>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-success"
                        onClick={() => CambiarEstado(pedido.OrderId, "Entregado")}
                        disabled={pedido.Status !== "Listo para entregar"}
                        style={pedido.Status !== "Listo para entregar" ? { backgroundColor: "#d3d3d3", borderColor: "#d3d3d3", color: "#808080", cursor: "not-allowed" } : {}}>
                        Entregado
                      </button>
                    </td>
                  </tr>
                  {expandedPedido === pedido.OrderId && (
                    <tr>
                      <td colSpan="8" style={{ paddingLeft: "20px", backgroundColor: "#f9f9f9" }}>
                        <h4>Productos del Pedido</h4>
                        {pedido.products && pedido.products.length > 0 ? (
                          <table className="table table-sm table-bordered mt-2">
                            <thead className="table-light">
                              <tr>
                                <th>Producto</th>
                                <th>Cantidad</th>
                                <th>Medidas</th>
                                <th>Peso</th>
                                <th>Volumen</th>
                                <th>Precio</th>
                                <th>Color</th>
                                <th>Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              {pedido.products.map((producto, index) => (
                                <tr key={`${pedido.OrderId}-${producto.ProductId}-${index}`}>
                                  <td>{producto.ProductName}</td>
                                  <td>{producto.Quantity}</td>
                                  <td>
                                    {productoDetalles[producto.ProductId]
                                      ? `${productoDetalles[producto.ProductId].Base || ''} x ${productoDetalles[producto.ProductId].Height || ''}`.trim().replace(/^ x | x $/, '')
                                      : "Cargando..."}
                                  </td>
                                  <td>
                                    {productoDetalles[producto.ProductId]
                                      ? productoDetalles[producto.ProductId].Weight || "-"
                                      : "Cargando..."}
                                  </td>
                                  <td>
                                    {productoDetalles[producto.ProductId]
                                      ? productoDetalles[producto.ProductId].Volume || "-"
                                      : "Cargando..."}
                                  </td>
                                  <td>${producto.Price}</td>
                                  <td>
                                    {productoDetalles[producto.ProductId]
                                      ? productoDetalles[producto.ProductId].Color || "Sin especificar"
                                      : "Cargando..."}
                                  </td>
                                  <td>${producto.Quantity * producto.Price}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <p>No hay productos en este pedido.</p>
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    </div >
  );
};

export default Orders;
