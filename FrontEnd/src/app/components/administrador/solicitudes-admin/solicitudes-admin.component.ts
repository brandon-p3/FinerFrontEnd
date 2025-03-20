import { Component } from '@angular/core';

@Component({
  selector: 'app-solicitudes-admin',
  templateUrl: './solicitudes-admin.component.html',
  styleUrl: './solicitudes-admin.component.css'
})
export class SolicitudesAdminComponent {
  instructores = [
    { nombre: 'Juan Pérez', username: 'juanp', correo: 'juan.pere.com', telefono: '123-456-7890', direccion: 'Calle Ficticia 123' },
    { nombre: 'Ana Rodríguez', username: 'anar', correo: 'ana.rodriguez.com', telefono: '987-654-3210', direccion: 'Avenida Central 456' }
  ];

  instructorSeleccionado: any = null; // Almacena los datos del instructor seleccionado
  mostrarModal = false; // Controla la visibilidad del modal

  abrirDetalles(instructor: any) {
    this.instructorSeleccionado = instructor;
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
  }
}

