import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface ReporteItem {
  fecha: string;
  servicio: string;
  emitidos: number;
  canjeados: number;
  porcentaje: number;
}

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.page.html',
  styleUrls: ['./reportes.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ReportesPage implements OnInit {
  reportes: ReporteItem[] = [];
  reportesFiltrados: ReporteItem[] = [];
  
  // Filtros
  fechaInicio: string = '';
  fechaFin: string = '';
  servicioFiltro: string = 'todos';
  servicios: string[] = ['todos', 'Desayuno', 'Almuerzo', 'Once'];

  // Estadísticas
  totalEmitidos: number = 0;
  totalCanjeados: number = 0;
  promedioCanjeados: number = 0;

  constructor(private router: Router) {}

  ngOnInit() {
    this.cargarDatosEjemplo();
    this.calcularEstadisticas();
  }

  cargarDatosEjemplo() {
    // Datos de ejemplo - en producción vendrían del backend
    this.reportes = [
      {
        fecha: '2025-11-12',
        servicio: 'Desayuno',
        emitidos: 120,
        canjeados: 110,
        porcentaje: 91.7
      },
      {
        fecha: '2025-11-12',
        servicio: 'Almuerzo',
        emitidos: 250,
        canjeados: 240,
        porcentaje: 96.0
      },
      {
        fecha: '2025-11-12',
        servicio: 'Once',
        emitidos: 80,
        canjeados: 75,
        porcentaje: 93.8
      },
      {
        fecha: '2025-11-11',
        servicio: 'Desayuno',
        emitidos: 115,
        canjeados: 105,
        porcentaje: 91.3
      },
      {
        fecha: '2025-11-11',
        servicio: 'Almuerzo',
        emitidos: 245,
        canjeados: 238,
        porcentaje: 97.1
      },
      {
        fecha: '2025-11-11',
        servicio: 'Once',
        emitidos: 85,
        canjeados: 80,
        porcentaje: 94.1
      },
      {
        fecha: '2025-11-10',
        servicio: 'Desayuno',
        emitidos: 125,
        canjeados: 115,
        porcentaje: 92.0
      },
      {
        fecha: '2025-11-10',
        servicio: 'Almuerzo',
        emitidos: 260,
        canjeados: 250,
        porcentaje: 96.2
      },
      {
        fecha: '2025-11-10',
        servicio: 'Once',
        emitidos: 90,
        canjeados: 85,
        porcentaje: 94.4
      }
    ];
    
    this.reportesFiltrados = [...this.reportes];
  }

  aplicarFiltros() {
    this.reportesFiltrados = this.reportes.filter(reporte => {
      let cumpleFiltros = true;

      // Filtro por servicio
      if (this.servicioFiltro !== 'todos') {
        cumpleFiltros = cumpleFiltros && reporte.servicio === this.servicioFiltro;
      }

      // Filtro por fecha inicio
      if (this.fechaInicio) {
        cumpleFiltros = cumpleFiltros && reporte.fecha >= this.fechaInicio;
      }

      // Filtro por fecha fin
      if (this.fechaFin) {
        cumpleFiltros = cumpleFiltros && reporte.fecha <= this.fechaFin;
      }

      return cumpleFiltros;
    });

    this.calcularEstadisticas();
  }

  limpiarFiltros() {
    this.fechaInicio = '';
    this.fechaFin = '';
    this.servicioFiltro = 'todos';
    this.reportesFiltrados = [...this.reportes];
    this.calcularEstadisticas();
  }

  calcularEstadisticas() {
    this.totalEmitidos = this.reportesFiltrados.reduce((sum, r) => sum + r.emitidos, 0);
    this.totalCanjeados = this.reportesFiltrados.reduce((sum, r) => sum + r.canjeados, 0);
    this.promedioCanjeados = this.totalEmitidos > 0 
      ? Math.round((this.totalCanjeados / this.totalEmitidos) * 100) 
      : 0;
  }

  formatearFecha(fecha: string): string {
    const date = new Date(fecha + 'T00:00:00');
    return date.toLocaleDateString('es-CL', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  }

  getColorPorcentaje(porcentaje: number): string {
    if (porcentaje >= 95) return 'success';
    if (porcentaje >= 85) return 'warning';
    return 'danger';
  }

  exportarCSV() {
    let csv = 'Fecha,Servicio,Emitidos,Canjeados,Porcentaje\n';
    
    this.reportesFiltrados.forEach(reporte => {
      csv += `${reporte.fecha},${reporte.servicio},${reporte.emitidos},${reporte.canjeados},${reporte.porcentaje}%\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reportes_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}