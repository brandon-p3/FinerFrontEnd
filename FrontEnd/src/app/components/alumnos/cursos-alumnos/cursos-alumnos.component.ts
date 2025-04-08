import { Component, OnInit } from '@angular/core';
import { CursosServiceService } from '../../../services/cursos-service';
import { Curso } from '../../../documentos/cursosDocumento';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cursos-alumnos',
  templateUrl: './cursos-alumnos.component.html',
  styleUrl: './cursos-alumnos.component.css'
})
export class CursosAlumnosComponent implements OnInit {
  cursos: Curso[] = [];
  cursosFiltrados: Curso[] = [];
  nombreCurso: string = '';
  categoriaSeleccionada: string = '';
  menuOpen = false;
  curso: any = {};
  categoriasUnicas: string[] = [];




  constructor(private cursosService: CursosServiceService, private router: Router) {}

  ngOnInit(): void {
    this.obtenerCursos();

  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  obtenerCursos() {
    this.cursosService.getCursos().subscribe(
      (data) => {
        console.log('Cursos obtenidos:', data);
        this.cursos = data;
        this.cursosFiltrados = data;

        // Obtener categorías únicas
        const categoriasSet = new Set<string>();
        this.cursos.forEach(curso => {
          if (curso.nombreCategoria) {
            categoriasSet.add(curso.nombreCategoria);
          }
        });
        this.categoriasUnicas = Array.from(categoriasSet);
      },
      (error) => {
        console.error('Error al obtener cursos:', error);
        if (error.status === 500) {
          console.log('Mensaje de error del servidor:', error.message);
          console.log('Detalles del error:', error.error);
        }
      }
    );
  }


  filtrarCursos(): void {
    let cursosFiltrados = this.cursos;

    if (this.nombreCurso) {
      cursosFiltrados = cursosFiltrados.filter(curso =>
        curso.tituloCurso.toLowerCase().includes(this.nombreCurso.toLowerCase())
      );
    }

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
      this.cursosService.filtrarCursoPorCategoria(this.categoriaSeleccionada).subscribe(
        (data) => {
          console.log('Cursos filtrados por categoría:', data);
          this.cursosFiltrados = data;
        },
        (error) => {
          console.error('Error al filtrar cursos por categoría', error);
          this.cursosFiltrados = [];
        }
      );
    } else {
      this.cursosFiltrados = this.cursos;
    }
  }

 
  logout() {
    console.log('Cerrando sesión...');
    this.router.navigate(['/login']);
  }
  verDetallesCurso(tituloCurso: string) {
    console.log("Título recibido:", tituloCurso);

    if (tituloCurso) {
      const tituloCodificado = encodeURIComponent(tituloCurso); // Evitar problemas con caracteres especiales
      this.router.navigate([`/alumnos/descripcion`, tituloCurso]);
    } else {
      console.error("Título de curso inválido");
    }
  }



}
