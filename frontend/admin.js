const API_BASE_URL = 'http://192.168.1.8:8000/products';


async function fetchAPI(url, method = 'GET', body = null) {
    try {
        const token = localStorage.getItem('access_token');
        
        if (!token) {
            alert('No tienes sesión iniciada. Redirigiendo a la página de inicio de sesión.');
            window.location.href = 'login.html';
            return;
        }

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };

        const config = { method, headers };
        if (body) {
            config.body = JSON.stringify(body);
        }

        const response = await fetch(url, config);
        
        if (response.status === 401 || response.status === 403) {
            alert('Tu sesión ha expirado o no tienes permisos. Por favor, inicia sesión de nuevo.');
            localStorage.removeItem('access_token');
            window.location.href = 'login.html';
            return null;
        }

        if (response.status === 204) {
            return null;
        }

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || `Error de la API: ${response.status}`);
        }

        return data;
    } catch (error) {
        console.error(`Error en la solicitud ${method} a ${url}:`, error);
        alert(`Error: ${error.message}`);
        return null;
    }
}


document.addEventListener('DOMContentLoaded', async () => {
    const categoriesList = document.getElementById('categories-list');
    const productsList = document.getElementById('products-list');
    const categoryForm = document.getElementById('category-form');
    const productForm = document.getElementById('product-form');
    const productCategorySelect = document.getElementById('product-category');
    const productNameInput = document.getElementById('product-name');
    const productDescriptionInput = document.getElementById('product-description');
    const productPriceInput = document.getElementById('product-price');
    const productImageInput = document.getElementById('product-image');
    const productSubmitBtn = document.getElementById('product-submit-btn');

    async function loadAllData() {
        await loadCategories();
        await loadProducts();
    }
    
    async function loadCategories() {
        const categories = await fetchAPI(`${API_BASE_URL}/categories/`);
        if (categories) {
            renderCategories(categories);
            populateCategorySelect(categories);
        }
    }

    async function loadProducts() {
        const products = await fetchAPI(`${API_BASE_URL}/products/`);
        if (products) {
            renderProducts(products);
        }
    }
    
    function renderCategories(categories) {
        categoriesList.innerHTML = '';
        categories.forEach(category => {
            const li = document.createElement('li');
            li.className = 'item';
            li.innerHTML = `
                <span>${category.name}</span>
                <div class="item-actions">
                    <button class="delete-btn" data-id="${category.id}">Eliminar</button>
                </div>
            `;
            categoriesList.appendChild(li);
        });
    }

    function populateCategorySelect(categories) {
        productCategorySelect.innerHTML = '<option value="">Selecciona una categoría</option>';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            productCategorySelect.appendChild(option);
        });
    }

    function renderProducts(products) {
        productsList.innerHTML = '';
        products.forEach(product => {
            const li = document.createElement('li');
            li.className = 'item product-item';
            li.innerHTML = `
                <div class="product-details">
                    <h4>${product.name}</h4>
                    <p>${product.description}</p>
                    <p><strong>Precio:</strong> $${product.price.toFixed(2)}</p>
                </div>
                <div class="item-actions">
                    <button class="edit-btn" data-id="${product.id}">Editar</button>
                    <button class="delete-btn" data-id="${product.id}">Eliminar</button>
                </div>
            `;
            productsList.appendChild(li);
        });
    }

    
    categoryForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('category-name').value;
        await fetchAPI(`${API_BASE_URL}/categories/`, 'POST', { name });
        categoryForm.reset();
        await loadAllData();
    });

    categoriesList.addEventListener('click', async (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const id = e.target.dataset.id;
            if (confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
                await fetchAPI(`${API_BASE_URL}/categories/${id}`, 'DELETE');
                await loadAllData();
            }
        }
    });

    productForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('product-id').value;
        const productData = {
            name: productNameInput.value,
            description: productDescriptionInput.value,
            price: parseFloat(productPriceInput.value),
            image_url: productImageInput.value,
            category_id: parseInt(productCategorySelect.value)
        };

        if (id) {
            await fetchAPI(`${API_BASE_URL}/products/${id}`, 'PUT', productData);
        } else {
            await fetchAPI(`${API_BASE_URL}/products/`, 'POST', productData);
        }

        productForm.reset();
        document.getElementById('product-id').value = '';
        productSubmitBtn.textContent = 'Crear Producto';
        await loadProducts();
    });

    productsList.addEventListener('click', async (e) => {
        const id = e.target.dataset.id;
        if (e.target.classList.contains('delete-btn')) {
            if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
                await fetchAPI(`${API_BASE_URL}/products/${id}`, 'DELETE');
                await loadProducts();
            }
        }
        if (e.target.classList.contains('edit-btn')) {
            const product = await fetchAPI(`${API_BASE_URL}/products/${id}`);
            if (product) {
                document.getElementById('product-id').value = product.id;
                document.getElementById('product-name').value = product.name;
                document.getElementById('product-description').value = product.description;
                document.getElementById('product-price').value = product.price;
                document.getElementById('product-image').value = product.image_url;
                document.getElementById('product-category').value = product.category_id;
                productSubmitBtn.textContent = 'Actualizar Producto';
            }
        }
    });

    loadAllData();
});

