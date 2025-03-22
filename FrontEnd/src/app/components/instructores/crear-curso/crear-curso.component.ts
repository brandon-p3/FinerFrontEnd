import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';  // Importa FormsModule
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2'; // Importa SweetAlert2

@Component({
  selector: 'app-crear-curso',
  templateUrl: './crear-curso.component.html',
  styleUrls: ['./crear-curso.component.css']
})
export class CrearCursoComponent {
  isModalOpen: boolean = false;
  isCategoriaModalOpen: boolean = false;
  @ViewChild('vistaPreviaModal') vistaPreviaModal!: ElementRef; // Referencia al modal
 
  courseName: string = '';  // Nombre del curso
  selectedCategory: string = '';  // Categoría seleccionada
  categories: string[] = ['Desarrollo Web', 'Marketing', 'Negocios', 'Diseño Gráfico']; // Lista de categorías disponibles

  sections: { title: string, subsections: { title: string, content: string }[] }[] = [
    { title: '', subsections: [{ title: '', content: '' }] }  // Sección y subsección por defecto
  ];

  usuario = {
    nombre: 'Juan',
    apellidos: 'Pérez',
    email: 'juan.perez@finer.com',
  };
  menuOpen = false;
  currentPage = 'crear-curso';

  constructor(private router: Router, private modalService: NgbModal) {}

  // Método para navegar a una ruta específica
  navigateTo(route: string) {
    this.router.navigate([route]); // Usa el Router para redirigir
  }

  // Método para agregar una nueva sección
  addSection() {
    this.sections.push({ title: '', subsections: [{ title: '', content: '' }] });
  }

  // Método para agregar una subsección a la sección actual
  addSubsection(sectionIndex: number) {
    this.sections[sectionIndex].subsections.push({ title: '', content: '' });
  }

  // Método para eliminar una sección
  removeSection(sectionIndex: number) {
    this.sections.splice(sectionIndex, 1);
  }

  // Método para eliminar una subsección
  removeSubsection(sectionIndex: number, subsectionIndex: number) {
    this.sections[sectionIndex].subsections.splice(subsectionIndex, 1);
  }

  // Método para enviar el curso a revisión
  submitForReview() {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas enviar el curso a revisión?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, enviar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#8EC3B0',
      cancelButtonColor: '#FF6B6B',
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('Enviando curso a revisión...');
        console.log('Nombre del curso:', this.courseName);
        console.log('Categoría:', this.selectedCategory);
        console.log('Secciones:', this.sections);

        this.router.navigate(['/crear-curso']);
      }
    });
  }

  solicitarNuevaCategoria() {
    this.isCategoriaModalOpen  = true; 
  }

  cerrarModal() {
    this.isCategoriaModalOpen  = false;
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  // Método para abrir el modal
  vistaPrevia() {
    console.log('Mostrando vista previa del curso...');
    this.isModalOpen = true;
  }

  // Método para cerrar el modal
  closeModal() {
    this.isModalOpen = false;
  }

  eliminarCurso() {
    console.log('Eliminando curso...');
    this.courseName = ''; 
    this.selectedCategory = '';
    this.sections = [{ title: '', subsections: [{ title: '', content: '' }] }];
  }

  logout() {
    console.log('Cerrando sesión...');
    this.router.navigate(['/usuarios-admin/login/login']);
  }

  misCursos() {
    this.router.navigate(['/cursos-instructor']);
  }
}
