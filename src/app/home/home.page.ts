import { Component } from '@angular/core';
import { IonicModule, MenuController } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, RouterLink, CommonModule]
})
export class HomePage {
  constructor(private menuCtrl: MenuController) {}

  ionViewDidEnter() {
    // Agregar listener al botón del menú
    const menuButton = document.getElementById('menu-button');
    if (menuButton) {
      menuButton.addEventListener('click', () => {
        this.menuCtrl.open();
      });
    }
  }
}