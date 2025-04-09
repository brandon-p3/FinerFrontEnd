import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CursoEditarDTO, CursoVerDTO, VerCategoriasDTO, TemaDTO, SolicitudTemaEditarDTO } from '../../../documentos/cursoDocumento';
import { CursoServiceService } from '../../../services/curso-service.service';
import { CategoriaServiceService } from '../../../services/categorias-service.service';
import { UsuariosService } from '../../../services/usuarios-service.service';
import { EvaluacionService } from '../../../services/evaluacion.service';
import { PreguntaDTO, EvaluacionInstructorDTO, OpcionDTO, Evaluacion } from '../../../documentos/evaluacionDocumento';

const customSwal = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-primary mx-2',
    cancelButton: 'btn btn-secondary mx-2'
  },
  buttonsStyling: false,
  backdrop: `
    rgba(0,0,0,0.4)
    url("/assets/images/pattern.png")
    left top
    repeat
  `,
  background: '#ffffff',
  color: '#333333',
  iconColor: '#4a6cf7'
});

@Component({
  selector: 'app-cursos-instructor',
  templateUrl: './cursos-instructor.component.html',
  styleUrls: ['./cursos-instructor.component.css']
})
export class CursosInstructorComponent implements OnInit {
  readonly COURSE_STATUS = {
    APPROVED: 'aprobado',
    REJECTED: 'rechazada',
    PENDING: 'pendiente',
    IN_REVIEW: 'en revision'
  };

  constructor(
    private router: Router,
    public cursoService: CursoServiceService,
    private categoriaService: CategoriaServiceService,
    private usuariosService: UsuariosService,
    private evaluacionService: EvaluacionService
  ) { }

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
  currentPage = 'mis-cursos';
  searchQuery = '';
  sortOption = 'asc';

  cursos: CursoVerDTO[] = [];
  filteredCourses: CursoVerDTO[] = [];
  isLoading = false;
  errorMessage = '';
  courseToDelete: number | null = null;
  showDeleteModal = false;

  temaToDelete: number | null = null;
  showDeleteTemaModal = false;

  noHayCursos: boolean = false;

  showPreviewModal = false;
  selectedCourse: CursoVerDTO | null = null;
  previewLoading = false;

  showEditModal = false;
  editFormData: any = {
    idCurso: null,
    idInstructor: null,
    titulo: '',
    descripcion: '',
    idCategoria: null,
    categoria: '',
    nombreCategoriaActual: '',
    imagenUrl: ''

    
  };
  categorias: VerCategoriasDTO[] = [];
  isEditing = false;
  categoriaSeleccionada: VerCategoriasDTO | null = null;

  showTemaModal = false;
  selectedCourseForTema: CursoVerDTO | null = null;
  nuevoTema = { nombre: '', contenido: '' };
  temasDelCurso: TemaDTO[] = [];
  editingTema: any = null; // Cambiado a 'any' para mayor flexibilidad
  temasLoading = false;

  ngOnInit() {
    this.cargarUsuarioAutenticado();
    this.loadCursos();
    this.loadCategorias();
  }

  cargarUsuarioAutenticado() {
    const usuarioAutenticado = this.usuariosService.currentUserValue;
    if (usuarioAutenticado) {
      this.usuario = {
        ...this.usuario,
        id: usuarioAutenticado.idUsuario,
        idUsuario: usuarioAutenticado.idUsuario,
        idRol: usuarioAutenticado.idRol,
        nombre: usuarioAutenticado.nombre || 'Instructor',
        apellidoPaterno: usuarioAutenticado.apellidoPaterno || '',
        apellidoMaterno: usuarioAutenticado.apellidoMaterno || '',
        email: usuarioAutenticado.email || '',
        username: usuarioAutenticado.username || ''
      };

      if (!usuarioAutenticado.nombre) {
        this.usuariosService.obtenerUsuarioPorId(usuarioAutenticado.idUsuario).subscribe({
          next: (usuarioCompleto) => {
            this.usuario = {
              ...this.usuario,
              nombre: usuarioCompleto.nombre || this.usuario.nombre,
              apellidoPaterno: usuarioCompleto.apellidoPaterno || this.usuario.apellidoPaterno,
              apellidoMaterno: usuarioCompleto.apellidoMaterno || this.usuario.apellidoMaterno,
              email: usuarioCompleto.email || this.usuario.email
            };
          },
          error: (error) => {
            console.error('Error al cargar datos adicionales del usuario:', error);
          }
        });
      }
    } else {
      this.router.navigate(['/login']);
    }
  }

  loadCursos() {
    if (!this.usuario.idUsuario) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.noHayCursos = false;

    this.cursos = [];
    this.filteredCourses = [];

    this.cursoService.verCursosInstructor(this.usuario.idUsuario).subscribe({
      next: (cursos) => {
        if (cursos && cursos.length > 0) {
          this.cursos = [...cursos];
          this.applyFilters();
        } else {
          this.noHayCursos = true;
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar los cursos', error);
        if (error.status === 404) {
          this.noHayCursos = true;
          this.errorMessage = '';
        } else {
          this.errorMessage = 'No se pudieron cargar los cursos. Por favor, intente nuevamente.';
        }
        this.isLoading = false;
      }
    });
  }

  loadCategorias() {
    this.categoriaService.obtenerCategoriasAprobadas().subscribe({
      next: (categorias) => {
        this.categorias = categorias;
      },
      error: (error) => {
        console.error('Error al cargar categorías', error);
        this.errorMessage = 'No se pudieron cargar las categorías.';
      }
    });
  }

  buscarCategoriaPorNombre(nombre: string) {
    if (!nombre.trim()) {
      this.categoriaSeleccionada = null;
      return;
    }

    const encontrada = this.categorias.find(c =>
      c.nombreCategoria.toLowerCase().includes(nombre.toLowerCase())
    );

    if (encontrada) {
      this.categoriaSeleccionada = encontrada;
    } else {
      this.errorMessage = `No se encontró la categoría "${nombre}"`;
      this.categoriaSeleccionada = null;
    }
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  shouldDisableEdit(curso: CursoVerDTO): boolean {
    if (!curso) return true;
    return curso.estatus === this.COURSE_STATUS.PENDING || curso.estatus === this.COURSE_STATUS.IN_REVIEW;
  }

  shouldDisableDelete(curso: CursoVerDTO): boolean {
    if (!curso) return true;
    return curso.estatus !== this.COURSE_STATUS.APPROVED;
  }

  navigateTo(page: string) {
    this.currentPage = page;
    this.menuOpen = false;

    if (page === 'cursos') {
      this.router.navigate(['/instructor/cursos']);
    }
  }

  applyFilters() {
    let filtered = [...this.cursos];

    if (this.searchQuery) {
      filtered = filtered.filter(curso =>
        curso.titulo.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    if (this.sortOption === 'asc') {
      filtered.sort((a, b) => a.titulo.localeCompare(b.titulo));
    } else if (this.sortOption === 'desc') {
      filtered.sort((a, b) => b.titulo.localeCompare(a.titulo));
    }

    this.filteredCourses = filtered;
  }

  createCourse() {
    this.currentPage = 'crear-curso';
    this.router.navigate(['/instructor/crear-curso']);
  }

  perfil() {
    this.currentPage = 'perfil';
    this.router.navigate(['/instructor/perfil']);
  }

  openPreviewModal(curso: CursoVerDTO) {
    this.selectedCourse = { ...curso, temas: [] };
    this.showPreviewModal = true;
    this.cargarTemasParaVistaPrevia(curso.idCurso);
  }

  cargarTemasParaVistaPrevia(idCurso: number): void {
    this.previewLoading = true;
    this.cursoService.verTemasSolicitadosPorCurso(idCurso).subscribe({
      next: (temas: TemaDTO[]) => {
        if (this.selectedCourse) {
          this.selectedCourse.temas = temas || [];
        }
        this.previewLoading = false;
      },
      error: (error) => {
        if (error.status !== 404) {
          console.error('Error al cargar temas:', error);
        }
        if (this.selectedCourse) {
          this.selectedCourse.temas = [];
        }
        this.previewLoading = false;
      }
    });
  }

  closePreviewModal() {
    this.showPreviewModal = false;
    this.selectedCourse = null;
    this.previewLoading = false;
  }

  editCourse(curso: CursoVerDTO) {
    if (!curso) {
      console.error('Intento de editar un curso nulo');
      return;
    }

    this.editFormData = {
      idCurso: curso.idCurso,
      idInstructor: this.usuario.idUsuario,
      titulo: curso.titulo || '',
      descripcion: curso.descripcion || '',
      categoria: curso.categoria || '',
      imagenUrl: curso.imagen ? this.getImageUrl(curso.imagen) : '',
      estatus: curso.estatus
    };

    this.buscarCategoriaPorNombre(curso.categoria || '');
    this.showEditModal = true;
    this.isEditing = true;
  }

  getImageUrl(imagen: string): string {
    if (!imagen) return 'assets/images/default-course.jpg';

    if (imagen.startsWith('http') || imagen.startsWith('data:')) {
      return imagen;
    }

    if (imagen.startsWith('assets/')) {
      return imagen;
    }

    return imagen;
  }

  getCategoriaName(categoriaNombre: string): string {
    return categoriaNombre || 'Sin categoría';
  }

  clearCategory() {
    this.editFormData.categoria = '';
    this.categoriaSeleccionada = null;
  }

  removeImage() {
    this.editFormData.imagenUrl = '';
  }

  submitEditForm() {
    if (!this.editFormData.titulo || !this.editFormData.descripcion || !this.editFormData.categoria) {
      this.errorMessage = 'Por favor complete todos los campos requeridos';
      return;
    }

    Swal.fire({
      title: '¿Guardar cambios?',
      text: '¿Estás seguro de que deseas guardar los cambios en este curso?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, guardar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.proceedWithEdit();
      }
    });
  }

  private proceedWithEdit() {
    this.isLoading = true;
    this.errorMessage = '';

    const categoriaSeleccionada = this.categorias.find(c => c.nombreCategoria === this.editFormData.categoria);
    const idCategoria = categoriaSeleccionada ? categoriaSeleccionada.idCategoria : 0;

    const cursoData: CursoEditarDTO = {
      idCurso: this.editFormData.idCurso,
      idInstructor: this.editFormData.idInstructor,
      titulo: this.editFormData.titulo,
      descripcion: this.editFormData.descripcion,
      imagen: this.editFormData.imagenUrl,
      idCategoria: idCategoria
    };

    const cursoDataSolicitud: any = {
      idSolicitudCurso: this.editFormData.idCurso,
      idUsuarioInstructor: this.editFormData.idInstructor,
      tituloCursoSolicitado: this.editFormData.titulo,
      descripcion: this.editFormData.descripcion,
      imagen: this.editFormData.imagenUrl,
      idCategoria: idCategoria
    };
    if (this.editFormData.estatus == 'rechazada') {
      this.cursoService.editarCursoRechazado(cursoDataSolicitud).subscribe({
        next: (response) => {
          Swal.fire(
            '¡Guardado!',
            'Los cambios se han guardado correctamente.',
            'success'
          );
          this.loadCursos();
          this.closeEditModal();
        },
        error: (error) => {
          console.error('Error al editar el curso', error);
          Swal.fire(
            'Error',
            error.error?.message || 'No se pudo actualizar el curso.',
            'error'
          );
          this.errorMessage = error.error?.message || 'No se pudo actualizar el curso.';
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } else {

      this.cursoService.editarCurso(cursoData).subscribe({
        next: (response) => {
          Swal.fire(
            '¡Guardado!',
            'Los cambios se han guardado correctamente.',
            'success'
          );
          this.loadCursos();
          this.closeEditModal();
        },
        error: (error) => {
          console.error('Error al editar el curso', error);
          Swal.fire(
            'Error',
            error.error?.message || 'No se pudo actualizar el curso.',
            'error'
          );
          this.errorMessage = error.error?.message || 'No se pudo actualizar el curso.';
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }

  closeEditModal() {
    this.showEditModal = false;
    this.editFormData = {
      idCurso: null,
      idInstructor: null,
      titulo: '',
      descripcion: '',
      idCategoria: null,
      categoria: '',
      nombreCategoriaActual: '',
      imagenUrl: ''
    };
    this.errorMessage = '';
    this.isEditing = false;
    this.categoriaSeleccionada = null;
  }

  confirmDelete(curso: CursoVerDTO) {
    if (this.shouldDisableDelete(curso)) {
      let message = '';

      switch (curso.estatus) {
        case this.COURSE_STATUS.REJECTED:
          message = 'No puedes eliminar un curso rechazado. Puedes editarlo y volver a enviarlo a revisión.';
          break;
        case this.COURSE_STATUS.PENDING:
          message = 'No puedes eliminar un curso pendiente de revisión.';
          break;
        case this.COURSE_STATUS.IN_REVIEW:
          message = 'No puedes eliminar un curso en proceso de revisión.';
          break;
        default:
          message = 'Acción no permitida para este estado.';
      }

      Swal.fire({
        title: 'Acción no permitida',
        text: message,
        icon: 'warning',
        confirmButtonText: 'Entendido'
      });
      return;
    }

    this.courseToDelete = curso.idCurso;
    this.showDeleteModal = true;
  }

  cancelDelete() {
    this.showDeleteModal = false;
    this.courseToDelete = null;
  }

  deleteCourse() {
    if (this.courseToDelete && this.usuario.idUsuario) {
      this.isLoading = true;
      this.cursoService.eliminarCurso(this.usuario.idUsuario, this.courseToDelete).subscribe({
        next: () => {
          Swal.fire('¡Eliminado!', 'El curso ha sido eliminado correctamente.', 'success');
          this.loadCursos();
          this.showDeleteModal = false;
        },
        error: (error) => {
          console.error('Error al eliminar el curso', error);
          Swal.fire('Error', 'No se pudo eliminar el curso. Por favor, intente nuevamente.', 'error');
          this.showDeleteModal = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }

  confirmDeleteTema(tema: TemaDTO): void {
    this.temaToDelete = tema.idSolicitudTema; // Cambiado a idSolicitudTema
    this.showDeleteTemaModal = true;
  }

  cancelDeleteTema(): void {
    this.showDeleteTemaModal = false;
    this.temaToDelete = null;
  }

  deleteTema(): void {
    if (this.temaToDelete && this.usuario.idUsuario) {
      this.isLoading = true;
      this.cursoService.eliminarTema(this.usuario.idUsuario, this.temaToDelete).subscribe({
        next: () => {
          Swal.fire('¡Eliminado!', 'El tema ha sido eliminado correctamente.', 'success');
          this.cargarTemasDelCurso();
          this.showDeleteTemaModal = false;
        },
        error: (error) => {
          console.error('Error al eliminar el tema', error);
          Swal.fire('Error', 'No se pudo eliminar el tema. Por favor, intente nuevamente.', 'error');
          this.showDeleteTemaModal = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }

  logout() {
    Swal.fire({
      title: '¿Cerrar sesión?',
      text: '¿Estás seguro de que deseas salir de tu cuenta?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuariosService.logout();
        this.router.navigate(['home/inicio']);
      }
    });
  }

  openTemaModal(curso: CursoVerDTO): void {
    this.selectedCourseForTema = { ...curso };
    this.nuevoTema = { nombre: '', contenido: '' };
    this.editingTema = null;
    this.cargarTemasDelCurso();
    this.showTemaModal = true;
  }
  cargarTemaParaEdicion(tema: TemaDTO): void {
    this.editarTema(tema);
  }

  cargarTemasDelCurso(): void {
    if (!this.selectedCourseForTema) return;

    this.temasLoading = true;
    this.cursoService.verTemasSolicitadosPorCurso(this.selectedCourseForTema.idCurso).subscribe({
      next: (temas: TemaDTO[]) => {
        this.temasDelCurso = temas || [];
        console.log('Temas cargados:', this.temasDelCurso);
      },
      error: (error) => {
        if (error.status === 404) {
          this.temasDelCurso = [];
        } else {
          console.error('Error al cargar temas:', error);
          Swal.fire('Error', 'No se pudieron cargar los temas del curso', 'error');
          this.temasDelCurso = [];
        }
      },
      complete: () => {
        this.temasLoading = false;
      }
    });
  }

  agregarTema(): void {
    if (!this.nuevoTema.nombre || !this.nuevoTema.contenido) {
      Swal.fire('Error', 'Debes completar todos los campos del tema', 'error');
      return;
    }

    this.isLoading = true;

    if (this.editingTema) {
      // Edición de tema existente
      const solicitudTemaDTO: SolicitudTemaEditarDTO = {
        idSolicitudTema: this.editingTema.idSolicitudTema, // Usar idSolicitudTema directamente
        idSolicitudCurso: this.selectedCourseForTema?.idCurso || 0,
        nombreTema: this.nuevoTema.nombre,
        contenido: this.nuevoTema.contenido
      };

      console.log('Enviando datos para editar tema:', solicitudTemaDTO);

      this.cursoService.editarSolicitudTema(solicitudTemaDTO).subscribe({
        next: (response) => {
          console.log('Respuesta del servidor:', response);
          Swal.fire('¡Éxito!', 'Tema actualizado correctamente', 'success');
          this.cargarTemasDelCurso();
          this.cancelarEdicionTema();
        },
        error: (error) => {
          console.error('Error al actualizar tema:', error);
          Swal.fire('Error', 'No se pudo actualizar el tema: ' + (error.error?.message || error.message), 'error');
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } else {
      // Creación de nuevo tema
      if (!this.selectedCourseForTema?.idCurso) {
        Swal.fire('Error', 'No se ha seleccionado un curso válido', 'error');
        this.isLoading = false;
        return;
      }

      console.log('Agregando nuevo tema:', {
        idSolicitudCurso: this.selectedCourseForTema.idCurso,
        nombreTema: this.nuevoTema.nombre,
        contenido: this.nuevoTema.contenido
      });

      this.cursoService.agregarTema(
        this.selectedCourseForTema.idCurso,
        this.nuevoTema.nombre,
        this.nuevoTema.contenido
      ).subscribe({
        next: () => {
          Swal.fire('¡Éxito!', 'Tema agregado correctamente', 'success');
          this.cargarTemasDelCurso();
          this.nuevoTema = { nombre: '', contenido: '' };
        },
        error: (error) => {
          console.error('Error al agregar tema:', error);
          Swal.fire('Error', 'No se pudo agregar el tema: ' + (error.error?.message || error.message), 'error');
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }

  editarTema(tema: TemaDTO): void {
    if (!this.usuario?.idUsuario) {
      console.error('ID de usuario no disponible');
      return;
    }

    console.log('Editando tema:', tema);

    this.editingTema = {
      id: tema.idSolicitudTema, // Usar idSolicitudTema en lugar de id
      idSolicitudTema: tema.idSolicitudTema, // Mantener el id original
      idSolicitudCurso: tema.idSolicitudCurso, // Mantener el id del curso
      nombre: tema.nombre || '',
      contenido: tema.contenido || ''
    };

    this.nuevoTema = {
      nombre: this.editingTema.nombre,
      contenido: this.editingTema.contenido
    };
  }

  cancelarEdicionTema(): void {
    this.editingTema = null;
    this.nuevoTema = { nombre: '', contenido: '' };
  }

  enviarARevision(): void {
    if (!this.selectedCourseForTema?.idCurso) {
      Swal.fire('Error', 'No se ha seleccionado un curso válido', 'error');
      return;
    }

    if (this.temasDelCurso.length === 0) {
      Swal.fire('Error', 'Debes agregar al menos un tema', 'error');
      return;
    }

    console.log('Enviando curso a revisión:', this.selectedCourseForTema.idCurso);

    Swal.fire({
      title: '¿Enviar a revisión?',
      text: '¿Estás seguro de que deseas enviar este curso a revisión?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, enviar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;

        this.cursoService.enviarARevision(this.selectedCourseForTema!.idCurso).subscribe({
          next: (response) => {
            console.log('Respuesta del servidor al enviar a revisión:', response);
            Swal.fire({
              title: '¡Éxito!',
              text: 'Curso enviado a revisión correctamente',
              icon: 'success'
            });
            this.closeTemaModal();
            this.loadCursos();
          },
          error: (error) => {
            console.error('Error:', error);
            Swal.fire({
              title: 'Error',
              text: error.error?.message || 'Error al enviar a revisión',
              icon: 'error'
            });
          },
          complete: () => {
            this.isLoading = false;
          }
        });
      }
    });
  }

  closeTemaModal(): void {
    this.showTemaModal = false;
    this.selectedCourseForTema = null;
    this.temasDelCurso = [];
    this.editingTema = null;
    this.nuevoTema = { nombre: '', contenido: '' };
  }

  canEditCourse(curso: CursoVerDTO | null): boolean {
    if (!curso) return false;
    return [this.COURSE_STATUS.APPROVED, this.COURSE_STATUS.REJECTED, ].includes(curso.estatus);
  }

  canSendToReview(curso: CursoVerDTO | null): boolean {
    if (!curso) return false;

    return (curso.estatus === this.COURSE_STATUS.REJECTED ||
      curso.estatus === this.COURSE_STATUS.PENDING) &&
      this.temasDelCurso.length > 0;
  }

  // Agrega estas propiedades a la clase
showEvaluacionModal = false;
selectedCourseForEvaluacion: CursoVerDTO | null = null;
existingEvaluacion: Evaluacion | null = null;

nuevaEvaluacion: EvaluacionInstructorDTO = {
  idCurso: 0,
  tituloEvaluacion: '',
  preguntas: []
};
// Agrega estos métodos a la clase
openEvaluacionModal(curso: CursoVerDTO): void {
  this.selectedCourseForEvaluacion = { ...curso };
  this.nuevaEvaluacion = {
    idCurso: curso.idCurso,
    tituloEvaluacion: `Evaluación de ${curso.titulo}`,
    preguntas: []
  };
  this.showEvaluacionModal = true;
  
  // Verificar si ya existe una evaluación para este curso
  this.verificarEvaluacionExistente(curso.idCurso);
}

closeEvaluacionModal(): void {
  this.showEvaluacionModal = false;
  this.selectedCourseForEvaluacion = null;
  this.existingEvaluacion = null;
  this.nuevaEvaluacion = {
    idCurso: 0,
    tituloEvaluacion: '',
    preguntas: []
  };
}

verificarEvaluacionExistente(idCurso: number): void {
  // Aquí deberías implementar la llamada a tu servicio para verificar si existe una evaluación
  // Por ahora lo dejamos como null (no existe)
  this.existingEvaluacion = null;
}

addPregunta(): void {
  this.nuevaEvaluacion.preguntas.push({
    pregunta: '',
    opciones: [
      { textoOpcion: '', verificar: false },
      { textoOpcion: '', verificar: false }
    ]
  });
}
removePregunta(index: number): void {
  this.nuevaEvaluacion.preguntas.splice(index, 1);
}

esEvaluacionValida(): boolean {
  // Verificar que el título de la evaluación no esté vacío
  const tituloValido = !!this.nuevaEvaluacion.tituloEvaluacion && 
                      this.nuevaEvaluacion.tituloEvaluacion.trim() !== '';

  // Verificar que hay al menos una pregunta
  const tienePreguntas = this.nuevaEvaluacion.preguntas.length > 0;

  // Verificar cada pregunta
  const preguntasValidas = this.nuevaEvaluacion.preguntas.every(pregunta => {
    // El texto de la pregunta no debe estar vacío
    const textoPreguntaValido = !!pregunta.pregunta && 
                               pregunta.pregunta.trim() !== '';

    // Debe haber al menos 2 opciones por pregunta
    const tieneOpcionesSuficientes = pregunta.opciones.length >= 2;

    // Todas las opciones deben tener texto
    const opcionesTextoValido = pregunta.opciones.every(opcion => 
      !!opcion.textoOpcion && opcion.textoOpcion.trim() !== ''
    );

    // Al menos una opción debe estar marcada como correcta (verificar = true)
    const tieneOpcionCorrecta = pregunta.opciones.some(opcion => opcion.verificar === true);

    return textoPreguntaValido && 
           tieneOpcionesSuficientes && 
           opcionesTextoValido && 
           tieneOpcionCorrecta;
  });

  return tituloValido && tienePreguntas && preguntasValidas;
}

addOpcion(preguntaIndex: number): void {
  this.nuevaEvaluacion.preguntas[preguntaIndex].opciones.push({
    textoOpcion: '',
    verificar: false
  });
}
removeOpcion(preguntaIndex: number, opcionIndex: number): void {
  this.nuevaEvaluacion.preguntas[preguntaIndex].opciones.splice(opcionIndex, 1);
}

crearEvaluacion(): void {
  this.isLoading = true;
  console.log(this.nuevaEvaluacion)
  
  this.evaluacionService.crearEvaluacion(this.nuevaEvaluacion).subscribe({
    next: (response) => {
      // Manejar respuesta exitosa (puede ser texto o JSON)
      let mensaje = 'Evaluación creada correctamente';
      if (typeof response === 'string') {
        mensaje = response;
      }
      Swal.fire('¡Éxito!', mensaje, 'success');
      this.closeEvaluacionModal();
    },
    error: (error) => {
      console.error('Error completo:', error);
      
      let mensajeError = error.message;
      // Extraer solo el mensaje si es muy largo
      if (mensajeError.length > 150) {
        mensajeError = mensajeError.substring(0, 150) + '...';
      }
      
      Swal.fire({
        title: 'Error al crear evaluación',
        html: `<div style="text-align: left;">
               <p>${mensajeError}</p>
               <small>Ver consola para más detalles</small>
               </div>`,
        icon: 'error',
        width: '600px'
      });
    },
    complete: () => {
      this.isLoading = false;
    }
  });
}
}