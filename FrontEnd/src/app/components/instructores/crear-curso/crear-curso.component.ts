import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CursoServiceService } from '../../../services/curso-service.service';
import { VerCategoriasDTO } from '../../../documentos/cursoDocumento';
import { UsuariosService } from '../../../services/usuarios-service.service';
import { CategoriaServiceService } from '../../../services/categorias-service.service';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-crear-curso',
  templateUrl: './crear-curso.component.html',
  styleUrls: ['./crear-curso.component.css']
})
export class CrearCursoComponent implements OnInit {
  isModalOpen: boolean = false;
  isCategoriaModalOpen: boolean = false;
  currentPage: string = 'crear-curso';
  
  // Propiedades para el formulario de nueva categoría
  nuevaCategoriaNombre: string = '';
  nuevaCategoriaDescripcion: string = '';
  
  @ViewChild('vistaPreviaModal') vistaPreviaModal!: ElementRef;
 
  courseName: string = '';
  courseDescription: string = '';
  selectedCategory: string = '';
  categories: VerCategoriasDTO[] = [];
  imageUrl: string = '';
  imagePreview: string | ArrayBuffer | null = null;

  constructor(
    private router: Router,
    private cursoService: CursoServiceService,
    public usuariosService: UsuariosService,
    private categoriaService: CategoriaServiceService
  ) {}
  
  ngOnInit(): void {
    this.loadApprovedCategories();
  }

  private loadApprovedCategories(): void {
    this.categoriaService.obtenerCategoriasAprobadas().subscribe({
      next: (categorias: VerCategoriasDTO[]) => {
        this.categories = categorias;
        if (categorias.length > 0) {
          this.selectedCategory = categorias[0].nombreCategoria;
        }
      },
      error: (error: any) => {
        console.error('Error al cargar categorías aprobadas:', error);
        Swal.fire('Error', 'No se pudieron cargar las categorías aprobadas', 'error');
      }
    });
  }

  // Método para enviar solicitud de nueva categoría
  enviarSolicitudCategoria(): void {
    if (!this.nuevaCategoriaNombre) {
      Swal.fire('Error', 'El nombre de la categoría es requerido', 'error');
      return;
    }
  
    Swal.fire({
      title: 'Enviando solicitud...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  
    this.categoriaService.solicitarNuevaCategoria(
      this.nuevaCategoriaNombre,
      this.nuevaCategoriaDescripcion
    ).subscribe({
      next: (response) => {
        Swal.close();
        if (response.success) {
          Swal.fire({
            icon: 'success',
            title: 'Solicitud enviada',
            text: response.message || 'La solicitud fue recibida correctamente',
            confirmButtonColor: '#8EC3B0'
          });
          this.cerrarModal();
          this.resetFormCategoria();
          this.loadApprovedCategories();
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: response.error || 'Error al enviar la solicitud',
            confirmButtonColor: '#FF6B6B'
          });
        }
      },
      error: (error) => {
        Swal.close();
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un problema al comunicarse con el servidor',
          confirmButtonColor: '#FF6B6B'
        });
      }
    });
  }
  
  // Método para resetear el formulario de categoría
  private resetFormCategoria(): void {
    this.nuevaCategoriaNombre = '';
    this.nuevaCategoriaDescripcion = '';
  }

  updateImageUrl(event: any): void {
    const url = event.target.value.trim();
    if (this.validateImageUrl(url)) {
      this.imageUrl = url;
      this.imagePreview = url;
    } else {
      Swal.fire('Error', 'Por favor ingrese una URL válida para la imagen (debe comenzar con http:// o https://)', 'error');
      this.imageUrl = '';
      this.imagePreview = null;
    }
  }

  private validateImageUrl(url: string): boolean {
    try {
      new URL(url);
      return url.startsWith('http://') || url.startsWith('https://');
    } catch (_) {
      return false;
    }
  }

  removeImage(): void {
    this.imageUrl = '';
    this.imagePreview = null;
  }

  isFormValid(): boolean {
    return !!this.courseName && 
           !!this.selectedCategory && 
           !!this.courseDescription;
  }

  saveCourse() {
    if (!this.isFormValid()) {
      Swal.fire('Error', 'Por favor complete todos los campos obligatorios', 'error');
      return;
    }

    const currentUser = this.usuariosService.currentUserValue;
    if (!currentUser || !currentUser.idUsuario) {
      Swal.fire('Error', 'No se pudo identificar al usuario', 'error');
      return;
    }

    const selectedCategoryObj = this.categories.find(c => c.nombreCategoria === this.selectedCategory);
    if (!selectedCategoryObj || !selectedCategoryObj.idCategoria) {
      Swal.fire('Error', 'Seleccione una categoría válida', 'error');
      return;
    }

    Swal.fire({
      title: '¿Guardar curso?',
      text: '¿Estás seguro de guardar el curso?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#8EC3B0',
      cancelButtonColor: '#FF6B6B',
      confirmButtonText: 'Sí, guardar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.sendCourseToBackend(currentUser.idUsuario, selectedCategoryObj.idCategoria);
      }
    });
  }

  private sendCourseToBackend(userId: number, categoryId: number) {
    const params = new HttpParams()
      .set('idUsuarioInstructor', userId.toString())
      .set('idCategoria', categoryId.toString())
      .set('tituloCurso', this.courseName)
      .set('descripcion', this.courseDescription)
      .set('imagen', this.imageUrl || 'default.jpg');
  
    this.cursoService.crearCurso(params).subscribe({
      next: (response) => {
        Swal.fire('Éxito', 'Curso guardado correctamente', 'success');
        this.resetForm();
        this.router.navigate(['/instructor/cursos']);
      },
      error: (error) => {
        console.error('Error al guardar curso:', error);
        let errorMsg = 'No se pudo guardar el curso';
        if (error.error && typeof error.error === 'string') {
          errorMsg += ': ' + error.error;
        } else if (error.error?.message) {
          errorMsg += ': ' + error.error.message;
        }
        Swal.fire('Error', errorMsg, 'error');
      }
    });
  }

  private resetForm() {
    this.courseName = '';
    this.courseDescription = '';
    this.selectedCategory = this.categories.length > 0 ? this.categories[0].nombreCategoria : '';
    this.imageUrl = '';
    this.imagePreview = null;
  }

  openPreview() {
    if (!this.isFormValid()) {
      Swal.fire('Información', 'Complete los campos obligatorios para ver la vista previa', 'info');
      return;
    }
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  solicitarNuevaCategoria() {
    this.isCategoriaModalOpen = true; 
  }

  cerrarModal() {
    this.isCategoriaModalOpen = false;
    this.resetFormCategoria();
  }

  clearForm() {
    Swal.fire({
      title: '¿Borrar curso?',
      text: '¿Estás seguro de eliminar todo el contenido?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#FF6B6B',
      cancelButtonColor: '#8EC3B0',
      confirmButtonText: 'Sí, borrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.resetForm();
        Swal.fire('Información', 'El curso ha sido borrado', 'info');
      }
    });
  }

  logout() {
    this.usuariosService.logout();
  }

  misCursos() {
    this.router.navigate(['/cursos-instructor']);
  }
}