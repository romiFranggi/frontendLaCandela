import { Navigate } from "react-router-dom";



const ProtectedRoute = ({ children }) => {
  

  // Verifica si el usuario está logueado y si su rol es 'admin'
  const isAdmin = localStorage.getItem("roleId") === "1"; // Ajusta según tu implementación del rol

  if (isAdmin) {
    return children;
  }

  // Si el usuario no tiene el rol adecuado, redirige al inicio o login
  return <Navigate to="/" replace />;
};


export default ProtectedRoute;
