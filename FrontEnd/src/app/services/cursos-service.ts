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
}
