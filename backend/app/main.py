from fastapi import FastAPI
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError

from app.database import Base, engine
from app import models

app = FastAPI(
    title="Shell Fuel Control API",
    description="API Backend para la gestión de ventas e inventario de combustible",
    version="1.0.0"
)

Base.metadata.create_all(bind=engine)


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