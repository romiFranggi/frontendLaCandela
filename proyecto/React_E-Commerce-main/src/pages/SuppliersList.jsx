import "../css/dashboard.css";
import "../css/listaProductos.css";
import "../css/navbar.css";
import React, { useEffect, useState } from "react";
import { Sidebar, Navbar } from "../components/index.js";
import API_URL from "../config.js";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import DeleteSupplier from "./DeleteSupplier.jsx";
import Spinner from '../components/Spinner.jsx';

export const SuppliersList = () => {
    const navigate = useNavigate();
    const [proveedores, setProveedores] = useState([]);
    const [filteredProveedores, setFilteredProveedores] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [expandedProveedor, setExpandedProveedor] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); 
    const [totalPages, setTotalPages] = useState(1);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
        const options = { year: "numeric", month: "long", day: "numeric" };
        return date.toLocaleDateString("es-UY", options);
    };

    useEffect(() => {
        const getProveedores = async () => {
            setLoading(true);

            try {
                const responseProveedores = await axios.get(`${API_URL}/proveedores`);
                const proveedoresData = responseProveedores.data;

                const responseProducts = await axios.get(`${API_URL}/productos`);
                const productsData = responseProducts.data;

                const proveedoresConProductos = proveedoresData.map(proveedor => ({
                    ...proveedor,
                    productos: productsData.filter(producto => producto.SupplierId === proveedor.SupplierId),
                }));

                setProveedores(proveedoresConProductos);
                setFilteredProveedores(proveedoresConProductos);
                setTotalPages(Math.ceil(proveedoresConProductos.length / itemsPerPage)); // Total de páginas
            } catch (error) {
                console.error("Error encontrando información del proveedor", error);
                toast.error("Hubo un error al cargar los datos.");
            } finally {
                setLoading(false);
            }
        };

        getProveedores();
    }, [itemsPerPage]);

    useEffect(() => {
        const filtered = proveedores.filter(proveedor =>
            proveedor.Name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProveedores(filtered);
    }, [searchTerm, proveedores]);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    //const indexOfLastItem = currentPage * itemsPerPage;
    //const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    //const currentProveedores = filteredProveedores.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) {
        return <Spinner />;
    }

    return (
        <div>
            <Navbar />
            <Sidebar />
            <div className="d-flex justify-content-center mb-4">
                <div className="input-group w-50">
                    <span className="input-group-text bg-white border-end-0 rounded-start">
                        <i className="fa-solid fa-magnifying-glass text-muted"></i>
                    </span>
                    <input
                        type="text"
                        className="form-control border-start-0 rounded-end"
                        placeholder="Buscar proveedor"
                        aria-label="Buscar proveedor"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>
            </div>
            <div className="provider-table-container" style={{ margin: "0 auto", width: "90%" }}>
                <div className="d-flex justify-content-center">
                    <div className="table-responsive" style={{ width: "100%" }}>
                        <table className="table table-striped table-hover" style={{ width: "100%" }}>
                            <thead className="table-dark">
                                <tr>
                                    <th>Nombre</th>
                                    <th>Teléfono</th>
                                    <th>Productos</th>
                                    
                                    <th>Email</th>
                                    <th>Última Compra</th>
                                    <th>Modificar</th>
                                    <th>Eliminar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProveedores.map((proveedor) => (
                                    <React.Fragment key={proveedor.SupplierId}>
                                        <tr>
                                            <td>{proveedor.Name}</td>
                                            <td>{proveedor.Phone}</td>
                                            <td>
                                                <button
                                                    className="btn btn-sm btn-outline-info"
                                                    onClick={() =>
                                                        setExpandedProveedor(
                                                            expandedProveedor === proveedor.SupplierId ? null : proveedor.SupplierId
                                                        )
                                                    }
                                                >
                                                    {expandedProveedor === proveedor.SupplierId ? "Ocultar" : "Ver"}
                                                </button>
                                            </td>
                                           
                                            <td>{proveedor.Email}</td>
                                            <td>{formatDate(proveedor.LastPurchaseDate)}</td>
                                            <td>
                                                <button
                                                    className="btn btn-sm btn-outline-primary"
                                                    onClick={() => navigate(`/editarProveedor/${proveedor.SupplierId}`)}
                                                >
                                                    <i className="fa-solid fa-pen"></i>
                                                </button>
                                            </td>
                                            <td>
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => DeleteSupplier(proveedor.SupplierId, setProveedores)}
                                                >
                                                    <i className="fa-solid fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                        {expandedProveedor === proveedor.SupplierId && (
                                            <tr>
                                                <td colSpan="8" style={{ paddingLeft: "20px", backgroundColor: "#f9f9f9" }}>
                                                    <h5>Productos de {proveedor.Name}</h5>
                                                    {proveedor.productos.length > 0 ? (
                                                        <table className="table table-sm table-bordered mt-2">
                                                            <thead className="table-light">
                                                                <tr>
                                                                    <th>Nombre</th>
                                                                    <th>Precio</th>
                                                                    <th>Cantidad</th>
                                                                    <th>Descripción</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {proveedor.productos.map((producto) => (
                                                                    <tr key={producto.ProductId}>
                                                                        <td>{producto.Name}</td>
                                                                        <td>{`$${producto.Price}`}</td>
                                                                        <td>{producto.Quantity}</td>
                                                                        <td>{producto.Description}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    ) : (
                                                        <p>No hay productos asociados con este proveedor.</p>
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

            <div className="d-flex justify-content-center" style={{ textAlign: "center", marginTop: "20px" }}>
                <nav>
                    <ul className="pagination">
                        {[...Array(totalPages).keys()].map((pageNumber) => (
                            <li key={pageNumber + 1} className={`page-item ${currentPage === pageNumber + 1 ? "active" : ""}`}>
                                <button
                                    className="page-link"
                                    onClick={() => paginate(pageNumber + 1)}>
                                    {pageNumber + 1}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default SuppliersList;
