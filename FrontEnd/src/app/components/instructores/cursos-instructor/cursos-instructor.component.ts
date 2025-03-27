import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CursoVerDTO } from '../../../documentos/cursoDocumento';
import { CursoServiceService } from '../../../services/curso-service.service';

@Component({
  selector: 'app-cursos-instructor',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './cursos-instructor.component.html',
  styleUrls: ['./cursos-instructor.component.css']
})
export class CursosInstructorComponent implements OnInit {
  constructor(
    private router: Router,
    private cursoService: CursoServiceService
  ) { } 

  usuario = {
    id: 3,
    nombre: 'Ana',
    apellidoPaterno: 'Ramírez',
    apellidoMaterno: 'Díaz',
    email: 'ana.ramirez@finer.edu',
    username: 'ana_instructor'
  };

  menuOpen = false;
  currentPage = 'mis-cursos';
  searchQuery = ''; 
  sortOption = 'asc'; 
  
  cursos: CursoVerDTO[] = [];
  filteredCourses: CursoVerDTO[] = [];
  isLoading = false;
  errorMessage = '';
  courseToDelete: number | null = null;
  showDeleteModal = false;
  
  // Variables para vista previa
  showPreviewModal = false;
  selectedCourse: CursoVerDTO | null = null;

  ngOnInit() {
    this.loadCursos();
  }

  loadCursos() {
    this.isLoading = true;
    this.errorMessage = '';
  
    this.cursoService.verCursosInstructor(this.usuario.id).subscribe({
      next: (cursos) => {
        this.cursos = cursos;
        this.filteredCourses = [...this.cursos];
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar los cursos', error);
        this.errorMessage = 'No se pudieron cargar los cursos. Por favor, intente nuevamente.';
        this.isLoading = false;
      }
    });
  }
  
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  navigateTo(page: string) {
    this.currentPage = page;
    this.menuOpen = false;
  }

  applyFilters() {
    let filtered = [...this.cursos];

    // Filtro por búsqueda de nombre de curso
    if (this.searchQuery) {
      filtered = filtered.filter(curso =>
        curso.titulo.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    // Filtro por orden
    if (this.sortOption === 'asc') {
      filtered.sort((a, b) => a.titulo.localeCompare(b.titulo));
    } else if (this.sortOption === 'desc') {
      filtered.sort((a, b) => b.titulo.localeCompare(a.titulo));
    }

    this.filteredCourses = filtered;
  }

  createCourse() {
    this.currentPage = 'crear-curso';
    this.router.navigate(['/crear-curso']);
  }

  openPreviewModal(curso: CursoVerDTO) {
    this.selectedCourse = { ...curso }; // Crear una copia del curso
    this.showPreviewModal = true;
  }

  closePreviewModal() {
    this.showPreviewModal = false;
    this.selectedCourse = null;
  }

  editCourse(curso: CursoVerDTO) {
    if (!curso) {
      console.error('Intento de editar un curso nulo');
      return;
    }
    
    console.log('Editando curso:', curso);
    this.selectedCourse = { ...curso }; // Crear una copia del curso
    this.showPreviewModal = true;
    
    
  }

  confirmDelete(idCurso: number) {
    this.courseToDelete = idCurso;
    this.showDeleteModal = true;
  }

  cancelDelete() {
    this.showDeleteModal = false;
    this.courseToDelete = null;
  }

  deleteCourse() {
    if (this.courseToDelete) {
      this.isLoading = true;
      this.cursoService.eliminarCurso(this.courseToDelete.toString()).subscribe({
        next: () => {
          this.loadCursos();
          this.showDeleteModal = false;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error al eliminar el curso', error);
          this.errorMessage = 'No se pudo eliminar el curso. Por favor, intente nuevamente.';
          this.showDeleteModal = false;
          this.isLoading = false;
        }
      });
    }
  }

  logout() {
    console.log('Cerrando sesión...');
    this.router.navigate(['/login']);
  }
}