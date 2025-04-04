import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CONFIG } from '../config/config';
import { Observable } from 'rxjs';
import { AlumnoDocumento, InstructorDocumento } from '../documentos/usuarioDocumento'
import { Curso } from '../documentos/cursosDocumento';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private apiUri = CONFIG.apiUrl + '/administrador';
  private apiUri2 = CONFIG.apiUrl + '/token';
  private apiUri3 = CONFIG.apiUrl + '/alumnos-instructor/usuarios';

  constructor(private http: HttpClient) { }

  getAlumnos(): Observable<AlumnoDocumento[]> {
    return this.http.get<AlumnoDocumento[]>(`${this.apiUri}/getUsuarios/alumnos`);
  }

  getInstructores(): Observable<InstructorDocumento[]>{
    return this.http.get<InstructorDocumento[]>(`${this.apiUri}/getUsuarios/instructores`)
  }

  iniciarSesion(nombreUsuario: string, contrasenia: string): Observable<string> {
    const url = `${this.apiUri2}/iniciar-sesion`
    return this.http.get<string>(url, {
      params: { nombreUsuario, contrasenia }
    });
  }

  obtenerUsuarioPorId(idUsuario: number): Observable<any> {
    return this.http.get<any>(`${this.apiUri3}/${idUsuario}`);
  }

}
