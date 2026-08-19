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