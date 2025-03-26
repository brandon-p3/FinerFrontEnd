import { Component, OnInit } from '@angular/core';
import { NavbarAdminComponent } from '../navbar-admin/navbar-admin.component';
import { FooterComponent } from '../footer/footer.component';
import { AdministradorServiceService } from '../../../services/administrador-service.service';


@Component({
  selector: 'app-cursos-admin',
  templateUrl: './cursos-admin.component.html',
  styleUrl: './cursos-admin.component.css'
})
export class CursosAdminComponent implements OnInit {

  constructor(private administradorService: AdministradorServiceService) { }

  solicitudesPendientes: any[] = [];
  cursos: any[] = [];

  modalVisible: boolean = false;
  motivoRechazo: string = '';
  cursoSeleccionado: any = null;

  ngOnInit(): void {
    this.obtenerSolicitudesCursos();
  }

  obtenerSolicitudesCursos() {
    this.administradorService.obtenerSolicitudesCursos().subscribe((data) => {
      this.solicitudesPendientes = data || [];
      console.log(this.solicitudesPendientes);
    });
  }

  aprobarCurso(idSolicitudCurso: number) {
    const requestBody = {
      idSolicitudCurso: idSolicitudCurso
    };

    this.administradorService.aprobarCurso(requestBody).subscribe(
      (response) => {
        alert(response.mensaje);
      },
      (error) => {
        alert('Error al aprobar el curso');
        console.error(error); // Puedes ver el error más detallado en la consola
      }
    );
  }

  // Método para rechazar el curso
  rechazarCurso() {
    if (!this.cursoSeleccionado || !this.motivoRechazo.trim()) {
      alert("Debes ingresar un motivo para el rechazo.");
      return;
    }
  
    const requestBody = {
      idSolicitudCurso: this.cursoSeleccionado.idSolicitudCurso,
      correoInstructor: this.cursoSeleccionado.correoInstructor,
      motivoRechazo: this.motivoRechazo,
      tituloCurso: this.cursoSeleccionado.tituloCurso
    };
  
    this.administradorService.rechazarCurso(requestBody).subscribe(
      (response) => {
        alert(response.mensaje);
        this.cerrarModal(); // Cerrar el modal después de rechazar
        this.obtenerSolicitudesCursos(); // Actualizar la lista de solicitudes
      },
      (error) => {
        alert("Error al rechazar el curso");
        console.error(error);
      }
    );
  }
  


  // Método para abrir el modal de rechazo
  abrirModalRechazo(solicitud: any) {
    this.cursoSeleccionado = solicitud;
    this.modalVisible = true; // Mostrar el modal
  }

  // Método para cerrar el modal
  cerrarModal() {
    this.modalVisible = false;
    this.motivoRechazo = ''; // Limpiar el campo de texto
  }


}
