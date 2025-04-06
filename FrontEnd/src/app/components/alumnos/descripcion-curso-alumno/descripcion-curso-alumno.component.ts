import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Curso } from '../../../documentos/cursosDocumento';
import { CursosServiceService } from '../../../services/cursos-service';
import { UsuariosService } from '../../../services/usuarios-service.service';

@Component({
  selector: 'app-descripcion-curso-alumno',
  templateUrl: './descripcion-curso-alumno.component.html',
  styleUrls: ['./descripcion-curso-alumno.component.css']
})
export class DescripcionCursoAlumnoComponent implements OnInit {
  cursos: Curso[] = [];
  idAlumno: number = 0;

  constructor(
    private route: ActivatedRoute,
    private cursosService: CursosServiceService,
    private usuariosService: UsuariosService
  ) {}

  ngOnInit(): void {
    const tituloCurso = this.route.snapshot.paramMap.get('id');

    if (tituloCurso) {
      this.cursosService.obtenerDetalles(tituloCurso).subscribe(
        (data) => {
          this.cursos = data;
          console.log('Detalles del curso:', this.cursos);
        },
        (error) => console.error('Error al obtener detalles:', error)
      );
    }

    // 🔥 Aquí usamos directamente el idUsuario del localStorage como idAlumno
    const usuario = this.usuariosService.currentUserValue;
    this.idAlumno = usuario?.idUsuario;
    console.log('ID de alumno usado:', this.idAlumno);
  }

  inscribirse(curso: Curso): void {
    if (!this.idAlumno || !curso?.idCurso) {
      alert('Faltan datos para inscribirse.');
      return;
    }

    this.cursosService.inscribirAlumno(this.idAlumno, curso.idCurso).subscribe(
      () => {
        alert('¡Te has inscrito exitosamente al curso!');
      },
      (error) => {
        console.error('Error al inscribirse:', error);
        const mensaje = error.error?.mensaje || 'Ocurrió un error al intentar inscribirte.';
        alert(mensaje);
      }
    );
  }
}
