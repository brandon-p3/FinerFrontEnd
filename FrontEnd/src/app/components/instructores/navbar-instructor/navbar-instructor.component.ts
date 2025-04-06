import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuariosService } from '../../../services/usuarios-service.service';  // Asegúrate de importar el servicio correctamente

@Component({
  selector: 'app-navbar-instructor',
  templateUrl: './navbar-instructor.component.html',
  styleUrl: './navbar-instructor.component.css'
})
export class NavbarInstructorComponent implements OnInit {
  
  usuario: any = {};  // Aquí inicializamos el objeto de usuario
  menuOpen = false;
  currentPage = 'crear-curso';

  constructor(private router: Router, private usuariosService: UsuariosService) { }

  ngOnInit(): void {
    this.usuariosService.currentUser.subscribe(user => {
      if (user) {
        this.usuario = user; 
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

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
    this.usuariosService.logout();
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
