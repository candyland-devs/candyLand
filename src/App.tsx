import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";  // ← Importa
import Home from "./pages/Home/Home";
import CatalogPage from "./pages/Catalog/CatalogPage";
import Layout from "./layout/Layout";
import CarritoPage from "./pages/CarritoPage";


const App: React.FC = () => {
  return (
    <CartProvider>  {/* ← Ya deberías tenerlo */}
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalogo" element={<CatalogPage />} />
            <Route path="/carrito" element={<CarritoPage />} />
          </Routes>
        </Layout>
      </Router>
    </CartProvider>
  );
};

export default App;
