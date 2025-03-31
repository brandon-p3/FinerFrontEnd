import { Component, OnInit } from '@angular/core';
import { AdministradorServiceService } from '../../../services/administrador-service.service';

@Component({
  selector: 'app-solicitudes-admin',
  templateUrl: './solicitudes-admin.component.html',
  styleUrl: './solicitudes-admin.component.css'
})
export class SolicitudesAdminComponent implements OnInit {
  instructores: any[] = [];

  instructorSeleccionado: any = null;
  mostrarModal = false;
  solicitudesCategorias: any[] = [];
  mensajeExito: string = '';
  mostrarMensaje: boolean = false;
  
  // Variables para el modal de rechazo
  mostrarModalRechazo: boolean = false;
  instructorParaRechazar: any = null;
  motivoRechazo: string = '';

  constructor(private adminService: AdministradorServiceService) {}

  ngOnInit(): void {
    this.obtenerSolicitudesInstructores();
    this.obtenerSolicitudesCategorias();
  }

  abrirDetalles(instructor: any) {
    this.instructorSeleccionado = instructor;
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  // Método para mostrar mensaje temporalmente
  mostrarMensajeTemporalmente(mensaje: string) {
    this.mensajeExito = mensaje;
    this.mostrarMensaje = true;
    
    // Ocultar el mensaje después de 5 segundos
    setTimeout(() => {
      this.mostrarMensaje = false;
    }, 5000);
  }

  // ==== SECCION DE INSTRUCTORES ======

  obtenerSolicitudesInstructores() {
    this.adminService.verSolicitudesInstructor().subscribe(
      (data) => {
        console.log('Datos de solicitudes de instructores:', data);
        // Verificar si data es un array
        if (Array.isArray(data)) {
          this.instructores = data;
        } else if (data && typeof data === 'object') {
          // Si data es un objeto, pero tiene una propiedad que contiene el array
          // Por ejemplo, si la respuesta es { items: [...] }
          // Busca alguna propiedad que sea un array
          for (const prop in data) {
            if (Array.isArray(data[prop])) {
              this.instructores = data[prop];
              break;
            }
          }
          
          // Si no encontramos ningún array, convierte el objeto en array si es posible
          if (!Array.isArray(this.instructores)) {
            console.warn('La respuesta no contiene un array, intentando convertir');
            this.instructores = [data]; // Convertir un único objeto en array
          }
        } else {
          console.error('La respuesta no es un array ni un objeto:', data);
          this.instructores = [];
        }
      },
      (error) => {
        console.error('Error al obtener solicitudes de instructores', error);
        this.instructores = [];
      }
    );
  }

  aceptarInstructor(instructor: any) {
    // Imprimir todo el objeto instructor para ver su estructura completa
    console.log('Objeto instructor completo:', instructor);
  
    // Verificación de seguridad más detallada
    if (!instructor) {
      console.error('El objeto instructor es undefined o null');
      return;
    }
  
    // Verificar la existencia de la propiedad id_solicitud_instructor
    if (!instructor.hasOwnProperty('id_solicitud_instructor')) {
      console.error('El objeto instructor no tiene la propiedad id_solicitud_instructor');
      console.error('Propiedades disponibles:', Object.keys(instructor));
      return;
    }
  
    // Verificar que el id_solicitud_instructor sea un número válido
    if (typeof instructor.id_solicitud_instructor !== 'number') {
      console.error('id_solicitud_instructor no es un número válido', instructor.id_solicitud_instructor);
      return;
    }
  
    this.adminService.aceptarInstructor(instructor.id_solicitud_instructor).subscribe(
      (response) => {
        console.log('Respuesta de aceptar instructor:', response);
        // Mostrar mensaje de éxito al usuario
        this.mostrarMensajeTemporalmente(`¡El instructor ${instructor.nombre || ''} ha sido aceptado exitosamente!`);
        this.obtenerSolicitudesInstructores();
      },
      (error) => {
        console.error('Error completo al aceptar instructor:', error);
        // Mostrar mensaje de error al usuario
        this.mostrarMensajeTemporalmente('Error al aceptar el instructor. Por favor, inténtelo de nuevo.');
      }
    );
  }

  // Método para abrir el modal de rechazo
  abrirModalRechazo(instructor: any) {
    this.instructorParaRechazar = instructor;
    this.motivoRechazo = '';
    this.mostrarModalRechazo = true;
  }

  // Método para cancelar el rechazo
  cancelarRechazo() {
    this.mostrarModalRechazo = false;
    this.instructorParaRechazar = null;
    this.motivoRechazo = '';
  }

  // Método para confirmar el rechazo
  confirmarRechazo() {
    if (!this.motivoRechazo || this.motivoRechazo.trim() === '') {
      console.error('El motivo de rechazo no puede estar vacío');
      // Puedes mostrar un mensaje de error al usuario
      return;
    }

    this.rechazarInstructor(this.instructorParaRechazar, this.motivoRechazo);
    this.mostrarModalRechazo = false;
  }

  // Método para rechazar instructor con motivo
  rechazarInstructor(instructor: any, motivo: string) {
    // Verificaciones de seguridad
    if (!instructor) {
      console.error('El objeto instructor es undefined o null');
      return;
    }
  
    if (!instructor.hasOwnProperty('id_solicitud_instructor')) {
      console.error('El objeto instructor no tiene la propiedad id_solicitud_instructor');
      console.error('Propiedades disponibles:', Object.keys(instructor));
      return;
    }
  
    if (typeof instructor.id_solicitud_instructor !== 'number') {
      console.error('id_solicitud_instructor no es un número válido', instructor.id_solicitud_instructor);
      return;
    }

    this.adminService.rechazarInstructor(instructor.id_solicitud_instructor, motivo).subscribe(
      (response) => {
        console.log('Instructor rechazado exitosamente:', response);
        this.mostrarMensajeTemporalmente(`La solicitud del instructor ha sido rechazada.`);
        this.obtenerSolicitudesInstructores(); // Actualizar la lista
      },
      (error) => {
        console.error('Error al rechazar instructor:', error);
        this.mostrarMensajeTemporalmente('Error al rechazar la solicitud. Por favor, inténtelo de nuevo.');
      }
    );
  }

  // ========= SECCION DE CATEGORIAS =========

  obtenerSolicitudesCategorias() {
    this.adminService.obtenerTodasLasSolicitudes().subscribe(
      (data) => {
        console.log('Datos de solicitudes de instructores:', data);
        this.solicitudesCategorias = data;
      },
      (error) => {
        console.error('Error al obtener solicitudes', error);
      }
    );
  }
}