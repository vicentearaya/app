import { Component } from '@angular/core';
import { IonicModule, AlertController, LoadingController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ValeService } from '../services/vale.service';
import { Vale } from '../models/vale';

@Component({
  selector: 'app-totem',
  templateUrl: './totem.page.html',
  styleUrls: ['./totem.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class TotemPage {
  // Lista de servicios que se pueden imprimir
  servicios = [
    { 
      nombre: 'Desayuno', 
      icono: 'cafe-outline', 
      emoji: '☕',
      color: 'warning',
      descripcion: 'Vale de desayuno',
      horario: '7:00 AM - 9:30 AM',
      servicio_id: 1,
      monto: 10000
    },
    { 
      nombre: 'Almuerzo', 
      icono: 'restaurant-outline', 
      emoji: '🍽️',
      color: 'success',
      descripcion: 'Vale de almuerzo',
      horario: '12:00 PM - 2:30 PM',
      servicio_id: 2,
      monto: 15000
    },
    { 
      nombre: 'Once', 
      icono: 'beer-outline', 
      emoji: '🧁',
      color: 'tertiary',
      descripcion: 'Vale de once',
      horario: '4:00 PM - 6:00 PM',
      servicio_id: 3,
      monto: 8000
    }
  ];

  constructor(
    private router: Router,
    private valeService: ValeService,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {}

  generarCodigoVale(): string {
    // Generar código único: VALE + timestamp + número aleatorio
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `VALE${timestamp}${random}`;
  }

  async imprimir(servicio: any) {
    const loading = await this.loadingController.create({
      message: 'Generando vale...',
    });
    await loading.present();

    // Generar código único
    const codigo = this.generarCodigoVale();
    
    // Calcular fechas
    const fechaEmision = new Date();
    const fechaVigencia = new Date();
    fechaVigencia.setMonth(fechaVigencia.getMonth() + 6); // 6 meses de vigencia

    // Crear el vale
    const nuevoVale: Vale = {
      codigo: codigo,
      user_id: 1, // Por defecto, en producción esto vendría de la sesión
      servicio_id: servicio.servicio_id,
      fecha_emision: fechaEmision.toISOString().split('T')[0],
      fecha_vigencia: fechaVigencia.toISOString().split('T')[0],
      monto_inicial: servicio.monto,
      monto_usado: 0,
      estado: 'activo',
      es_adicional: false
    };

    this.valeService.create(nuevoVale).subscribe({
      next: async (vale) => {
        loading.dismiss();
        
        // Mostrar alerta con el código del vale
        const fechaVigenciaFormateada = new Date(vale.fecha_vigencia).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });

        const alert = await this.alertController.create({
          header: '✅ Vale Generado Exitosamente',
          message: `
            <div style="text-align: center;">
              <div style="background: #f0f0f0; padding: 15px; border-radius: 8px; margin: 15px 0;">
                <p style="margin: 5px 0; color: #666; font-size: 0.9em;">Tu código de vale es:</p>
                <h2 style="color: #3880ff; font-size: 1.8em; margin: 10px 0; font-weight: bold; letter-spacing: 2px;">${vale.codigo}</h2>
              </div>
              <div style="text-align: left; margin-top: 15px;">
                <p style="margin: 8px 0;"><strong>Servicio:</strong> ${servicio.nombre}</p>
                <p style="margin: 8px 0;"><strong>Monto disponible:</strong> $${vale.monto_inicial.toLocaleString('es-CL')}</p>
                <p style="margin: 8px 0;"><strong>Vigencia hasta:</strong> ${fechaVigenciaFormateada}</p>
              </div>
              <p style="margin-top: 15px; color: #666; font-size: 0.85em;">Usa este código en el punto de venta para realizar tus compras.</p>
            </div>
          `,
          buttons: [
            {
              text: 'Copiar y Ir a Caja',
              handler: async () => {
                await this.copiarCodigo(vale.codigo);
                this.router.navigate(['/caja'], { 
                  queryParams: { codigo: vale.codigo } 
                });
              }
            },
            {
              text: 'Solo Copiar',
              handler: async () => {
                await this.copiarCodigo(vale.codigo);
              }
            },
            {
              text: 'Cerrar',
              role: 'cancel'
            }
          ]
        });

        await alert.present();
      },
      error: async (error) => {
        console.error('Error al generar vale:', error);
        loading.dismiss();
        
        const alert = await this.alertController.create({
          header: '❌ Error',
          message: 'No se pudo generar el vale. Por favor, intenta nuevamente.',
          buttons: ['OK']
        });
        await alert.present();
      }
    });
  }

  async copiarCodigo(codigo: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(codigo);
      const toast = document.createElement('ion-toast');
      toast.message = 'Código copiado al portapapeles';
      toast.duration = 2000;
      toast.color = 'success';
      toast.position = 'top';
      document.body.appendChild(toast);
      await toast.present();
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}