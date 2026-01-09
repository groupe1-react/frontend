import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import Home from "./pages/Home/Home";
import Navbar from "./components/Navbar/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Cart from "./pages/Cart";
import Register from "./pages/Register";
import Products from "./pages/Products";
import Login from "./pages/Login/Login";
import ProductDetails from "./pages/ProductsDetails";


function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/register" element={<Register />} />
        <Route path="products" element={<Products />} />
        <Route path="login" element={<Login />} />
        <Route path="/products/:id" element={<ProductDetails/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
