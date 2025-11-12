import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule]
})
export class LoginPage {
  model = { codigo: '', password: '' };
  minPasswordLength = 6;

  constructor(private router: Router) {}

  onSubmit() {
    // Aquí irá tu lógica de login
    console.log('Login:', this.model);
    // this.router.navigate(['/home']);
  }

  goBack() {
    this.router.navigate(['/']);
  }
}