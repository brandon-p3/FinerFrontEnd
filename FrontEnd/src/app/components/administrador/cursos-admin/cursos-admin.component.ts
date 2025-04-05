import { Component, OnInit } from '@angular/core';
import { AdministradorServiceService } from '../../../services/administrador-service.service';
import { CursosServiceService } from '../../../services/cursos-service';
import { Curso } from '../../../documentos/cursosDocumento';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-cursos-admin',
  templateUrl: './cursos-admin.component.html',
  styleUrls: ['./cursos-admin.component.css']
})
export class CursosAdminComponent implements OnInit {
  solicitudesPendientes: any[] = [];
  cursos: Curso[] = [];
  categoriasAprobadas: any[] = [];
  cursosFiltrados: Curso[] = [];

  //para rechazar un curso
  modalVisible: boolean = false;
  motivoRechazo: string = '';
  cursoSeleccionado: any = null;

  cursoDetalleSeleccionado: any = null;

  // Variables para los filtros
  nombreCurso: string = '';
  categoriaSeleccionada: string = '';

  //Variables para cargar los temas solicitados
  modalTemasVisible: boolean = false;
  temasSolicitados: any[] = [];
  mensajeTemas: string = '';
  cursoTemasActual: any = null;

  // Nueva variable para controlar qué tema está expandido
  temaExpandido: number | null = null;


  constructor(
    private administradorService: AdministradorServiceService,
    private cursoService: CursosServiceService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.obtenerSolicitudesCursos();
    this.obtenerCursosAprobados(); // Llamamos al nuevo método
    this.obtenerCategoriasAprobadas();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.inicializarBotonesDetalles();
    });
  }

  obtenerSolicitudesCursos() {
    this.administradorService.obtenerSolicitudesCursos().subscribe((data) => {
      console.log('Solicitudes cargadas', data)
      this.solicitudesPendientes = data || [];
    });
  }

  obtenerTemasSolicitados(idSolicitudCurso: number): void {
    this.administradorService.verTemasSolicitadosPorCurso(idSolicitudCurso).subscribe({
      next: (temas) => {
        this.temasSolicitados = temas;
        this.mensajeTemas = '';
      },
      error: (err) => {
        this.temasSolicitados = [];
        this.mensajeTemas = err.error?.mensaje || 'Error al obtener los temas solicitados';
      }
    });
  }

  abrirModalTemasSolicitados(curso: any): void {
    console.log('Objeto curso completo:', curso);
    this.cursoTemasActual = curso;
    this.modalTemasVisible = true;

    this.administradorService.verTemasSolicitadosPorCurso(curso.idSolicitudCurso).subscribe({
      next: (temas) => {
        console.log('Temas solicitados', temas)
        this.temasSolicitados = temas;
        this.mensajeTemas = '';
      },
      error: (err) => {
        this.temasSolicitados = [];
        this.mensajeTemas = err.error?.mensaje || 'Error al obtener los temas solicitados';
      }
    });
  }

  // Nuevo método para alternar la visibilidad del contenido del tema
  toggleTemaContenido(index: number) {
    if (this.temaExpandido === index) {
      this.temaExpandido = null;
    } else {
      this.temaExpandido = index;
    }
  }

  cerrarModalTemasSolicitados(): void {
    this.modalTemasVisible = false;
    this.temasSolicitados = [];
    this.mensajeTemas = '';
  }

  obtenerCursosAprobados() {
    this.cursoService.getCursos().subscribe(
      (data) => {
        console.log('Cursos cargados0', data)
        this.cursos = data;
        this.cursosFiltrados = data; // Iniciamos con todos los cursos
      },
      (error) => {
        console.error('Error al obtener los cursos aprobados', error);
      }
    );
  }

  obtenerCategoriasAprobadas() {
    this.administradorService.obtenerCategoriasAprobadas().subscribe(
      (data) => {
        if (Array.isArray(data)) {
          this.categoriasAprobadas = data;
        } else {
          console.error("Respuesta inesperada al obtener categorías aprobadas:", data);
          this.categoriasAprobadas = [];
        }
      },
      (error) => {
        console.error("Error al obtener las categorías aprobadas", error);
        this.categoriasAprobadas = [];
      }
    );
  }

  filtrarCursos(): void {
    let cursosFiltrados = this.cursos;

    // Filtrar por nombre de curso
    if (this.nombreCurso) {
      cursosFiltrados = cursosFiltrados.filter(curso =>
        curso.tituloCurso.toLowerCase().includes(this.nombreCurso.toLowerCase())
      );
    }

    // Filtrar por categoría
    if (this.categoriaSeleccionada) {
      cursosFiltrados = cursosFiltrados.filter(curso =>
        curso.nombreCategoria.toLowerCase() === this.categoriaSeleccionada.toLowerCase()
      );
    }

    this.cursosFiltrados = cursosFiltrados;
  }

  onNombreCursoChange(event: any): void {
    this.nombreCurso = event.target.value;
    this.filtrarCursos();
  }

  onCategoriaChange(event: any): void {
    this.categoriaSeleccionada = event.target.value;

    if (this.categoriaSeleccionada) {
      this.cursoService.filtrarCursoPorCategoria(this.categoriaSeleccionada).subscribe(
        (data) => {
          this.cursosFiltrados = data;
        },
        (error) => {
          console.error('Error al filtrar cursos por categoría', error);
          this.cursosFiltrados = [];
        }
      );
    } else {
      this.cursosFiltrados = this.cursos; // Si no hay categoría, mostrar todos los cursos
    }
  }

  aprobarCurso(idSolicitudCurso: number) {
    const requestBody = { idSolicitudCurso: idSolicitudCurso };

    this.administradorService.aprobarCurso(requestBody).subscribe(
      (response) => {
        alert(response.mensaje);
      },
      (error) => {
        alert('Error al aprobar el curso');
        console.error(error);
      }
    );
  }

  rechazarCurso() {
    if (!this.cursoSeleccionado || !this.motivoRechazo.trim()) {
      alert('Debes ingresar un motivo para el rechazo.');
      return;
    }

    const requestBody = {
      idSolicitudCurso: this.cursoSeleccionado.idSolicitudCurso,
      correoInstructor: this.cursoSeleccionado.correoInstructor,
      motivoRechazo: this.motivoRechazo,
      tituloCurso: this.cursoSeleccionado.tituloCurso
    };

    this.administradorService.rechazarCurso(requestBody).subscribe(
      (response) => {
        alert(response.mensaje);
        this.cerrarModal();
        this.obtenerSolicitudesCursos();
      },
      (error) => {
        alert('Error al rechazar el curso');
        console.error(error);
      }
    );
  }

  abrirModalRechazo(solicitud: any) {
    this.cursoSeleccionado = solicitud;
    this.modalVisible = true;
  }

  cerrarModal() {
    this.modalVisible = false;
    this.motivoRechazo = '';
  }

  // ======= MODAL DE DETALLES ========================

  inicializarBotonesDetalles() {
    if (typeof document === 'undefined') {
      return; // Evita ejecutar este código en el servidor
    }

    const botonesDetalles = document.querySelectorAll('.btn.details');
    const modal = document.getElementById('cursoModal');
    const closeButton = document.querySelector('.close-button');

    // Agregar evento a cada botón de detalles
    botonesDetalles.forEach((boton, index) => {
      boton.addEventListener('click', () => {
        this.mostrarDetallesCurso(this.cursosFiltrados[index]);
      });
    });

    // Cerrar modal con el botón X
    if (closeButton) {
      closeButton.addEventListener('click', () => {
        if (modal) {
          modal.style.display = 'none';
        }
      });
    }

    // Cerrar modal al hacer clic fuera
    window.addEventListener('click', (event) => {
      if (modal && event.target === modal) {
        modal.style.display = 'none';
      }
    });
  }

  mostrarDetallesCurso(curso: any) {
    this.cursoDetalleSeleccionado = curso;

    // Actualizar el contenido del modal con los datos del curso
    const modal = document.getElementById('cursoModal');
    const titulo = document.getElementById('modal-titulo');
    const imagen = document.getElementById('modal-imagen') as HTMLImageElement;
    const descripcion = document.getElementById('modal-descripcion');
    const instructor = document.getElementById('modal-instructor');
    const categoria = document.getElementById('modal-categoria');

    if (titulo) titulo.textContent = curso.tituloCurso;
    if (imagen) imagen.src = curso.imagen;
    if (descripcion) descripcion.textContent = curso.descripcion;
    if (instructor) {
      instructor.textContent = `${curso.nombreInstructor} ${curso.apellidoPaterno} ${curso.apellidoMaterno}`;
    }
    if (categoria) categoria.textContent = curso.nombreCategoria;

    // Mostrar el modal
    if (modal) {
      modal.style.display = 'flex';
    }
  }
}
