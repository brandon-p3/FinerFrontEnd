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

  filtrarUsuarios(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const terminoBusqueda = inputElement.value.trim().toLowerCase();
  
    if (terminoBusqueda === '') {
      this.alumnosFiltrados = this.alumnos;
      this.instructoresFiltrados = this.instructores;
      return;
    }
  
    this.administradorService.buscarUsuarioNombre(terminoBusqueda).subscribe(
      (response) => {
        console.log('Respuesta de la búsqueda:', response); // Verifica lo que está llegando
        if (response.usuarios) {
          // Asigna a los filtros correctamente, utilizando los nombres de campo correctos
          this.alumnosFiltrados = response.usuarios.filter((usuario: any) => usuario.id_rol === 3);
          this.instructoresFiltrados = response.usuarios.filter((usuario: any) => usuario.id_rol === 2); 
        } else {
          this.alumnosFiltrados = [];
          this.instructoresFiltrados = [];
        }
      },
      (error) => {
        console.error('Error al filtrar usuarios:', error);
        this.alumnosFiltrados = [];
        this.instructoresFiltrados = [];
      }
    );
  }
  

}
