import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const API_BASE_URL = "http://192.168.1.8:8000";

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/products/products/${id}`
      );
      setProduct(response.data);
    } catch (error) {
      console.error("Error al obtener producto:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    alert(`${product.name} añadido al carrito!`);
  };

  if (loading) {
    return (
      <div className="container my-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container my-5 text-center">
        <h2>Producto no encontrado</h2>
        <button className="btn btn-primary" onClick={() => navigate("/")}>
          Volver al inicio
        </button>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <button className="btn btn-link p-0" onClick={() => navigate("/")}>
              Inicio
            </button>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {product.name}
          </li>
        </ol>
      </nav>

      <div className="row">
        <div className="col-md-6">
          <img
            src={product.image_url}
            alt={product.name}
            className="img-fluid rounded shadow"
            style={{ width: "100%", height: "400px", objectFit: "cover" }}
          />
        </div>

        <div className="col-md-6">
          <div className="ps-md-4">
            <h1 className="display-5 mb-3">{product.name}</h1>
            <p className="lead text-success mb-4">${product.price}</p>

            <div className="mb-4">
              <h5>Descripción</h5>
              <p className="text-muted">{product.description}</p>
            </div>

            <div className="mb-4">
              <h6>
                Stock disponible:{" "}
                <span className="text-success">{product.stock}</span>
              </h6>
            </div>

            <div className="row align-items-center mb-4">
              <div className="col-md-4">
                <label htmlFor="quantity" className="form-label">
                  Cantidad:
                </label>
                <input
                  type="number"
                  id="quantity"
                  className="form-control"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                  }
                />
              </div>
            </div>

            <div className="d-grid gap-2 d-md-flex">
              <button
                className="btn btn-success btn-lg me-md-2"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <i className="fas fa-shopping-cart me-2"></i>
                {product.stock === 0 ? "Sin stock" : "Añadir al carrito"}
              </button>
              <button
                className="btn btn-outline-primary btn-lg"
                onClick={() => navigate("/")}
              >
                Seguir comprando
              </button>
            </div>

            <div className="mt-4">
              <h6>
                Categoría:{" "}
                <span className="badge bg-secondary">
                  {product.category?.name}
                </span>
              </h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
