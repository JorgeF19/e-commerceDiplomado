import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getTotalPrice, clearCart } =
    useCart();
  const { user } = useAuth();

  const cartItems = Object.values(cart);

  const handleQuantityChange = (productId, newQuantity) => {
    const quantity = Math.max(0, parseInt(newQuantity) || 0);
    updateQuantity(productId, quantity);
  };

  const handleCheckout = async () => {
    if (!user) {
      alert("Debes iniciar sesión para realizar una compra");
      return;
    }

    if (cartItems.length === 0) {
      alert("El carrito está vacío");
      return;
    }

    try {
      // Aquí implementarías la lógica de checkout con el backend
      const orderData = {
        items: cartItems.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        total: getTotalPrice(),
      };

      console.log("Order data:", orderData);

      // Por ahora solo simulamos el checkout
      alert("¡Pedido realizado con éxito!");
      clearCart();
    } catch (error) {
      console.error("Error en checkout:", error);
      alert("Error al procesar el pedido");
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container my-5">
        <div className="text-center">
          <h2>Tu carrito está vacío</h2>
          <p className="lead">¡Agrega algunos productos increíbles!</p>
          <Link to="/" className="btn btn-primary">
            Continuar comprando
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h1 className="mb-4">Carrito de Compras</h1>

      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Productos en el carrito</h5>
            </div>
            <div className="card-body">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="row align-items-center mb-3 pb-3 border-bottom"
                >
                  <div className="col-md-2">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="img-fluid rounded"
                      style={{ maxHeight: "80px", objectFit: "cover" }}
                    />
                  </div>
                  <div className="col-md-4">
                    <h6>{item.name}</h6>
                    <p className="text-muted small mb-0">{item.description}</p>
                  </div>
                  <div className="col-md-2">
                    <strong>${item.price}</strong>
                  </div>
                  <div className="col-md-2">
                    <div className="input-group">
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity - 1)
                        }
                      >
                        -
                      </button>
                      <input
                        type="number"
                        className="form-control form-control-sm text-center"
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(item.id, e.target.value)
                        }
                        min="0"
                      />
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="col-md-1">
                    <strong>${(item.price * item.quantity).toFixed(2)}</strong>
                  </div>
                  <div className="col-md-1">
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))}

              <div className="text-end mt-3">
                <button
                  className="btn btn-outline-secondary me-2"
                  onClick={clearCart}
                >
                  Vaciar carrito
                </button>
                <Link to="/" className="btn btn-outline-primary">
                  Continuar comprando
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Resumen del pedido</h5>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <strong>${getTotalPrice().toFixed(2)}</strong>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Envío:</span>
                <span>Gratis</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-3">
                <strong>Total:</strong>
                <strong className="text-success">
                  ${getTotalPrice().toFixed(2)}
                </strong>
              </div>

              {user ? (
                <button
                  className="btn btn-success w-100"
                  onClick={handleCheckout}
                >
                  Proceder al pago
                </button>
              ) : (
                <div>
                  <p className="text-muted small mb-2">
                    Debes iniciar sesión para continuar
                  </p>
                  <Link to="/login" className="btn btn-primary w-100">
                    Iniciar sesión
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
