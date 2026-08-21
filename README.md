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
| **Versión** | 1.0.0 |

---

# 📌 Descripción

**Shell Fuel Control** es un prototipo funcional para gestionar operaciones relacionadas con combustible en diferentes estaciones de servicio.

El sistema permite administrar:

- Estaciones.
- Productos/combustibles.
- Inventario por estación.
- Ventas.
- Auditoría individual por estación.
- Indicadores generales.
- Reportes mediante Power BI.

El proyecto está construido utilizando una arquitectura Backend-Frontend conectada a una base de datos PostgreSQL.

---

# 🎯 Objetivo

Desarrollar un producto mínimo de software que permita administrar información de combustible mediante una solución compuesta por:

- Backend REST.
- Frontend web.
- Base de datos relacional.
- Contenedores.
- Control de versiones.
- Gestión de actividades.
- Herramientas de Business Intelligence.

---

# 🏗️ Arquitectura

```text
┌──────────────────────────────┐
│        Angular Frontend      │
│      http://localhost:4200   │
└──────────────┬───────────────┘
               │ HTTP / JSON
               ▼
┌──────────────────────────────┐
│        FastAPI Backend       │
│    http://127.0.0.1:8000     │
└──────────────┬───────────────┘
               │ SQLAlchemy
               ▼
┌──────────────────────────────┐
│       PostgreSQL 16          │
│        Docker Compose        │
│       localhost:5432         │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│          Power BI            │
│  Indicadores y visualización │
└──────────────────────────────┘
```

Herramientas complementarias:

```text
Git / GitHub → Control de versiones
Jira         → Gestión del proyecto
Power BI     → Inteligencia de negocios
Docker       → Infraestructura
```

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
- Asignar nuevos productos a estaciones.
- Identificar niveles de inventario.

Clasificación utilizada:

```text
Menos de 500 galones     → Crítico
500 a 999.999 galones    → Bajo
1000 galones o más       → Estable
```

---

## ⛽ Productos

Permite registrar y consultar combustibles.

Productos utilizados durante las pruebas:

| Combustible | Color |
|---|---|
| Regular | 🟡 Amarillo |
| Super | 🟢 Verde |
| Diesel | ⚫ Negro |
| V-Power | 🔴 Rojo |

Cada producto contiene su propio precio por galón.

---

## 🏪 Estaciones

Permite:

- Registrar estaciones.
- Consultar estaciones.
- Visualizar estado.
- Eliminar estaciones.

### Eliminación controlada

Cuando una estación es eliminada también se eliminan:

- Sus registros de inventario.
- Sus ventas relacionadas.

Antes de ejecutar la eliminación, el frontend solicita confirmación al usuario.

---

## 🔎 Auditoría por estación

El módulo de Auditoría permite seleccionar una estación y consultar exclusivamente:

- Productos asignados.
- Inventario disponible.
- Cantidad de ventas.
- Galones vendidos.
- Ingresos.
- Historial de ventas.

Esto permite analizar cada estación individualmente sin mezclar los datos de toda la red.

---

# 🗄️ Modelo de datos

La aplicación utiliza cuatro tablas principales:

```text
estaciones
productos
inventario
ventas
```

Relaciones principales:

```text
estaciones
    │
    ├── inventario
    │
    └── ventas

productos
    │
    ├── inventario
    │
    └── ventas
```

Una estación puede poseer varios productos y cada producto puede encontrarse en varias estaciones.

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

Con el sistema ejecutándose, la documentación interactiva se encuentra en:

```text
http://127.0.0.1:8000/docs
```

Desde Swagger se pueden probar los endpoints directamente.

---

# 💻 Instalación en una computadora nueva

Esta sección explica cómo ejecutar el proyecto desde cero en otra computadora.

> Las instrucciones están preparadas principalmente para Windows utilizando CMD.

---

## 1. Requisitos

Antes de descargar el proyecto deben estar instaladas las siguientes herramientas:

### Git

Descargar desde:

```text
https://git-scm.com/
```

Verificar instalación:

```cmd
git --version
```

---

### Docker Desktop

Descargar desde:

```text
https://www.docker.com/products/docker-desktop/
```

Después de instalarlo, abrir **Docker Desktop** antes de ejecutar el proyecto.

Verificar:

```cmd
docker --version
```

Y:

```cmd
docker compose version
```

---

### Python

Se recomienda:

```text
Python 3.11
```

Verificar:

```cmd
py --version
```

o:

```cmd
python --version
```

---

### Node.js

Instalar una versión compatible con Angular.

Durante el desarrollo se utilizó Node.js 24.

Verificar:

```cmd
node --version
```

Verificar npm:

```cmd
npm --version
```

---

# 📥 2. Clonar el repositorio

Abrir **CMD** en la carpeta donde se desea guardar el proyecto.

Ejecutar:

```cmd
git clone https://github.com/JorgeDanielAchijLopez/-Tarea-02---Producto-M-nimo-Software- Shell-Fuel-Control
```

Después:

```cmd
cd Shell-Fuel-Control
```

---

# 🐍 3. Crear entorno virtual del backend

Desde la raíz del proyecto:

```cmd
py -3.11 -m venv backend\venv
```

Activarlo:

```cmd
backend\venv\Scripts\activate
```

El CMD debería mostrar algo similar a:

```text
(venv) C:\...\Shell-Fuel-Control>
```

---

# 📦 4. Instalar dependencias de Python

Ejecutar:

```cmd
pip install -r backend\requirements.txt
```

Esto instalará las dependencias utilizadas por FastAPI y PostgreSQL.

---

# 🔐 5. Crear archivo de variables de entorno

El archivo:

```text
backend/.env
```

no se almacena en GitHub porque se encuentra protegido mediante `.gitignore`.

Debe crearse manualmente.

Desde la raíz del proyecto se puede crear mediante CMD:

```cmd
echo DATABASE_URL=postgresql+psycopg2://shell_admin:shell123@localhost:5432/shell_fuel_control> backend\.env
```

El contenido resultante debe ser:

```env
DATABASE_URL=postgresql+psycopg2://shell_admin:shell123@localhost:5432/shell_fuel_control
```

---

# 🅰️ 6. Instalar dependencias de Angular

Ingresar a la carpeta frontend:

```cmd
cd frontend
```

Instalar paquetes:

```cmd
npm install
```

Regresar a la raíz:

```cmd
cd ..
```

---

# 🐳 7. Iniciar PostgreSQL

Asegurarse primero de que **Docker Desktop esté abierto**.

Desde la raíz ejecutar:

```cmd
docker compose up -d
```

Verificar:

```cmd
docker ps
```

Debe aparecer un contenedor llamado:

```text
shell_postgres
```

---

# 🗃️ Configuración de PostgreSQL

El archivo `docker-compose.yml` utiliza:

| Parámetro | Valor |
|---|---|
| Servidor | localhost |
| Puerto | 5432 |
| Base de datos | shell_fuel_control |
| Usuario | shell_admin |
| Contraseña | shell123 |
| Contenedor | shell_postgres |

---

# ▶️ 8. Ejecutar el sistema

El proyecto incluye el script:

```text
run-dev.bat
```

Desde la raíz simplemente ejecutar:

```cmd
run-dev
```

El script realiza automáticamente:

1. Verifica PostgreSQL.
2. Inicia Docker si es necesario.
3. Limpia procesos anteriores.
4. Inicia FastAPI.
5. Verifica que la API responda.
6. Inicia Angular.

Cuando termine aparecerá:

```text
Frontend:
http://localhost:4200

API:
http://127.0.0.1:8000

Swagger:
http://127.0.0.1:8000/docs
```

---

# 🌍 URLs del proyecto

| Servicio | Dirección |
|---|---|
| Frontend Angular | http://localhost:4200 |
| API FastAPI | http://127.0.0.1:8000 |
| Swagger | http://127.0.0.1:8000/docs |
| Health Check | http://127.0.0.1:8000/health |
| Database Health | http://127.0.0.1:8000/database/health |

---

# 🛑 Detener el sistema

El proyecto incluye:

```text
stop-dev.bat
```

Para detener correctamente Angular y FastAPI ejecutar:

```cmd
stop-dev
```

Este script libera los puertos utilizados durante el desarrollo.

---

# 🔌 Puertos utilizados

| Servicio | Puerto |
|---|---:|
| Angular | 4200 |
| FastAPI | 8000 |
| PostgreSQL | 5432 |

---

# 🆕 Primera ejecución

En una computadora nueva la base de datos estará inicialmente vacía.

Las tablas son creadas automáticamente cuando inicia FastAPI.

Se recomienda registrar información en este orden:

```text
1. Productos
       ↓
2. Estaciones
       ↓
3. Inventario
       ↓
4. Ventas
       ↓
5. Dashboard / Auditoría
```

---

## Datos de prueba sugeridos

### Productos

```text
Regular
Super
Diesel
V-Power
```

Ejemplo de precios utilizados durante las pruebas:

```text
Regular  → Q33.99
Super    → Q35.79
Diesel   → Q31.49
V-Power  → Q36.99
```

Los valores pueden modificarse para realizar nuevas pruebas.

---

### Estaciones

Ejemplo:

```text
Shell Zona 10
Shell Zona 11
Shell Mixco
```

Después de crear una estación se deben asignar productos desde el módulo **Inventario**.

---

# 🧪 Pruebas sugeridas

## Prueba de API

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

## Prueba de base de datos

Abrir:

```text
http://127.0.0.1:8000/database/health
```

Debe indicar conexión exitosa con PostgreSQL.

---

## Prueba de venta

1. Crear un producto.
2. Crear una estación.
3. Asignar inventario.
4. Registrar una venta.
5. Verificar que los galones disminuyan.

Ejemplo:

```text
Inventario inicial: 100 galones
Venta: 5 galones
Inventario esperado: 95 galones
```

---

## Prueba de inventario insuficiente

Intentar vender una cantidad superior al inventario disponible.

El backend debe impedir la operación y devolver:

```text
Inventario insuficiente para realizar la venta
```

---

## Prueba de eliminación de estación

Crear una estación temporal.

Asignarle:

- Inventario.
- Una venta.

Posteriormente eliminar la estación.

El sistema debe eliminar:

```text
Estación
Inventario relacionado
Ventas relacionadas
```

---

# 📊 Power BI

El proyecto utiliza Power BI como herramienta de Business Intelligence.

Power BI se conecta directamente a PostgreSQL.

---

## Configuración de conexión

En Power BI:

```text
Inicio
→ Obtener datos
→ PostgreSQL
```

Configuración:

```text
Servidor:
localhost:5432

Base de datos:
shell_fuel_control
```

Autenticación:

```text
Usuario:
shell_admin

Contraseña:
shell123
```

Modo utilizado:

```text
Importar
```

---

## Tablas utilizadas

```text
public.estaciones
public.productos
public.inventario
public.ventas
```

---

## Relaciones

```text
estaciones[id]
      1
      │
      ├──── * inventario[estacion_id]
      │
      └──── * ventas[estacion_id]


productos[id]
      1
      │
      ├──── * inventario[producto_id]
      │
      └──── * ventas[producto_id]
```

---

## Medidas DAX

### Ingresos Totales

```DAX
Ingresos Totales = SUM('public ventas'[total])
```

### Galones Vendidos

```DAX
Galones Vendidos = SUM('public ventas'[galones])
```

### Ventas Registradas

```DAX
Ventas Registradas = COUNTROWS('public ventas')
```

### Inventario Total

```DAX
Inventario Total = SUM('public inventario'[galones_disponibles])
```

---

## Indicadores del panel

El dashboard de Power BI muestra:

- Ingresos totales.
- Inventario total.
- Ventas registradas.
- Galones vendidos.
- Ventas por combustible.
- Ventas por estación.
- Inventario disponible por estación.
- Filtro por estación.

---

## Actualizar datos de Power BI

El proyecto utiliza modo **Importar**.

Por esta razón Power BI no actualiza automáticamente cada vez que cambia PostgreSQL.

Después de registrar nuevos datos en Shell Fuel Control utilizar:

```text
Inicio → Actualizar
```

Power BI volverá a consultar PostgreSQL.

---

# 📋 Jira

El proyecto se gestionó mediante Jira utilizando una plantilla Scrum.

## Proyecto

[Shell Fuel Control - Jira](https://miumg-team-k6y4r2cb.atlassian.net/jira/software/projects/SFC/list?jql=project%20%3D%20SFC%20ORDER%20BY%20cf%5B10019%5D%20ASC)

Jira contiene actividades relacionadas con:

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
- Power BI.
- Corrección de errores.
- Pruebas finales.
- Documentación.

Los errores detectados durante el desarrollo también fueron documentados como actividades.

---

# 🐙 GitHub

Repositorio oficial:

[Shell Fuel Control - GitHub](https://github.com/JorgeDanielAchijLopez/-Tarea-02---Producto-M-nimo-Software-)

El proyecto utiliza Git para mantener la trazabilidad del desarrollo mediante commits independientes.

Ejemplos:

```text
feat: conectar FastAPI con PostgreSQL
feat: implementar control de inventario
feat: implementar registro de ventas
feat: integrar dashboard Angular
feat: implementar modulo frontend de inventario
feat: implementar modulo frontend de productos
feat: implementar modulo frontend de estaciones
feat: agregar eliminacion en cascada de estaciones
fix: evitar procesos duplicados en entorno de desarrollo
```

---

# 🏷️ Versión

Versión final:

```text
v1.0.0
```

---

# 🎥 Video explicativo

Enlace al video:

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

Probar manualmente desde la raíz:

```cmd
backend\venv\Scripts\python.exe -m uvicorn app.main:app --app-dir backend --host 127.0.0.1 --port 8000
```

Esto permite observar directamente cualquier error del backend.

---

## Puerto 8000 ocupado

Verificar:

```cmd
netstat -ano | findstr :8000
```

Ejemplo:

```text
TCP 127.0.0.1:8000 0.0.0.0:0 LISTENING 12345
```

Finalizar el proceso:

```cmd
taskkill /F /T /PID 12345
```

Cambiar `12345` por el PID correspondiente.

---

## Puerto 4200 ocupado

Verificar:

```cmd
netstat -ano | findstr :4200
```

Después finalizar el PID correspondiente.

---

## Docker no está iniciado

Verificar:

```cmd
docker ps
```

Si Docker no responde, abrir **Docker Desktop**.

Después:

```cmd
docker compose up -d
```

---

## PostgreSQL no aparece

Ejecutar:

```cmd
docker compose ps
```

Después:

```cmd
docker compose up -d
```

---

## Frontend no conecta con FastAPI

Verificar primero:

```text
http://127.0.0.1:8000/health
```

Si no responde, FastAPI está apagado.

Después verificar:

```text
http://localhost:4200
```

---

## Power BI no actualiza

1. Verificar que Docker/PostgreSQL esté funcionando.
2. En Power BI seleccionar:

```text
Inicio → Actualizar
```

3. Confirmar conexión con:

```text
localhost:5432
```

---

# 🔄 Flujo rápido para ejecutar en otra computadora

Para una computadora que ya tenga instalados Git, Python, Node y Docker Desktop:

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

Después abrir:

```text
http://localhost:4200
```

---

# ✅ Comprobación rápida de instalación

Una instalación correcta debe cumplir:

```text
☑ Docker Desktop activo
☑ shell_postgres ejecutándose
☑ FastAPI en puerto 8000
☑ Angular en puerto 4200
☑ /health devuelve OK
☑ /database/health devuelve OK
☑ Frontend abre correctamente
```

Comprobar Docker:

```cmd
docker ps
```

Comprobar FastAPI:

```cmd
curl http://127.0.0.1:8000/health
```

Comprobar frontend:

```text
http://localhost:4200
```

---

# 🔒 Consideraciones

Las credenciales incluidas en `docker-compose.yml` y en los ejemplos de configuración se utilizan únicamente para fines académicos y ejecución local.

En un ambiente de producción se deberían utilizar:

- Credenciales seguras.
- Variables de entorno protegidas.
- HTTPS.
- Gestión de secretos.
- Control de usuarios y permisos.
- Copias de seguridad.
- Monitoreo.

---

# 👨‍💻 Autor

**Jorge Daniel Achij Lopez**  
Carné **2890-23-11995**

Universidad Mariano Gálvez de Guatemala  
Análisis de Sistemas II

---

## 📚 Enlaces

- [Repositorio GitHub](https://github.com/JorgeDanielAchijLopez/-Tarea-02---Producto-M-nimo-Software-)
- [Proyecto Jira](https://miumg-team-k6y4r2cb.atlassian.net/jira/software/projects/SFC/list?jql=project%20%3D%20SFC%20ORDER%20BY%20cf%5B10019%5D%20ASC)

---

> **Shell Fuel Control v1.0.0** — Proyecto académico desarrollado como producto mínimo de software Backend-Frontend.