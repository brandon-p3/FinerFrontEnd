
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CursoVerDTO, VerCategoriasDTO } from '../../../documentos/cursoDocumento';
import { CursoServiceService } from '../../../services/curso-service.service';
import { CategoriaServiceService } from '../../../services/categorias-service.service';

@Component({
  selector: 'app-cursos-instructor',
  standalone: false,
  templateUrl: './cursos-instructor.component.html',
  styleUrls: ['./cursos-instructor.component.css']
})
export class CursosInstructorComponent implements OnInit {
  constructor(
    private router: Router,
    private cursoService: CursoServiceService,
    private categoriaService: CategoriaServiceService // Inyectamos el nuevo servicio
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

  // Variables para edición
  showEditModal = false;
  editFormData: any = {
    idCurso: null,
    idInstructor: null,
    descripcion: '',
    idCategoria: null
  };
  categorias: VerCategoriasDTO[] = []; // Mejor tipado
  isEditing = false;
  categoriaSeleccionada: VerCategoriasDTO | null = null; // Para búsqueda por nombre

  ngOnInit() {
    this.loadCursos();
    this.loadCategorias();
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

  // Método modificado para usar CategoriaService
  loadCategorias() {
    this.categoriaService.obtenerCategoriasAprobadas().subscribe({
      next: (categorias) => {
        this.categorias = categorias;
        console.log('Categorías cargadas:', this.categorias);
      },
      error: (error) => {
        console.error('Error al cargar categorías', error);
        this.errorMessage = 'No se pudieron cargar las categorías.';
      }
    });
  }

  // Nuevo método para buscar categoría por nombre
  buscarCategoriaPorNombre(nombre: string) {
    if (!nombre.trim()) {
      this.categoriaSeleccionada = null;
      return;
    }

    // Versión con filtrado local (sin llamar al backend)
    const encontrada = this.categorias.find(c => 
      c.nombreCategoria.toLowerCase().includes(nombre.toLowerCase())
    );
    
    if (encontrada) {
      this.categoriaSeleccionada = encontrada;
    } else {
      this.errorMessage = `No se encontró la categoría "${nombre}"`;
      this.categoriaSeleccionada = null;
    }

 
  }
  
  // Resto de métodos se mantienen igual...
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  navigateTo(page: string) {
    this.currentPage = page;
    this.menuOpen = false;
  }

  applyFilters() {
    let filtered = [...this.cursos];

    if (this.searchQuery) {
      filtered = filtered.filter(curso =>
        curso.titulo.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

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
    this.selectedCourse = { ...curso };
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
  
    this.editFormData = {
      idCurso: curso.idCurso,
      idInstructor: this.usuario.id,
      descripcion: curso.descripcion || '',
      idCategoria: curso.idCategoria 
    };
    
    this.showEditModal = true;
    this.isEditing = true;
  }

  submitEditForm() {
    if (!this.editFormData.descripcion || !this.editFormData.idCategoria) {
      this.errorMessage = 'Por favor complete todos los campos requeridos';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
        // Asegúrate de que el objeto tenga la estructura correcta
        const cursoData = {
          idCurso: this.editFormData.idCurso,
          idInstructor: this.editFormData.idInstructor,
          descripcion: this.editFormData.descripcion,
          idCategoria: this.editFormData.idCategoria
        };

    this.cursoService.editarCurso(this.editFormData).subscribe({
      next: (response) => {
        console.log('Curso actualizado:', response);
        this.loadCursos();
        this.closeEditModal();
      },
      error: (error) => {
        console.error('Error al editar el curso', error);
        this.errorMessage = error.error?.message || 'No se pudo actualizar el curso. Por favor, intente nuevamente.';
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  closeEditModal() {
    this.showEditModal = false;
    this.editFormData = {
      idCurso: null,
      idInstructor: null,
      descripcion: '',
      idCategoria: null
    };
    this.errorMessage = '';
    this.isEditing = false;
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
    if (this.courseToDelete && this.usuario.id) {
      this.isLoading = true;
      this.cursoService.eliminarCurso(this.usuario.id, this.courseToDelete).subscribe({
        next: () => {
          this.loadCursos();
          this.showDeleteModal = false;
        },
        error: (error) => {
          console.error('Error al eliminar el curso', error);
          this.errorMessage = error.error?.message || 'No se pudo eliminar el curso. Por favor, intente nuevamente.';
          this.showDeleteModal = false;
        },
        complete: () => {
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