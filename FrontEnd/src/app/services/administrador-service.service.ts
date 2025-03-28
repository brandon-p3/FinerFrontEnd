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

  buscarUsuarioNombre(nombreUsuario: string): Observable<any> {
    console.log(`Buscando usuario: ${nombreUsuario}`);
    return this.http.get<any>(`${this.apiUri}/administrador/buscarUsuario/${nombreUsuario}`);
  }  
   
  // ===================== Servicios de categorias =============================
  obtenerTodasLasSolicitudes(): Observable<any[]> { // Solicitud de categorias
    return this.http.get<any[]>(`${this.apiUri}/solicitudes/todas`);
  }

  obtenerCategoriasAprobadas(): Observable<any> {
    return this.http.get<any>(`${this.apiUri}/api/categorias/ver-categoria-aprobada`);
  }

  // ===================== Servicios de Cursos =================================
  obtenerSolicitudesCursos(): Observable<any> { //Solicitud de cursos
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


