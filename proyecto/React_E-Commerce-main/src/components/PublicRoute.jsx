import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
  const email = localStorage.getItem("email");
  const token = localStorage.getItem("token");

  //si el usuario ya esta logueado (por ejemplo, tiene un token), redirige a home
  if (email && token) {
    return <Navigate to="/" replace />;
  }

  //si no esta logueado, permite el acceso a la ruta publica 
  return children;
};


export default PublicRoute;
