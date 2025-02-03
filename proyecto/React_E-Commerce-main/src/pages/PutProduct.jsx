import API_URL from "../config";
import React, { useRef, useEffect, useState } from "react";
import { Navbar, Sidebar } from "../components";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

const PutProduct = () => {
    const { productId } = useParams();
    const navigate = useNavigate();

    const Name = useRef(null);
    const Price = useRef(null);
    const Cost = useRef(null);
    const Description = useRef(null);
    const Quantity = useRef(null);
    const CategoryId = useRef(null);
    const ImageUrl = useRef(null);
    const Base = useRef(null);
    const Height = useRef(null);
    const Weight = useRef(null);
    const Volume = useRef(null);
    const Package = useRef(null);
    const ALaVenta = useRef(null);
    const SupplierId = useRef(null);
    const Color = useRef(null);
    const [categories, setCategories] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [product, setProduct] = useState(null);

    useEffect(() => {

        const fetchCategories = async () => {
            try {
                const response = await fetch(`${API_URL}/categorias`);
                if (!response.ok) throw new Error("Error al cargar categorías");
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error("Error al cargar las categorías:", error);
                toast.error("No se pudieron cargar las categorías");
            }
        };

        const fetchSuppliers = async () => {
            try {
                const response = await fetch(`${API_URL}/proveedores`);
                if (!response.ok) throw new Error("Error al cargar proveedores");
                const data = await response.json();
                setSuppliers(data);
            } catch (error) {
                console.error("Error al cargar los proveedores:", error);
                toast.error("No se pudieron cargar los proveedores");
            }
        };

        const fetchProduct = async () => {
            try {
                const response = await fetch(`${API_URL}/productos/${productId}`);
                if (!response.ok) throw new Error("Error al cargar producto");
                const data = await response.json();
                setProduct(data);
            } catch (error) {
                console.error("Error al cargar el producto:", error);
                toast.error("No se pudo cargar el producto");
            }
        };

        fetchCategories();
        fetchProduct();
        fetchSuppliers();
    }, [productId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const productData = {
            Name: Name.current?.value,
            Price: Price.current?.value,
            Cost: Cost.current?.value,
            Description: Description.current?.value,
            Quantity: Quantity.current?.value,
            CategoryId: CategoryId.current?.value,
            ImageUrl: ImageUrl.current?.value,
            Base: Base.current?.value,
            Height: Height.current?.value,
            Weight: Weight.current?.value,
            Volume: Volume.current?.value,
            Package: Package.current?.value,
            ALaVenta: ALaVenta.current?.checked,
            SupplierId: SupplierId.current?.value,
            Color: Color.current?.value,
        };

        try {
            const response = await fetch(`${API_URL}/productos/${productId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(productData),
            });

            if (response.status === 200) {
                toast.success("Producto editado");
                navigate("/listaProductos");
            } else {
                toast.error("No se editó correctamente");
            }
        } catch (err) {
            console.error("Error al editar:", err);
            toast.error("Error al editar el producto");
        }
    };

    if (!product) return <div>Cargando...</div>;

    return (
        <div>
            <Navbar />
            <Sidebar />
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div className="content-container flex-grow-1 ms-sm-5 mt-4">
                    <div className="container mt-5">
                        <h2>Editar Producto</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-12 col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="nombre" className="form-label">Nombre del Producto</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="nombre"
                                            ref={Name}
                                            defaultValue={product.Name}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="col-12 col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="precio" className="form-label">Precio</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="precio"
                                            ref={Price}
                                            defaultValue={product.Price}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="col-12 col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="costo" className="form-label">Costo</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="costo"
                                            ref={Cost}
                                            defaultValue={product.Cost}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="col-12 col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="color" className="form-label">Color</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="color"
                                            ref={Color}
                                            defaultValue={product.Color}
                                        />
                                    </div>
                                </div>

                                <div className="col-12 col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="descripcion" className="form-label">Descripción</label>
                                        <textarea
                                            className="form-control"
                                            id="descripcion"
                                            ref={Description}
                                            rows="3"
                                            defaultValue={product.Description}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="col-12 col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="cantidad" className="form-label">Cantidad</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="cantidad"
                                            ref={Quantity}
                                            defaultValue={product.Quantity}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="col-12 col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="categoria" className="form-label">Categoría</label>
                                        <select
                                            className="form-control"
                                            id="categoria"
                                            ref={CategoryId}
                                            defaultValue={product.CategoryId}
                                            required>
                                            <option value="">Seleccione una categoría</option>
                                            {categories.map((category) => (
                                                <option key={category.CategoryId} value={category.CategoryId}>
                                                    {category.Name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="col-12 col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="imagenURL" className="form-label">Imagen del Producto</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            id="imagenURL"
                                            ref={ImageUrl}
                                            accept="image/*"
                                        />
                                    </div>
                                </div>

                                <div className="col-12 col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="base" className="form-label">Base</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="base"
                                            ref={Base}
                                            defaultValue={product.Base}
                                        />
                                    </div>
                                </div>

                                <div className="col-12 col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="altura" className="form-label">Altura (cm)</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="altura"
                                            ref={Height}
                                            defaultValue={product.Height}
                                        />
                                    </div>
                                </div>

                                <div className="col-12 col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="peso" className="form-label">Peso (kg)</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="peso"
                                            ref={Weight}
                                            defaultValue={product.Weight}
                                        />
                                    </div>
                                </div>

                                <div className="col-12 col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="volumen" className="form-label">Volumen (m³)</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="volumen"
                                            ref={Volume}
                                            defaultValue={product.Volume}
                                        />
                                    </div>
                                </div>

                                <div className="col-12 col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="paquete" className="form-label">Paquete</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="paquete"
                                            ref={Package}
                                            defaultValue={product.Package}
                                        />
                                    </div>
                                </div>

                                <div className="col-12 col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="proveedor" className="form-label">Proveedor</label>
                                        <select
                                            className="form-control"
                                            id="proveedor"
                                            ref={SupplierId}
                                            value={product.SupplierId || ""}
                                            onChange={(e) => setProduct({ ...product, SupplierId: e.target.value })}
                                            required>
                                            <option value="">Seleccione un proveedor</option>
                                            {suppliers.map((supplier) => (
                                                <option key={supplier.SupplierId} value={supplier.SupplierId}>
                                                    {supplier.Name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="col-12 col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="alaventa" className="form-label">¿A la venta?</label>
                                        <input
                                            type="checkbox"
                                            //className="form-check-input"
                                            id="alaventa"
                                            ref={ALaVenta}
                                            defaultChecked={product.ALaVenta}
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
};

export default PutProduct;
