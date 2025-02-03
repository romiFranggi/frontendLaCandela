import React, { useRef, useEffect, useState } from "react";
import { Sidebar, Navbar } from "../components";
import toast from "react-hot-toast";
import API_URL from "../config";
import { useNavigate } from "react-router-dom";


export const AddProduct = () => {
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
    const SupplierId = useRef(null);
    const Color = useRef(null);

    const [categories, setCategories] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoriesResponse, suppliersResponse] = await Promise.all([
                    fetch(`${API_URL}/categorias`),
                    fetch(`${API_URL}/proveedores`),
                ]);

                if (!categoriesResponse.ok || !suppliersResponse.ok) {
                    throw new Error("Error al cargar datos");
                }

                const [categoriesData, suppliersData] = await Promise.all([
                    categoriesResponse.json(),
                    suppliersResponse.json(),
                ]);

                setCategories(categoriesData);
                setSuppliers(suppliersData);
            } catch (error) {
                console.error("Error al cargar categorías o proveedores:", error);
                toast.error("Error al cargar datos necesarios");
            }
        };

        fetchData();
    }, []);

    const crearProduct = async (e) => {
        e.preventDefault();

        const productData = {
            Name: Name.current?.value,
            Price: Price.current?.value,
            Cost: Cost.current?.value,
            Description: Description.current?.value,
            Quantity: Quantity.current?.value,
            CategoryId: CategoryId.current?.value,
            Base: Base.current?.value,
            Height: Height.current?.value,
            Weight: Weight.current?.value,
            Volume: Volume.current?.value,
            Package: Package.current?.value,
            SupplierId: SupplierId.current?.value,
            Color: Color.current?.value,
        };

        const image = ImageUrl.current?.files[0];
        if (image) {
            const formData = new FormData();
            formData.append("image", image);
            formData.append("Name", productData.Name);
            formData.append("Price", productData.Price);
            formData.append("Cost", productData.Cost);
            formData.append("Description", productData.Description);
            formData.append("Quantity", productData.Quantity);
            formData.append("CategoryId", productData.CategoryId);
            formData.append("Base", productData.Base);
            formData.append("Height", productData.Height);
            formData.append("Weight", productData.Weight);
            formData.append("Volume", productData.Volume);
            formData.append("Package", productData.Package);
            formData.append("SupplierId", productData.SupplierId);
            formData.append("Color", productData.Color);

            try {
                const response = await fetch(`${API_URL}/productos`, {
                    method: "POST",
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error("Creación no realizada");
                }

                toast.success("Producto creado correctamente");
                navigate("/listaProductos");
            } catch (error) {
                console.error("Error al crear el producto:", error);
                toast.error("Error al crear el producto");
            }
        } else {
            toast.error("No se ha seleccionado una imagen");
        }
    };

    return (
        <div>
            <Navbar />
            <Sidebar />
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div className="content-container flex-grow-1 ms-sm-5 mt-4">
                    <div className="container mt-5">
                        <h2>Agregar Producto</h2>
                        <form onSubmit={crearProduct}>
                            <div className="row">
                                <div className="col-12 col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="nombre" className="form-label">Nombre del Producto *</label>
                                        <input type="text" className="form-control" id="nombre" ref={Name} required />
                                    </div>
                                </div>

                                <div className="col-12 col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="precio" className="form-label">Precio *</label>
                                        <input type="number" className="form-control" id="precio" ref={Price} required />
                                    </div>
                                </div>

                                <div className="col-12 col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="costo" className="form-label">Costo *</label>
                                        <input type="number" className="form-control" id="costo" ref={Cost} required />
                                    </div>
                                </div>

                                <div className="col-12 col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="descripcion" className="form-label">Descripción *</label>
                                        <textarea className="form-control" id="descripcion" ref={Description} rows="3" required></textarea>
                                    </div>
                                </div>

                                <div className="col-12 col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="cantidad" className="form-label">Cantidad *</label>
                                        <input type="number" className="form-control" id="cantidad" ref={Quantity} required />
                                    </div>
                                </div>

                                <div className="col-12 col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="categoria" className="form-label">Categoría *</label>
                                        <select className="form-control" id="categoria" ref={CategoryId} required>
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
                                        <label htmlFor="proveedor" className="form-label">Proveedor *</label>
                                        <select className="form-control" id="proveedor" ref={SupplierId} required>
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
                                        <label htmlFor="color" className="form-label">Color</label>
                                        <textarea className="form-control" id="color" ref={Color}></textarea>
                                    </div>
                                </div>

                                <div className="col-12 col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="imagenURL" className="form-label">Imagen del Producto *</label>
                                        <input type="file" className="form-control" id="imagenURL" ref={ImageUrl} accept="image/*" required />
                                    </div>
                                </div>

                                <div className="col-12 col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="base" className="form-label">Base</label>
                                        <input type="number" className="form-control" id="base" ref={Base} />
                                    </div>
                                </div>

                                <div className="col-12 col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="altura" className="form-label">Altura (cm)</label>
                                        <input type="number" className="form-control" id="altura" ref={Height} />
                                    </div>
                                </div>

                                <div className="col-12 col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="peso" className="form-label">Peso (kg)</label>
                                        <input type="number" className="form-control" id="peso" ref={Weight} />
                                    </div>
                                </div>

                                <div className="col-12 col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="volumen" className="form-label">Volumen (m³)</label>
                                        <input type="number" className="form-control" id="volumen" ref={Volume} />
                                    </div>
                                </div>

                                <div className="col-12 col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="paquete" className="form-label">Paquete</label>
                                        <input type="number" className="form-control" id="paquete" ref={Package} />
                                    </div>
                                </div>

                                <div className="col-12">
                                    <button className="my-2 mx-auto btn btn-dark" type="submit">
                                        Crear
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddProduct;