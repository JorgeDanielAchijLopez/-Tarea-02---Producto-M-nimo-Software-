from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field


class ProductoCreate(BaseModel):
    nombre: str = Field(min_length=2, max_length=50)
    precio_galon: Decimal = Field(gt=0)


class ProductoResponse(BaseModel):
    id: int
    nombre: str
    precio_galon: Decimal

    model_config = ConfigDict(from_attributes=True)