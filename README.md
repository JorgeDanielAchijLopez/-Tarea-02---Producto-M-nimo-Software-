# ⛽ Shell Fuel Control

Sistema Backend-Frontend para la administración de estaciones de servicio, productos, inventario, ventas, auditoría e indicadores de negocio.

Proyecto desarrollado para el curso de **Análisis de Sistemas II** de la **Universidad Mariano Gálvez de Guatemala**.

---

## 👤 Información académica

| Campo | Información |
|---|---|
| **Estudiante** | Jorge Daniel Achij Lopez |
| **Carné** | 2890-23-11995 |
| **Curso** | Análisis de Sistemas II |
| **Catedrático** | Ing. ERICK EDUARDO PEREZ AGUILAR |
| **Proyecto** | Shell Fuel Control |
| **Versión** | v1.0.0 |

---

# 📌 Descripción

**Shell Fuel Control** es un prototipo funcional para gestionar operaciones relacionadas con combustible en diferentes estaciones de servicio.

El sistema permite administrar:

- Estaciones.
- Productos y combustibles.
- Inventario por estación.
- Ventas.
- Auditoría individual por estación.
- Indicadores generales.
- Reportes mediante Power BI.

El proyecto utiliza una arquitectura Backend-Frontend conectada a una base de datos PostgreSQL.

---

# 🎯 Objetivo

Desarrollar un producto mínimo de software que permita administrar información de combustible mediante una solución compuesta por:

- Backend REST.
- Frontend web.
- Base de datos relacional.
- Contenedores.
- Control de versiones.
- Gestión de actividades.
- Business Intelligence.

---

# 🏗️ Arquitectura

```mermaid
flowchart TD

    A["🅰️ Angular Frontend<br/>http://localhost:4200"]

    B["⚡ FastAPI Backend<br/>http://127.0.0.1:8000"]

    C["🐘 PostgreSQL 16<br/>Docker Compose<br/>localhost:5432"]

    D["📊 Power BI<br/>Indicadores y visualización"]

    E["🐙 Git / GitHub<br/>Control de versiones"]

    F["📋 Jira<br/>Gestión del proyecto"]

    A -->|"HTTP / JSON"| B

    B -->|"SQLAlchemy"| C

    C -->|"Importación / Actualización"| D

    E -.->|"Versionamiento"| A

    E -.->|"Versionamiento"| B

    F -.->|"Seguimiento de actividades"| E
```

## Flujo principal

1. El usuario utiliza el frontend desarrollado en Angular.
2. Angular realiza solicitudes HTTP al backend FastAPI.
3. FastAPI procesa las operaciones.
4. SQLAlchemy gestiona la comunicación con PostgreSQL.
5. PostgreSQL almacena estaciones, productos, inventarios y ventas.
6. Power BI consulta PostgreSQL para generar indicadores.
7. GitHub mantiene el control de versiones.
8. Jira permite administrar y documentar las actividades del proyecto.

---

# 🛠️ Tecnologías utilizadas

## Backend

- Python 3.11
- FastAPI
- Uvicorn
- SQLAlchemy
- Psycopg2
- Python Dotenv

## Frontend

- Angular
- TypeScript
- HTML
- CSS

## Base de datos

- PostgreSQL 16

## Infraestructura

- Docker
- Docker Compose

## Gestión y análisis

- Git
- GitHub
- Jira
- Microsoft Power BI

---

# 📂 Estructura del proyecto

```text
Shell-Fuel-Control/
│
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── database.py
│   │   ├── main.py
│   │   ├── models.py
│   │   └── schemas.py
│   │
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   └── app/
│   │       ├── app.ts
│   │       ├── app.html
│   │       ├── app.css
│   │       ├── inventory.css
│   │       ├── products.css
│   │       ├── stations.css
│   │       └── audit.css
│   │
│   ├── package.json
│   └── proxy.conf.json
│
├── database/
├── docker-compose.yml
├── run-dev.bat
├── stop-dev.bat
├── .gitignore
└── README.md
```

---

# ✨ Funcionalidades

## 📊 Dashboard

El Dashboard presenta información general de todas las estaciones:

- Ingresos totales.
- Galones vendidos.
- Inventario total.
- Estaciones activas.
- Ventas por combustible.
- Alertas de inventario bajo.

---

## 💰 Ventas

Permite registrar ventas indicando:

- Estación.
- Producto.
- Cantidad de galones.

El sistema obtiene automáticamente el precio del combustible.

El total se calcula mediante:

```text
Total = Galones × Precio por galón
```

Después de registrar una venta:

1. Se almacena la operación.
2. Se calcula el total.
3. Se descuenta automáticamente el inventario.
4. Se actualizan los indicadores.

El sistema también valida que exista suficiente inventario.

---

## 📦 Inventario

El módulo de inventario permite:

- Seleccionar una estación.
- Consultar únicamente los productos de esa estación.
- Visualizar galones disponibles.
- Modificar existencias.
- Asignar productos a estaciones.
- Identificar niveles de inventario.

### Clasificación

| Galones disponibles | Estado |
|---:|---|
| Menos de 500 | 🔴 Crítico |
| De 500 a menos de 1000 | 🟡 Bajo |
| 1000 o más | 🟢 Estable |

---

## ⛽ Productos

Permite registrar y consultar combustibles.

| Combustible | Color |
|---|---|
| Regular | 🟡 Amarillo |
| Super | 🟢 Verde |
| Diesel | ⚫ Negro |
| V-Power | 🔴 Rojo |

Cada producto contiene un precio por galón.

---

## 🏪 Estaciones

Permite:

- Registrar estaciones.
- Consultar estaciones.
- Visualizar su estado.
- Eliminar estaciones.

### Eliminación controlada

Cuando una estación se elimina también se eliminan:

- Sus registros de inventario.
- Sus ventas relacionadas.

Antes de realizar la eliminación, el frontend solicita confirmación.

---

## 🔎 Auditoría por estación

El módulo de Auditoría permite seleccionar una estación y consultar únicamente:

- Productos asignados.
- Inventario disponible.
- Cantidad de ventas.
- Galones vendidos.
- Ingresos.
- Historial de ventas.

Esto permite analizar cada estación individualmente.

---

# 🗄️ Modelo de datos

El sistema utiliza cuatro tablas principales:

- `estaciones`
- `productos`
- `inventario`
- `ventas`

## Diagrama de relaciones

```mermaid
erDiagram

    ESTACIONES ||--o{ INVENTARIO : posee
    ESTACIONES ||--o{ VENTAS : registra

    PRODUCTOS ||--o{ INVENTARIO : pertenece
    PRODUCTOS ||--o{ VENTAS : vendido_en

    ESTACIONES {
        int id PK
        string nombre
        string direccion
        string estado
    }

    PRODUCTOS {
        int id PK
        string nombre
        decimal precio_galon
    }

    INVENTARIO {
        int id PK
        int estacion_id FK
        int producto_id FK
        decimal galones_disponibles
    }

    VENTAS {
        int id PK
        int estacion_id FK
        int producto_id FK
        decimal galones
        decimal precio_galon
        decimal total
        datetime fecha
    }
```

---

# 🌐 API REST

FastAPI proporciona una API REST documentada automáticamente mediante Swagger.

## Sistema

```http
GET /
GET /health
GET /database/health
```

## Productos

```http
GET  /productos
POST /productos
GET  /productos/{producto_id}
```

## Estaciones

```http
GET    /estaciones
POST   /estaciones
GET    /estaciones/{estacion_id}
DELETE /estaciones/{estacion_id}
```

## Inventario

```http
GET  /inventario
POST /inventario
GET  /inventario/{inventario_id}
PUT  /inventario/{inventario_id}
```

## Ventas

```http
GET  /ventas
POST /ventas
GET  /ventas/{venta_id}
```

## Dashboard

```http
GET /dashboard
```

---

# 📖 Swagger

Con el sistema ejecutándose:

```text
http://127.0.0.1:8000/docs
```

Swagger permite consultar y probar los endpoints de la API directamente desde el navegador.

---

# 💻 Instalación en una computadora nueva

Esta sección explica cómo instalar y ejecutar el proyecto desde cero.

> Las instrucciones están preparadas para Windows utilizando CMD.

---

# 1️⃣ Requisitos

La computadora debe tener instalados:

- Git.
- Docker Desktop.
- Python 3.11.
- Node.js.
- npm.

Power BI Desktop solo es necesario para visualizar el archivo `.pbix`.

---

## Git

Comprobar instalación:

```cmd
git --version
```

Descarga:

```text
https://git-scm.com/
```

---

## Docker Desktop

Comprobar:

```cmd
docker --version
```

Y:

```cmd
docker compose version
```

Docker Desktop debe permanecer abierto durante la ejecución de PostgreSQL.

---

## Python

Versión recomendada:

```text
Python 3.11
```

Verificar:

```cmd
py --version
```

---

## Node.js

Durante el desarrollo se utilizó Node.js 24.

Verificar:

```cmd
node --version
```

Y:

```cmd
npm --version
```

---

# 2️⃣ Clonar el repositorio

Abrir CMD y ejecutar:

```cmd
git clone https://github.com/JorgeDanielAchijLopez/-Tarea-02---Producto-M-nimo-Software- Shell-Fuel-Control
```

Ingresar al proyecto:

```cmd
cd Shell-Fuel-Control
```

---

# 3️⃣ Crear entorno virtual de Python

Desde la raíz:

```cmd
py -3.11 -m venv backend\venv
```

Activarlo:

```cmd
backend\venv\Scripts\activate
```

El CMD debería mostrar:

```text
(venv) C:\...\Shell-Fuel-Control>
```

---

# 4️⃣ Instalar dependencias del backend

```cmd
pip install -r backend\requirements.txt
```

Esto instalará:

- FastAPI.
- Uvicorn.
- SQLAlchemy.
- Psycopg2.
- Python Dotenv.

---

# 5️⃣ Crear variables de entorno

El archivo:

```text
backend/.env
```

no se almacena en GitHub porque se encuentra protegido mediante `.gitignore`.

Crear desde CMD:

```cmd
echo DATABASE_URL=postgresql+psycopg2://shell_admin:shell123@localhost:5432/shell_fuel_control> backend\.env
```

Contenido:

```env
DATABASE_URL=postgresql+psycopg2://shell_admin:shell123@localhost:5432/shell_fuel_control
```

---

# 6️⃣ Instalar dependencias de Angular

Ingresar al frontend:

```cmd
cd frontend
```

Instalar:

```cmd
npm install
```

Regresar a la raíz:

```cmd
cd ..
```

---

# 7️⃣ Abrir Docker Desktop

Antes de continuar, iniciar:

```text
Docker Desktop
```

Comprobar desde CMD:

```cmd
docker ps
```

---

# 8️⃣ Iniciar PostgreSQL

Desde la raíz:

```cmd
docker compose up -d
```

Verificar:

```cmd
docker ps
```

Debe aparecer:

```text
shell_postgres
```

---

# 🐘 Configuración de PostgreSQL

| Parámetro | Valor |
|---|---|
| Servidor | localhost |
| Puerto | 5432 |
| Base de datos | shell_fuel_control |
| Usuario | shell_admin |
| Contraseña | shell123 |
| Contenedor | shell_postgres |

---

# 9️⃣ Ejecutar Shell Fuel Control

Desde la raíz:

```cmd
run-dev
```

El script realiza automáticamente:

```mermaid
flowchart LR

    A["run-dev"] --> B["Verificar PostgreSQL"]

    B --> C["Limpiar procesos anteriores"]

    C --> D["Iniciar FastAPI"]

    D --> E["Verificar /health"]

    E --> F["Iniciar Angular"]

    F --> G["Sistema listo"]
```

---

# 🌍 URLs del proyecto

| Servicio | Dirección |
|---|---|
| 🅰️ Frontend Angular | http://localhost:4200 |
| ⚡ API FastAPI | http://127.0.0.1:8000 |
| 📖 Swagger | http://127.0.0.1:8000/docs |
| ❤️ API Health | http://127.0.0.1:8000/health |
| 🐘 Database Health | http://127.0.0.1:8000/database/health |

---

# 🔌 Puertos

| Servicio | Puerto |
|---|---:|
| Angular | 4200 |
| FastAPI | 8000 |
| PostgreSQL | 5432 |

---

# 🛑 Detener el proyecto

Ejecutar desde la raíz:

```cmd
stop-dev
```

El script detiene correctamente:

- Angular.
- FastAPI.

Esto evita procesos duplicados en los puertos `4200` y `8000`.

---

# 🆕 Primera ejecución

En una computadora nueva PostgreSQL estará inicialmente vacío.

Las tablas son creadas automáticamente cuando inicia FastAPI.

Se recomienda registrar información en este orden:

```mermaid
flowchart LR

    A["1. Productos"]
    --> B["2. Estaciones"]
    --> C["3. Inventario"]
    --> D["4. Ventas"]
    --> E["5. Dashboard"]
    --> F["6. Auditoría"]
```

---

# 📝 Datos de prueba sugeridos

## Productos

| Producto | Precio de ejemplo |
|---|---:|
| Regular | Q33.99 |
| Super | Q35.79 |
| Diesel | Q31.49 |
| V-Power | Q36.99 |

---

## Estaciones

Ejemplos:

```text
Shell Zona 10
Shell Zona 11
Shell Mixco
```

Después de crear una estación se deben asignar productos desde el módulo **Inventario**.

---

# 🧪 Pruebas sugeridas

## API Health

Abrir:

```text
http://127.0.0.1:8000/health
```

Resultado esperado:

```json
{
  "status": "OK",
  "message": "API funcionando correctamente"
}
```

---

## Base de datos

Abrir:

```text
http://127.0.0.1:8000/database/health
```

Debe indicar conexión exitosa con PostgreSQL.

---

## Venta

Ejemplo:

```text
Inventario inicial = 100 galones
Venta = 5 galones
Inventario esperado = 95 galones
```

La venta debe:

- Registrarse.
- Calcular el total.
- Descontar inventario.
- Aparecer en el historial.
- Actualizar el Dashboard.
- Aparecer en Auditoría.

---

## Inventario insuficiente

Intentar vender más galones de los disponibles.

Respuesta esperada:

```text
Inventario insuficiente para realizar la venta
```

La venta no debe almacenarse.

---

## Eliminación de estación

Crear una estación temporal.

Asignarle:

- Producto.
- Inventario.
- Venta.

Posteriormente eliminarla.

El sistema debe eliminar:

```text
Estación
Inventario asociado
Ventas asociadas
```

---

# 📊 Power BI

Power BI se conecta directamente a PostgreSQL.

## Conexión

```text
Inicio
→ Obtener datos
→ PostgreSQL
```

Servidor:

```text
localhost:5432
```

Base:

```text
shell_fuel_control
```

Usuario:

```text
shell_admin
```

Contraseña:

```text
shell123
```

Modo utilizado:

```text
Importar
```

---

# 📋 Tablas utilizadas en Power BI

```text
public.estaciones
public.productos
public.inventario
public.ventas
```

---

# 🔗 Modelo de Power BI

```mermaid
flowchart LR

    E["estaciones[id]"]

    P["productos[id]"]

    I["inventario"]

    V["ventas"]

    E -->|"1 : N<br/>estacion_id"| I

    E -->|"1 : N<br/>estacion_id"| V

    P -->|"1 : N<br/>producto_id"| I

    P -->|"1 : N<br/>producto_id"| V
```

---

# 🧮 Medidas DAX

## Ingresos Totales

```DAX
Ingresos Totales = SUM('public ventas'[total])
```

## Galones Vendidos

```DAX
Galones Vendidos = SUM('public ventas'[galones])
```

## Ventas Registradas

```DAX
Ventas Registradas = COUNTROWS('public ventas')
```

## Inventario Total

```DAX
Inventario Total = SUM('public inventario'[galones_disponibles])
```

---

# 📈 Panel de Power BI

El panel ejecutivo contiene:

- Ingresos totales.
- Inventario total.
- Ventas registradas.
- Galones vendidos.
- Ventas por combustible.
- Ventas por estación.
- Inventario disponible por estación.
- Filtro por estación.

---

# 🔄 Actualizar Power BI

El proyecto utiliza modo:

```text
Importar
```

Por esa razón los datos no cambian automáticamente cuando PostgreSQL recibe nuevos registros.

Para actualizarlos:

```text
Inicio → Actualizar
```

Power BI vuelve a consultar PostgreSQL.

---

# 📋 Jira

El desarrollo se gestionó utilizando Jira y metodología Scrum.

## Proyecto Jira

[🔗 Shell Fuel Control - Jira](https://miumg-team-k6y4r2cb.atlassian.net/jira/software/projects/SFC/list?jql=project%20%3D%20SFC%20ORDER%20BY%20cf%5B10019%5D%20ASC)

Se registraron actividades para:

- PostgreSQL.
- Docker.
- FastAPI.
- Productos.
- Estaciones.
- Inventario.
- Ventas.
- Dashboard.
- Angular.
- Auditoría.
- Eliminación de estaciones.
- Power BI.
- Corrección de errores.
- Pruebas.
- Documentación.

---

# 🐙 GitHub

Repositorio:

[🔗 Shell Fuel Control - GitHub](https://github.com/JorgeDanielAchijLopez/-Tarea-02---Producto-M-nimo-Software-)

Git se utilizó para mantener trazabilidad mediante commits independientes.

Ejemplos:

```text
feat: conectar FastAPI con PostgreSQL
feat: implementar control de inventario
feat: implementar registro de ventas
feat: integrar dashboard Angular con API del backend
feat: implementar modulo frontend de inventario
feat: implementar modulo frontend de productos
feat: implementar modulo frontend de estaciones
feat: agregar eliminacion en cascada de estaciones
fix: evitar procesos duplicados en entorno de desarrollo
docs: completar documentacion e instrucciones de instalacion
```

---

# 🏷️ Versión

Versión final:

```text
v1.0.0
```

---

# 🎥 Video explicativo

Enlace:

```text
PENDIENTE DE AGREGAR ENLACE DE GOOGLE DRIVE
```

---

# 📊 Archivo Power BI

Enlace al archivo `.pbix`:

```text
PENDIENTE DE AGREGAR ENLACE DE GOOGLE DRIVE
```

---

# 🛠️ Solución de problemas

## FastAPI no inicia

Ejecutar manualmente:

```cmd
backend\venv\Scripts\python.exe -m uvicorn app.main:app --app-dir backend --host 127.0.0.1 --port 8000
```

Esto permite observar directamente cualquier error.

---

## Puerto 8000 ocupado

```cmd
netstat -ano | findstr :8000
```

Ejemplo:

```text
TCP 127.0.0.1:8000 0.0.0.0:0 LISTENING 12345
```

Cerrar:

```cmd
taskkill /F /T /PID 12345
```

---

## Puerto 4200 ocupado

```cmd
netstat -ano | findstr :4200
```

Finalizar el PID correspondiente.

---

## Docker no responde

```cmd
docker ps
```

Si falla:

1. Abrir Docker Desktop.
2. Esperar a que Docker termine de iniciar.
3. Ejecutar:

```cmd
docker compose up -d
```

---

## PostgreSQL no inicia

```cmd
docker compose ps
```

Después:

```cmd
docker compose up -d
```

---

## Frontend no conecta con backend

Primero comprobar:

```text
http://127.0.0.1:8000/health
```

Si no responde, FastAPI está apagado.

Después comprobar:

```text
http://localhost:4200
```

---

## Power BI no actualiza

Verificar que PostgreSQL esté encendido:

```cmd
docker ps
```

Después en Power BI:

```text
Inicio → Actualizar
```

---

# ⚡ Instalación rápida

Para una PC con Git, Python, Node.js y Docker Desktop instalados:

```cmd
git clone https://github.com/JorgeDanielAchijLopez/-Tarea-02---Producto-M-nimo-Software- Shell-Fuel-Control

cd Shell-Fuel-Control

py -3.11 -m venv backend\venv

backend\venv\Scripts\activate

pip install -r backend\requirements.txt

echo DATABASE_URL=postgresql+psycopg2://shell_admin:shell123@localhost:5432/shell_fuel_control> backend\.env

cd frontend

npm install

cd ..

docker compose up -d

run-dev
```

Abrir:

```text
http://localhost:4200
```

---

# ✅ Comprobación de instalación

Una instalación correcta debe cumplir:

- ✅ Docker Desktop activo.
- ✅ `shell_postgres` ejecutándose.
- ✅ FastAPI en puerto `8000`.
- ✅ Angular en puerto `4200`.
- ✅ `/health` devuelve `OK`.
- ✅ `/database/health` devuelve `OK`.
- ✅ El frontend abre correctamente.

Comprobar:

```cmd
docker ps
```

```cmd
curl http://127.0.0.1:8000/health
```

Frontend:

```text
http://localhost:4200
```

---

# 🔒 Consideraciones de seguridad

Las credenciales incluidas en `docker-compose.yml` y en la documentación se utilizan únicamente para fines académicos y ejecución local.

En un entorno de producción deberían implementarse:

- Variables de entorno protegidas.
- Contraseñas seguras.
- Gestión de secretos.
- HTTPS.
- Autenticación.
- Roles y permisos.
- Copias de seguridad.
- Monitoreo.
- Registro de auditoría.
- Políticas de recuperación.

---

# 👨‍💻 Autor

**Jorge Daniel Achij Lopez**

**Carné:** 2890-23-11995

**Universidad Mariano Gálvez de Guatemala**

**Curso:** Análisis de Sistemas II

**Catedrático:** Ing. ERICK EDUARDO PEREZ AGUILAR

---

# 🔗 Enlaces

- [🐙 Repositorio GitHub](https://github.com/JorgeDanielAchijLopez/-Tarea-02---Producto-M-nimo-Software-)
- [📋 Proyecto Jira](https://miumg-team-k6y4r2cb.atlassian.net/jira/software/projects/SFC/list?jql=project%20%3D%20SFC%20ORDER%20BY%20cf%5B10019%5D%20ASC)

---

> **Shell Fuel Control v1.0.0**  
> Producto mínimo de software Backend-Frontend desarrollado para Análisis de Sistemas II.