import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CursoVerDTO } from '../documentos/cursoDocumento';

@Injectable({
  providedIn: 'root'
})
export class CursoServiceService {
  private apiUrl = 'http://localhost:8080/api/cursos/ver'; // Ruta del API

  constructor(private http: HttpClient) { }

  verCursosInstructor(idInstructor: number): Observable<CursoVerDTO[]> {
    const url = `${this.apiUrl}/${idInstructor}`;
    console.log('URL de la petición:', url);
    return this.http.get<CursoVerDTO[]>(url);
  }

  eliminarCurso(idCurso: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${idCurso}`);
  }
}
