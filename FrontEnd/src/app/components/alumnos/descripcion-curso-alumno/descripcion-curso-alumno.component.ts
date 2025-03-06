import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-descripcion-curso-alumno',
  standalone: true,
  imports: [],
  templateUrl: './descripcion-curso-alumno.component.html',
  styleUrls: ['./descripcion-curso-alumno.component.css']
})
export class DescripcionCursoAlumnoComponent {

  constructor(private router: Router) {}

  volver() {
    this.router.navigateByUrl('/cursos-alumnos');
  }
}
