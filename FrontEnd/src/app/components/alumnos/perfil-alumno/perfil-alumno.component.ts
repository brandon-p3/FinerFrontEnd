import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AlumnoService } from '../../../services/alumno.service';

// Define un tipo personalizado para las páginas
type PageType = 'actualizar-perfil' | 'certificados' | 'historial' | 'mis-cursos';

@Component({
  selector: 'app-perfil-alumno',
  templateUrl: './perfil-alumno.component.html',
  styleUrls: ['./perfil-alumno.component.css']
})
export class PerfilAlumnoComponent {
  constructor(private router: Router, private alumnoService: AlumnoService) {}

  // Datos del usuario
  usuario = {
    idUsuario: 1, // Este valor debería obtenerse de la autenticación
    nombre: 'Nombre del Alumno',
    apellidoPaterno: 'ApellidoPaterno',
    apellidoMaterno: 'ApellidoMaterno',
    email: 'ejemplo@gmail.com',
    contrasenia: 'password123',
    nombreUsuario: 'nombreUsuario',
    cursosCompletados: 5
  };

  // Estado del menú desplegable
  menuOpen = false;

  // Página y sección actuales
  currentPage: PageType = 'actualizar-perfil';
  currentSection: string = 'perfil';

  // Método para alternar el menú desplegable
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  // Método para guardar cambios
  guardarCambios() {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas guardar los cambios?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, guardar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#8EC3B0',
      cancelButtonColor: '#FF6B6B',
    }).then((result) => {
      if (result.isConfirmed) {
        this.ejecutarGuardado();
      }
    });
  }

  // Método que contiene la lógica para guardar cambios
  ejecutarGuardado() {
    this.alumnoService.actualizarPerfil(
      this.usuario.idUsuario,
      this.usuario.nombre,
      this.usuario.apellidoPaterno,
      this.usuario.apellidoMaterno,
      this.usuario.email,
      this.usuario.contrasenia,
      this.usuario.nombreUsuario
    ).subscribe({
      next: (response) => {
        Swal.fire('Éxito', 'Los cambios se guardaron correctamente', 'success');
      },
      error: (error) => {
        Swal.fire('Error', 'No se pudieron guardar los cambios', 'error');
      }
    });
  }

  // Método para descargar el certificado
  descargarCertificado(idCertificado: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas descargar el certificado?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, descargar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#8EC3B0',
      cancelButtonColor: '#FF6B6B',
    }).then((result) => {
      if (result.isConfirmed) {
        this.alumnoService.generarCertificado(idCertificado).subscribe({
          next: (data) => {
            const blob = new Blob([data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `certificado-${idCertificado}.pdf`;
            a.click();
            window.URL.revokeObjectURL(url);
          },
          error: (error) => {
            Swal.fire('Error', 'No se pudo descargar el certificado', 'error');
          }
        });
      }
    });
  }
    // Método para obtener el progreso del alumno en un curso
    obtenerProgresoCurso(idEstudiante: number, idCurso: number) {
      this.alumnoService.verProgresoAlumno(idEstudiante, idCurso).subscribe({
        next: (progreso) => {
          console.log('Progreso del curso:', progreso);
          // Aquí puedes manejar la respuesta, por ejemplo, mostrarla en la interfaz de usuario
        },
        error: (error) => {
          console.error('Error al obtener el progreso del curso:', error);
        }
      });
    }
  

  // Método para navegar a las diferentes páginas y secciones
  navigateTo(page: PageType) {
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
    this.router.navigate(['/login']);
  }
}