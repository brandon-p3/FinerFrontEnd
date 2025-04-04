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
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private usuariosService: UsuariosService
  ) {} 

  toggleMostrarContrasena(): void {
    this.mostrarContrasena = !this.mostrarContrasena;
  }
  
  iniciarSesion(): void {
    this.isLoading = true;
    this.errorMensaje = '';
    
    this.usuariosService.iniciarSesion(this.nombreUsuario, this.contrasenia).subscribe({
      next: (response) => {
        console.log('Sesión iniciada con éxito:', response);
        
        // Guardar usuario completo en el servicio y localStorage
        const userData = {
          idUsuario: response.idUsuario,
          idRol: response.idRol,
          nombreUsuario: this.nombreUsuario,
          // Puedes agregar más datos básicos si los devuelve el login
        };
        
        this.usuariosService.setCurrentUser(userData);
        
        // Obtener datos completos del usuario según su rol
        this.usuariosService.obtenerUsuarioPorId(response.idUsuario).subscribe({
          next: (usuarioCompleto) => {
            // Combinar datos básicos con los completos
            const fullUserData = {
              ...userData,
              ...usuarioCompleto
            };
            
            this.usuariosService.setCurrentUser(fullUserData);
            
            // Redireccionar según el rol
            this.redirigirSegunRol(response.idRol);
          },
          error: (error) => {
            console.error('Error al obtener datos del usuario:', error);
            // Aun así redirigir con los datos básicos
            this.redirigirSegunRol(response.idRol);
          }
        });
      },
      error: (error) => {
        console.error('Error al iniciar sesión:', error);
        this.errorMensaje = error.error?.error || 'Error desconocido al iniciar sesión';
        this.isLoading = false;
      }
    });
  }

  private redirigirSegunRol(idRol: number): void {
    this.isLoading = false;
    
    switch(idRol) {
      case 1: // Administrador
        this.router.navigate(['/administrador/cursos/ver']);
        break;
      case 2: // Instructor
        this.router.navigate(['/instructor/cursos']);
        break;
      case 3: // Alumno
        this.router.navigate(['/alumnos/cursos']);
        break;
      default:
        this.errorMensaje = 'Rol no reconocido. Comunícate con soporte.';
    }
  }

  navigateToRegister() {
    this.router.navigate(['/home/registro']); 
  }
}