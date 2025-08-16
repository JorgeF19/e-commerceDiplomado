import os
from passlib.context import CryptContext
from dotenv import load_dotenv

# Carga las variables de entorno
load_dotenv()

# Usa el mismo contexto de passlib que en auth_service.py
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Lee la contraseña en texto plano desde la variable de entorno
plain_password = os.getenv("PLAIN_PASSWORD")

# Genera el hash de la contraseña
hashed_password = pwd_context.hash(plain_password)

print("Contraseña hasheada:", hashed_password)