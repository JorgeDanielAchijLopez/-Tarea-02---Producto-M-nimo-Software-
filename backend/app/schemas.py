from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field


# =========================
# PRODUCTOS
# =========================

class ProductoCreate(BaseModel):
    nombre: str = Field(min_length=2, max_length=50)
    precio_galon: Decimal = Field(gt=0)


class ProductoResponse(BaseModel):
    id: int
    nombre: str
    precio_galon: Decimal

    model_config = ConfigDict(from_attributes=True)


# =========================
# ESTACIONES
# =========================

class EstacionCreate(BaseModel):
    nombre: str = Field(min_length=3, max_length=100)
    direccion: str = Field(min_length=5, max_length=200)


class EstacionResponse(BaseModel):
    id: int
    nombre: str
    direccion: str
    estado: str

    model_config = ConfigDict(from_attributes=True)


# =========================
# INVENTARIO
# =========================

class InventarioCreate(BaseModel):
    estacion_id: int = Field(gt=0)
    producto_id: int = Field(gt=0)
    galones_disponibles: Decimal = Field(ge=0)


class InventarioUpdate(BaseModel):
    galones_disponibles: Decimal = Field(ge=0)


class InventarioResponse(BaseModel):
    id: int
    estacion_id: int
    producto_id: int
    galones_disponibles: Decimal

    model_config = ConfigDict(from_attributes=True)


# =========================
# VENTAS
# =========================

class VentaCreate(BaseModel):
    estacion_id: int = Field(gt=0)
    producto_id: int = Field(gt=0)
    galones: Decimal = Field(gt=0)


class VentaResponse(BaseModel):
    id: int
    estacion_id: int
    producto_id: int
    galones: Decimal
    precio_galon: Decimal
    total: Decimal
    fecha: datetime

    model_config = ConfigDict(from_attributes=True)