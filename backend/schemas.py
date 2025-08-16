from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

# Autenticación
class TokenOut(BaseModel):
    access_token: str

class LoginIn(BaseModel):
    username: str
    password: str

# Categorías
class CategoryCreate(BaseModel):
    name: str = Field(min_length=2, max_length=100)

class CategoryOut(BaseModel):
    id: int
    name: str
    class Config:
        from_attributes = True

# Productos
class ProductCreate(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    iva: float = 0.19
    image_url: Optional[str] = None
    category_id: Optional[int] = None

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    iva: Optional[float] = None
    image_url: Optional[str] = None
    category_id: Optional[int] = None

class ProductOut(BaseModel):
    id: int
    name: str
    description: Optional[str]
    price: float
    iva: float
    image_url: Optional[str]
    category_id: Optional[int] 
    class Config:
        from_attributes = True

# Carrito
class CartItemIn(BaseModel):
    product_id: int
    quantity: int = 1

class CartItemOut(BaseModel):
    id: int
    product_id: int
    quantity: int
    class Config:
        from_attributes = True


#  Pedidos

# Item dentro de una orden
class OrderItemBase(BaseModel):
    product_id: int
    quantity: int
    price: float

class OrderItemCreate(OrderItemBase):
    pass

class OrderItemOut(OrderItemBase):
    id: int
    order_id: int
    class Config:
        from_attributes = True

# Orden completa
class OrderBase(BaseModel):
    user_id: int
    total_amount: float

class OrderCreate(OrderBase):
    items: List[OrderItemCreate]

class OrderOut(OrderBase):
    id: int
    created_at: datetime
    items: List[OrderItemOut] = []
    class Config:
        from_attributes = True