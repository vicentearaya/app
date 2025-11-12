import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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
      horario: '7:00 AM - 9:30 AM'
    },
    { 
      nombre: 'Almuerzo', 
      icono: 'restaurant-outline', 
      emoji: '🍽️',
      color: 'success',
      descripcion: 'Vale de almuerzo',
      horario: '12:00 PM - 2:30 PM'
    },
    { 
      nombre: 'Once', 
      icono: 'beer-outline', 
      emoji: '🧁',
      color: 'tertiary',
      descripcion: 'Vale de once',
      horario: '4:00 PM - 6:00 PM'
    }
  ];

  constructor(private router: Router) {}

  async imprimir(servicio: any) {
    // Mostrar loading
    const loading = document.createElement('ion-loading');
    loading.message = 'Preparando vale...';
    loading.duration = 1000;
    document.body.appendChild(loading);
    await loading.present();

    // Simular preparación del vale
    setTimeout(() => {
      loading.dismiss();
      // Imprimir
      window.print();
    }, 1000);
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}