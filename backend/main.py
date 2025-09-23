import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.database import Base, engine
from . import auth_service, products_service, cart_service, orders_service


# Obtiene la ruta al directorio del proyecto y carga el archivo .env
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(project_root, '.env'))

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Tienda API")

# Configuración de CORS
origins = [
    "http://127.0.0.1:5500",
    "http://192.168.1.8:5500",
    "http://localhost:5500",
    "http://localhost:3000",  # React development server
    "http://127.0.0.1:3000",
    "http://192.168.1.8:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_service.router, prefix="/auth", tags=["Auth"])
app.include_router(products_service.router, prefix="/products", tags=["Products"])
app.include_router(cart_service.router, prefix="/cart", tags=["Cart"])
app.include_router(orders_service.router, prefix="/orders", tags=["Orders"])


@app.get("/")
def read_root():
    return {"message": "¡Servidor de Armería está corriendo!"}