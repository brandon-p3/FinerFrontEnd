import { Component, ElementRef, ViewChild, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { CursoServiceService } from '../../../services/curso-service.service';
import { VerCategoriasDTO } from '../../../documentos/cursoDocumento';
import { UsuariosService } from '../../../services/usuarios-service.service';
import { CategoriaServiceService } from '../../../services/categorias-service.service';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-crear-curso',
  templateUrl: './crear-curso.component.html',
  styleUrls: ['./crear-curso.component.css']
})
export class CrearCursoComponent implements OnInit {
  isModalOpen: boolean = false;
  isCategoriaModalOpen: boolean = false;
  menuOpen: boolean = false;
  currentPage: string = 'crear-curso';
  
  @ViewChild('vistaPreviaModal') vistaPreviaModal!: ElementRef;
 
  courseName: string = '';
  courseDescription: string = '';
  selectedCategory: string = '';
  categories: VerCategoriasDTO[] = [];
  imageUrl: string = '';
  selectedImage: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  sections: { title: string, subsections: { title: string, content: string }[] }[] = [
    { title: '', subsections: [{ title: '', content: '' }] }
  ];

  constructor(
    private router: Router, 
    private modalService: NgbModal,
    private cursoService: CursoServiceService,
    public usuariosService: UsuariosService,
    @Inject(CategoriaServiceService) private categoriaService: CategoriaServiceService
  ) {}
  
  // Usuario autenticado
  usuario: any = {
    id: 0,          
    nombre: '',     
    apellidoPaterno: '',
    apellidoMaterno: '',
    email: '',
    username: '',
    idUsuario: 0,    
    idRol: 0         
  };


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
    this.selectedImage = null;
  }

  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
        this.imageUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  isFormValid(): boolean {
    if (!this.courseName || !this.selectedCategory || !this.courseDescription) {
      return false;
    }

    return this.sections.every(section => 
      section.title && 
      section.subsections.length > 0 &&
      section.subsections.every(sub => sub.title && sub.content)
    );
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  addSection() {
    this.sections.push({ title: '', subsections: [{ title: '', content: '' }] });
  }

  addSubsection(sectionIndex: number) {
    this.sections[sectionIndex].subsections.push({ title: '', content: '' });
  }

  removeSection(sectionIndex: number) {
    if (this.sections.length > 1) {
      this.sections.splice(sectionIndex, 1);
    } else {
      Swal.fire('Información', 'Debe haber al menos una sección', 'info');
    }
  }

  removeSubsection(sectionIndex: number, subsectionIndex: number) {
    if (this.sections[sectionIndex].subsections.length > 1) {
      this.sections[sectionIndex].subsections.splice(subsectionIndex, 1);
    } else {
      Swal.fire('Información', 'Debe haber al menos un tema por sección', 'info');
    }
  }

  private generateStructuredDescription(): string {
    let description = `Descripción: ${this.courseDescription}\n\nContenido del curso:\n\n`;
    
    this.sections.forEach((section, sectionIndex) => {
      description += `## Sección ${sectionIndex + 1}: ${section.title}\n`;
      
      section.subsections.forEach((subsection, subIndex) => {
        description += `### Tema ${subIndex + 1}: ${subsection.title}\n`;
        description += `${subsection.content}\n\n`;
      });
    });

    return description;
  }

  submitForReview() {
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
    if (!selectedCategoryObj) {
      Swal.fire('Error', 'Seleccione una categoría válida', 'error');
      return;
    }

    Swal.fire({
      title: '¿Confirmar envío?',
      text: '¿Estás seguro de enviar el curso a revisión?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#8EC3B0',
      cancelButtonColor: '#FF6B6B',
      confirmButtonText: 'Sí, enviar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.sendCourseToBackend(currentUser.idUsuario, selectedCategoryObj.idCategoria);
      }
    });
  }

  private sendCourseToBackend(userId: number, categoryId: number) {
    // Preparar los parámetros como x-www-form-urlencoded
    const params = new HttpParams()
      .set('idUsuarioInstructor', userId.toString())
      .set('idCategoria', categoryId.toString())
      .set('tituloCurso', this.courseName)
      .set('descripcion', this.generateStructuredDescription())
      .set('imagen', this.imageUrl || 'default.jpg');
  
    this.cursoService.crearCurso(params).subscribe({
      next: (response) => {
        Swal.fire('Éxito', 'Curso creado correctamente', 'success');
        this.resetForm();
        this.router.navigate(['/instructor/cursos']);
      },
      error: (error) => {
        console.error('Error al crear curso:', error);
        let errorMsg = 'No se pudo crear el curso';
        if (error.error && typeof error.error === 'string') {
          errorMsg += ': ' + error.error;
        }
        Swal.fire('Error', errorMsg, 'error');
      }
    });
  }
  private resetForm() {
    this.courseName = '';
    this.courseDescription = '';
    this.selectedCategory = this.categories.length > 0 ? this.categories[0].nombreCategoria : '';
    this.sections = [{ title: '', subsections: [{ title: '', content: '' }] }];
    this.imageUrl = '';
    this.selectedImage = null;
    this.imagePreview = null;
  }

  vistaPrevia() {
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
  }

  eliminarCurso() {
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