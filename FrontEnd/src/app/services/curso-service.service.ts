import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CursoVerDTO, VerCategoriasDTO, CursoEditarDTO } from '../documentos/cursoDocumento';

@Injectable({
  providedIn: 'root'
})
export class CursoServiceService {
  private apiUrl = 'http://localhost:8080/api/cursos'; // Ruta base para operaciones de cursos
  private instructorApiUrl = 'http://localhost:8080/api/curso'; // Ruta para operaciones de instructor

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

editarCurso(cursoData: CursoEditarDTO): Observable<any> {
  return this.http.put(`${this.apiUrl}/editar`, cursoData, {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      responseType: 'text'
  });
}

  // Nuevos métodos para creación de cursos
  crearCurso(
    idUsuarioInstructor: number,
    idCategoria: number,
    tituloCurso: string,
    descripcion: string
  ): Observable<any> {
    const params = new HttpParams()
      .set('idUsuarioInstructor', idUsuarioInstructor.toString())
      .set('idCategoria', idCategoria.toString())
      .set('tituloCurso', tituloCurso)
      .set('descripcion', descripcion);
  
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

  // Método para enviar el curso completo a revisión
  enviarCursoCompleto(cursoCompleto: any): Observable<any> {
    return this.http.post(`${this.instructorApiUrl}/enviar-revision`, cursoCompleto, {
      responseType: 'text'
    });
  }

  // Método para solicitar nueva categoría
  solicitarNuevaCategoria(nombreCategoria: string, descripcion: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/solicitar-categoria`, {
      nombreCategoria,
      descripcion
    }, {
      responseType: 'text'
    });
  }
}