import { Component } from '@angular/core';
import { Router } from '@angular/router'; 
import { UsuariosService } from '../../../services/usuarios-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  nombreUsuario: string = '';
  contrasenia: string = '';
  errorMensaje: string = '';

  mostrarContrasena: boolean = false;

  constructor(
    private router: Router,
    private usuariosService: UsuariosService
  ) {} 

  toggleMostrarContrasena(): void {
    this.mostrarContrasena = !this.mostrarContrasena;
  }
  
  iniciarSesion(): void {
    this.usuariosService.iniciarSesion(this.nombreUsuario, this.contrasenia).subscribe({
      next: (response) => {
        console.log('Sesión iniciada con éxito:', response);
  
        const idUsuario = response.idUsuario;
        const idRol = response.idRol;
  
        // Guardar en localStorage
        localStorage.setItem('idUsuario', idUsuario);
        localStorage.setItem('idRol', idRol);
  
        // Redireccionar según el rol
        if (idRol === 1) {
          this.router.navigate(['/administrador/cursos/ver']);
        } else if (idRol === 2) {
          this.router.navigate(['/instructor/cursos']);
        } else if (idRol === 3) {
          this.router.navigate(['/alumnos/cursos']);
        } else {
          this.errorMensaje = 'Rol no reconocido. Comunícate con soporte.';
        }
      },
      error: (error) => {
        console.error('Error al iniciar sesión:', error);
        this.errorMensaje = error.error?.error || 'Error desconocido al iniciar sesión';
      }
    });
  }
  

  navigateToRegister() {
    this.router.navigate(['/home/registro']); 
  }
}
