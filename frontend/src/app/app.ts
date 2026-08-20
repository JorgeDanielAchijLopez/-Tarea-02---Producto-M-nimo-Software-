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
    './inventory.css'
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

  inventarioEditandoId: number | null = null;
  nuevaCantidadInventario = 0;

  nuevaVenta = {
    estacion_id: 0,
    producto_id: 0,
    galones: 0
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
      }
    });
  }

  cargarEstaciones(): void {
    this.http.get<Estacion[]>('/api/estaciones').subscribe({
      next: (data) => {
        this.estaciones = data;
        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Error estaciones:', error);
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
      this.error = 'Debe completar todos los datos de la venta.';
      return;
    }

    this.http.post<Venta>(
      '/api/ventas',
      this.nuevaVenta
    ).subscribe({
      next: () => {
        this.mensaje = 'Venta registrada correctamente.';

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
        console.error('Error al registrar venta:', error);

        if (error.error?.detail) {
          this.error = error.error.detail;
        } else {
          this.error = 'No fue posible registrar la venta.';
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
      this.error = 'El inventario no puede ser negativo.';
      return;
    }

    const datos = {
      galones_disponibles: this.nuevaCantidadInventario
    };

    this.http.put<Inventario>(
      `/api/inventario/${item.id}`,
      datos
    ).subscribe({
      next: () => {
        this.mensaje = 'Inventario actualizado correctamente.';

        this.inventarioEditandoId = null;
        this.nuevaCantidadInventario = 0;

        this.cargarInventario();
        this.cargarDashboard();

        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Error actualizando inventario:', error);

        if (error.error?.detail) {
          this.error = error.error.detail;
        } else {
          this.error = 'No fue posible actualizar el inventario.';
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

  estadoInventario(cantidad: number | string): string {
    const valor = Number(cantidad);

    if (valor < 500) {
      return 'Crítico';
    }

    if (valor < 1000) {
      return 'Bajo';
    }

    return 'Estable';
  }

  numero(valor: number | string): number {
    return Number(valor);
  }
}