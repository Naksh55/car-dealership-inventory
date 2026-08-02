# Purpose: Implements vehicle inventory CRUD and listing endpoints.

from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database import get_db
from app import models, schemas
from app.dependencies import get_current_user, require_admin

router = APIRouter(prefix="/api/vehicles", tags=["vehicles"])


class RestockRequest(BaseModel):
    amount: int


@router.post("", response_model=schemas.VehicleOut, status_code=201)
def add_vehicle(
    vehicle_in: schemas.VehicleCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    vehicle = models.Vehicle(**vehicle_in.model_dump())
    db.add(vehicle)
    db.commit()
    db.refresh(vehicle)
    return vehicle


@router.get("", response_model=List[schemas.VehicleOut])
def list_vehicles(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return db.query(models.Vehicle).all()


@router.get("/search", response_model=List[schemas.VehicleOut])
def search_vehicles(
    make: Optional[str] = None,
    model: Optional[str] = None,
    category: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    query = db.query(models.Vehicle)
    if make:
        query = query.filter(models.Vehicle.make.ilike(f"%{make}%"))
    if model:
        query = query.filter(models.Vehicle.model.ilike(f"%{model}%"))
    if category:
        query = query.filter(models.Vehicle.category.ilike(f"%{category}%"))
    if min_price is not None:
        query = query.filter(models.Vehicle.price >= min_price)
    if max_price is not None:
        query = query.filter(models.Vehicle.price <= max_price)
    return query.all()


def _get_vehicle_or_404(db: Session, vehicle_id: int) -> models.Vehicle:
    vehicle = db.query(models.Vehicle).filter(models.Vehicle.id == vehicle_id).first()
    if vehicle is None:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return vehicle


@router.put("/{vehicle_id}", response_model=schemas.VehicleOut)
def update_vehicle(
    vehicle_id: int,
    vehicle_in: schemas.VehicleCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    vehicle = _get_vehicle_or_404(db, vehicle_id)
    for field, value in vehicle_in.model_dump().items():
        setattr(vehicle, field, value)
    db.commit()
    db.refresh(vehicle)
    return vehicle


@router.delete("/{vehicle_id}", status_code=204)
def delete_vehicle(
    vehicle_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_admin),
):
    vehicle = _get_vehicle_or_404(db, vehicle_id)
    db.delete(vehicle)
    db.commit()
    return None


@router.post("/{vehicle_id}/purchase", response_model=schemas.VehicleOut)
def purchase_vehicle(
    vehicle_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    vehicle = _get_vehicle_or_404(db, vehicle_id)
    if vehicle.quantity <= 0:
        raise HTTPException(status_code=400, detail="Vehicle out of stock")
    vehicle.quantity -= 1
    db.commit()
    db.refresh(vehicle)
    return vehicle


@router.post("/{vehicle_id}/restock", response_model=schemas.VehicleOut)
def restock_vehicle(
    vehicle_id: int,
    restock_in: RestockRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_admin),
):
    vehicle = _get_vehicle_or_404(db, vehicle_id)
    vehicle.quantity += restock_in.amount
    db.commit()
    db.refresh(vehicle)
    return vehicle
