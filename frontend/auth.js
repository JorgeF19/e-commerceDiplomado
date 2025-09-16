// URL base de tu API de FastAPI
const API_URL = 'http://192.168.1.8:8000';

// Función para obtener y mostrar la información del usuario
async function fetchAndRenderProfile() {
    const token = localStorage.getItem('access_token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch(`${API_URL}/auth/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 401 || response.status === 403) {
            alert("Tu sesión ha expirado. Por favor, inicia sesión de nuevo.");
            localStorage.removeItem('access_token');
            window.location.href = 'login.html';
            return;
        }

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const user = await response.json();
        
        const usernameDisplay = document.getElementById('username-display');
        if (usernameDisplay) {
            usernameDisplay.textContent = user.email; // ahora mostramos email
        }

        fetchAndRenderOrders(token);

    } catch (error) {
        console.error("Error al obtener el perfil del usuario:", error);
    }
}

// Obtiene las órdenes del usuario y las muestra en la página
async function fetchAndRenderOrders(token) {
    try {
        const response = await fetch(`${API_URL}/orders`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const orders = await response.json();
        const ordersList = document.getElementById('orders-list');
        
        if (orders.length === 0) {
            ordersList.innerHTML = '<p>No tienes órdenes registradas.</p>';
            return;
        }

        let ordersHtml = '<ul>';
        orders.forEach(order => {
            ordersHtml += `
                <li>
                    <strong>Orden #${order.id}</strong> - Total: $${order.total.toFixed(2)} - Estado: ${order.status}
                </li>
            `;
        });
        ordersHtml += '</ul>';
        ordersList.innerHTML = ordersHtml;

    } catch (error) {
        console.error("Error al obtener las órdenes:", error);
        const ordersList = document.getElementById('orders-list');
        ordersList.innerHTML = '<p>No se pudieron cargar tus órdenes.</p>';
    }
}

// Función para cerrar sesión
function logout() {
    localStorage.removeItem('access_token');
    alert('Has cerrado sesión correctamente.');
    window.location.href = 'login.html';
}

// Listener principal
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const logoutBtn = document.getElementById('logout-btn');

    // LOGIN
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch(`${API_URL}/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                const result = await response.json();

                if (response.ok) {
                    localStorage.setItem('access_token', result.access_token);
                    alert('¡Inicio de sesión exitoso!');
                    window.location.href = 'admin.html'; 
                } else {
                    alert('Error en el inicio de sesión: ' + result.detail);
                }
            } catch (error) {
                console.error('Error de red al iniciar sesión:', error);
                alert('No se pudo conectar con el servidor.');
            }
        });
    }

    // REGISTRO
    if (registerForm) {
        registerForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            if (password !== confirmPassword) {
                alert('Las contraseñas no coinciden.');
                return;
            }

            try {
                const response = await fetch(`${API_URL}/auth/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                const result = await response.json();

                if (response.ok) {
                    alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
                    window.location.href = 'login.html'; 
                } else {
                    alert('Error en el registro: ' + result.detail);
                }
            } catch (error) {
                console.error('Error de red al registrarse:', error);
                alert('No se pudo conectar con el servidor.');
            }
        });
    }

    // PERFIL
    if (window.location.pathname.endsWith('profile.html')) {
        fetchAndRenderProfile();
        if (logoutBtn) {
            logoutBtn.addEventListener('click', logout);
        }
    }
});
