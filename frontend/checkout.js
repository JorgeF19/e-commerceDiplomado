document.addEventListener('DOMContentLoaded', function () {
  const cartItemsContainer = document.getElementById('cart-items');
  const cartTotalAmount = document.getElementById('cart-total-amount');

  function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || {};
  }

  function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartIcon();
    displayCartItems();
  }

  function displayCartItems() {
    const cart = getCart();
    cartItemsContainer.innerHTML = '';
    let totalAmount = 0;
    
    if (Object.keys(cart).length === 0) {
      cartItemsContainer.innerHTML = '<p class="text-center">Tu carrito de compras está vacío.</p>';
      cartTotalAmount.textContent = '$0.00';
      return;
    }

    Object.values(cart).forEach(product => {
      const itemElement = document.createElement('div');
      itemElement.classList.add('card', 'mb-3');
      itemElement.innerHTML = `
        <div class="card-body">
          <div class="row align-items-center">
            <div class="col-md-2">
              <img src="${product.image}" alt="${product.name}" class="img-fluid rounded">
            </div>
            <div class="col-md-6">
              <h5 class="card-title">${product.name}</h5>
              <p class="card-text">${product.quantity} x $${product.price.toFixed(2)}</p>
            </div>
            <div class="col-md-2 d-flex align-items-center">
              <input type="number" class="form-control form-control-sm quantity-input" value="${product.quantity}" min="1" data-product-id="${product.id}">
            </div>
            <div class="col-md-2 d-flex align-items-center justify-content-end">
              <button class="btn btn-danger btn-sm remove-item-btn" data-product-id="${product.id}">Eliminar</button>
            </div>
          </div>
        </div>
      `;
      cartItemsContainer.appendChild(itemElement);
      totalAmount += product.quantity * product.price;
    });

    cartTotalAmount.textContent = `$${totalAmount.toFixed(2)}`;
  }

  function updateQuantity(productId, newQuantity) {
    let cart = getCart();
    if (cart[productId]) {
      cart[productId].quantity = newQuantity;
      if (newQuantity <= 0) {
        delete cart[productId];
      }
      saveCart(cart);
    }
  }

  function removeItem(productId) {
    let cart = getCart();
    if (cart[productId]) {
      delete cart[productId];
      saveCart(cart);
    }
  }

  cartItemsContainer.addEventListener('change', function(event) {
    if (event.target.classList.contains('quantity-input')) {
      const productId = event.target.dataset.productId;
      const newQuantity = parseInt(event.target.value);
      updateQuantity(productId, newQuantity);
    }
  });

  cartItemsContainer.addEventListener('click', function(event) {
    if (event.target.classList.contains('remove-item-btn')) {
      const productId = event.target.dataset.productId;
      removeItem(productId);
    }
  });

  function updateCartIcon() {
    let cart = getCart();
    let totalItems = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
    const cartIcon = document.getElementById('cart-total');
    if (cartIcon) {
      cartIcon.textContent = totalItems;
    }
  }

  displayCartItems();
  updateCartIcon();
});