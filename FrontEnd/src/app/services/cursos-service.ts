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
  private apiUrl = 'http://localhost:8080/api/cursos/alumno/temasCurso';
  private apiUrlE = 'http://localhost:8080/api/evaluacion/alumno/verEvaluacion/2';
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



}
