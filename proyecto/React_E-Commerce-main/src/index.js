import React from "react";
import ReactDOM from "react-dom/client";
import "../node_modules/font-awesome/css/font-awesome.min.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import Spinner from "./components/Spinner";
import {
  Home,
  Product,
  Products,
  AboutPage,
  ContactPage,
  Cart,
  Login,
  Register,
  Checkout,
  PageNotFound,
  Dashboard,
  ProductsList,
  AddProduct,
  PutProduct,
  SuppliersList,
  PutSupplier,
  Orders,
  ProductDetails,
  Statistics,
  AddSupplier,
  Users
} from "./pages";
import ScrollToTop from "./components/ScrollToTop";
import { Toaster } from "react-hot-toast";

<link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
/>


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <ScrollToTop>
      <Provider store={store}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<Products />} />
          <Route path="/productos/:id" element={<Product />} />
          <Route path="/sobreNosotros" element={<AboutPage />} />
          <Route path="/contacto" element={<ContactPage />} />
          <Route path="/carrito" element={<Cart />} />

          <Route path="/spinner" element={<Spinner />} />

          {/* LOGIN */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          <Route path="/registro" element={<Register />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="*" element={<PageNotFound />} />
          <Route path="/productos/*" element={<PageNotFound />} />

          {/* RUTAS PROTEGIDAS SOLO PARA ADMIN */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route path="/listaProductos" element={
            <ProtectedRoute>
              <ProductsList/>
            </ProtectedRoute>
          }
          />

          <Route path="/listaProveedores" element={
            <ProtectedRoute>
              <SuppliersList />
            </ProtectedRoute>
          }
          />
            
          <Route path="/agregarProveedor" element={
            <ProtectedRoute>
              <AddSupplier />
            </ProtectedRoute>
          } />


          <Route path="/ordenes" element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          } />


          <Route path="/estadisticas" element={
            <ProtectedRoute>
              <Statistics />
            </ProtectedRoute>
          } />

          <Route path="/productoDetalleDashboard/:productId" element={
            <ProtectedRoute>
              < ProductDetails />
            </ProtectedRoute>
          } />

          <Route path="/editarProveedor/:proveedorId" element={
            <ProtectedRoute>
              <PutSupplier />
            </ProtectedRoute>
          } />


          <Route path="/editarProducto/:productId" element={
            <ProtectedRoute>
              <PutProduct />
            </ProtectedRoute>
          } />

          <Route path="/agregarProducto" element={
            <ProtectedRoute>
              <AddProduct />
            </ProtectedRoute>
          } />
           <Route path="/usuarios" element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          } />

        </Routes>
      </Provider>
    </ScrollToTop>
    <Toaster />
  </BrowserRouter>
);
