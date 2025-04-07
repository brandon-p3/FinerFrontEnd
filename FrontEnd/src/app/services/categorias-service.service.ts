import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { VerCategoriasDTO } from '../documentos/cursoDocumento';
import { CategoriaSolicitudDTO } from '../documentos/categoriasDocumento';

@Injectable({
  providedIn: 'root'
})
export class CategoriaServiceService {
  private apiUrl = 'http://localhost:8080/api/token';
  private apiSolicitudUrl = 'http://localhost:8080/api/categorias';

  constructor(private http: HttpClient) { }

  obtenerCategoriasAprobadas(): Observable<VerCategoriasDTO[]> {
    return this.http.get<VerCategoriasDTO[]>(`${this.apiUrl}/ver-categoria-aprobada`).pipe(
      catchError(this.handleError<VerCategoriasDTO[]>('obtenerCategoriasAprobadas', []))
    );
  }

  solicitarNuevaCategoria(nombre: string, descripcion: string): Observable<{success: boolean, message?: string, error?: string}> {
    const currentUserStr = localStorage.getItem('currentUser') || '{}';
    const currentUser = JSON.parse(currentUserStr);
    
    const solicitud: CategoriaSolicitudDTO = {
      nombreCategoria: nombre,
      descripcion: descripcion,
      idInstructor: currentUser.idUsuario,
      nombreInstructor: currentUser.nombre || currentUser.username
    };

    if (!solicitud.idInstructor) {
      return of({ 
        success: false, 
        error: 'No se pudo identificar al instructor' 
      });
    }

    return this.http.post(
      `${this.apiSolicitudUrl}/solicitar`,
      solicitud,
      {
        headers: new HttpHeaders({'Content-Type': 'application/json'}),
        responseType: 'text' // Esperamos una respuesta de texto
      }
    ).pipe(
      map((response: string) => {
        // Manejar respuesta de texto exitosa (código 201)
        return {
          success: true,
          message: response // El mensaje directo del backend
        };
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Error al enviar solicitud:', error);
        let errorMessage = 'Error al enviar la solicitud';
        
        // Manejar diferentes formatos de error
        if (typeof error.error === 'string') {
          errorMessage = error.error;
        } else if (error.message) {
          errorMessage = error.message;
        }

        return of({ 
          success: false,
          error: errorMessage
        });
      })
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);
      return of(result as T);
    };
  }
}