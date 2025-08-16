document.addEventListener('DOMContentLoaded', () => {
    const authLink = document.getElementById('auth-link');
    const adminLinkContainer = document.getElementById('admin-link-container');
    const token = localStorage.getItem('access_token');

    
    if (token) {
        
        authLink.href = "#";
        authLink.textContent = "Cerrar Sesión";
        authLink.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('access_token');
            window.location.href = 'login.html';
        });

        
        if (adminLinkContainer) {
            adminLinkContainer.classList.remove('d-none');
        }
    } else {
        
        authLink.href = "login.html";
        authLink.textContent = "Iniciar Sesión";

        
        if (adminLinkContainer) {
            adminLinkContainer.classList.add('d-none');
        }
    }
});