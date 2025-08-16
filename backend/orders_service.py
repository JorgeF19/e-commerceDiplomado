from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .database import get_db
from .models import OrderItem
from pydantic import BaseModel

router = APIRouter()

# --- Schemas ---
class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int
    price: float

class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    price: float

    class Config:
        from_attributes = True


# Crear pedido (recibe lista de items)
@router.post("/orders", response_model=List[OrderItemResponse])
def create_order(items: List[OrderItemCreate], db: Session = Depends(get_db)):
    order_items = []
    for item in items:
        db_item = OrderItem(
            product_id=item.product_id,
            quantity=item.quantity,
            price=item.price
        )
        db.add(db_item)
        order_items.append(db_item)
    
    db.commit()
    return order_items


# Listar todos los pedidos
@router.get("/orders", response_model=List[OrderItemResponse])
def get_all_orders(db: Session = Depends(get_db)):
    return db.query(OrderItem).all()


# Ver pedido por ID (order_id)
@router.get("/orders/{id}", response_model=List[OrderItemResponse])
def get_order_by_id(id: int, db: Session = Depends(get_db)):
    items = db.query(OrderItem).filter(OrderItem.id == id).all()
    if not items:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")
    return items
