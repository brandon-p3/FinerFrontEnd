import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RegistroService {
  private urlAlumno = 'http://localhost:8080/api/alumno/crear-cuenta'; 
  private urlInstructor = 'http://localhost:8080/api/instructor/crear-cuenta';

  constructor(private http: HttpClient) { }

  registrarAlumno(
    nombre: string,
    apellidoPaterno: string,
    apellidoMaterno: string,
    correo: string,
    contrasenia: string,
    nombreUsuario: string
  ): Observable<any> {
    const params = new HttpParams()
      .set('nombre', nombre)
      .set('apellidoPaterno', apellidoPaterno)
      .set('apellidoMaterno', apellidoMaterno || '') // Manejar valor nulo
      .set('correo', correo)
      .set('contrasenia', contrasenia)
      .set('nombreUsuario', nombreUsuario);

    return this.http.post(this.urlAlumno, {}, { params }).pipe(
      catchError(this.handleError)
    );
  }

  registrarInstructor(
    nombre: string,
    apellidoPaterno: string,
    apellidoMaterno: string,
    correo: string,
    contrasenia: string,
    nombreUsuario: string,
    telefono: string,
    direccion: string,
    cedula: string
  ): Observable<any> {
    const params = new HttpParams()
      .set('nombre', nombre)
      .set('apellidoPaterno', apellidoPaterno)
      .set('apellidoMaterno', apellidoMaterno || '') // Manejar valor nulo
      .set('correo', correo)
      .set('contrasenia', contrasenia)
      .set('nombreUsuario', nombreUsuario)
      .set('telefono', telefono)
      .set('direccion', direccion)
      .set('cedula', cedula);

    return this.http.post(this.urlInstructor, {}, { params }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error desconocido';
    
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      if (error.status === 0) {
        errorMessage = 'No se pudo conectar al servidor';
      } else if (error.error && typeof error.error === 'object') {
        // Si el backend devuelve un objeto con mensaje
        errorMessage = error.error.message || `Error ${error.status}: ${error.message}`;
      } else {
        errorMessage = `Error ${error.status}: ${error.message}`;
      }
    }
    
    console.error('Error en el servicio de registro:', error);
    return throwError(() => new Error(errorMessage));
  }
}