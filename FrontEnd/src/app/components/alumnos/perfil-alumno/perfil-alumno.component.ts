import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AlumnoService } from '../../../services/alumno.service';

// Define un tipo personalizado para las páginas
type PageType = 'actualizar-perfil' | 'certificados' | 'historial' | 'mis-cursos';

interface Usuario {
  idUsuario: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  email: string; // Asegúrate que coincida con 'correo' en el backend
  contrasenia: string;
  nombreUsuario: string;
  cursosCompletados: number;
  // Agrega otros campos si son necesarios
}

@Component({
  selector: 'app-perfil-alumno',
  templateUrl: './perfil-alumno.component.html',
  styleUrls: ['./perfil-alumno.component.css']
})
export class PerfilAlumnoComponent {
  constructor(private router: Router, private alumnoService: AlumnoService) {}
  mostrarCampoContrasenia: boolean = false;
  mostrarContrasenia: boolean = false;

  usuario: Usuario = {
    idUsuario: 1,
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

  // Lista de cursos dinámica
  cursos: any[] = [];

  // Término de búsqueda
  terminoBusqueda: string = '';

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
      this.usuario.email, // Nota: En el backend es 'correo'
      this.usuario.contrasenia,
      this.usuario.nombreUsuario
    ).subscribe({
      next: (response) => {
        Swal.fire('Éxito', 'Los cambios se guardaron correctamente', 'success');
        // Opcional: Actualizar datos locales si el backend devuelve info actualizada
        if (response.data) {
          this.usuario = { ...this.usuario, ...response.data };
        }
      },
      error: (error) => {
        console.error('Error al actualizar:', error);
        Swal.fire('Error', error.error?.message || 'No se pudieron guardar los cambios', 'error');
      }
    });
  }

  // Método para visualizar el certificado
visualizarCertificado(idInscripcion: number) {
  this.alumnoService.generarCertificado(idInscripcion).subscribe({
    next: (data) => {
      // Crear un Blob con el contenido del PDF
      const blob = new Blob([data], { type: 'application/pdf' });

      // Crear una URL para el Blob
      const url = window.URL.createObjectURL(blob);

      // Abrir el PDF en una nueva pestaña
      window.open(url, '_blank');

      // Liberar el objeto URL después de abrir el PDF
      window.URL.revokeObjectURL(url);
    },
    error: (error) => {
      console.error('Error al visualizar el certificado:', error);
      Swal.fire('Error', 'No se pudo visualizar el certificado', 'error');
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

  // Método para buscar cursos por nombre
  buscarCursos() {
    if (this.terminoBusqueda.trim() === '') {
      Swal.fire('Advertencia', 'Por favor, ingresa un término de búsqueda', 'warning');
      return;
    }

    this.alumnoService.buscarCursoPorNombre(this.terminoBusqueda).subscribe({
      next: (cursos) => {
        this.cursos = cursos; // Actualizar la lista de cursos con los resultados de la búsqueda
        this.obtenerProgresoDeCursos(); // Obtener el progreso de los cursos encontrados
      },
      error: (error) => {
        console.error('Error al buscar cursos:', error);
        Swal.fire('Error', 'No se pudieron buscar los cursos', 'error');
      }
    });
  }

  // Método para obtener el progreso de los cursos en la lista
  obtenerProgresoDeCursos() {
    this.cursos.forEach(curso => {
      this.obtenerProgresoCurso(this.usuario.idUsuario, curso.idCurso);
    });
  }

  // Método para obtener el progreso de un curso específico
  obtenerProgresoCurso(idEstudiante: number, idCurso: number) {
    this.alumnoService.verProgresoAlumno(idEstudiante, idCurso).subscribe({
      next: (progreso) => {
        // Buscar el curso en la lista y actualizar su progreso y última actividad
        const curso = this.cursos.find(c => c.idCurso === idCurso);
        if (curso) {
          curso.progreso = progreso.vPorcentaje;
          curso.ultimaActividad = progreso.ultimaActividad;
        }
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