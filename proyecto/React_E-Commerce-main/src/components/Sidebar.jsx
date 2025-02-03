import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../css/sidebar.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaList, FaPlus, FaTruck, FaUserPlus, FaFileAlt, FaChartBar, FaUser } from "react-icons/fa";

const Sidebar = () => {
  const location = useLocation();
  const isDashboardPage = location.pathname === "/dashboard";


  const [collapsed, setCollapsed] = useState(!isDashboardPage);


  useEffect(() => {
    if (isDashboardPage) {
      setCollapsed(false);
    } else {
      setCollapsed(true);
    }
  }, [location, isDashboardPage]);


  const handleButtonClick = (link) => {
    if (!isDashboardPage) {
      setCollapsed(true);
    }
    setTimeout(() => {
      window.location.href = link;
    }, 50);
  };

  return (
    <div className="d-flex flex-column min-vh-50">

      {!collapsed && isDashboardPage && (
        <div className="d-flex flex-column align-items-center justify-content-center flex-grow-1">
          <h2 className="dashboard-title mb-4">Bienvenido al Dashboard</h2>
        </div>
      )}


      <div
        className={`dashboard-buttons d-flex flex-wrap justify-content-center gap-4 ${collapsed ? 'collapsed' : ''}`}>
        <button
          className="btn btn-primary d-flex flex-column align-items-center p-4 shadow"
          onClick={() => handleButtonClick("/listaProductos")}>
          <FaList size={50} className="mb-2" />
          <span>Lista de productos</span>
        </button>
        <button
          className="btn btn-success d-flex flex-column align-items-center p-4 shadow"
          onClick={() => handleButtonClick("/agregarProducto")}>
          <FaPlus size={50} className="mb-2" />
          <span>Agregar producto</span>
        </button>
        <button
          className="btn btn-warning d-flex flex-column align-items-center p-4 shadow"
          onClick={() => handleButtonClick("/listaProveedores")}>
          <FaTruck size={50} className="mb-2" />
          <span>Lista de proveedores</span>
        </button>
        <button
          className="btn btn-danger d-flex flex-column align-items-center p-4 shadow"
          onClick={() => handleButtonClick("/agregarProveedor")}>
          <FaUserPlus size={50} className="mb-2" />
          <span>Agregar proveedor</span>
        </button>
        <button
          className="btn btn-dark d-flex flex-column align-items-center p-4 shadow"
          onClick={() => handleButtonClick("/ordenes")}>
          <FaFileAlt size={50} className="mb-2" />
          <span>Lista de órdenes</span>
        </button>
        <button
          className="btn btn-info d-flex flex-column align-items-center p-4 shadow"
          onClick={() => handleButtonClick("/estadisticas")}>
          <FaChartBar size={50} className="mb-2" />
          <span>Estadísticas</span>
        </button>
        <button
          className="btn btn-secondary d-flex flex-column align-items-center p-4 shadow"
          onClick={() => handleButtonClick("/usuarios")}>
          <FaUser size={50} className="mb-2" />
          <span>Lista de usuarios</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
