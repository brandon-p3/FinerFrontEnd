import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class RegistroService {

  private urlAlumno = 'http://localhost:8080/api/alumnos-instructor/crear-cuenta/instructor';
  private urlInstructor = 'http://localhost:8080/api/instructor/crear-cuenta';

  constructor(private http: HttpClient) {}

  registrarAlumno(alumno: any) {
    const params = new HttpParams()
      .set('nombre', alumno.nombre)
      .set('apellidoPaterno', alumno.apellidoPaterno)
      .set('apellidoMaterno', alumno.apellidoMaterno)
      .set('correo', alumno.correo)
      .set('contrasenia', alumno.contrasenia)
      .set('nombreUsuario', alumno.nombreUsuario);

    return this.http.post(this.urlAlumno, alumno);
  }

  registrarInstructor(instructor: any) {
    const params = new HttpParams()
      .set('nombre', instructor.nombre)
      .set('apellidoPaterno', instructor.apellidoPaterno)
      .set('apellidoMaterno', instructor.apellidoMaterno)
      .set('correo', instructor.correo)
      .set('contrasenia', instructor.contrasenia)
      .set('nombreUsuario', instructor.nombreUsuario)
      .set('telefono', instructor.telefono)
      .set('direccion', instructor.direccion)
      .set('cedula', instructor.cedula); // cedula es una URL

      return this.http.post(this.urlInstructor, instructor);
  }
}