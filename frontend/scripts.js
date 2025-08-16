document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = 'http://192.168.1.8:8000';

    const getCart = () => {
        const cart = JSON.parse(localStorage.getItem('cart')) || {};
        const filteredCart = {};
        for (const key in cart) {
            if (cart[key] && typeof cart[key].quantity === 'number' && cart[key].quantity > 0) {
                filteredCart[key] = cart[key];
            }
        }
        return filteredCart;
    };

    const saveCart = (cart) => localStorage.setItem('cart', JSON.stringify(cart));

    const updateCartIcon = () => {
        const cart = getCart();
        const totalItems = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) cartCountElement.textContent = totalItems;
    };

    const addToCart = (product, quantity = 1) => {
        if (quantity < 1) quantity = 1;
        const cart = getCart();
        if (cart[product.id]) {
            cart[product.id].quantity += quantity;
        } else {
            cart[product.id] = { ...product, quantity };
        }
        saveCart(cart);
        updateCartIcon();
    };

    async function fetchCategories() {
        try {
            const response = await fetch(`${API_BASE_URL}/products/categories/`);
            if (!response.ok) throw new Error('Error al obtener las categorías.');
            const categories = await response.json();
            populateCategorySelect(categories);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    }

    function populateCategorySelect(categories) {
        const select = document.getElementById('category-select');
        if (!select) return;
        select.innerHTML = '<option value="">Todas las categorías</option>';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            select.appendChild(option);
        });
    }

    async function fetchProducts(categoryId = null) {
        try {
            const url = categoryId
                ? `${API_BASE_URL}/products/products/?category_id=${categoryId}`
                : `${API_BASE_URL}/products/products/`;

            const response = await fetch(url);
            if (!response.ok) throw new Error('Error al cargar productos');
            const products = await response.json();
            renderProducts(products);
        } catch (error) {
            console.error('Error fetching products:', error);
            const container = document.getElementById('products-container');
            if (container) container.innerHTML = '<p class="text-danger">No se pudieron cargar los productos.</p>';
        }
    }

    function renderProducts(products) {
        const container = document.getElementById('products-container');
        if (!container) return;
        container.innerHTML = products.length
            ? products.map(product => `
                <div class="col-lg-4 col-md-6 mb-4">
                    <div class="card h-100">
                        <a href="product.html?id=${product.id}">
                            <img class="card-img-top" src="${product.image_url}" alt="${product.name}">
                        </a>
                        <div class="card-body">
                            <h4 class="card-title">
                                <a href="product.html?id=${product.id}">${product.name}</a>
                            </h4>
                            <h5>$${product.price}</h5>
                            <p class="card-text">${product.description}</p>
                            <div class="input-group mb-2">
                                <input type="number" class="form-control product-quantity" min="1" value="1" data-product-id="${product.id}">
                                <button class="btn btn-success add-to-cart-btn" data-product-id="${product.id}">Añadir al Carrito</button>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('')
            : '<p class="text-center">No hay productos disponibles.</p>';

        // Añadir al carrito
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const productId = btn.dataset.productId;
                const qtyInput = document.querySelector(`.product-quantity[data-product-id="${productId}"]`);
                let quantity = qtyInput ? parseInt(qtyInput.value) || 1 : 1;
                if (quantity < 1) quantity = 1;

                try {
                    const response = await fetch(`${API_BASE_URL}/products/products/${productId}`);
                    if (!response.ok) throw new Error('Producto no encontrado');
                    const product = await response.json();
                    addToCart(product, quantity);
                    alert(`${product.name} añadido al carrito (${quantity} unidades)`);
                } catch (error) {
                    console.error(error);
                }
            });
        });
    }

    async function fetchProductDetails() {
        const params = new URLSearchParams(window.location.search);
        const productId = params.get('id');
        if (!productId) return;
        try {
            const response = await fetch(`${API_BASE_URL}/products/products/${productId}`);
            if (!response.ok) throw new Error('Producto no encontrado');
            const product = await response.json();
            renderProductDetails(product);
        } catch (error) {
            console.error(error);
            const container = document.getElementById('product-details-container');
            if (container) container.innerHTML = `<p class="text-danger">${error.message}</p>`;
        }
    }

    function renderProductDetails(product) {
        const titleElement = document.getElementById('product-title');
        const container = document.getElementById('product-details-container');
        if (!titleElement || !container) return;

        titleElement.textContent = product.name;
        container.innerHTML = `
            <div class="col-md-6">
                <img src="${product.image_url}" class="img-fluid product-image-detail" alt="${product.name}">
            </div>
            <div class="col-md-6">
                <h2>${product.name}</h2>
                <p class="text-muted">${product.description}</p>
                <h3 class="text-primary">$${product.price}</h3>
                <div class="mt-4">
                    <input type="number" class="form-control product-quantity-detail" min="1" value="1">
                    <button class="btn btn-success btn-lg mt-2" id="add-to-cart-btn">Añadir al carrito</button>
                </div>
            </div>
        `;

        const addBtn = document.getElementById('add-to-cart-btn');
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                const qtyInput = document.querySelector('.product-quantity-detail');
                let quantity = qtyInput ? parseInt(qtyInput.value) || 1 : 1;
                if (quantity < 1) quantity = 1;
                addToCart(product, quantity);
                alert(`${product.name} añadido al carrito (${quantity} unidades)`);
            });
        }
    }

    function renderCartItems() {
        const cart = getCart();
        const container = document.getElementById('cart-items');
        const totalAmountElement = document.getElementById('cart-total-amount');

        if (!container || !totalAmountElement) return;
        container.innerHTML = '';
        let totalAmount = 0;

        if (Object.keys(cart).length === 0) {
            container.innerHTML = '<p class="text-center">Tu carrito está vacío.</p>';
            totalAmountElement.textContent = '0.00';
            return;
        }

        Object.values(cart).forEach(item => {
            totalAmount += item.price * item.quantity;

            const card = document.createElement('div');
            card.className = 'card mb-3';
            card.innerHTML = `
                <div class="card-body">
                    <div class="row align-items-center">
                        <div class="col-md-2">
                            <img src="${item.image_url}" class="img-fluid rounded" alt="${item.name}">
                        </div>
                        <div class="col-md-6">
                            <h5 class="card-title">${item.name}</h5>
                            <p class="card-text">$${item.price} cada uno</p>
                        </div>
                        <div class="col-md-2">
                            <input type="number" class="form-control cart-quantity-input" min="1" value="${item.quantity}" data-product-id="${item.id}">
                        </div>
                        <div class="col-md-2 text-end">
                            <button class="btn btn-danger remove-item-btn" data-product-id="${item.id}">Eliminar</button>
                        </div>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });

        totalAmountElement.textContent = totalAmount.toFixed(2);

        container.querySelectorAll('.remove-item-btn').forEach(btn => {
            btn.addEventListener('click', e => {
                const productId = e.target.dataset.productId;
                const cart = getCart();
                delete cart[productId];
                saveCart(cart);
                renderCartItems();
                updateCartIcon();
            });
        });

        container.querySelectorAll('.cart-quantity-input').forEach(input => {
            input.addEventListener('input', e => {
                const productId = e.target.dataset.productId;
                let newQuantity = parseInt(e.target.value);
                if (isNaN(newQuantity) || newQuantity < 1) newQuantity = 1;
                e.target.value = newQuantity;
                const cart = getCart();
                if (cart[productId]) {
                    cart[productId].quantity = newQuantity;
                    saveCart(cart);
                    // Solo actualiza el total
                    let total = 0;
                    Object.values(cart).forEach(i => total += i.price * i.quantity);
                    totalAmountElement.textContent = total.toFixed(2);
                    updateCartIcon();
                }
            });
        });

        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.onclick = async () => {
                const cart = getCart();
                if (Object.keys(cart).length === 0) {
                    alert('El carrito está vacío.');
                    return;
                }
                const token = localStorage.getItem('access_token');
                if (!token) {
                    alert('Debes iniciar sesión para comprar.');
                    return;
                }

                const items = Object.values(cart).map(item => ({
                    order_id: null,
                    product_id: item.id,
                    quantity: item.quantity,
                    price: item.price
                }));

                try {
                    const response = await fetch(`${API_BASE_URL}/orders/orders`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify(items)
                    });
                    if (!response.ok) throw new Error('Error al procesar la compra.');
                    localStorage.removeItem('cart');
                    alert('Compra realizada con éxito!');
                    window.location.href = 'index.html';
                } catch (error) {
                    console.error(error);
                    alert('Ocurrió un error al procesar tu compra.');
                }
            };
        }
    }

    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage === 'index.html' || currentPage === '') {
        fetchCategories();
        fetchProducts();
        const categorySelect = document.getElementById('category-select');
        if (categorySelect) {
            categorySelect.addEventListener('change', (e) => fetchProducts(e.target.value));
        }
    } else if (currentPage === 'product.html') {
        fetchProductDetails();
    } else if (currentPage === 'carrito.html') {
        renderCartItems();
    }

    updateCartIcon();
});
