import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { CursoVerDTO, VerCategoriasDTO, CursoEditarDTO, TemaDTO, SolicitudTemaEditarDTO } from '../documentos/cursoDocumento';
import { CONFIG } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class CursoServiceService {
  private apiUrl = 'http://localhost:8080/api/cursos'; // Ruta base para operaciones de cursos
  private instructorApiUrl = 'http://localhost:8080/api/curso'; // Ruta para operaciones de instructor
  private temaApiUrl = 'http://localhost:8080/api/tema';
  private solicitudTemaApiUrl = 'http://localhost:8080/api/solicitud-tema'; // Nueva URL base para solicitud de temas
  private apiUri = CONFIG.apiUrl;

  constructor(private http: HttpClient) { }

  // Métodos existentes (se mantienen igual)
  verCursosInstructor(idInstructor: number): Observable<CursoVerDTO[]> {
    const url = `${this.apiUrl}/ver/${idInstructor}`;
    return this.http.get<CursoVerDTO[]>(url);
  }

  eliminarCurso(idUsuario: number, idCurso: number): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/eliminar/${idUsuario}/${idCurso}`,
      { responseType: 'text' }
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

  editarCursoRechazado(cursoData: any): Observable<any> {
    return this.http.put(`http://localhost:8080/api/solicitud-curso/editar`, cursoData, {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      responseType: 'text'
    });
  }
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

  obtenerCategorias(): Observable<VerCategoriasDTO[]> {
    return this.http.get<VerCategoriasDTO[]>(`${this.apiUrl}/categorias`);
  }

  enviarARevision(idSolicitudCurso: number): Observable<any> {
    const params = new HttpParams().set('id_solicitud_curso', idSolicitudCurso.toString());

    return this.http.put(
      `${this.apiUrl}/solicitud-curso/enviar-a-revision`,
      null,
      {
        params: params,
        headers: new HttpHeaders({
          'Accept': 'application/json'
        })
      }
    ).pipe(
      catchError(error => {
        let errorMessage = 'Error desconocido';
        if (error.error) {
          try {
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

  verTemasSolicitadosPorCurso(idSolicitudCurso: number): Observable<TemaDTO[]> {
    const url = `${this.apiUri}/cursos/ver-solicitudes/tema`;
    return this.http.get<TemaDTO[]>(url, {
      params: {
        idSolicitudCurso: idSolicitudCurso.toString()
      }
    });
  }

  // Método actualizado para editar tema según el nuevo controlador Spring
  editarSolicitudTema(solicitudTemaDTO: SolicitudTemaEditarDTO): Observable<any> {
    return this.http.put(
      `${this.solicitudTemaApiUrl}/editar`,
      solicitudTemaDTO,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }
    ).pipe(
      catchError(this.handleError('editarSolicitudTema'))
    );
  }

  // Método anterior (puedes mantenerlo o eliminarlo según necesites)
  editarTema(idUsuario: number, idTema: number, nombreTema?: string, contenido?: string): Observable<any> {
    let queryParams = new HttpParams();
    if (nombreTema) queryParams = queryParams.append('nombreTema', nombreTema);
    if (contenido) queryParams = queryParams.append('contenido', contenido);

    return this.http.put(
      `${this.temaApiUrl}/editar/${idUsuario}/${idTema}`,
      null,
      {
        params: queryParams,
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        responseType: 'text'
      }
    ).pipe(
      catchError(this.handleError('editarTema'))
    );
  }
}