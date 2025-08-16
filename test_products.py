import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.main import app
from backend.database import Base, get_db
from backend.models import Product, Category
# Importa la función de autenticación para poder sobreescribirla
from backend.auth_service import get_current_user_id

# Configurar la base de datos de prueba en memoria
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="session", autouse=True)
def setup_database():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def db_session():
    """Crea una nueva sesión de base de datos para cada prueba."""
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

# Función para sobrescribir la dependencia de autenticación
def override_get_current_user_id():
    """Simula un usuario logueado devolviendo un ID fijo."""
    return 1 # Devuelve un ID de usuario de prueba, por ejemplo, 1

@pytest.fixture
def client(db_session):
    """Crea un cliente de prueba para la API, inyectando la sesión de prueba."""
    # Sobreescribe la dependencia de base de datos para usar la de prueba
    app.dependency_overrides[get_db] = lambda: db_session
    # Sobreescribe la dependencia de autenticación para que siempre devuelva un usuario válido
    app.dependency_overrides[get_current_user_id] = override_get_current_user_id
    with TestClient(app) as c:
        yield c
    # Limpia las dependencias sobreescritas después de la prueba
    app.dependency_overrides.clear()

def test_create_category(client, db_session):
    """Prueba la creación de una nueva categoría."""
    response = client.post("/products/categories/", json={"name": "Test Category"})
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Test Category"
    assert "id" in data

def test_get_all_categories(client, db_session):
    """Prueba la obtención de todas las categorías."""
    response = client.get("/products/categories/")
    assert response.status_code == 200
    assert len(response.json()) > 0

def test_create_product(client, db_session):
    """Prueba la creación de un nuevo producto."""
    # Primero crea una categoría para asociar el producto
    category_response = client.post("/products/categories/", json={"name": "Test Products Category"})
    category_id = category_response.json()["id"]

    product_data = {
        "name": "Test Product",
        "description": "A product for testing.",
        "price": 10.0,
        "iva": 0.19,
        "image_url": "http://example.com/image.jpg",
        "category_id": category_id
    }
    
    response = client.post("/products/products/", json=product_data)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Test Product"
    assert data["category_id"] == category_id
    
def test_delete_category_deletes_products(client, db_session):
    """
    Prueba que al eliminar una categoría, sus productos asociados también son eliminados.
    """
    # Crea una categoría y un producto para la prueba
    category_response = client.post("/products/categories/", json={"name": "Temp Category"})
    category_id = category_response.json()["id"]

    product_data = {
        "name": "Temp Product",
        "description": "Temp.",
        "price": 5.0,
        "iva": 0.19,
        "image_url": "http://example.com/temp.jpg",
        "category_id": category_id
    }
    client.post("/products/products/", json=product_data)

    # Verifica que el producto existe
    products_before = db_session.query(Product).filter_by(category_id=category_id).all()
    assert len(products_before) == 1

    # Elimina la categoría
    response = client.delete(f"/products/categories/{category_id}")
    assert response.status_code == 204

    # Verifica que el producto ya no existe
    products_after = db_session.query(Product).filter_by(category_id=category_id).all()
    assert len(products_after) == 0