import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Admin = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("products");
  const [loading, setLoading] = useState(true);

  // Estados para formularios
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category_id: "",
    image_url: "",
  });
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);

  const { user, token, isAdmin } = useAuth();
  const navigate = useNavigate();

  const API_BASE_URL = "http://192.168.1.8:8000";

  useEffect(() => {
    if (!user || !isAdmin()) {
      navigate("/");
      return;
    }
    fetchData();
  }, [user, navigate, isAdmin]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsRes, categoriesRes, ordersRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/products/products/`),
        axios.get(`${API_BASE_URL}/products/categories/`),
        axios.get(`${API_BASE_URL}/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
      setOrders(ordersRes.data);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        ...productForm,
        price: parseFloat(productForm.price),
        stock: parseInt(productForm.stock),
        category_id: parseInt(productForm.category_id),
      };

      if (editingProduct) {
        await axios.put(
          `${API_BASE_URL}/products/products/${editingProduct.id}`,
          productData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        await axios.post(`${API_BASE_URL}/products/products/`, productData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      resetProductForm();
      fetchData();
    } catch (error) {
      console.error("Error al guardar producto:", error);
      alert("Error al guardar el producto");
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await axios.put(
          `${API_BASE_URL}/products/categories/${editingCategory.id}`,
          categoryForm,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        await axios.post(`${API_BASE_URL}/products/categories/`, categoryForm, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      resetCategoryForm();
      fetchData();
    } catch (error) {
      console.error("Error al guardar categoría:", error);
      alert("Error al guardar la categoría");
    }
  };

  const deleteProduct = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este producto?")) {
      try {
        await axios.delete(`${API_BASE_URL}/products/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchData();
      } catch (error) {
        console.error("Error al eliminar producto:", error);
        alert("Error al eliminar el producto");
      }
    }
  };

  const deleteCategory = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar esta categoría?")) {
      try {
        await axios.delete(`${API_BASE_URL}/products/categories/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchData();
      } catch (error) {
        console.error("Error al eliminar categoría:", error);
        alert("Error al eliminar la categoría");
      }
    }
  };

  const editProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category_id: product.category_id,
      image_url: product.image_url,
    });
  };

  const editCategory = (category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      description: category.description,
    });
  };

  const resetProductForm = () => {
    setProductForm({
      name: "",
      description: "",
      price: "",
      stock: "",
      category_id: "",
      image_url: "",
    });
    setEditingProduct(null);
  };

  const resetCategoryForm = () => {
    setCategoryForm({
      name: "",
      description: "",
    });
    setEditingCategory(null);
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

  return (
    <div className="container-fluid my-5">
      <h1 className="mb-4">Panel de Administración</h1>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "products" ? "active" : ""}`}
            onClick={() => setActiveTab("products")}
          >
            Productos
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "categories" ? "active" : ""}`}
            onClick={() => setActiveTab("categories")}
          >
            Categorías
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            Órdenes
          </button>
        </li>
      </ul>

      {/* Products Tab */}
      {activeTab === "products" && (
        <div className="row">
          <div className="col-md-4">
            <div className="card">
              <div className="card-header">
                <h5>
                  {editingProduct ? "Editar Producto" : "Agregar Producto"}
                </h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleProductSubmit}>
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nombre del producto"
                      value={productForm.name}
                      onChange={(e) =>
                        setProductForm({ ...productForm, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <textarea
                      className="form-control"
                      placeholder="Descripción"
                      value={productForm.description}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          description: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      placeholder="Precio"
                      value={productForm.price}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          price: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Stock"
                      value={productForm.stock}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          stock: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <select
                      className="form-select"
                      value={productForm.category_id}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          category_id: e.target.value,
                        })
                      }
                      required
                    >
                      <option value="">Seleccionar categoría</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <input
                      type="url"
                      className="form-control"
                      placeholder="URL de la imagen"
                      value={productForm.image_url}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          image_url: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="d-grid gap-2">
                    <button type="submit" className="btn btn-primary">
                      {editingProduct ? "Actualizar" : "Agregar"} Producto
                    </button>
                    {editingProduct && (
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={resetProductForm}
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="col-md-8">
            <div className="card">
              <div className="card-header">
                <h5>Lista de Productos</h5>
              </div>
              <div className="card-body">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="d-flex justify-content-between align-items-center border-bottom py-3"
                  >
                    <div className="d-flex align-items-center">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "cover",
                        }}
                        className="me-3 rounded"
                      />
                      <div>
                        <h6 className="mb-1">{product.name}</h6>
                        <small className="text-muted">
                          ${product.price} | Stock: {product.stock}
                        </small>
                      </div>
                    </div>
                    <div>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => editProduct(product)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => deleteProduct(product.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Categories Tab */}
      {activeTab === "categories" && (
        <div className="row">
          <div className="col-md-4">
            <div className="card">
              <div className="card-header">
                <h5>
                  {editingCategory ? "Editar Categoría" : "Agregar Categoría"}
                </h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleCategorySubmit}>
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nombre de la categoría"
                      value={categoryForm.name}
                      onChange={(e) =>
                        setCategoryForm({
                          ...categoryForm,
                          name: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <textarea
                      className="form-control"
                      placeholder="Descripción"
                      value={categoryForm.description}
                      onChange={(e) =>
                        setCategoryForm({
                          ...categoryForm,
                          description: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="d-grid gap-2">
                    <button type="submit" className="btn btn-primary">
                      {editingCategory ? "Actualizar" : "Agregar"} Categoría
                    </button>
                    {editingCategory && (
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={resetCategoryForm}
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="col-md-8">
            <div className="card">
              <div className="card-header">
                <h5>Lista de Categorías</h5>
              </div>
              <div className="card-body">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="d-flex justify-content-between align-items-center border-bottom py-3"
                  >
                    <div>
                      <h6 className="mb-1">{category.name}</h6>
                      <small className="text-muted">
                        {category.description}
                      </small>
                    </div>
                    <div>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => editCategory(category)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => deleteCategory(category.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === "orders" && (
        <div className="card">
          <div className="card-header">
            <h5>Gestión de Órdenes</h5>
          </div>
          <div className="card-body">
            {orders.map((order) => (
              <div key={order.id} className="border-bottom py-3">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h6>Orden #{order.id}</h6>
                    <p className="mb-1">Usuario: {order.user_email || "N/A"}</p>
                    <p className="mb-1">Total: ${order.total}</p>
                    <small className="text-muted">
                      {new Date(order.created_at).toLocaleDateString()}
                    </small>
                  </div>
                  <div>
                    <span
                      className={`badge ${
                        order.status === "pending"
                          ? "bg-warning"
                          : order.status === "processing"
                          ? "bg-info"
                          : order.status === "shipped"
                          ? "bg-primary"
                          : order.status === "delivered"
                          ? "bg-success"
                          : "bg-danger"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
