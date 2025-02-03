import API_URL from "../config";
import React, { useRef, useEffect, useState } from "react";
import { Navbar, Sidebar } from "../components";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

const PutSupplier = () => {
    const { proveedorId } = useParams();
    const navigate = useNavigate();

    const Name = useRef(null);
    const Phone = useRef(null);
    const ProductId = useRef(null);
    const Cost = useRef(null);
    const Email = useRef(null);
    const LastPurchaseDate = useRef(null);
    const [products, setProducts] = useState([]);
    const [proveedor, setProveedor] = useState(null);
    
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${API_URL}/productos`);
                if (!response.ok) throw new Error("Error al cargar productos");
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error("Error al cargar los productos:", error);
                toast.error("No se pudieron cargar los productos");
            }
        };

        
        const fetchProveedor = async () => {
            try {
                const response = await fetch(`${API_URL}/proveedores/${proveedorId}`);
                if (!response.ok) throw new Error("Error al cargar proveedor");
                const data = await response.json();
                setProveedor(data);
            } catch (error) {
                console.error("Error al cargar el proveedor:", error);
                toast.error("No se pudo cargar el proveedor");
            }
        };

        fetchProveedor();
        fetchProducts();
    }, [proveedorId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const proveedorData = {
            Name: Name.current?.value,
            Phone: Phone.current?.value,
            ProductId: ProductId.current?.value,
            Cost: Cost.current?.value,
            Email: Email.current?.value,
            LastPurchaseDate: LastPurchaseDate.current?.value,
        };

        try {
            const response = await fetch(`${API_URL}/proveedores/${proveedorId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(proveedorData),
            });

            if (response.status === 200) {
                toast.success("Proveedor editado");
                navigate("/ListaProveedores");
            } else {
                toast.error("No se editó correctamente");
            }
        } catch (err) {
            console.error("Error al editar:", err);
            toast.error("Error al editar el proveedor");
        }
    };

    if (!proveedor) return <div>Cargando...</div>;

    return (
        <div>
            <Navbar />
            <Sidebar />
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div className="content-container flex-grow-1 ms-sm-5 mt-4">
                    <div className="container mt-5">
                        <h2>Editar Proveedor</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-12 col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="nombre" className="form-label">Nombre del Proveedor</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="nombre"
                                            ref={Name}
                                            defaultValue={proveedor.Name}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="col-12 col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="email"
                                            ref={Email}
                                            defaultValue={proveedor.Email}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="col-12 col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="telefono" className="form-label">Teléfono</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="telefono"
                                            ref={Phone}
                                            defaultValue={proveedor.Phone}
                                        />
                                    </div>
                                </div>

                                <div className="col-12 col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="producto" className="form-label">Producto</label>
                                        <select
                                            className="form-control"
                                            id="producto"
                                            ref={ProductId}
                                            value={proveedor.ProductId || ""}
                                            onChange={(e) => {
                                                setProveedor(prevState => ({ ...prevState, ProductId: e.target.value }));
                                            }}>
                                            <option value="">Seleccione un producto</option>
                                            {products.map((product) => (
                                                <option key={product.ProductId} value={product.ProductId}>
                                                    {product.Name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="col-12 col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="fecha-compra" className="form-label">Última Fecha de Compra</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            id="fecha-compra"
                                            ref={LastPurchaseDate}
                                            value={proveedor.LastPurchaseDate ? proveedor.LastPurchaseDate.split("T")[0] : ""}  
                                            onChange={(e) => {
                                                setProveedor(prevState => ({ ...prevState, LastPurchaseDate: e.target.value }));
                                            }}
                                        />
                                    </div>
                                </div>

                            </div>
                            <button type="submit" className="btn btn-dark">Guardar Cambios</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PutSupplier;