import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const API_BASE_URL = "http://192.168.1.8:8000";

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchOrders();
  }, [user, navigate]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(response.data);
    } catch (error) {
      console.error("Error al obtener órdenes:", error);
      if (error.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { class: "bg-warning", text: "Pendiente" },
      processing: { class: "bg-info", text: "Procesando" },
      shipped: { class: "bg-primary", text: "Enviado" },
      delivered: { class: "bg-success", text: "Entregado" },
      cancelled: { class: "bg-danger", text: "Cancelado" },
    };

    const statusInfo = statusMap[status] || {
      class: "bg-secondary",
      text: status,
    };
    return (
      <span className={`badge ${statusInfo.class}`}>{statusInfo.text}</span>
    );
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
    <div className="container my-5">
      <h1 className="mb-4">Mis Órdenes</h1>

      {orders.length === 0 ? (
        <div className="text-center">
          <h3>No tienes órdenes aún</h3>
          <p className="text-muted">¡Realiza tu primera compra!</p>
          <button className="btn btn-primary" onClick={() => navigate("/")}>
            Explorar productos
          </button>
        </div>
      ) : (
        <div className="row">
          {orders.map((order) => (
            <div key={order.id} className="col-md-12 mb-4">
              <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <div>
                    <strong>Orden #{order.id}</strong>
                    <small className="text-muted ms-2">
                      {formatDate(order.created_at)}
                    </small>
                  </div>
                  <div>{getStatusBadge(order.status)}</div>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-8">
                      <h6>Productos:</h6>
                      {order.items &&
                        order.items.map((item) => (
                          <div
                            key={item.id}
                            className="d-flex justify-content-between align-items-center mb-2"
                          >
                            <div>
                              <span>{item.product_name || "Producto"}</span>
                              <small className="text-muted">
                                {" "}
                                x{item.quantity}
                              </small>
                            </div>
                            <span>
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                    </div>
                    <div className="col-md-4 text-end">
                      <h5>
                        Total:{" "}
                        <span className="text-success">${order.total}</span>
                      </h5>
                      {order.status === "pending" && (
                        <button className="btn btn-outline-danger btn-sm mt-2">
                          Cancelar orden
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
