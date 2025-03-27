import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../../services/usuarios-service.service';
import { AdministradorServiceService } from '../../../services/administrador-service.service';
import { AlumnoDocumento, InstructorDocumento } from '../../../documentos/usuarioDocumento';

@Component({
  selector: 'app-usuarios-admin',
  templateUrl: './usuarios-admin.component.html',
  styleUrls: ['./usuarios-admin.component.css']
})
export class UsuariosAdminComponent implements OnInit {

  alumnos: AlumnoDocumento[] = [];
  instructores: InstructorDocumento[] = [];
  alumnosFiltrados: AlumnoDocumento[] = [];
  instructoresFiltrados: InstructorDocumento[] = [];

  constructor(
    private usuariosService: UsuariosService,
    private administradorService: AdministradorServiceService
  ) { }

  ngOnInit(): void {
    this.obtenerAlumnos();
    this.obtenerInstructores();
  }

  obtenerAlumnos(): void {
    this.usuariosService.getAlumnos().subscribe(
      (data) => {
        this.alumnos = data;
        this.alumnosFiltrados = data;
      },
      (error) => {
        console.error('Error al obtener alumnos:', error);
      }
    );
  }

  obtenerInstructores(): void {
    this.usuariosService.getInstructores().subscribe(
      (data) => {
        this.instructores = data;
        this.instructoresFiltrados = data;
      },
      (error) => {
        console.error('Error al obtener instructores:', error);
      }
    );
  }

  filtrarAlumnos(event: Event, orden: string = 'asc'): void {
    const inputElement = event.target as HTMLInputElement;
    const terminoBusqueda = inputElement.value.trim().toLowerCase();

    if (terminoBusqueda === '') {
      this.alumnosFiltrados = this.alumnos; // Si no hay búsqueda, muestra todos
      return;
    }

    // Usar el servicio para buscar los alumnos por nombre
    this.administradorService.buscarUsuarioNombre(terminoBusqueda).subscribe(
      (response) => {
        // El resultado que viene del backend tiene un campo 'usuarios', así que lo asignamos a alumnosFiltrados
        this.alumnosFiltrados = response.usuarios; // Asegúrate de que el backend esté devolviendo un campo 'usuarios'
      },
      (error) => {
        console.error('Error al filtrar alumnos:', error);
        this.alumnosFiltrados = [];
      }
    );
  }
}
