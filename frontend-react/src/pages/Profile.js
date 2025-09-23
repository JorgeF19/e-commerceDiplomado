import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!user) {
    return null;
  }

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h3 className="mb-0">Mi Perfil</h3>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">
                      <strong>Email:</strong>
                    </label>
                    <p className="form-control-plaintext">{user.email}</p>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">
                      <strong>Rol:</strong>
                    </label>
                    <p className="form-control-plaintext">
                      <span
                        className={`badge ${
                          user.role === "admin" ? "bg-danger" : "bg-secondary"
                        }`}
                      >
                        {user.role === "admin" ? "Administrador" : "Usuario"}
                      </span>
                    </p>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">
                      <strong>Estado:</strong>
                    </label>
                    <p className="form-control-plaintext">
                      <span
                        className={`badge ${
                          user.is_active ? "bg-success" : "bg-danger"
                        }`}
                      >
                        {user.is_active ? "Activo" : "Inactivo"}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="d-grid gap-2">
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => navigate("/orders")}
                    >
                      <i className="fas fa-shopping-bag me-2"></i>
                      Mis Órdenes
                    </button>

                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => navigate("/cart")}
                    >
                      <i className="fas fa-shopping-cart me-2"></i>
                      Mi Carrito
                    </button>

                    {user.role === "admin" && (
                      <button
                        className="btn btn-outline-info"
                        onClick={() => navigate("/admin")}
                      >
                        <i className="fas fa-cog me-2"></i>
                        Panel de Admin
                      </button>
                    )}

                    <hr />

                    <button className="btn btn-danger" onClick={handleLogout}>
                      <i className="fas fa-sign-out-alt me-2"></i>
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
