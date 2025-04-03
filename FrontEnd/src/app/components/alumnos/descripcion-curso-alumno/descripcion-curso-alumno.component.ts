import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Curso } from '../../../documentos/cursosDocumento';
import { CursosServiceService } from '../../../services/cursos-service';

@Component({
  selector: 'app-descripcion-curso-alumno',
  templateUrl: './descripcion-curso-alumno.component.html',
  styleUrls: ['./descripcion-curso-alumno.component.css']
})
export class DescripcionCursoAlumnoComponent implements OnInit {
  cursos: Curso[] =[];

  constructor(
    private route: ActivatedRoute,
    private cursosService: CursosServiceService
  ) {}

  ngOnInit(): void {
    const tituloCurso = this.route.snapshot.paramMap.get('id');

    if (tituloCurso) {
      this.cursosService.obtenerDetalles(tituloCurso).subscribe(
        (data) => {
          this.cursos = data;
          console.log(this.cursos)
        },
        (error) => console.error('Error al obtener detalles:', error)
      );
    } else {
      console.error("Título de curso inválido");
    }
  }
}
