import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface VentaProducto {
  producto: string;
  galones_vendidos: number | string;
  total_vendido: number | string;
}

interface InventarioBajo {
  estacion: string;
  producto: string;
  galones_disponibles: number | string;
}

interface Dashboard {
  total_ventas: number;
  ingresos_totales: number | string;
  galones_vendidos: number | string;
  inventario_total: number | string;
  estaciones_activas: number;
  ventas_por_producto: VentaProducto[];
  inventario_bajo: InventarioBajo[];
}

interface Producto {
  id: number;
  nombre: string;
  precio_galon: number | string;
}

interface Estacion {
  id: number;
  nombre: string;
  direccion: string;
  estado: string;
}

interface Venta {
  id: number;
  estacion_id: number;
  producto_id: number;
  galones: number | string;
  precio_galon: number | string;
  total: number | string;
  fecha: string;
}

interface Inventario {
  id: number;
  estacion_id: number;
  producto_id: number;
  galones_disponibles: number | string;
}

interface EliminacionEstacionResponse {
  message: string;
  estacion: string;
  inventarios_eliminados: number;
  ventas_eliminadas: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './app.html',
  styleUrls: [
    './app.css',
    './inventory.css',
    './products.css',
    './stations.css',
    './audit.css'
  ]
})
export class App implements OnInit {

  seccionActiva = 'dashboard';

  dashboard: Dashboard | null = null;

  productos: Producto[] = [];
  estaciones: Estacion[] = [];
  ventas: Venta[] = [];
  inventarios: Inventario[] = [];

  cargando = false;
  error = '';
  mensaje = '';

  estacionInventarioFiltro = 0;
  estacionAuditoriaFiltro = 0;

  inventarioEditandoId: number | null = null;
  nuevaCantidadInventario = 0;

  nuevaVenta = {
    estacion_id: 0,
    producto_id: 0,
    galones: 0
  };

  nuevoProducto = {
    nombre: '',
    precio_galon: 0
  };

  nuevaEstacion = {
    nombre: '',
    direccion: ''
  };

  nuevoInventario = {
    estacion_id: 0,
    producto_id: 0,
    galones_disponibles: 0
  };

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarDashboard();
    this.cargarProductos();
    this.cargarEstaciones();
    this.cargarVentas();
    this.cargarInventario();
  }

  get inventariosFiltrados(): Inventario[] {
    if (this.estacionInventarioFiltro <= 0) {
      return [];
    }

    return this.inventarios.filter(
      item =>
        item.estacion_id === this.estacionInventarioFiltro
    );
  }

  get inventarioAuditoria(): Inventario[] {
    if (this.estacionAuditoriaFiltro <= 0) {
      return [];
    }

    return this.inventarios.filter(
      item =>
        item.estacion_id === this.estacionAuditoriaFiltro
    );
  }

  get ventasAuditoria(): Venta[] {
    if (this.estacionAuditoriaFiltro <= 0) {
      return [];
    }

    return this.ventas.filter(
      venta =>
        venta.estacion_id === this.estacionAuditoriaFiltro
    );
  }

  cambiarSeccion(seccion: string): void {
    this.seccionActiva = seccion;
    this.error = '';
    this.mensaje = '';

    if (seccion === 'dashboard') {
      this.cargarDashboard();
    }

    if (seccion === 'ventas') {
      this.cargarVentas();
    }

    if (seccion === 'inventario') {
      this.cargarInventario();
      this.cargarEstaciones();
      this.cargarProductos();
    }

    if (seccion === 'productos') {
      this.cargarProductos();
    }

    if (seccion === 'estaciones') {
      this.cargarEstaciones();
    }

    if (seccion === 'auditoria') {
      this.cargarVentas();
      this.cargarInventario();
      this.cargarEstaciones();
      this.cargarProductos();
    }
  }

  cargarDashboard(): void {
    this.cargando = true;
    this.error = '';

    this.http.get<Dashboard>('/api/dashboard').subscribe({
      next: (data) => {
        this.dashboard = data;
        this.cargando = false;
        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Error dashboard:', error);

        this.error = 'No fue posible cargar el dashboard.';
        this.cargando = false;

        this.cdr.detectChanges();
      }
    });
  }

  cargarProductos(): void {
    this.http.get<Producto[]>('/api/productos').subscribe({
      next: (data) => {
        this.productos = data;
        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Error productos:', error);

        this.error = 'No fue posible cargar los productos.';
        this.cdr.detectChanges();
      }
    });
  }

  cargarEstaciones(): void {
    this.http.get<Estacion[]>('/api/estaciones').subscribe({
      next: (data) => {
        this.estaciones = data;

        const inventarioFiltroExiste =
          this.estaciones.some(
            estacion =>
              estacion.id === this.estacionInventarioFiltro
          );

        const auditoriaFiltroExiste =
          this.estaciones.some(
            estacion =>
              estacion.id === this.estacionAuditoriaFiltro
          );

        if (!inventarioFiltroExiste) {
          this.estacionInventarioFiltro =
            this.estaciones.length > 0
              ? this.estaciones[0].id
              : 0;
        }

        if (!auditoriaFiltroExiste) {
          this.estacionAuditoriaFiltro =
            this.estaciones.length > 0
              ? this.estaciones[0].id
              : 0;
        }

        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Error estaciones:', error);

        this.error = 'No fue posible cargar las estaciones.';
        this.cdr.detectChanges();
      }
    });
  }

  cargarVentas(): void {
    this.http.get<Venta[]>('/api/ventas').subscribe({
      next: (data) => {
        this.ventas = data;
        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Error ventas:', error);

        this.error = 'No fue posible cargar las ventas.';
        this.cdr.detectChanges();
      }
    });
  }

  cargarInventario(): void {
    this.http.get<Inventario[]>('/api/inventario').subscribe({
      next: (data) => {
        this.inventarios = data;
        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Error inventario:', error);

        this.error = 'No fue posible cargar el inventario.';
        this.cdr.detectChanges();
      }
    });
  }

  registrarVenta(): void {
    this.error = '';
    this.mensaje = '';

    if (
      this.nuevaVenta.estacion_id <= 0 ||
      this.nuevaVenta.producto_id <= 0 ||
      this.nuevaVenta.galones <= 0
    ) {
      this.error =
        'Debe completar todos los datos de la venta.';
      return;
    }

    this.http.post<Venta>(
      '/api/ventas',
      this.nuevaVenta
    ).subscribe({
      next: () => {
        this.mensaje =
          'Venta registrada correctamente.';

        this.nuevaVenta = {
          estacion_id: 0,
          producto_id: 0,
          galones: 0
        };

        this.cargarVentas();
        this.cargarInventario();
        this.cargarDashboard();

        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error(
          'Error al registrar venta:',
          error
        );

        if (error.error?.detail) {
          this.error = error.error.detail;
        } else {
          this.error =
            'No fue posible registrar la venta.';
        }

        this.cdr.detectChanges();
      }
    });
  }

  registrarProducto(): void {
    this.error = '';
    this.mensaje = '';

    if (
      this.nuevoProducto.nombre.trim().length < 2 ||
      this.nuevoProducto.precio_galon <= 0
    ) {
      this.error =
        'Ingrese un nombre y un precio válido.';
      return;
    }

    this.http.post<Producto>(
      '/api/productos',
      this.nuevoProducto
    ).subscribe({
      next: () => {
        this.mensaje =
          'Producto registrado correctamente.';

        this.nuevoProducto = {
          nombre: '',
          precio_galon: 0
        };

        this.cargarProductos();
        this.cargarDashboard();

        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error(
          'Error registrando producto:',
          error
        );

        if (error.error?.detail) {
          this.error = error.error.detail;
        } else {
          this.error =
            'No fue posible registrar el producto.';
        }

        this.cdr.detectChanges();
      }
    });
  }

  registrarEstacion(): void {
    this.error = '';
    this.mensaje = '';

    if (
      this.nuevaEstacion.nombre.trim().length < 3 ||
      this.nuevaEstacion.direccion.trim().length < 5
    ) {
      this.error =
        'Ingrese un nombre y una dirección válidos.';
      return;
    }

    this.http.post<Estacion>(
      '/api/estaciones',
      this.nuevaEstacion
    ).subscribe({
      next: (estacion) => {
        this.mensaje =
          'Estación registrada correctamente.';

        this.estacionInventarioFiltro = estacion.id;
        this.estacionAuditoriaFiltro = estacion.id;

        this.nuevaEstacion = {
          nombre: '',
          direccion: ''
        };

        this.cargarEstaciones();
        this.cargarDashboard();

        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error(
          'Error registrando estación:',
          error
        );

        if (error.error?.detail) {
          this.error = error.error.detail;
        } else {
          this.error =
            'No fue posible registrar la estación.';
        }

        this.cdr.detectChanges();
      }
    });
  }

  eliminarEstacion(estacion: Estacion): void {
    this.error = '';
    this.mensaje = '';

    const confirmar = window.confirm(
      `¿Está seguro de eliminar "${estacion.nombre}"?\n\n` +
      `También se eliminarán:\n` +
      `- Todo su inventario\n` +
      `- Todas sus ventas\n` +
      `- Sus datos derivados de auditoría\n\n` +
      `Esta acción no se puede deshacer.`
    );

    if (!confirmar) {
      return;
    }

    this.http.delete<EliminacionEstacionResponse>(
      `/api/estaciones/${estacion.id}`
    ).subscribe({
      next: (respuesta) => {
        this.mensaje =
          `${respuesta.estacion} eliminada correctamente. ` +
          `Inventarios eliminados: ${respuesta.inventarios_eliminados}. ` +
          `Ventas eliminadas: ${respuesta.ventas_eliminadas}.`;

        if (
          this.estacionInventarioFiltro === estacion.id
        ) {
          this.estacionInventarioFiltro = 0;
        }

        if (
          this.estacionAuditoriaFiltro === estacion.id
        ) {
          this.estacionAuditoriaFiltro = 0;
        }

        if (
          this.nuevaVenta.estacion_id === estacion.id
        ) {
          this.nuevaVenta.estacion_id = 0;
        }

        if (
          this.nuevoInventario.estacion_id === estacion.id
        ) {
          this.nuevoInventario.estacion_id = 0;
        }

        this.cargarEstaciones();
        this.cargarInventario();
        this.cargarVentas();
        this.cargarDashboard();

        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error(
          'Error eliminando estación:',
          error
        );

        if (error.error?.detail) {
          this.error = error.error.detail;
        } else {
          this.error =
            'No fue posible eliminar la estación.';
        }

        this.cdr.detectChanges();
      }
    });
  }

  registrarInventario(): void {
    this.error = '';
    this.mensaje = '';

    if (
      this.nuevoInventario.estacion_id <= 0 ||
      this.nuevoInventario.producto_id <= 0 ||
      this.nuevoInventario.galones_disponibles < 0
    ) {
      this.error =
        'Seleccione una estación, un producto y una cantidad válida.';
      return;
    }

    const existe = this.inventarios.some(
      item =>
        item.estacion_id ===
          this.nuevoInventario.estacion_id &&
        item.producto_id ===
          this.nuevoInventario.producto_id
    );

    if (existe) {
      this.error =
        'Este producto ya está asignado a la estación seleccionada. Puede modificar sus galones desde la tabla.';
      return;
    }

    const estacionAsignada =
      this.nuevoInventario.estacion_id;

    this.http.post<Inventario>(
      '/api/inventario',
      this.nuevoInventario
    ).subscribe({
      next: () => {
        this.mensaje =
          'Producto asignado a la estación correctamente.';

        this.estacionInventarioFiltro =
          estacionAsignada;

        this.nuevoInventario = {
          estacion_id: 0,
          producto_id: 0,
          galones_disponibles: 0
        };

        this.cargarInventario();
        this.cargarDashboard();

        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error(
          'Error registrando inventario:',
          error
        );

        if (error.error?.detail) {
          this.error = error.error.detail;
        } else {
          this.error =
            'No fue posible asignar el producto a la estación.';
        }

        this.cdr.detectChanges();
      }
    });
  }

  editarInventario(item: Inventario): void {
    this.inventarioEditandoId = item.id;

    this.nuevaCantidadInventario =
      Number(item.galones_disponibles);

    this.error = '';
    this.mensaje = '';
  }

  cancelarEdicionInventario(): void {
    this.inventarioEditandoId = null;
    this.nuevaCantidadInventario = 0;
  }

  guardarInventario(item: Inventario): void {
    this.error = '';
    this.mensaje = '';

    if (this.nuevaCantidadInventario < 0) {
      this.error =
        'El inventario no puede ser negativo.';
      return;
    }

    const datos = {
      galones_disponibles:
        this.nuevaCantidadInventario
    };

    this.http.put<Inventario>(
      `/api/inventario/${item.id}`,
      datos
    ).subscribe({
      next: () => {
        this.mensaje =
          'Inventario actualizado correctamente.';

        this.inventarioEditandoId = null;
        this.nuevaCantidadInventario = 0;

        this.cargarInventario();
        this.cargarDashboard();

        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error(
          'Error actualizando inventario:',
          error
        );

        if (error.error?.detail) {
          this.error = error.error.detail;
        } else {
          this.error =
            'No fue posible actualizar el inventario.';
        }

        this.cdr.detectChanges();
      }
    });
  }

  obtenerProducto(productoId: number): string {
    const producto = this.productos.find(
      item => item.id === productoId
    );

    return producto
      ? producto.nombre
      : `Producto ${productoId}`;
  }

  obtenerEstacion(estacionId: number): string {
    const estacion = this.estaciones.find(
      item => item.id === estacionId
    );

    return estacion
      ? estacion.nombre
      : `Estacion ${estacionId}`;
  }

  estadoInventario(
    cantidad: number | string
  ): string {

    const valor = Number(cantidad);

    if (valor < 500) {
      return 'Crítico';
    }

    if (valor < 1000) {
      return 'Bajo';
    }

    return 'Estable';
  }

  claseColorProducto(nombre: string): string {
    const producto = nombre
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-');

    if (producto === 'regular') {
      return 'fuel-regular';
    }

    if (producto === 'super') {
      return 'fuel-super';
    }

    if (producto === 'diesel') {
      return 'fuel-diesel';
    }

    if (
      producto === 'v-power' ||
      producto === 'vpower'
    ) {
      return 'fuel-vpower';
    }

    return '';
  }

  totalInventarioEstacion(
    estacionId: number
  ): number {

    return this.inventarios
      .filter(
        item => item.estacion_id === estacionId
      )
      .reduce(
        (total, item) =>
          total + Number(item.galones_disponibles),
        0
      );
  }

  galonesVendidosAuditoria(): number {
    return this.ventasAuditoria.reduce(
      (total, venta) =>
        total + Number(venta.galones),
      0
    );
  }

  ingresosAuditoria(): number {
    return this.ventasAuditoria.reduce(
      (total, venta) =>
        total + Number(venta.total),
      0
    );
  }

  numero(valor: number | string): number {
    return Number(valor);
  }
}