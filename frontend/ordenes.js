document.addEventListener('DOMContentLoaded', async () => {
    const API_BASE_URL = 'http://192.168.1.8:8000';
    const token = localStorage.getItem('access_token');
    const ordersContainer = document.getElementById('orders-container');

    if (!token) {
        ordersContainer.innerHTML = `<p class="text-danger">Debes iniciar sesión para ver tus órdenes.</p>`;
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/orders/orders`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error('Error al obtener órdenes');

        const orders = await response.json();

        if (orders.length === 0) {
            ordersContainer.innerHTML = `<p class="text-muted">No tienes órdenes registradas.</p>`;
            return;
        }

        // Enriquecer con datos de producto
        const enrichedOrders = await Promise.all(orders.map(async (order) => {
            try {
                const productRes = await fetch(`${API_BASE_URL}/products/products/${order.product_id}`);
                if (productRes.ok) {
                    const product = await productRes.json();
                    return { ...order, product };
                }
            } catch (err) {
                console.error("Error cargando producto:", err);
            }
            return { ...order, product: null };
        }));

        ordersContainer.innerHTML = enrichedOrders.map(order => `
            <div class="col-12 mb-3">
                <div class="card shadow-sm">
                    <div class="card-body">
                        <h5 class="card-title">Orden #${order.id}</h5>
                        ${order.product ? `
                            <img src="${order.product.image_url}" alt="${order.product.name}" class="img-fluid mb-2" style="max-width:150px;">
                            <h6>${order.product.name}</h6>
                            <p>${order.product.description}</p>
                        ` : `<p>Producto ID: ${order.product_id}</p>`}
                        <p><strong>Cantidad:</strong> ${order.quantity}</p>
                        <p><strong>Precio:</strong> $${order.price}</p>
                    </div>
                </div>
            </div>
        `).join('');

    } catch (error) {
        console.error('Error cargando órdenes:', error);
        ordersContainer.innerHTML = `<p class="text-danger">No se pudieron cargar tus órdenes.</p>`;
    }
});
