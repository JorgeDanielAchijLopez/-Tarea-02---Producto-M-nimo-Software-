from fastapi import FastAPI

app = FastAPI(
    title="Shell Fuel Control API",
    description="API Backend para la gestión de ventas e inventario de combustible",
    version="1.0.0"
)


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