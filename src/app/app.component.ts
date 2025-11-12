import { Component } from '@angular/core';
import { IonApp, IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonIcon, IonLabel, IonRouterOutlet, IonMenuToggle } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { home, logIn, restaurant, cash, statsChart, exit } from 'ionicons/icons';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [
    CommonModule,
    IonApp, 
    IonMenu, 
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    IonList, 
    IonItem, 
    IonIcon, 
    IonLabel, 
    IonRouterOutlet,
    IonMenuToggle,
    RouterLink
  ],
})
export class AppComponent {
  public menuItems = [
    {
      title: 'Inicio',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'Solicitar Vale',
      url: '/totem',
      icon: 'restaurant'
    },
    {
      title: 'Punto de Venta',
      url: '/caja',
      icon: 'cash'
    },
    {
      title: 'Reportes',
      url: '/reportes',
      icon: 'stats-chart'
    },
    {
      title: 'Login',
      url: '/login',
      icon: 'log-in'
    }
  ];

  constructor() {
    // Registrar los iconos
    addIcons({ home, logIn, restaurant, cash, statsChart, exit });
  }
}