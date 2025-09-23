import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de un CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({});

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      // Filtrar items con cantidad válida
      const filteredCart = {};
      for (const key in parsedCart) {
        if (
          parsedCart[key] &&
          typeof parsedCart[key].quantity === "number" &&
          parsedCart[key].quantity > 0
        ) {
          filteredCart[key] = parsedCart[key];
        }
      }
      setCart(filteredCart);
    }
  }, []);

  const saveCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const addToCart = (product, quantity = 1) => {
    if (quantity < 1) quantity = 1;
    const newCart = { ...cart };

    if (newCart[product.id]) {
      newCart[product.id].quantity += quantity;
    } else {
      newCart[product.id] = { ...product, quantity };
    }

    saveCart(newCart);
  };

  const removeFromCart = (productId) => {
    const newCart = { ...cart };
    delete newCart[productId];
    saveCart(newCart);
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const newCart = { ...cart };
    if (newCart[productId]) {
      newCart[productId].quantity = quantity;
      saveCart(newCart);
    }
  };

  const clearCart = () => {
    saveCart({});
  };

  const getTotalItems = () => {
    return Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return Object.values(cart).reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
