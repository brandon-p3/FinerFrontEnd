  import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CursosServiceService } from '../../../services/cursos-service';
import { contenidoCurso } from '../../../documentos/cursosDocumento';

@Component({
  selector: 'app-contenido-curso',
  templateUrl: './contenido-curso.component.html',
  styleUrls: ['./contenido-curso.component.css']
})
export class ContenidoCursoComponent implements OnInit {
  idCurso: string | null = '';
  temas: contenidoCurso[] = [];
  temaActual: contenidoCurso | null = null;
  temaIndex: number = 0;
  temaActualIndex: number = 0; 

  constructor(private route: ActivatedRoute, private cursosService: CursosServiceService) {}

  ngOnInit(): void {
    // Obtener el parámetro 'id' de la ruta
    this.route.paramMap.subscribe(params => {
      this.idCurso = params.get('id');
      console.log('ID del curso recibido:', this.idCurso); // Verifica que el ID llega correctamente

      // Si se recibe un idCurso válido, se obtienen los temas del curso
      if (this.idCurso) {
        this.obtenerTemasDeCurso(Number(this.idCurso)); // Convertimos a número el id
      }
    });
  }

  // Obtener los temas del curso
  obtenerTemasDeCurso(idCurso: number): void {
    this.cursosService.obtenerTemasCurso(idCurso).subscribe(
      (data) => {
        console.log('Temas obtenidos:', data);
        this.temas = data; // Aquí asignas los temas a la propiedad 'temas'
        this.mostrarTema(0); // Mostrar el primer tema al inicio
      },
      (error) => {
        console.error('Error al obtener los temas del curso:', error);
      }
    );
  }

  // Mostrar el tema correspondiente por índice
  mostrarTema(index: number): void {
    this.temaActual = this.temas[index];
    this.temaIndex = index;
  }

  // Mostrar el siguiente tema
  mostrarSiguienteTema(): void {
    if (this.temaActualIndex < this.temas.length - 1) {
      this.temaActualIndex++;
      this.mostrarTema(this.temaActualIndex);
    }
  }

  // Mostrar el tema anterior
  mostrarTemaAnterior(): void {
    if (this.temaActualIndex > 0) {
      this.temaActualIndex--;
      this.mostrarTema(this.temaActualIndex);
    }
  }
  // Verificar si hay un siguiente tema disponible
  get siguienteTemaDisponible(): boolean {
    return this.temaIndex < this.temas.length - 1;
  }
}
