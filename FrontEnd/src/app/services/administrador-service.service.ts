import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
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

  verSolicitudesInstructor(): Observable<any> {
    return this.http.get<any>(`${this.apiUri}/administrador/solicitudes-instructor`);
  }

  aceptarInstructor(idSolicitudInstructor: number): Observable<any> {
    return this.http.post<any>(`${this.apiUri}/administrador/aceptar-instructor`, { idSolicitudInstructor });
  }

  rechazarInstructor(id: number, motivo: string): Observable<any> {
    const url = `${this.apiUri}/administrador/solicitudes/rechazar/${id}`;
    
    const headers = new HttpHeaders({
      'Content-Type': 'text/plain'
    });
    
    return this.http.post(url, motivo, { headers });
  }
   
  // ===================== Servicios de categorias =============================
  obtenerTodasLasSolicitudes(): Observable<any[]> { // Solicitud de categorias
    return this.http.get<any[]>(`${this.apiUri}/solicitudes/todas`);
  }

  aprobarCategoria(id: number): Observable<string> {
    const url = `${this.apiUri}/solicitudes/aprobar/${id}`;
    return this.http.put<string>(url, {});
  }

  desaprobarCategoria(id: number): Observable<string> {
    return this.http.put<string>(`${this.apiUri}/solicitudes/desaprobar/${id}`, {});
  }

  obtenerCategoriasAprobadas(): Observable<any> {
    return this.http.get<any>(`${this.apiUri}/token/ver-categoria-aprobada`);
  }

  // ===================== Servicios de Cursos =================================
  obtenerSolicitudesCursos(): Observable<any> { //Solicitud de cursos
    return this.http.get<any>(`${this.apiUri}/solicitudes-curso/pendientes`);
  }

  verTemasSolicitadosPorCurso(idSolicitudCurso: number): Observable<any> {
    const url = `${this.apiUri}/cursos/ver-solicitudes/tema`;
    return this.http.get<any>(url, {
      params: {
        idSolicitudCurso: idSolicitudCurso.toString()
      }
    });
  }

  // Aprobar curso
  aprobarCurso(requestBody: any): Observable<any> {
    return this.http.post<any>(`${this.apiUri}/administrador/aprobar-curso`, requestBody);
  }

  // Rechazar curso
  rechazarCurso(requestBody: any): Observable<any> {
    return this.http.post<any>(`${this.apiUri}/administrador/rechazarCurso`, requestBody);
  }

}


