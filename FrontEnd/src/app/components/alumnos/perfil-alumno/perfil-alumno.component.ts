import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-perfil-alumno',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './perfil-alumno.component.html',
  styleUrls: ['./perfil-alumno.component.css']
})
export class PerfilAlumnoComponent {
  // Datos del usuario
  usuario = {
    nombre: 'Nombre del Alumno',
    apellidos: 'Apellido del Alumno',
    email: 'ejemplo@gmail.com',
    cursosCompletados: 5
  };

  // Estado del menú desplegable
  menuOpen = false;
  
  // Página y sección actuales
  currentPage = 'actualizar-perfil';
  currentSection = 'perfil';

  // Método para alternar el menú desplegable
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  // Método para navegar a las diferentes páginas y secciones
  navigateTo(page: string) {
    this.currentPage = page;

    // Cambiar la sección activa del mini menú
    if (page === 'actualizar-perfil') {
      this.currentSection = 'perfil';
    } else if (page === 'certificados') {
      this.currentSection = 'certificados';
    } else if (page === 'historial') {
      this.currentSection = 'historial';
    } else if (page === 'mis-cursos') {
      this.currentSection = 'mis-cursos';
    }

    // Cerrar el menú después de seleccionar una opción
    this.menuOpen = false;
  }

  // Método para cerrar sesión
  logout() {
    console.log('Cerrando sesión...');
    // Aquí puedes agregar lógica para cerrar sesión
  }
}
