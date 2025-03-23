import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../../services/usuarios-service.service';
import { AlumnoDocumento } from '../../../documentos/usuarioDocumento'
import { InstructorDocumento } from '../../../documentos/usuarioDocumento';

@Component({
  selector: 'app-usuarios-admin',
  templateUrl: './usuarios-admin.component.html',
  styleUrls: ['./usuarios-admin.component.css']
})
export class UsuariosAdminComponent implements OnInit {
  
  alumnos: AlumnoDocumento[] = [];
  instructores: InstructorDocumento[] = [];

  constructor(private usuariosService: UsuariosService) {}

  ngOnInit(): void {
    this.obtenerAlumnos();
    this.obtenerInstructores();
  }

  obtenerAlumnos(): void {
    this.usuariosService.getAlumnos().subscribe(
      (data) => {
        this.alumnos = data;
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
      },
      (error) => {
        console.error('Error al obtener instructores:', error);
      }
    );
  }
}
