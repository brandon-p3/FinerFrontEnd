import { Component, OnInit } from '@angular/core';
import { AdministradorServiceService } from '../../../services/administrador-service.service';
import { CursosServiceService } from '../../../services/cursos-service';
import { Curso } from '../../../documentos/cursosDocumento';

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

  modalVisible: boolean = false;
  motivoRechazo: string = '';
  cursoSeleccionado: any = null; //para rechazar curso

  // Variables para los filtros
  nombreCurso: string = '';
  categoriaSeleccionada: string = '';

  constructor(
    private administradorService: AdministradorServiceService,
    private cursoService: CursosServiceService
  ) {}

  ngOnInit(): void {
    this.obtenerSolicitudesCursos();
    this.obtenerCursosAprobados(); // Llamamos al nuevo método
    this.obtenerCategoriasAprobadas();
  }

  obtenerSolicitudesCursos() {
    this.administradorService.obtenerSolicitudesCursos().subscribe((data) => {
      this.solicitudesPendientes = data || [];
    });
  }

  obtenerCursosAprobados() {
    this.cursoService.getCursos().subscribe(
      (data) => {
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
}
