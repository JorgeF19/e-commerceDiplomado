import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});
  const { addToCart } = useCart();

  const API_BASE_URL = "http://192.168.1.8:8000";

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products/categories/`);
      setCategories(response.data);
    } catch (error) {
      console.error("Error al obtener categorías:", error);
    }
  };

  const fetchProducts = async (categoryId = null) => {
    try {
      setLoading(true);
      const url = categoryId
        ? `${API_BASE_URL}/products/products/?category_id=${categoryId}`
        : `${API_BASE_URL}/products/products/`;

      const response = await axios.get(url);
      setProducts(response.data);

      // Inicializar cantidades por defecto
      const defaultQuantities = {};
      response.data.forEach((product) => {
        defaultQuantities[product.id] = 1;
      });
      setQuantities(defaultQuantities);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    fetchProducts(categoryId || null);
  };

  const handleQuantityChange = (productId, quantity) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(1, parseInt(quantity) || 1),
    }));
  };

  const handleAddToCart = (product) => {
    const quantity = quantities[product.id] || 1;
    addToCart(product, quantity);
    alert(`${product.name} añadido al carrito!`);
  };

  return (
    <div>
      {/* Header */}
      <header className="bg-dark text-white text-center py-5">
        <div className="container">
          <img
            src="https://ideogram.ai/assets/image/lossless/response/-vhLE8H0T12kleJrD7o8hA"
            alt="Logo"
            className="logo mb-4"
            style={{ maxWidth: "240px" }}
          />
          <h1 className="display-4">Armería Vanguard</h1>
          <p className="lead">Las mejores armas para tu seguridad y defensa</p>
        </div>
      </header>

      {/* Content */}
      <div className="container my-5">
        <h1 className="text-center mb-4">Nuestros Productos</h1>

        {/* Category Filter */}
        <div className="mb-4">
          <select
            className="form-select"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="">Todas las categorías</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
          </div>
        ) : (
          <div className="row">
            {products.length > 0 ? (
              products.map((product) => (
                <div key={product.id} className="col-lg-4 col-md-6 mb-4">
                  <div className="card h-100">
                    <Link to={`/product/${product.id}`}>
                      <img
                        className="card-img-top"
                        src={product.image_url}
                        alt={product.name}
                        style={{ height: "200px", objectFit: "cover" }}
                      />
                    </Link>
                    <div className="card-body">
                      <h4 className="card-title">
                        <Link
                          to={`/product/${product.id}`}
                          className="text-decoration-none"
                        >
                          {product.name}
                        </Link>
                      </h4>
                      <h5 className="text-success">${product.price}</h5>
                      <p className="card-text">{product.description}</p>
                      <div className="input-group mb-2">
                        <input
                          type="number"
                          className="form-control"
                          min="1"
                          value={quantities[product.id] || 1}
                          onChange={(e) =>
                            handleQuantityChange(product.id, e.target.value)
                          }
                        />
                        <button
                          className="btn btn-success"
                          onClick={() => handleAddToCart(product)}
                        >
                          Añadir al Carrito
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center">No hay productos disponibles.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
