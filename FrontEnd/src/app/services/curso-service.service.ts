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
  // Método para obtener categorías 
  obtenerCategorias(): Observable<VerCategoriasDTO[]> {
    return this.http.get<VerCategoriasDTO[]>(`${this.apiUrl}/categorias`);
  }

  enviarARevision(idSolicitudCurso: number): Observable<any> {
    // Usar HttpParams para el parámetro de consulta
    const params = new HttpParams().set('id_solicitud_curso', idSolicitudCurso.toString());

    return this.http.put(
        `${this.apiUrl}/solicitud-curso/enviar-a-revision`,
        null, // Cuerpo vacío porque usamos parámetros de consulta
        {
            params: params,
            headers: new HttpHeaders({
                'Accept': 'application/json'
            })
        }
    ).pipe(
        catchError(error => {
            // Manejo de errores consistente
            let errorMessage = 'Error desconocido';
            if (error.error) {
                try {
                    // Intenta parsear si es un string JSON
                    const errorObj = typeof error.error === 'string' ? JSON.parse(error.error) : error.error;
                    errorMessage = errorObj.message || errorObj.error || error.statusText;
                } catch (e) {
                    errorMessage = error.error || error.statusText;
                }
            }
            return throwError(() => new Error(errorMessage));
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

