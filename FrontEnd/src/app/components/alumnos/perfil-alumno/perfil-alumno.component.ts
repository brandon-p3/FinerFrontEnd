import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AlumnoService } from '../../../services/alumno.service';

// Define un tipo personalizado para las páginas
type PageType = 'actualizar-perfil' | 'certificados' | 'historial' | 'mis-cursos';

interface Usuario {
  idUsuario: number;
  idRol: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  email: string;
  contrasenia: string;
  nombreUsuario: string;
  cursosCompletados?: number;
  estado: string;
}

@Component({
  selector: 'app-perfil-alumno',
  templateUrl: './perfil-alumno.component.html',
  styleUrls: ['./perfil-alumno.component.css']
})
export class PerfilAlumnoComponent implements OnInit {
  constructor(private router: Router, private alumnoService: AlumnoService) {}
  
  mostrarContraseniaActual: boolean = false;
  mostrarNuevaContrasenia: boolean = false;
  nuevaContrasenia: string = '';
  confirmarContrasenia: string = '';
  contraseniaAnterior: string = '';

  usuario: Usuario = {
    idUsuario: 10,
    idRol: 3,
    nombre: 'Diego',
    apellidoPaterno: 'Flores',
    apellidoMaterno: 'Moreno',
    email: 'diego.flores@estudiante.finer.edu',
    contrasenia: 'est202',
    nombreUsuario: 'diego_estudiante',
    estado: 'activo',
    cursosCompletados: 1
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

  ngOnInit(): void {
    // Guardamos la contraseña original para posibles reversiones
    this.contraseniaAnterior = this.usuario.contrasenia;
  }

  // Método para alternar el menú desplegable
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  // Método para guardar cambios (perfil completo)
  guardarCambios() {
    // Validaciones
    if (!this.usuario.nombre || !this.usuario.apellidoPaterno || 
        !this.usuario.nombreUsuario || !this.usuario.email) {
      Swal.fire('Error', 'Por favor completa todos los campos requeridos', 'error');
      return;
    }

    if (!this.usuario.email.includes('@')) {
      Swal.fire('Error', 'Por favor ingresa un correo electrónico válido', 'error');
      return;
    }

    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas guardar los cambios en tu perfil?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, guardar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const contrasenia = this.nuevaContrasenia || this.usuario.contrasenia;
        
        this.alumnoService.actualizarPerfil(
          this.usuario.idUsuario,
          this.usuario.nombre,
          this.usuario.apellidoPaterno,
          this.usuario.apellidoMaterno,
          this.usuario.email,
          contrasenia,
          this.usuario.nombreUsuario
        ).subscribe({
          next: (response) => {
            Swal.fire('Éxito', 'Perfil actualizado correctamente', 'success');
            
            // Actualiza la contraseña en el frontend si se cambió
            if (this.nuevaContrasenia) {
              this.usuario.contrasenia = this.nuevaContrasenia;
              this.contraseniaAnterior = this.nuevaContrasenia;
              this.nuevaContrasenia = '';
              this.confirmarContrasenia = '';
            }
            
            // Forza la actualización de la vista
            this.refrescarVistaContrasenia();
          },
          error: (error) => {
            // Revierte los cambios en caso de error
            this.usuario.contrasenia = this.contraseniaAnterior;
            Swal.fire('Error', error.error || 'Error al actualizar el perfil', 'error');
          }
        });
      }
    });
  }

  // Método para actualizar solo la contraseña
  actualizarContrasenia() {
    if (this.nuevaContrasenia !== this.confirmarContrasenia) {
      Swal.fire('Error', 'Las contraseñas no coinciden', 'error');
      return;
    }

    if (this.nuevaContrasenia.length < 8) {
      Swal.fire('Error', 'La contraseña debe tener al menos 8 caracteres', 'error');
      return;
    }

    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas actualizar tu contraseña?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, actualizar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Guardamos la contraseña anterior por si hay error
        const contraseniaAnterior = this.usuario.contrasenia;
        
        // Actualizamos primero en el frontend para respuesta inmediata
        this.usuario.contrasenia = this.nuevaContrasenia;
        
        this.alumnoService.actualizarContrasenia(
          this.usuario.email,
          this.nuevaContrasenia
        ).subscribe({
          next: () => {
            Swal.fire('Éxito', 'Contraseña actualizada correctamente', 'success');
            this.contraseniaAnterior = this.nuevaContrasenia;
            this.nuevaContrasenia = '';
            this.confirmarContrasenia = '';
            this.refrescarVistaContrasenia();
          },
          error: (error) => {
            // Revierte el cambio si hay error
            this.usuario.contrasenia = contraseniaAnterior;
            Swal.fire('Error', error.error || 'Error al actualizar la contraseña', 'error');
          }
        });
      }
    });
  }

  // Método auxiliar para refrescar la vista de la contraseña
  private refrescarVistaContrasenia() {
    this.mostrarContraseniaActual = false;
    setTimeout(() => {
      this.mostrarContraseniaActual = true;
    }, 100);
  }

  // Resto de tus métodos existentes (sin cambios)
  ejecutarActualizacion() {
    const contrasenia = this.mostrarContraseniaActual && this.usuario.contrasenia 
      ? this.usuario.contrasenia 
      : '';

    this.alumnoService.actualizarPerfil(
      this.usuario.idUsuario,
      this.usuario.nombre,
      this.usuario.apellidoPaterno,
      this.usuario.apellidoMaterno,
      this.usuario.email,
      contrasenia,
      this.usuario.nombreUsuario
    ).subscribe({
      next: (response) => {
        Swal.fire('Éxito', 'Los cambios se guardaron correctamente', 'success');
        if (response.data) {
          this.usuario = { ...this.usuario, ...response.data };
          this.contraseniaAnterior = this.usuario.contrasenia;
        }
        this.refrescarVistaContrasenia();
      },
      error: (error) => {
        console.error('Error al actualizar:', error);
        Swal.fire('Error', error.error?.message || 'No se pudieron guardar los cambios', 'error');
      }
    });
  }

  visualizarCertificado(idInscripcion: number) {
    this.alumnoService.generarCertificado(idInscripcion).subscribe({
      next: (data) => {
        const blob = new Blob([data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Error al visualizar el certificado:', error);
        Swal.fire('Error', 'No se pudo visualizar el certificado', 'error');
      }
    });
  }

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

  buscarCursos() {
    if (this.terminoBusqueda.trim() === '') {
      Swal.fire('Advertencia', 'Por favor, ingresa un término de búsqueda', 'warning');
      return;
    }

    this.alumnoService.buscarCursoPorNombre(this.terminoBusqueda).subscribe({
      next: (cursos) => {
        this.cursos = cursos;
        this.obtenerProgresoDeCursos();
      },
      error: (error) => {
        console.error('Error al buscar cursos:', error);
        Swal.fire('Error', 'No se pudieron buscar los cursos', 'error');
      }
    });
  }

  obtenerProgresoDeCursos() {
    this.cursos.forEach(curso => {
      this.obtenerProgresoCurso(this.usuario.idUsuario, curso.idCurso);
    });
  }

  obtenerProgresoCurso(idEstudiante: number, idCurso: number) {
    this.alumnoService.verProgresoAlumno(idEstudiante, idCurso).subscribe({
      next: (progreso) => {
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

  navigateTo(page: PageType) {
    this.currentPage = page;

    if (page === 'actualizar-perfil') {
      this.currentSection = 'perfil';
    } else if (page === 'certificados') {
      this.currentSection = 'certificados';
    } else if (page === 'historial') {
      this.currentSection = 'historial';
    } else if (page === 'mis-cursos') {
      this.currentSection = 'mis-cursos';
    }

    this.menuOpen = false;
  }

  logout() {
    console.log('Cerrando sesión...');
    this.router.navigate(['/login']);
  }
}