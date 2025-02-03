import { Navbar, Main, Product, Footer } from "../components";
import "../css/home.css";

function Home() {
  
  return (
    <>
    <div className="homePage">
      <Navbar />
      <Main />
      <Product />
      <Footer />
      </div>
    </>
  )
}

export default Home