import API_URL from "../config";
import React, { useRef } from "react";
import { Sidebar, Navbar } from "../components";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const AddSupplier = () => {

    const Name = useRef(null);
    const Phone = useRef(null);
    const Cost = useRef(null);
    const Email = useRef(null);
    const LastPurchaseDate = useRef(null);
    const navigate = useNavigate();

    const crearProveedor = async (e) => {
        e.preventDefault();
    
        const proveedorData = {
            Name: Name.current?.value,
            Phone: Phone.current?.value,
            Cost: Cost.current?.value,
            Email: Email.current?.value,
            LastPurchaseDate: LastPurchaseDate.current?.value,
        };
    
        console.log("Enviando proveedor:", proveedorData);
    
        try {
           
            const response = await fetch(`${API_URL}/proveedores`, { method: "GET" });
            if (!response.ok) {
                toast.error("Error verificando el email");
                throw new Error("Error al verificar el email");
            }
    
            const proveedores = await response.json();
            const emailExistente = proveedores.some(proveedor => proveedor.Email === proveedorData.Email);
    
            if (emailExistente) {
                toast.error("Email ya usado");
                throw new Error("Email ya usado");
            }
    
            
            const postResponse = await fetch(`${API_URL}/proveedores`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(proveedorData),
            });
    
            const responseData = await postResponse.json();
            console.log("Respuesta del servidor:", responseData);
    
            if (postResponse.status === 201 || postResponse.status === 200) {
                toast.success("Proveedor creado");
                navigate("/ListaProveedores");
            } else {
                toast.error("Creación no realizada");
                throw new Error("Creación fallida");
            }
        } catch (err) {
            console.error("Error en la creación:", err);
            toast.error("Ocurrió un error en la creación");
        }
    };
    

    return (
        <div>
            <Navbar />
            <Sidebar />
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div className="content-container flex-grow-1 ms-sm-5 mt-4">
                    <div className="container mt-5">
                        <h2>Agregar Proveedor</h2>
                        <form onSubmit={crearProveedor}>
                            <div className="row">
                                <div className="col-12 col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="nombre" className="form-label">Nombre del Proveedor *</label>
                                        <input type="text" className="form-control" id="nombre" ref={Name} required />
                                    </div>
                                </div>

                                <div className="col-12 col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="telefono" className="form-label">Telefono *</label>
                                        <input type="number" className="form-control" id="telefono" ref={Phone} required />
                                    </div>
                                </div>

                                <div className="col-12 col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">Email *</label>
                                        <input type="email" className="form-control" id="email" ref={Email} required />
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

}

export default AddSupplier;