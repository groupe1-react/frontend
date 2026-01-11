import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Navbar from "./components/Navbar/Navbar";
import Auth from "./pages/Auth";
import Products from "./pages/Products";
import Cart from "./pages/Cart";




function App() {
  return (
    <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/products" element={<Products />} />
        <Route path="/cart" element={<Cart />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;
