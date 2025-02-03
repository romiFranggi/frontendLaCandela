import React, { useRef } from "react";
import { Footer, Navbar } from "../components";
import { Link, useNavigate } from "react-router-dom";
import API_URL from "../config";
import toast from "react-hot-toast";
import "../css/register.css";

const Register = () => {
  const UserName = useRef(null);
  const Password = useRef(null);
  const Email = useRef(null);
  const Birthdate = useRef(null);
  const Address = useRef(null);
  const RUT = useRef(null);
  const Phone = useRef(null);
  const ContactName = useRef(null);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const userData = {
      UserName: UserName.current?.value,
      Password: Password.current?.value,
      Email: Email.current?.value,
      Birthdate: Birthdate.current?.value,
      Address: Address.current?.value,
      RUT: RUT.current?.value,
      Phone: Phone.current?.value,
      ContactName: ContactName.current?.value,
    };

    // Validar campos
    const error = validateFields(userData);
    if (error) {
      toast.error(error);
      return;
    }

    // Enviar datos si no hay errores
    fetch(`${API_URL}/usuarios`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then((response) => {
        if (response.ok) {
          toast.success("Registro realizado");
          navigate("/login");
          return response.json();
        } else {
          toast.error("Registro no realizado");
          throw new Error("Registro fallido");
        }
      })
      .catch((err) => {
        console.error("Error en el registro:", err);
        toast.error("Ocurrió un error en el registro");
      });
  };

  return (
    <div className="registerPage">
      <Navbar />
      <div className="container my-5 py-5">
        <h1 className="text-center">Registrarse</h1>
        <hr />
        <div className="row my-4 h-100">
          <div className="col-md-8 col-lg-8 col-sm-12 mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6">
                  <div className="form my-3">
                    <label htmlFor="Name">Nombre de usuario *</label>
                    <input
                      type="text"
                      className="form-control"
                      id="Name"
                      placeholder="Escribe aqui..."
                      ref={UserName}
                    />
                  </div>
                  <div className="form my-3">
                    <label htmlFor="Email">Email *</label>
                    <input
                      type="email"
                      className="form-control"
                      id="Email"
                      placeholder="Escribe aqui..."
                      ref={Email}
                    />
                  </div>
                  <div className="form my-3">
                    <label htmlFor="Password">Contraseña *</label>
                    <input
                      type="password"
                      className="form-control"
                      id="Password"
                      placeholder="Escribe aqui..."
                      ref={Password}
                    />
                  </div>
                  <div className="form my-3">
                    <label htmlFor="Birthdate">Fecha de Nacimiento *</label>
                    <input
                      type="date"
                      className="form-control"
                      id="Birthdate"
                      ref={Birthdate}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form my-3">
                    <label htmlFor="Address">Dirección</label>
                    <input
                      type="text"
                      className="form-control"
                      id="Address"
                      placeholder="Escribe aqui..."
                      ref={Address}
                    />
                  </div>
                  <div className="form my-3">
                    <label htmlFor="RUT">RUT</label>
                    <input
                      type="text"
                      className="form-control"
                      id="RUT"
                      placeholder="Escribe aqui..."
                      ref={RUT}
                    />
                  </div>
                  <div className="form my-3">
                    <label htmlFor="Phone">Teléfono *</label>
                    <input
                      type="text"
                      className="form-control"
                      id="Phone"
                      placeholder="Escribe aqui..."
                      ref={Phone}
                    />
                  </div>
                  <div className="form my-3">
                    <label htmlFor="ContactName">Nombre de Contacto *</label>
                    <input
                      type="text"
                      className="form-control"
                      id="ContactName"
                      placeholder="Escribe aqui..."
                      ref={ContactName}
                    />
                  </div>
                </div>
              </div>
              <div className="my-3">
                <p>
                  ¿Ya tienes una cuenta?{" "}
                  <Link to="/login" className="custom-link">
                    Ingresa
                  </Link>
                </p>
              </div>
              <div className="text-center">
                <button className="my-2 mx-auto btn btn-dark" type="submit">
                  Registrate
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

const validateFields = (userData) => {
  // Validar UserName
  if (!/^[a-zA-Z0-9_]{3,20}$/.test(userData.UserName)) {
    return "El nombre de usuario debe tener entre 3 y 20 caracteres y solo puede contener letras, números y guiones bajos.";
  }

  // Validar Email
  if (!/^[\w.-]+@([\w-]+\.)+[\w-]{2,}$/.test(userData.Email)) { 
    return "El correo electrónico no es válido.";
  }

  // Validar Password
  if (
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/.test(userData.Password)
  ) {
    return "La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula, una minúscula y un número.";
  }

  // Validar Birthdate
  const birthdate = new Date(userData.Birthdate);
  const today = new Date();
  const age = today.getFullYear() - birthdate.getFullYear();
  if (isNaN(birthdate.getTime()) || age < 13 || birthdate > today) {
    return "Debes tener al menos 13 años y proporcionar una fecha de nacimiento válida.";
  }

  // Validar Phone
  if (!/^\d{8,15}$/.test(userData.Phone)) {
    return "El teléfono debe contener solo números y tener entre 8 y 15 dígitos.";
  }

  // Validar ContactName
  if (!/^[a-zA-ZÀ-ÿ\s]{3,50}$/.test(userData.ContactName)) {
    return "El nombre de contacto debe tener entre 3 y 50 caracteres y solo puede contener letras y espacios.";
  }
};

export default Register;
