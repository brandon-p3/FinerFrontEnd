import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar-instructor',
  templateUrl: './navbar-instructor.component.html',
  styleUrl: './navbar-instructor.component.css'
})
export class NavbarInstructorComponent {

  constructor(private router: Router) { }

  usuario = {
    nombre: 'Juan',
    apellidos: 'Pérez',
    email: 'juan.perez@finer.com',
  };

  menuOpen = false;
  currentPage = 'crear-curso';

  // Método para navegar a una ruta específica
  navigateTo(route: string) {
    this.router.navigate([route]); // Usa el Router para redirigir
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  logout() {
    console.log('Cerrando sesión...');
    this.router.navigate(['/usuarios-admin/login/login']);
  }

    createCourse() {
      this.currentPage = 'crear-curso';
      this.router.navigate(['/instructor/crear-curso']);
    }

}
