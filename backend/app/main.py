from fastapi import Depends, FastAPI, HTTPException, status
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import Base, engine, get_db


app = FastAPI(
    title="Shell Fuel Control API",
    description="API Backend para la gestión de ventas e inventario de combustible",
    version="1.0.0"
)

Base.metadata.create_all(bind=engine)


# =========================
# SISTEMA
# =========================

@app.get("/")
def inicio():
    return {
        "sistema": "Shell Fuel Control",
        "estado": "Activo"
    }


@app.get("/health")
def health_check():
    return {
        "status": "OK",
        "message": "API funcionando correctamente"
    }


@app.get("/database/health")
def database_health():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))

        return {
            "status": "OK",
            "database": "PostgreSQL",
            "message": "Conexion con la base de datos exitosa"
        }

    except SQLAlchemyError as error:
        return {
            "status": "ERROR",
            "database": "PostgreSQL",
            "message": "No se pudo establecer conexion con la base de datos",
            "detail": str(error)
        }


# =========================
# PRODUCTOS
# =========================

@app.post(
    "/productos",
    response_model=schemas.ProductoResponse,
    status_code=status.HTTP_201_CREATED
)
def crear_producto(
    producto: schemas.ProductoCreate,
    db: Session = Depends(get_db)
):
    producto_existente = (
        db.query(models.Producto)
        .filter(models.Producto.nombre == producto.nombre)
        .first()
    )

    if producto_existente:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya existe un producto con ese nombre"
        )

    nuevo_producto = models.Producto(
        nombre=producto.nombre,
        precio_galon=producto.precio_galon
    )

    db.add(nuevo_producto)
    db.commit()
    db.refresh(nuevo_producto)

    return nuevo_producto


@app.get(
    "/productos",
    response_model=list[schemas.ProductoResponse]
)
def listar_productos(db: Session = Depends(get_db)):
    return db.query(models.Producto).order_by(models.Producto.id).all()


@app.get(
    "/productos/{producto_id}",
    response_model=schemas.ProductoResponse
)
def obtener_producto(
    producto_id: int,
    db: Session = Depends(get_db)
):
    producto = (
        db.query(models.Producto)
        .filter(models.Producto.id == producto_id)
        .first()
    )

    if not producto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Producto no encontrado"
        )

    return producto


# =========================
# ESTACIONES
# =========================

@app.post(
    "/estaciones",
    response_model=schemas.EstacionResponse,
    status_code=status.HTTP_201_CREATED
)
def crear_estacion(
    estacion: schemas.EstacionCreate,
    db: Session = Depends(get_db)
):
    estacion_existente = (
        db.query(models.Estacion)
        .filter(models.Estacion.nombre == estacion.nombre)
        .first()
    )

    if estacion_existente:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya existe una estacion con ese nombre"
        )

    nueva_estacion = models.Estacion(
        nombre=estacion.nombre,
        direccion=estacion.direccion,
        estado="Activa"
    )

    db.add(nueva_estacion)
    db.commit()
    db.refresh(nueva_estacion)

    return nueva_estacion


@app.get(
    "/estaciones",
    response_model=list[schemas.EstacionResponse]
)
def listar_estaciones(db: Session = Depends(get_db)):
    return db.query(models.Estacion).order_by(models.Estacion.id).all()


@app.get(
    "/estaciones/{estacion_id}",
    response_model=schemas.EstacionResponse
)
def obtener_estacion(
    estacion_id: int,
    db: Session = Depends(get_db)
):
    estacion = (
        db.query(models.Estacion)
        .filter(models.Estacion.id == estacion_id)
        .first()
    )

    if not estacion:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Estacion no encontrada"
        )

    return estacion