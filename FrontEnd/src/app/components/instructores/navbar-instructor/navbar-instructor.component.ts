import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar-instructor',
  templateUrl: './navbar-instructor.component.html',
  styleUrl: './navbar-instructor.component.css'
})
export class NavbarInstructorComponent {

  constructor(private router: Router) { }

  usuario: any = {
    id: 0,          
    nombre: '',     
    apellidoPaterno: '',
    apellidoMaterno: '',
    email: '',
    username: '',
    idUsuario: 0,    
    idRol: 0         
  };

  menuOpen = false;
  currentPage = 'crear-curso';

  // Método para navegar a una ruta específica
  navigateTo(page: string) {
    if (page === 'cursos') {
        this.router.navigate(['/instructor/cursos']);
    }
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

  perfil() {
    this.currentPage = 'perfil';
    this.router.navigate(['/instructor/perfil']);
  }

}
