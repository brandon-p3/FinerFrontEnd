import { Component, OnInit } from '@angular/core';
import { AdministradorServiceService } from '../../../services/administrador-service.service';

@Component({
  selector: 'app-solicitudes-admin',
  templateUrl: './solicitudes-admin.component.html',
  styleUrl: './solicitudes-admin.component.css'
})
export class SolicitudesAdminComponent implements OnInit {
  instructores = [
    { id: 1, nombre: 'Juan Pérez', username: 'juanp', correo: 'juan.pere.com', telefono: '123-456-7890', direccion: 'Calle Ficticia 123' },
    { id: 2, nombre: 'Ana Rodríguez', username: 'anar', correo: 'ana.rodriguez.com', telefono: '987-654-3210', direccion: 'Avenida Central 456' }
  ];

  instructorSeleccionado: any = null;
  mostrarModal = false;
  solicitudesCategorias: any[] = [];

  constructor(private adminService: AdministradorServiceService) {}

  ngOnInit(): void {}

  abrirDetalles(instructor: any) {
    this.instructorSeleccionado = instructor;
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  obtenerSolicitudesCategorias() {
    this.adminService.obtenerTodasLasSolicitudes().subscribe(
      (data) => {
        this.solicitudesCategorias = data;
      },
      (error) => {
        console.error('Error al obtener solicitudes', error);
      }
    );
  }
}
