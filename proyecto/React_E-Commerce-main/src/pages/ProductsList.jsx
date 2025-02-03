import "../css/dashboard.css";
import "../css/listaProductos.css";
import "../css/navbar.css";
import React, { useEffect, useState } from "react";
import { Sidebar, Navbar } from "../components/index.js";
import API_URL from "../config.js";
import axios from "axios";
import toast from "react-hot-toast";
import DeleteProduct from "./DeleteProduct.jsx";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import Spinner from '../components/Spinner.jsx';

export const ProductsList = () => {
    const navigate = useNavigate();
    const [product, setProducts] = useState([]);
    const [filter, setFilter] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");

    const itemsPerPage = 10;
    const offset = currentPage * itemsPerPage;
    const currentItems = filter.slice(offset, offset + itemsPerPage);
    const pageCount = Math.ceil(filter.length / itemsPerPage);

    useEffect(() => {
        const getProduct = async () => {
            setLoading(true);

            try {
                const responseProducts = await axios.get(`${API_URL}/productos`);
                const productsData = responseProducts.data;

                const responseCategories = await axios.get(`${API_URL}/categorias`);
                const categoriesData = responseCategories.data;

                const responseSuppliers = await axios.get(`${API_URL}/proveedores`);
                const suppliersData = responseSuppliers.data;

                const productsWithDetails = productsData.map((product) => {
                    const category = categoriesData.find(
                        (cat) => cat.CategoryId === product.CategoryId
                    );
                    const supplier = suppliersData.find(
                        (sup) => sup.SupplierId === product.SupplierId
                    );

                    return {
                        ...product,
                        categoryName: category ? category.Name : "Sin categoría",
                        supplierName: supplier ? supplier.Name : "Sin proveedor",
                    };
                });
                setProducts(productsWithDetails);
                setFilter(productsWithDetails);
            } catch (error) {
                console.error("Error encontrando información del producto", error);
                toast.error("Error al cargar los productos.");
            } finally {
                setLoading(false);
            }
        };

        getProduct();
    }, []);

    useEffect(() => {
        const filtered = product.filter((product) =>
            product.Name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilter(filtered);
        setCurrentPage(0);
    }, [searchTerm, product]);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handlePageClick = (data) => {
        setCurrentPage(data.selected);
    };

    if (loading) {
        return <Spinner />;
    }

    return (
        <div className="pageListaProducts">
            <Navbar />
            <Sidebar />
            {/* Barra de búsqueda */}
            <div className="d-flex justify-content-center mb-4">
                <div className="input-group w-50">
                    <span className="input-group-text bg-white border-end-0 rounded-start">
                        <i className="fa-solid fa-magnifying-glass text-muted"></i>
                    </span>
                    <input
                        type="text"
                        className="form-control border-start-0 rounded-end"
                        placeholder="Buscar"
                        aria-label="Buscar"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>
            </div>
            <div className="product-table-container" style={{ margin: "0 auto", width: "90%" }}>
                <div className="d-flex justify-content-center">
                    <div className="table-responsive" style={{ width: "100%" }}>
                        <table className="table table-striped table-hover" style={{ width: "100%" }}>
                            <thead className="table-dark">
                                <tr>
                                    <th>Nombre</th>
                                    <th>Altura (cm)</th>
                                    <th style={{ width: "10%" }}>Color</th>
                                    <th>Categoría</th>
                                    <th>Proveedor</th>
                                    <th>Precio</th>
                                    <th>Stock</th>
                                    <th>¿A la venta?</th>
                                    <th>Detalles</th>
                                    <th>Modificar</th>
                                    <th>Eliminar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((item) => (
                                    <tr key={item.ProductId}>
                                        <td>{item.Name}</td>
                                        <td>{item.Height != null ? item.Height : "-"}</td>
                                        <td>{item.Color != null ? item.Color : "-"}</td>
                                        <td>{item.categoryName}</td>
                                        <td>{item.supplierName}</td>
                                        <td>{`$${item.Price}`}</td>
                                        <td>{item.Quantity}</td>

                                        <td>
                                            {item.ALaVenta ? (
                                                <i className="fa-solid fa-check text-success"></i>
                                            ) : (
                                                <i className="fa-solid fa-xmark text-danger"></i>
                                            )}
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-outline-info"
                                                onClick={() => navigate(`/productoDetalleDashboard/${item.ProductId}`)}>
                                                Ver detalles
                                            </button>
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={() => navigate(`/editarProducto/${item.ProductId}`)}>
                                                <i className="fa-solid fa-pen"></i>
                                            </button>
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => DeleteProduct(item.ProductId, setProducts, setFilter)}>
                                                <i className="fa-solid fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <ReactPaginate
                    previousLabel={<i className="fa-solid fa-chevron-left" style={{ fontSize: "12px", color: "#555" }}></i>}
                    nextLabel={<i className="fa-solid fa-chevron-right" style={{ fontSize: "12px", color: "#555" }}></i>}
                    breakLabel={<span style={{ color: "#555" }}>...</span>}
                    pageCount={pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={handlePageClick}
                    containerClassName={"pagination justify-content-center mt-4"}
                    pageClassName={"page-item"}
                    pageLinkClassName={"page-link text-primary"}
                    previousClassName={"page-item"}
                    previousLinkClassName={"page-link"}
                    nextClassName={"page-item"}
                    nextLinkClassName={"page-link"}
                    activeClassName={"active bg-secondary text-white"}
                    activeLinkClassName={"page-link"}
                    style={{ gap: "5px" }}
                />
            </div>
        </div>
    );
};

export default ProductsList;
