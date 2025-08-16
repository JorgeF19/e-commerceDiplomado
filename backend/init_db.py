from backend.database import Base, engine

# Importar todos los modelos
from backend.auth_service import User
from backend.products_service import Product
from backend.cart_service import CartItem
from backend.orders_service import Order

print("Creando tablas en la base de datos...")

# Crear todas las tablas
Base.metadata.create_all(bind=engine)

print("Tablas creadas con éxito")
