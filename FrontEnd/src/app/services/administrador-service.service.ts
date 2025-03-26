import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CONFIG } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class AdministradorServiceService {

  private apiUri = CONFIG.apiUrl;

  constructor(private http: HttpClient) { }

  filtrarAlumnosPorNombre(nombre: string, orden: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUri}/usuario/filtrar-alumno-nombre`, {
      params: { nombre, orden }
    });
  }

  buscarUsuarioNombre(busqueda: string): Observable<any> {
    return this.http.post<any>(`${this.apiUri}/administrador/buscarUsuarioNombre`, { busqueda });
  }
   

  // Soloicitudes
  obtenerSolicitudesCategorias(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUri}/instructor/${id}`);
  }

  obtenerSolicitudesCursos(): Observable<any> {
    return this.http.get<any>(`${this.apiUri}/solicitudes-curso/pendientes`);
  }

  // Aprobar curso
  aprobarCurso(requestBody: any): Observable<any> {
    return this.http.post<any>(`${this.apiUri}/administrador/aprobarCurso`, requestBody);
  }

  // Rechazar curso
  rechazarCurso(requestBody: any): Observable<any> {
    return this.http.post<any>(`${this.apiUri}/administrador/rechazarCurso`, requestBody);
  }

}


