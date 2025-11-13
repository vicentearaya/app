import { Component, OnInit } from '@angular/core';
import { IonicModule, AlertController, LoadingController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { ProductoService } from '../services/producto.service';
import { ValeService } from '../services/vale.service';
import { TransaccionService } from '../services/transaccion.service';
import { Producto } from '../models/producto';
import { Vale } from '../models/vale';

interface ItemCarrito {
  producto_id: number;
  nombre: string;
  precio: number;
  cantidad: number;
}

@Component({
  selector: 'app-caja',
  templateUrl: './caja.page.html',
  styleUrls: ['./caja.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class CajaPage implements OnInit {
  codigoVale: string = '';
  valeActual: Vale | null = null;
  errorVale: string = '';
  
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  categoriaSeleccionada: string = 'Todos';
  categorias: string[] = ['Todos', 'desayuno', 'almuerzo', 'cena', 'bebida', 'postre'];
  
  carrito: ItemCarrito[] = [];

  constructor(
    private productoService: ProductoService,
    private valeService: ValeService,
    private transaccionService: TransaccionService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  async cargarProductos(): Promise<void> {
    const loading = await this.loadingController.create({
      message: 'Cargando productos...',
    });
    await loading.present();

    this.productoService.getAll().subscribe({
      next: (data) => {
        this.productos = data.filter(p => p.activo);
        this.productosFiltrados = this.productos;
        loading.dismiss();
      },
      error: async (error) => {
        console.error('Error al cargar productos:', error);
        loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'No se pudieron cargar los productos',
          buttons: ['OK']
        });
        await alert.present();
      }
    });
  }

  async buscarVale(): Promise<void> {
    if (!this.codigoVale.trim()) {
      this.errorVale = 'Ingresa un código de vale';
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Buscando vale...',
    });
    await loading.present();

    this.valeService.getByCodigo(this.codigoVale).subscribe({
      next: (vale) => {
        loading.dismiss();
        
        if (vale.estado !== 'activo') {
          this.errorVale = 'El vale no está activo';
          this.valeActual = null;
        } else {
          const saldoDisponible = vale.saldo_disponible ?? (vale.monto_inicial - vale.monto_usado);

          if (saldoDisponible <= 0) {
            this.errorVale = 'El vale no tiene saldo disponible';
            this.valeActual = null;
          } else {
            this.valeActual = {
              ...vale,
              saldo_disponible: saldoDisponible
            };
            this.errorVale = '';
            this.mostrarToast('Vale encontrado', 'success');
          }
        }
      },
      error: async (error) => {
        console.error('Error al buscar vale:', error);
        loading.dismiss();
        this.errorVale = 'Vale no encontrado';
        this.valeActual = null;
      }
    });
  }

  filtrarPorCategoria(categoria: string): void {
    this.categoriaSeleccionada = categoria;
    if (categoria === 'Todos') {
      this.productosFiltrados = this.productos;
    } else {
      this.productosFiltrados = this.productos.filter(p => p.categoria === categoria);
    }
  }

  agregarProducto(producto: Producto): void {
    // Permitir agregar productos sin vale, pero mostrar advertencia
    if (!this.valeActual) {
      this.mostrarToast('Agrega un vale antes de procesar la venta', 'warning');
    }

    const itemExistente = this.carrito.find(item => item.producto_id === producto.id);
    
    if (itemExistente) {
      itemExistente.cantidad++;
    } else {
      this.carrito.push({
        producto_id: producto.id!,
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad: 1
      });
    }
    
    this.mostrarToast('Producto agregado', 'success');
  }

  aumentarCantidad(index: number): void {
    this.carrito[index].cantidad++;
  }

  disminuirCantidad(index: number): void {
    if (this.carrito[index].cantidad > 1) {
      this.carrito[index].cantidad--;
    }
  }

  eliminarDelCarrito(index: number): void {
    this.carrito.splice(index, 1);
    this.mostrarToast('Producto eliminado', 'warning');
  }

  calcularTotal(): number {
    return this.carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  }

  puedeProcessar(): boolean {
    // Requiere vale y productos en el carrito
    if (!this.valeActual || this.carrito.length === 0) {
      return false;
    }
    
    // Verificar que el saldo sea suficiente
    const saldoDisponible = this.valeActual.saldo_disponible ?? 0;
    return this.calcularTotal() <= saldoDisponible;
  }

  tieneProductos(): boolean {
    return this.carrito.length > 0;
  }

  async procesarTransaccion(): Promise<void> {
    // Validar que haya un vale antes de procesar
    if (!this.valeActual) {
      const alert = await this.alertController.create({
        header: 'Vale requerido',
        message: 'Debes buscar un vale antes de procesar la venta',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    if (!this.puedeProcessar()) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No se puede procesar la venta. Verifica que tengas saldo suficiente y productos en el carrito.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    const alert = await this.alertController.create({
      header: 'Confirmar transacción',
      message: `¿Procesar venta por $${this.calcularTotal()}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Confirmar',
          handler: () => {
            this.ejecutarTransaccion();
          }
        }
      ]
    });

    await alert.present();
  }

  async ejecutarTransaccion(): Promise<void> {
    const loading = await this.loadingController.create({
      message: 'Procesando transacción...',
    });
    await loading.present();

    const transaccion = {
      vale_id: this.valeActual!.id!,
      total: this.calcularTotal(),
      fecha: new Date().toISOString(),
      detalles: this.carrito.map(item => ({
        producto_id: item.producto_id,
        cantidad: item.cantidad,
        precio_unitario: item.precio,
        subtotal: item.precio * item.cantidad
      }))
    };

    this.transaccionService.create(transaccion).subscribe({
      next: async (response) => {
        loading.dismiss();
        const alert = await this.alertController.create({
          header: '✅ Éxito',
          message: 'Transacción procesada exitosamente',
          buttons: ['OK']
        });
        await alert.present();
        this.limpiarTodo();
      },
      error: async (error) => {
        console.error('Error al procesar transacción:', error);
        loading.dismiss();
        const alert = await this.alertController.create({
          header: '❌ Error',
          message: 'No se pudo procesar la transacción',
          buttons: ['OK']
        });
        await alert.present();
      }
    });
  }

  async limpiarCarrito(): Promise<void> {
    if (this.carrito.length === 0) return;

    const alert = await this.alertController.create({
      header: 'Limpiar carrito',
      message: '¿Estás seguro de vaciar el carrito?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Limpiar',
          handler: () => {
            this.carrito = [];
            this.mostrarToast('Carrito vaciado', 'warning');
          }
        }
      ]
    });

    await alert.present();
  }

  limpiarTodo(): void {
    this.carrito = [];
    this.valeActual = null;
    this.codigoVale = '';
    this.errorVale = '';
  }

  async mostrarToast(message: string, color: string): Promise<void> {
    const toast = document.createElement('ion-toast');
    toast.message = message;
    toast.duration = 2000;
    toast.color = color;
    toast.position = 'top';
    
    document.body.appendChild(toast);
    await toast.present();
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }
}
