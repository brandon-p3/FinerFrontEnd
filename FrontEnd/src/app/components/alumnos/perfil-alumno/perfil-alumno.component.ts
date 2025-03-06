import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms'


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
    nombre: 'Juan',
    apellidos: 'Pérez',
    email: 'juan.perez@email.com',
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

  // Método para navegar entre páginas
  navigateTo(page: string) {
    this.currentPage = page;
  }

  // Método para cerrar sesión
  logout() {
    console.log('Cerrando sesión...');
    // Aquí puedes agregar lógica para cerrar sesión
  }
}
