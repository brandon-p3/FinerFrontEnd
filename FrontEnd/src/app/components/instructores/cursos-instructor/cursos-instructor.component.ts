import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cursos-instructor',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './cursos-instructor.component.html',
  styleUrls: ['./cursos-instructor.component.css']
})
export class CursosInstructorComponent {
  constructor(private router: Router) { } 
  usuario = {
    nombre: 'Juan',
    apellidos: 'Pérez',
    email: 'juan.perez@finer.com',
  };

  menuOpen = false;
  currentPage = 'mis-cursos';
  searchQuery = ''; // Almacena el texto de búsqueda
  filterDate: string = ''; // Almacena la fecha seleccionada para el filtro
  sortOption = 'asc'; // Orden de los cursos (ascendente o descendente)
  cursos = [
    { nombre: 'Curso de Angular', imagen: 'assets/angular.jpg', fecha: '2025-03-10' },
    { nombre: 'Curso de React', imagen: 'assets/react.jpg', fecha: '2025-03-11' },
    { nombre: 'Curso de Vue', imagen: 'assets/vue.jpg', fecha: '2025-03-12' },
    // Agrega más cursos con fechas aquí
  ];
  filteredCourses = [...this.cursos]; // Lista de cursos filtrados

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  navigateTo(page: string) {
    this.currentPage = page;
    this.menuOpen = false; // Cierra el menú al seleccionar una opción
  }

  applyFilters() {
    let filtered = [...this.cursos];

    // Filtro por búsqueda de nombre
    if (this.searchQuery) {
      filtered = filtered.filter(curso =>
        curso.nombre.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    // Filtro por fecha (si se selecciona una)
    if (this.filterDate) {
      filtered = filtered.filter(curso => curso.fecha === this.filterDate);
    }

    // Filtro por orden
    if (this.sortOption === 'asc') {
      filtered.sort((a, b) => a.nombre.localeCompare(b.nombre));
    } else if (this.sortOption === 'desc') {
      filtered.sort((a, b) => b.nombre.localeCompare(a.nombre));
    }

    this.filteredCourses = filtered; // Actualiza los cursos filtrados
  }

  createCourse() {
    this.router.navigate(['/crear-curso']);
  }
  

  previewCourse(curso: any) {
    // Lógica para previsualizar el curso
    console.log('Previsualizando el curso', curso);
  }

  editCourse(curso: any) {
    // Lógica para editar el curso
    console.log('Editando el curso', curso);
  }

  deleteCourse(curso: any) {
    // Lógica para eliminar el curso
    console.log('Eliminando el curso', curso);
    this.cursos = this.cursos.filter(c => c !== curso);
    this.applyFilters(); // Vuelve a aplicar los filtros
  }

  logout() {
    console.log('Cerrando sesión...');
  }
}
