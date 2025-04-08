import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AlumnoService } from '../../../services/alumno.service';
import { VerIdInscripcionDTO } from '../../../services/alumno.service';
import { CursoCertificadoResumenDTO } from '../../../documentos/cursosDocumento';
import { ActivatedRoute } from '@angular/router';
import { saveAs } from 'file-saver';

type PageType = 'actualizar-perfil' | 'certificados' | 'mis-cursos';

interface Usuario {
  idUsuario: number;
  idRol: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  correo: string;
  contrasenia: string;
  nombreUsuario: string;
  cursosCompletados?: number;
  estado: string;
  actualizarContrasenia: boolean;
}

interface Curso {
  tituloCurso: string;
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
  constructor(
    private router: Router,
    private alumnoService: AlumnoService,
    private route: ActivatedRoute
  ) { }

  // CAMBIAR CONTRASEÑA =========================0
  mostrarContraseniaActual: boolean = false;
  mostrarNuevaContrasenia: boolean = false;
  nuevaContrasenia: string = '';
  confirmarContrasenia: string = '';

  usuario: Usuario = {
    idUsuario: 0,
    idRol: 0,
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    correo: '',
    contrasenia: '',
    nombreUsuario: '',
    estado: '',
    cursosCompletados: 0,
    actualizarContrasenia: false,
  };

// pARA LA NAVEGACION =================
  menuOpen = false;
  currentPage: PageType = 'actualizar-perfil';
  currentSection: string = 'perfil';
  cursos: Curso[] = [];
  terminoBusqueda: string = '';

  cursosCertificados: any[] = [];
  idAlumno!: number;

  ngOnInit(): void {
    if (typeof window !== 'undefined' && localStorage.getItem('currentUser')) {
      const storedUser = localStorage.getItem('currentUser');
      this.usuario = storedUser ? JSON.parse(storedUser) : null;
      console.log('Usuario cargado:', this.usuario);

      if (this.usuario && this.usuario.idUsuario) {
        this.idAlumno = this.usuario.idUsuario;

        if (this.currentPage === 'certificados') {
          this.cargarCursosFinalizados();
        }

        if (this.currentPage === 'mis-cursos') {
          this.cargarMisCursos();
        }
      } else {
        console.warn('El objeto usuario no tiene idUsuario');
        this.router.navigate(['/home/inicio']);
      }

    } else {
      console.warn('No se encontró información del usuario en localStorage');
      this.router.navigate(['/home/inicio']);
    }
  }


  // ================ MI PERFIL ============================

  cargarMisCursos() {
    this.alumnoService.obtenerMisCursos(this.usuario.idUsuario).subscribe({
      next: (response: any) => {
        console.log('Respuesta del backend:', response);
        
        // Verifica si es un array (lista de cursos) o un objeto con mensaje
        if (Array.isArray(response)) {
          this.cursos = response.map(curso => ({
            ...curso,
            progreso: 0,
            ultimaActividad: ''
          }));
        } else {
          // Si es un objeto con mensaje y cursos vacíos
          if (response.cursos) {
            this.cursos = [];
          }
        }
        
        if (this.cursos.length > 0) {
          this.obtenerProgresoDeCursos();
        }
      },
      error: (error) => {
        console.error('Error al obtener cursos:', error);
        Swal.fire('Error', 'No se pudieron cargar los cursos', 'error');
      }
    });
  }

  guardarCambios() {
    if (!this.usuario.nombre || !this.usuario.apellidoPaterno ||
      !this.usuario.nombreUsuario || !this.usuario.correo) {
      Swal.fire('Error', 'Por favor completa todos los campos requeridos', 'error');
      return;
    }

    if (!this.usuario.correo.includes('@')) {
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
          this.usuario.correo,
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

    this.alumnoService.actualizarContrasenia(this.usuario.correo, this.nuevaContrasenia)
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
      this.usuario.correo,
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

  // =============== MIS CERTIFICADOS =============================

  descargarCertificado(idInscripcion: number): void {
    this.alumnoService.descargarCertificado(idInscripcion).subscribe({
      next: (pdfBlob: Blob) => {
        const nombreArchivo = `certificado_${idInscripcion}.pdf`;
        saveAs(pdfBlob, nombreArchivo);
      },
      error: (err) => {
        console.error('No se pudo descargar el certificado', err);
        // Puedes mostrar un mensaje con SweetAlert o algún toast
      }
    });
  }

  cargarCursosFinalizados(): void {
    this.alumnoService.obtenerCursosFinalizados(this.idAlumno).subscribe({
      next: (cursos) => {
        console.log('Cerficiciones: ', cursos)
        this.cursosCertificados = cursos;
      },
      error: () => {
        this.cursosCertificados = [];
      }
    });
  }

  // ============== MIS CURSOS ====================

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
      this.alumnoService.obtenerProgresoCurso(this.usuario.idUsuario, curso.idCurso).subscribe({
        next: (porcentaje: number) => {
          const porcentajeRedondeado = Math.round(porcentaje);
          console.log('porcentaje redondeado', porcentajeRedondeado);
        curso.progreso = porcentajeRedondeado;
        },
        error: (error) => {
          console.error(`Error al obtener el progreso del curso ${curso.idCurso}:`, error);
        }
      });
    });
  }

  accederYObtenerProgreso(curso: any) {
    this.alumnoService.obtenerProgresoCurso(this.usuario.idUsuario, curso.idCurso).subscribe({
      next: (porcentaje: number) => {
        curso.progreso = porcentaje;
        console.log(`Progreso del curso ${curso.idCurso}:`, porcentaje);

        // Ahora redirige al contenido del curso
        this.router.navigate([`/alumnos/contenido`, curso.idCurso]);
      },
      error: (error) => {
        console.error(`Error al obtener el progreso del curso ${curso.idCurso}:`, error);
        // Si quieres, puedes mostrar un mensaje de error aquí antes de redirigir o detener la navegación
      }
    });
  }

  /*  accederCurso(curso: any) {
    console.log('Accediendo al curso:', curso);

    if (curso.idCurso) {
      this.router.navigate([`/alumnos/contenido`, curso.idCurso]);
    } else {
      console.error("ID del curso inválido");
    }
  }*/

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

  bajaCurso(idCurso: number): void {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const idUsuario = user.idUsuario;
    console.log('idUsuario:', idUsuario, 'idCurso:', idCurso);

    // Llamamos al servicio para obtener el idInscripcion
    this.alumnoService.obtenerIdInscripcion(idUsuario, idCurso).subscribe({
      next: (inscripciones: VerIdInscripcionDTO[]) => {
        console.log('Respuesta de inscripciones:', inscripciones);
        if (inscripciones && inscripciones.length > 0) {
          const idInscripcion = inscripciones[0].idInscripcion; // Suponiendo que siempre hay un único idInscripcion

          // Ahora que tenemos el idInscripcion, mostramos una confirmación
          Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción dará de baja al alumno del curso.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, dar de baja',
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            if (result.isConfirmed) {
              // Ahora damos de baja utilizando el idInscripcion
              this.alumnoService.bajaCursoAlumno(idInscripcion).subscribe({
                next: (res) => {
                  Swal.fire('Curso dado de baja', res.mensaje, 'success');
                  // Aquí puedes actualizar la lista de cursos o hacer otra acción después de dar de baja
                },
                error: (err) => {
                  console.error('Error al dar de baja el curso:', err);
                  Swal.fire('Error', 'No se pudo dar de baja el curso', 'error');
                }
              });
            }
          });
        } else {
          Swal.fire('Error', 'No se encontró la inscripción para este curso', 'error');
        }
      },
      error: (error) => {
        console.error('Error al obtener idInscripcion:', error);
        Swal.fire('Error', 'No se pudo obtener el ID de inscripción', 'error');
      }
    });
  }

  //  ============ NAVEGACIONES ======================================

  logout() {
    console.log('Cerrando sesión...');
    localStorage.clear();
    this.router.navigate(['/home/inicio']);
  }

  navigateTo(page: PageType) {
    this.currentPage = page;

    if (page === 'actualizar-perfil') {
      this.currentSection = 'perfil';
    } else if (page === 'certificados') {
      this.currentSection = 'certificados';
      this.cargarCursosFinalizados();
    } else if (page === 'mis-cursos') {
      this.currentSection = 'mis-cursos';
      this.cargarMisCursos();
    }

    this.menuOpen = false;
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
