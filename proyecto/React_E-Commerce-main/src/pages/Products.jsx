import React from 'react'
import { Footer, Navbar, Product } from "../components"
import "../css/productsPage.css";

const Products = () => {
  return (
    <div className='productosPageDiv'>
      <Navbar />
      <Product />
      <Footer />
    </div>
  )
}

export default Products
