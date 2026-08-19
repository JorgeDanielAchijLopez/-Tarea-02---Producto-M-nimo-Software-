from decimal import Decimal, ROUND_HALF_UP

from fastapi import Depends, FastAPI, HTTPException, status
from sqlalchemy import func, text
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


# =========================
# INVENTARIO
# =========================

@app.post(
    "/inventario",
    response_model=schemas.InventarioResponse,
    status_code=status.HTTP_201_CREATED
)
def crear_inventario(
    inventario: schemas.InventarioCreate,
    db: Session = Depends(get_db)
):
    estacion = (
        db.query(models.Estacion)
        .filter(models.Estacion.id == inventario.estacion_id)
        .first()
    )

    if not estacion:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Estacion no encontrada"
        )

    producto = (
        db.query(models.Producto)
        .filter(models.Producto.id == inventario.producto_id)
        .first()
    )

    if not producto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Producto no encontrado"
        )

    inventario_existente = (
        db.query(models.Inventario)
        .filter(
            models.Inventario.estacion_id == inventario.estacion_id,
            models.Inventario.producto_id == inventario.producto_id
        )
        .first()
    )

    if inventario_existente:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya existe inventario para este producto en esta estacion"
        )

    nuevo_inventario = models.Inventario(
        estacion_id=inventario.estacion_id,
        producto_id=inventario.producto_id,
        galones_disponibles=inventario.galones_disponibles
    )

    db.add(nuevo_inventario)
    db.commit()
    db.refresh(nuevo_inventario)

    return nuevo_inventario


@app.get(
    "/inventario",
    response_model=list[schemas.InventarioResponse]
)
def listar_inventario(db: Session = Depends(get_db)):
    return db.query(models.Inventario).order_by(models.Inventario.id).all()


@app.get(
    "/inventario/{inventario_id}",
    response_model=schemas.InventarioResponse
)
def obtener_inventario(
    inventario_id: int,
    db: Session = Depends(get_db)
):
    inventario = (
        db.query(models.Inventario)
        .filter(models.Inventario.id == inventario_id)
        .first()
    )

    if not inventario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Registro de inventario no encontrado"
        )

    return inventario


@app.put(
    "/inventario/{inventario_id}",
    response_model=schemas.InventarioResponse
)
def actualizar_inventario(
    inventario_id: int,
    datos: schemas.InventarioUpdate,
    db: Session = Depends(get_db)
):
    inventario = (
        db.query(models.Inventario)
        .filter(models.Inventario.id == inventario_id)
        .first()
    )

    if not inventario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Registro de inventario no encontrado"
        )

    inventario.galones_disponibles = datos.galones_disponibles

    db.commit()
    db.refresh(inventario)

    return inventario


# =========================
# VENTAS
# =========================

@app.post(
    "/ventas",
    response_model=schemas.VentaResponse,
    status_code=status.HTTP_201_CREATED
)
def crear_venta(
    venta: schemas.VentaCreate,
    db: Session = Depends(get_db)
):
    estacion = (
        db.query(models.Estacion)
        .filter(models.Estacion.id == venta.estacion_id)
        .first()
    )

    if not estacion:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Estacion no encontrada"
        )

    producto = (
        db.query(models.Producto)
        .filter(models.Producto.id == venta.producto_id)
        .first()
    )

    if not producto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Producto no encontrado"
        )

    inventario = (
        db.query(models.Inventario)
        .filter(
            models.Inventario.estacion_id == venta.estacion_id,
            models.Inventario.producto_id == venta.producto_id
        )
        .with_for_update()
        .first()
    )

    if not inventario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No existe inventario para este producto en la estacion"
        )

    if inventario.galones_disponibles < venta.galones:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inventario insuficiente para realizar la venta"
        )

    precio_galon = Decimal(producto.precio_galon)

    total = (
        Decimal(venta.galones) * precio_galon
    ).quantize(
        Decimal("0.01"),
        rounding=ROUND_HALF_UP
    )

    try:
        nueva_venta = models.Venta(
            estacion_id=venta.estacion_id,
            producto_id=venta.producto_id,
            galones=venta.galones,
            precio_galon=precio_galon,
            total=total
        )

        inventario.galones_disponibles -= venta.galones

        db.add(nueva_venta)
        db.commit()
        db.refresh(nueva_venta)

        return nueva_venta

    except SQLAlchemyError:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al registrar la venta"
        )


@app.get(
    "/ventas",
    response_model=list[schemas.VentaResponse]
)
def listar_ventas(db: Session = Depends(get_db)):
    return db.query(models.Venta).order_by(models.Venta.id.desc()).all()


@app.get(
    "/ventas/{venta_id}",
    response_model=schemas.VentaResponse
)
def obtener_venta(
    venta_id: int,
    db: Session = Depends(get_db)
):
    venta = (
        db.query(models.Venta)
        .filter(models.Venta.id == venta_id)
        .first()
    )

    if not venta:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Venta no encontrada"
        )

    return venta


# =========================
# DASHBOARD
# =========================

@app.get(
    "/dashboard",
    response_model=schemas.DashboardResponse
)
def obtener_dashboard(db: Session = Depends(get_db)):

    total_ventas = (
        db.query(func.count(models.Venta.id))
        .scalar()
    ) or 0

    ingresos_totales = (
        db.query(func.sum(models.Venta.total))
        .scalar()
    ) or Decimal("0.00")

    galones_vendidos = (
        db.query(func.sum(models.Venta.galones))
        .scalar()
    ) or Decimal("0.000")

    inventario_total = (
        db.query(func.sum(models.Inventario.galones_disponibles))
        .scalar()
    ) or Decimal("0.000")

    estaciones_activas = (
        db.query(func.count(models.Estacion.id))
        .filter(models.Estacion.estado == "Activa")
        .scalar()
    ) or 0

    ventas_producto = (
        db.query(
            models.Producto.nombre,
            func.sum(models.Venta.galones).label("galones_vendidos"),
            func.sum(models.Venta.total).label("total_vendido")
        )
        .outerjoin(
            models.Venta,
            models.Venta.producto_id == models.Producto.id
        )
        .group_by(
            models.Producto.id,
            models.Producto.nombre
        )
        .order_by(models.Producto.id)
        .all()
    )

    ventas_por_producto = []

    for fila in ventas_producto:
        ventas_por_producto.append(
            {
                "producto": fila.nombre,
                "galones_vendidos": fila.galones_vendidos or Decimal("0.000"),
                "total_vendido": fila.total_vendido or Decimal("0.00")
            }
        )

    inventarios_bajos = (
        db.query(
            models.Inventario,
            models.Estacion.nombre.label("estacion_nombre"),
            models.Producto.nombre.label("producto_nombre")
        )
        .join(
            models.Estacion,
            models.Inventario.estacion_id == models.Estacion.id
        )
        .join(
            models.Producto,
            models.Inventario.producto_id == models.Producto.id
        )
        .filter(models.Inventario.galones_disponibles < 500)
        .all()
    )

    inventario_bajo = []

    for fila in inventarios_bajos:
        inventario_bajo.append(
            {
                "estacion": fila.estacion_nombre,
                "producto": fila.producto_nombre,
                "galones_disponibles": fila.Inventario.galones_disponibles
            }
        )

    return {
        "total_ventas": total_ventas,
        "ingresos_totales": ingresos_totales,
        "galones_vendidos": galones_vendidos,
        "inventario_total": inventario_total,
        "estaciones_activas": estaciones_activas,
        "ventas_por_producto": ventas_por_producto,
        "inventario_bajo": inventario_bajo
    }