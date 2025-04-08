import { Component } from '@angular/core';
import { RegistroService } from '../../../services/registro.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  usuario: any = {
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

  esInstructor: boolean = false;

  constructor(private registroService: RegistroService) {}

  registrar() {
    if (this.esInstructor) {
      this.registroService.registrarInstructor(this.usuario).subscribe({
        next: (res: any) => {
          console.log('Instructor registrado:', res);
          alert(res.message || '¡Instructor registrado correctamente!');
        },
        error: (err) => {
          console.error('Error al registrar instructor:', err);
          alert('Error al registrar instructor');
        }
      });
    } else {
      this.registroService.registrarAlumno(this.usuario).subscribe({
        next: () => {
          alert('¡Alumno registrado correctamente!');
        },
        error: (err) => {
          console.error('Error al registrar alumno:', err);
          alert('Error al registrar alumno');
        }
      });
    }
  }
}
