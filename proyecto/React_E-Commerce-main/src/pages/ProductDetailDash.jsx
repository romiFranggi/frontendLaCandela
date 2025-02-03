import React, { useEffect, useState } from "react";
import { Navbar, Sidebar } from "../components";
import API_URL from "../config";
import axios from "axios";
import { useParams } from "react-router-dom";
import Spinner from '../components/Spinner.jsx';

export const ProductDetails = () => {
    const { productId } = useParams(); 
    const [product, setProduct] = useState(null);
    const [category, setCategory] = useState([]);
    const [supplier, setSupplier] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const fetchProductDetails = async () => {
            try {
                const response = await axios.get(`${API_URL}/productos/${productId}`);
                setProduct(response.data);

                const responseCat = await axios.get(
                    `${API_URL}/categorias/${response.data.CategoryId}`
                );
                setCategory(responseCat.data);

                const responseProv = await axios.get(
                    `${API_URL}/proveedores/${response.data.SupplierId}`
                );
                setSupplier(responseProv.data);

            } catch (error) {
                console.error("Error fetching product details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetails();
    }, [productId]);

    if (loading) {
        return <Spinner />;
    }

    if (!product) {
        return <p>Product not found.</p>;
    }

    return (
        <div>
            <Navbar />
            <Sidebar />
            <div className="product-details" style={{ marginLeft: "210px", marginTop: "20px", padding: "20px" }}>
                <h1>{product.Name}</h1>
                <div className="product-info">
                    <div className="product-image">
                        <img
                            src={product.ImageUrl || "placeholder-image-url.jpg"}
                            alt={product.Name}
                            style={{ maxWidth: "300px", maxHeight: "300px" }}
                        />
                    </div>
                    <div className="product-details-text">
                        <p><strong>Precio:</strong> ${product.Price}</p>
                        <p><strong>Costo:</strong> ${product.Cost}</p>
                        <p><strong>Descripcion:</strong> {product.Description || "No description available."}</p>
                        <p><strong>Cantidad:</strong> {product.Quantity}</p>
                        <p><strong>Categoria:</strong> {category.Name}</p>
                        <p><strong>Proveedor:</strong> {supplier.Name}</p>
                        <p><strong>Valoracion:</strong> {product.Rate || "Not rated yet."}</p>
                        <p><strong>Base:</strong> {product.Base || "N/A"}</p>
                        <p><strong>Altura:</strong> {product.Height || "N/A"}</p>
                        <p><strong>Peso:</strong> {product.Weight || "N/A"}</p>
                        <p><strong>Volumen:</strong> {product.Volume || "N/A"}</p>
                        <p><strong>Paquete:</strong> {product.Package || "N/A"}</p>
                        <p><strong>Fecha de creacion:</strong> {new Date(product.CreationDate).toLocaleDateString("es-UY")}</p>
                    </div>
                </div>
                <button
                    className="btn btn-primary mt-4"
                    onClick={() => window.history.back()}>
                    Volver
                </button>
            </div>
        </div>
    );
};

export default ProductDetails;
