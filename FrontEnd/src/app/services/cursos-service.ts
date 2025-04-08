import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CONFIG } from '../config/config';
import { Curso } from '../documentos/cursosDocumento';

@Injectable({
  providedIn: 'root'
})
export class CursosServiceService {

  private apiUri = CONFIG.apiUrl;
  private apiUri2 = CONFIG.apiUrl + '/cursos';
  private apiUrlA = 'http://localhost:8080/api/cursos/alumno';
  private apiUrl = 'http://localhost:8080/api/cursos/alumno/temasCurso';
  private apiUrlE = 'http://localhost:8080/api/evaluacion/alumno/verEvaluacion';
  // api/evaluacion/alumno
  constructor(private http: HttpClient) { }

  getCursos(): Observable<Curso[]> {
    return this.http.get<Curso[]>(`${this.apiUri}/token/ver-cursos`);
  }

  buscarCursoPorNombre(nombreCurso: string): Observable<Curso[]> {
    return this.http.get<Curso[]>(`${this.apiUri2}/alumno/curso/${nombreCurso}`);
  }

  filtrarCursoPorCategoria(categoria: string): Observable<Curso[]> {
    return this.http.get<Curso[]>(`${this.apiUri2}/filtrar-categoria/${categoria}`);
  }

  obtenerDetalles(titulo: string): Observable<Curso[]> {
    return this.http.get<Curso[]>(`${this.apiUri}/cursos/alumno/detalles/${titulo}`);
  }

  obtenerTemas(idCurso: number): Observable<Curso[]> {
  return this.http.get<Curso[]>(`${this.apiUri}/cursos/alumno/temasCurso/${idCurso}`);
  }

  obtenerTemasCurso(idCurso: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${idCurso}`);
  }

  obtenerEvaluacion(idEvaluacion: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrlE}/${idEvaluacion}`);
  }

  inscribirAlumno(idAlumno: number, idCurso: number): Observable<any> {
    const url = `http://localhost:8080/api/cursos/alumno/inscripcionCurso/${idCurso}/${idAlumno}`;
    return this.http.get(url);
  }

  completarTema(idInscripcion: string, idTema: string): Observable<string> {
    const url = `${this.apiUrlA}/completar-tema/${idInscripcion}/${idTema}`;
    return this.http.get(url, { responseType: 'text' });
  }

  obtenerIdInscripcion(idUsuario: number, idCurso: number): Observable<any> {
    return this.http.get<any>(`${this.apiUri}/token/verIdInscripcion/${idUsuario}/${idCurso}`);
  }

  guardarRespuestas(respuestaDTO: any): Observable<any> {
    return this.http.post('http://localhost:8080/api/evaluacion/alumno/guardarRespuesta', respuestaDTO);
  }


  enviarEvaluacion(idEvaluacion: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrlE}/${idEvaluacion}`);
  }
//|----------------------------------------------------------------

verResultadoEvaluacion(idInscripcion: number) {
  return this.http.get<any>(`${this.apiUrlA}/resultadoEvaluacion/${idInscripcion}`);
}








}
