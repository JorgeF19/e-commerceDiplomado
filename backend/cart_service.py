from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from pydantic import BaseModel, Field

from .database import get_db
from .models import CartItem, Product
from .auth_service import get_current_user_id

router = APIRouter()

# Schemas del carrito
class CartItemResponse(BaseModel):
    product_id: int
    quantity: int
    
    class Config:
        from_attributes = True

# Endpoint para agregar un producto al carrito
@router.post("/cart/add/{product_id}", status_code=status.HTTP_200_OK)
def add_to_cart(product_id: int, db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
        
    db_cart_item = db.query(CartItem).filter(CartItem.user_id == user_id, CartItem.product_id == product_id).first()
    
    if db_cart_item:
        db_cart_item.quantity += 1
    else:
        db_cart_item = CartItem(user_id=user_id, product_id=product_id, quantity=1)
        db.add(db_cart_item)
    
    db.commit()
    db.refresh(db_cart_item)
    return {"message": "Product added to cart"}

# Endpoint para obtener el carrito del usuario actual
@router.get("/cart/", response_model=List[CartItemResponse])
def get_user_cart(db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    cart_items = db.query(CartItem).filter(CartItem.user_id == user_id).all()
    return cart_items

# Endpoint para vaciar el carrito
@router.delete("/cart/", status_code=status.HTTP_204_NO_CONTENT)
def clear_user_cart(db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    db.query(CartItem).filter(CartItem.user_id == user_id).delete()
    db.commit()
    return {"message": "Cart cleared"}