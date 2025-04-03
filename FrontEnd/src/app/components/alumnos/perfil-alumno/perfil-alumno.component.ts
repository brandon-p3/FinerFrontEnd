import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AlumnoService } from '../../../services/alumno.service';

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

interface Curso {
titulo: string;
  idCurso: number;
  idInscripcion: number;
  idAlumno: number;
  fechaInscripcion: string;
  estado: string;
  progreso?: number;
  ultimaActividad?: string;
  categoria?: string;

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

  menuOpen = false;
  currentPage: PageType = 'actualizar-perfil';
  currentSection: string = 'perfil';
  cursos: Curso[] = [];
  cursosCertificados: Curso[] = [];
  terminoBusqueda: string = '';

  ngOnInit(): void {
    if (this.currentPage === 'mis-cursos') {
      this.cargarMisCursos();
    }
    if (this.currentPage === 'certificados') {
      this.cargarCursosFinalizados();
    }
  }

  cargarMisCursos() {
    this.alumnoService.obtenerMisCursos(this.usuario.idUsuario).subscribe({
      next: (cursos: any[]) => {
        this.cursos = cursos.map(curso => ({
          ...curso,
          progreso: 0,
          ultimaActividad: ''
        }));
        this.obtenerProgresoDeCursos();
      },
      error: (error) => {
        console.error('Error al obtener cursos:', error);
        Swal.fire('Error', 'No se pudieron cargar los cursos', 'error');
      }
    });
  }

  cargarCursosFinalizados() {
    this.alumnoService.obtenerMisCursos(this.usuario.idUsuario).subscribe({
      next: (cursos: any[]) => {
        this.cursosCertificados = cursos.filter(curso => curso.estado === 'finalizado');
      },
      error: (error) => {
        console.error('Error al obtener cursos finalizados:', error);
        Swal.fire('Error', 'No se pudieron cargar los certificados', 'error');
      }
    });
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  guardarCambios() {
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
        const contrasenia = this.mostrarContraseniaActual ? this.usuario.contrasenia : '';
        
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
            this.mostrarContraseniaActual = false;
            this.usuario.contrasenia = '';
          },
          error: (error) => {
            Swal.fire('Error', error.error || 'Error al actualizar el perfil', 'error');
          }
        });
      }
    });
  }

  actualizarContrasenia() {
    if (this.nuevaContrasenia !== this.confirmarContrasenia) {
      Swal.fire('Error', 'Las contraseñas no coinciden', 'error');
      return;
    }

    if (this.nuevaContrasenia.length < 8) {
      Swal.fire('Error', 'La contraseña debe tener al menos 8 caracteres', 'error');
      return;
    }

    this.alumnoService.actualizarContrasenia(this.usuario.email, this.nuevaContrasenia)
      .subscribe({
        next: () => {
          Swal.fire('Éxito', 'Contraseña actualizada correctamente', 'success');
          this.usuario.contrasenia = this.nuevaContrasenia;
          this.nuevaContrasenia = '';
          this.confirmarContrasenia = '';
        },
        error: (error) => {
          Swal.fire('Error', error.error || 'Error al actualizar la contraseña', 'error');
        }
      });
  }

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
        }
        this.mostrarContraseniaActual = false;
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

  descargarCertificado(idInscripcion: number) {
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
        this.alumnoService.generarCertificado(idInscripcion).subscribe({
          next: (data) => {
            const blob = new Blob([data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `certificado-${idInscripcion}.pdf`;
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

    this.alumnoService.buscarCursosPorNombre(this.terminoBusqueda).subscribe({
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

  continuarCurso(idCurso: number) {
    // Redirige al componente del curso con el ID del curso
    this.router.navigate(['/curso', idCurso]);
  }

  navigateTo(page: PageType) {
    this.currentPage = page;

    if (page === 'actualizar-perfil') {
      this.currentSection = 'perfil';
    } else if (page === 'certificados') {
      this.currentSection = 'certificados';
      this.cargarCursosFinalizados();
    } else if (page === 'historial') {
      this.currentSection = 'historial';
      this.cargarMisCursos();
    } else if (page === 'mis-cursos') {
      this.currentSection = 'mis-cursos';
      this.cargarMisCursos();
    }

    this.menuOpen = false;
  }

  inscribirseCurso(idCurso: number) {
    this.alumnoService.inscribirseCurso(this.usuario.idUsuario, idCurso).subscribe({
      next: (inscrito) => {
        if (inscrito) {
          Swal.fire('Éxito', 'Te has inscrito correctamente al curso', 'success');
          this.buscarCursos();
        } else {
          Swal.fire('Error', 'No se pudo completar la inscripción', 'error');
        }
      },
      error: (error) => {
        console.error('Error al inscribirse:', error);
        Swal.fire('Error', error.error || 'Error al inscribirse al curso', 'error');
      }
    });
  }

  logout() {
    console.log('Cerrando sesión...');
    this.router.navigate(['/login']);
  }
}