import "../css/dashboard.css";
import "../css/listaProductos.css";
import "../css/navbar.css";
import React, { useEffect, useState } from "react";
import { Sidebar, Navbar } from "../components/index.js";
import API_URL from "../config.js";
import axios from "axios";
import toast from "react-hot-toast";
//import { useNavigate } from "react-router-dom";
import Spinner from '../components/Spinner.jsx';

export const Users = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredUsuarios, setFilteredUsuarios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [usuariosPorPagina] = useState(10);

    useEffect(() => {
        const getUsuarios = async () => {
            setLoading(true);

            try {
                const responseUsuario = await axios.get(`${API_URL}/usuarios`);
                const usuarioData = responseUsuario.data;

                setUsuarios(usuarioData);
                setFilteredUsuarios(usuarioData);
            } catch (error) {
                console.error("Error encontrando información del usuario", error);
                toast.error("Hubo un error al cargar los datos.");
            } finally {
                setLoading(false);
            }
        };

        getUsuarios();
    }, []);

    useEffect(() => {
        const filtered = usuarios.filter(usuario =>
            usuario.UserName.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredUsuarios(filtered);
    }, [searchTerm, usuarios]);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const cambiarRolAdmin = async (id) => {
        const confirmacion = window.confirm("¿Estás seguro de asignar el rol de administrador?");

        if (confirmacion) {
            try {
                console.log("Id de usuario" + id)
                const response = await axios.put(`${API_URL}/usuarios/${id}`, { RoleId: 1 });

                if (response.status === 200) {
                    toast.success("Rol actualizado a Administrador");

                    setUsuarios(prevUsuarios =>
                        prevUsuarios.map(user =>
                            user.UserId === id ? { ...user, RoleId: 1 } : user
                        )
                    );
                }
            } catch (error) {
                console.error("Error al cambiar el rol:", error);
                toast.error("No se pudo cambiar el rol");
            }
        }
    };

    const cambiarRolCliente = async (id) => {
        const confirmacion = window.confirm("¿Estás seguro de asignar el rol de cliente?");

        if (confirmacion) {
            try {
                console.log("Id de usuario" + id)
                const response = await axios.put(`${API_URL}/usuarios/${id}`, { RoleId: 2 });

                if (response.status === 200) {
                    toast.success("Rol actualizado a Cliente");

                    setUsuarios(prevUsuarios =>
                        prevUsuarios.map(user =>
                            user.UserId === id ? { ...user, RoleId: 2 } : user
                        )
                    );
                }
            } catch (error) {
                console.error("Error al cambiar el rol:", error);
                toast.error("No se pudo cambiar el rol");
            }
        }
    };

    const indexOfLastUser = currentPage * usuariosPorPagina;
    const indexOfFirstUser = indexOfLastUser - usuariosPorPagina;
    const currentUsers = filteredUsuarios.slice(indexOfFirstUser, indexOfLastUser);

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
                        placeholder="Buscar usuario"
                        aria-label="Buscar usuario"
                        value={searchTerm}
                        onChange={handleSearch} />
                </div>
            </div>
            <div className="provider-table-container" style={{ margin: "0 auto", width: "90%" }}>
                <div className="d-flex justify-content-center">
                    <div className="table-responsive" style={{ width: "100%" }}>
                        <table className="table table-striped table-hover" style={{ width: "100%" }}>
                            <thead className="table-dark">
                                <tr>
                                    <th>Nombre</th>
                                    <th>Email</th>
                                    <th>Dirección</th>
                                    <th>Teléfono</th>
                                    <th>Rol</th>
                                    <th>Cambiar rol a Cliente</th>
                                    <th>Cambiar rol a Administrador</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentUsers.map((usuario) => (
                                    <tr key={usuario.UserId}>
                                        <td>{usuario.UserName}</td>
                                        <td>{usuario.Email}</td>
                                        <td>{usuario.Address}</td>
                                        <td>{usuario.Phone}</td>
                                        <td>{usuario.RoleId === 1 ? "Administrador" : "Cliente"}</td>
                                        <td>
                                            <button
                                                className="btn btn-outline-info btn-sm"
                                                onClick={() => cambiarRolCliente(usuario.UserId)}
                                                disabled={usuario.RoleId === 2}
                                                style={usuario.RoleId === 2 ? { backgroundColor: "rgba(128, 128, 128, 0.3)", color: "#6c757d", borderColor: "rgba(128, 128, 128, 0.5)", pointerEvents: "none" } : {}}>
                                                {usuario.RoleId === 2 ? "Cliente" : "Hacer Cliente"}
                                            </button>
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-outline-dark btn-sm"
                                                onClick={() => cambiarRolAdmin(usuario.UserId)}
                                                disabled={usuario.RoleId === 1}
                                                style={usuario.RoleId === 1 ? { backgroundColor: "rgba(128, 128, 128, 0.3)", color: "#6c757d", borderColor: "rgba(128, 128, 128, 0.5)", pointerEvents: "none" } : {}}>
                                                {usuario.RoleId === 1 ? "Administrador" : "Hacer Admin"}
                                            </button>
                                        </td>


                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>



            <div className="d-flex justify-content-center">
                <nav>
                    <ul className="pagination">
                        {[...Array(Math.ceil(filteredUsuarios.length / usuariosPorPagina))].map((_, index) => (
                            <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => paginate(index + 1)}>
                                    {index + 1}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default Users;
