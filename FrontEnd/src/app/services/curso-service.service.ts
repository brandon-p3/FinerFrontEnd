import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { CursoVerDTO, VerCategoriasDTO, CursoEditarDTO } from '../documentos/cursoDocumento';
import { CONFIG } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class CursoServiceService {
  private apiUrl = 'http://localhost:8080/api/cursos'; // Ruta base para operaciones de cursos
  private instructorApiUrl = 'http://localhost:8080/api/curso'; // Ruta para operaciones de instructor
  private temaApiUrl = 'http://localhost:8080/api/tema';
  private apiUri = CONFIG.apiUrl;



  constructor(private http: HttpClient) { }

  // Métodos existentes
  verCursosInstructor(idInstructor: number): Observable<CursoVerDTO[]> {
    const url = `${this.apiUrl}/ver/${idInstructor}`;
    return this.http.get<CursoVerDTO[]>(url);
  }

 eliminarCurso(idUsuario: number, idCurso: number): Observable<any> {
  return this.http.delete(
    `${this.apiUrl}/eliminar/${idUsuario}/${idCurso}`,
    { responseType: 'text' } // Añade esta opción
  );
}
eliminarTema(idInstructor: number, idTema: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/temas/${idTema}`, {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'idInstructor': idInstructor.toString()
    })
  }).pipe(
    catchError(this.handleError('eliminarTema'))
  );
}
private handleError(operation = 'operation') {
  return (error: any): Observable<any> => {
    console.error(`${operation} failed:`, error);
    throw error;
  };
}

editarCurso(cursoData: CursoEditarDTO): Observable<any> {
  return this.http.put(`${this.apiUrl}/editar`, cursoData, {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      responseType: 'text'
  });
}

  // Nuevos métodos para creación de cursos
  crearCurso(params: HttpParams): Observable<any> {
    return this.http.post(
      `${this.instructorApiUrl}/crear-curso`,
      params.toString(),
      {
        headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
        responseType: 'text'
      }
    );
  }
  // Método para obtener categorías (si no lo tienes ya)
  obtenerCategorias(): Observable<VerCategoriasDTO[]> {
    return this.http.get<VerCategoriasDTO[]>(`${this.apiUrl}/categorias`);
  }

  enviarCursoCompleto(params: HttpParams): Observable<any> {
    return this.http.put(
        `${this.apiUrl}/solicitud-curso/enviar-a-revision`,
        params.toString(),
        {
            headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
            responseType: 'text'
        }
    ).pipe(
        catchError(error => {
            // Transforma el error para manejo consistente
            if (error.error && typeof error.error === 'string') {
                try {
                    error.error = JSON.parse(error.error);
                } catch (e) {
                    // Si no es JSON, lo dejamos como está
                }
            }
            return throwError(() => error);
        })
    );
}
 agregarTema(idSolicitudCurso: number, nombreTema: string, contenido: string): Observable<any> {
    const params = new HttpParams()
      .set('idSolicitudCurso', idSolicitudCurso.toString())
      .set('nombreTema', nombreTema)
      .set('contenido', contenido);

    return this.http.post(
      `${this.temaApiUrl}/crear-tema`,
      params.toString(),
      {
        headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
        responseType: 'text'
      }
    );
  }
  verTemasSolicitadosPorCurso(idSolicitudCurso: number): Observable<any> {
    const url = `${this.apiUri}/cursos/ver-solicitudes/tema`;
    return this.http.get<any>(url, {
      params: {
        idSolicitudCurso: idSolicitudCurso.toString()
      }
    });
  }


  editarTema(idUsuario: number, idTema: number, nombreTema?: string, contenido?: string): Observable<any> {
    let params = new HttpParams();
    if (nombreTema) params = params.set('nombreTema', nombreTema);
    if (contenido) params = params.set('contenido', contenido);

    return this.http.put(
      `${this.temaApiUrl}/editar/${idUsuario}/${idTema}`,
      params.toString(),
      {
        headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
        responseType: 'text'
      }
    );
  }
}

