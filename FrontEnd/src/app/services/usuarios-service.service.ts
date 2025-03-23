import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CONFIG } from '../config/config';
import { Observable } from 'rxjs';
import { AlumnoDocumento, InstructorDocumento } from '../documentos/usuarioDocumento'

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private apiUri = CONFIG.apiUrl + '/administrador';

  constructor(private http: HttpClient) { }

  getAlumnos(): Observable<AlumnoDocumento[]> {
    return this.http.get<AlumnoDocumento[]>(`${this.apiUri}/getUsuarios/alumnos`);
  }

  getInstructores(): Observable<InstructorDocumento[]>{
    return this.http.get<InstructorDocumento[]>(`${this.apiUri}/getUsuarios/instructores`)
  }
}
