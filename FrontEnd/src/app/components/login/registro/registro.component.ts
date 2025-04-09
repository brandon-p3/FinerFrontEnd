import { Component } from '@angular/core';
import { RegistroService } from '../../../services/registro.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  usuario = {
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    correo: '',
    contrasenia: '',
    nombreUsuario: '',
    telefono: '',
    direccion: '',
    cedula: ''
  };

  esInstructor = false;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private registroService: RegistroService) {}

  registrar() {
    this.errorMessage = '';
    this.successMessage = '';
    this.isLoading = true;

    if (this.esInstructor) {
      this.registrarInstructor();
    } else {
      this.registrarAlumno();
    }
  }

  private registrarAlumno() {
    const { nombre, apellidoPaterno, apellidoMaterno, correo, contrasenia, nombreUsuario } = this.usuario;
    
    this.registroService.registrarAlumno(
      nombre,
      apellidoPaterno,
      apellidoMaterno,
      correo,
      contrasenia,
      nombreUsuario
    ).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.successMessage = res?.message || 'Alumno registrado correctamente';
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.message || 'Error al registrar alumno';
        console.error('Error en registro:', err);
      }
    });
  }

  private registrarInstructor() {
    const { nombre, apellidoPaterno, apellidoMaterno, correo, contrasenia, 
           nombreUsuario, telefono, direccion, cedula } = this.usuario;
    
    // Validación de campos requeridos para instructor
    if (!telefono || !direccion || !cedula) {
      this.isLoading = false;
      this.errorMessage = 'Todos los campos de instructor son requeridos';
      return;
    }

    this.registroService.registrarInstructor(
      nombre,
      apellidoPaterno,
      apellidoMaterno,
      correo,
      contrasenia,
      nombreUsuario,
      telefono,
      direccion,
      cedula
    ).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.successMessage = res?.message || 'Solicitud de instructor enviada correctamente';
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.message || 'Error al registrar instructor';
        console.error('Error en registro:', err);
      }
    });
  }
}