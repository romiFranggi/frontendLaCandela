import React, { useRef } from 'react';
import { Footer, Navbar } from "../components";
import { Link, useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";
import API_URL from "../config";
import "../css/login.css";

const Login = () => {

  
  const Password = useRef(null);
  const Email = useRef(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

  const emailValue = Email.current?.value;
  const passwordValue = Password.current?.value;

  if (!emailValue || !passwordValue) {
    toast.error("Todos los campos son obligatorios");
    return;
  }

  fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      Email: emailValue,
      Password: passwordValue,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        // Si no es 200 OK, lanza un error
        throw new Error("Error en la autenticación");
      }
      return response.json();
    })
    .then((json) => {
      if (json.codigo === 200) {
        // Almacenar los valores correctos del json en localStorage
        localStorage.setItem("id", json.userId);  // Usar json.userId
        localStorage.setItem("token", json.apiKey);  // Guardamos el token JWT
        localStorage.setItem("email", json.email);
        localStorage.setItem("roleId", json.roleId); 
        localStorage.setItem("userName", json.userName);

        toast.success("Login realizado");
        navigate("/"); // Redirigir al home o página deseada
      } else {
        toast.error("Login no realizado");
      }
    })
    .catch((error) => {
      console.error("Error en la solicitud:", error);
      toast.error("Hubo un problema con el inicio de sesión. Intenta nuevamente.");
    });
  };

  return (
    <div className='loginPage'>
      <Navbar />
      <div className="container my-5 py-5">
        <h1 className="text-center">Login</h1>
        <hr />
        <div className="row my-4 h-100">
          <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="my-3">
                <label htmlFor="display-4">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="floatingInput"
                  placeholder="name@example.com"
                  ref={Email}
                />
              </div>
              <div className="my-3">
                <label htmlFor="floatingPassword display-4">Contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  id="floatingPassword"
                  placeholder="Password"
                  ref={Password}
                />
              </div>
              <div className="my-3">
                <p>¿No tienes una cuenta? <Link to="/register" className="custom-link">Registrate</Link> </p>
              </div>
              <div className="text-center">
                <button className="my-2 mx-auto btn btn-dark" type="submit">
                  Login
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


export default Login;