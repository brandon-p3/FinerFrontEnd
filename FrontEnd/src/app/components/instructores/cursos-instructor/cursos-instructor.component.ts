import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CursoEditarDTO, CursoVerDTO, VerCategoriasDTO } from '../../../documentos/cursoDocumento';
import { CursoServiceService } from '../../../services/curso-service.service';
import { CategoriaServiceService } from '../../../services/categorias-service.service';

@Component({
  selector: 'app-cursos-instructor',
  templateUrl: './cursos-instructor.component.html',
  styleUrls: ['./cursos-instructor.component.css']
})
export class CursosInstructorComponent implements OnInit {
  constructor(
    private router: Router,
    private cursoService: CursoServiceService,
    private categoriaService: CategoriaServiceService
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
    titulo: '',
    descripcion: '',
    idCategoria: null,
    nombreCategoriaActual: '',
    imagen: null,
    imagenUrl: null,
    file: null
  };
  categorias: VerCategoriasDTO[] = [];
  isEditing = false;
  categoriaSeleccionada: VerCategoriasDTO | null = null;

  ngOnInit() {
    this.loadCursos();
    this.loadCategorias();
  }

  loadCursos() {
    this.isLoading = true;
    this.errorMessage = '';
    
    // Limpiar el array antes de cargar nuevos datos
    this.cursos = [];
    this.filteredCourses = [];

    this.cursoService.verCursosInstructor(this.usuario.id).subscribe({
        next: (cursos) => {
            this.cursos = [...cursos]; // Crear un nuevo array para forzar la detección de cambios
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

  buscarCategoriaPorNombre(nombre: string) {
    if (!nombre.trim()) {
      this.categoriaSeleccionada = null;
      return;
    }

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
  
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  navigateTo(page: string) {
    this.currentPage = page;
    this.menuOpen = false;
    
    // Agrega esta condición para redirigir correctamente
    if (page === 'mis-cursos') {
        this.router.navigate(['/instructor/cursos']);
    }
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
    this.router.navigate(['/instructor/crear-curso']);
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
      titulo: curso.titulo || '',
      descripcion: curso.descripcion || '',
      categoria: curso.categoria || '',
      imagen: curso.imagen || null,
      imagenUrl: curso.imagen || null,
      file: null
    };
    
    this.showEditModal = true;
    this.isEditing = true;
}

  getImageUrl(imagen: string): string {
    if (!imagen) return '';
    
    if (imagen.startsWith('http') || imagen.startsWith('data:')) {
      return imagen;
    }
    return 'data:image/jpeg;base64,' + imagen;
  }

  getCategoriaName(categoriaNombre: string): string {
    return categoriaNombre || 'Sin categoría';
}

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.editFormData.file = file;
      
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.editFormData.imagen = e.target.result.split(',')[1];
        this.editFormData.imagenUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  submitEditForm() {
    // Validar que todos los campos requeridos estén completos
    if (!this.editFormData.titulo || !this.editFormData.descripcion || !this.editFormData.categoria) {
        this.errorMessage = 'Por favor complete todos los campos requeridos';
        return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // Encontrar el ID de la categoría seleccionada
    const categoriaSeleccionada = this.categorias.find(c => c.nombreCategoria === this.editFormData.categoria);
    const idCategoria = categoriaSeleccionada ? categoriaSeleccionada.idCategoria : 0;

    // Crear objeto de datos del curso
    const cursoData: CursoEditarDTO = {
        idCurso: this.editFormData.idCurso,
        idInstructor: this.editFormData.idInstructor,
        titulo: this.editFormData.titulo,
        descripcion: this.editFormData.descripcion,
        imagen: this.editFormData.imagenUrl,
        idCategoria: idCategoria // Enviar el ID al backend
    };

    // Llamar al servicio para editar el curso
    this.cursoService.editarCurso(cursoData).subscribe({
        next: (response) => {
            console.log('Curso actualizado:', response);
            this.loadCursos();
            this.closeEditModal();
        },
        error: (error) => {
            console.error('Error al editar el curso', error);
            this.errorMessage = error.error?.message || 'No se pudo actualizar el curso.';
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
      titulo: '',
      descripcion: '',
      idCategoria: null,
      nombreCategoriaActual: '',
      imagen: null,
      imagenUrl: null,
      file: null
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