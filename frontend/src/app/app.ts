import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  dashboard: Dashboard | null = null;
  cargando = true;
  error = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarDashboard();
  }

  cargarDashboard(): void {
    this.cargando = true;
    this.error = '';

    this.http.get<Dashboard>('/api/dashboard').subscribe({
      next: (data) => {
        this.dashboard = data;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar dashboard:', error);
        this.error = 'No fue posible conectar con el backend.';
        this.cargando = false;
      }
    });
  }

  numero(valor: number | string): number {
    return Number(valor);
  }
}