import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil-alumno',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './perfil-alumno.component.html',
  styleUrls: ['./perfil-alumno.component.css']
})
export class PerfilAlumnoComponent {
  constructor(private router: Router) {}
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
  ejecutarDescarga: any;


  // Método para alternar el menú desplegable
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
   // Método para guardar cambios
   guardarCambios() {
    // Muestra una alerta de confirmación
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas guardar los cambios?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, guardar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#8EC3B0', // Color del botón de confirmación
      cancelButtonColor: '#FF6B6B', // Color del botón de cancelación
    }).then((result) => {
      if (result.isConfirmed) {
        // Si el usuario confirma, ejecuta la lógica para guardar cambios
        this.ejecutarGuardado();
      }
    });
  }

  // Método que contiene la lógica para guardar cambios
  ejecutarGuardado() {
    console.log('Guardando cambios...');
    // Aquí puedes agregar la lógica para guardar los cambios,
    // como hacer una petición HTTP, actualizar el estado, etc.
  }
  // Método para descargar el certificado
  descargarCertificado() {
    // Muestra una alerta de confirmación
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas descargar el certificado?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, descargar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#8EC3B0', // Color del botón de confirmación
      cancelButtonColor: '#FF6B6B', // Color del botón de cancelación
    }).then((result) => {
      if (result.isConfirmed) {
        // Si el usuario confirma, ejecuta la lógica para descargar el certificado
        this.ejecutarDescarga();
      }
    });
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
    this.router.navigate(['/login']); // Redirige al login

  }
}
