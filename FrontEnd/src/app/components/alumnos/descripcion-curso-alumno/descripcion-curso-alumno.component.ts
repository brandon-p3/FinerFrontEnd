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
  curso!: Curso;

  constructor(
    private route: ActivatedRoute,
    private cursosService: CursosServiceService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cursosService.obtenerDetalles(+id).subscribe(
        (data) => this.curso = data,
        (error) => console.error('Error al obtener detalles:', error)
      );
    }
  }
}
