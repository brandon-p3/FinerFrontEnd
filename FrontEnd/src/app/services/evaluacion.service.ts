import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { 
  EvaluacionInstructorDTO, 
  PreguntaDTO, 
  OpcionDTO,
  PreguntaInstructorDTO,
  OpcionInstructorDTO,
  Evaluacion
} from '../documentos/evaluacionDocumento';

@Injectable({
  providedIn: 'root'
})
export class EvaluacionService {
  private apiUrl = `http://localhost:8080/api/evaluaciones`;

  constructor(private http: HttpClient) { }

  crearEvaluacion(evaluacionData: EvaluacionInstructorDTO): Observable<any> {
    const backendData = this.adaptToBackendStructure(evaluacionData);
    return this.http.post(`${this.apiUrl}/crear`, backendData, {
      responseType: 'text' // Esperamos respuesta como texto
    }).pipe(
      catchError(this.handleError)
    );
  }

  private adaptToBackendStructure(frontendData: EvaluacionInstructorDTO): any {
    return {
      idCurso: frontendData.idCurso,
      tituloEvaluacion: frontendData.tituloEvaluacion,
      preguntas: frontendData.preguntas.map(pregunta => ({
        pregunta: pregunta.pregunta || '',
        opciones: pregunta.opciones.map(opcion => ({
          textoOpcion: opcion.textoOpcion,
          verificar: opcion.verificar
        }))
      }))
    };
  }
  
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Error desconocido';
    
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del servidor (puede ser texto plano o JSON)
      try {
        // Intentamos parsear el error como JSON
        const errorObj = typeof error.error === 'string' ? JSON.parse(error.error) : error.error;
        errorMessage = errorObj.message || errorObj.error || error.message;
      } catch (e) {
        // Si falla el parseo, usamos el texto plano
        errorMessage = error.error || error.message;
      }
      
      // Agregamos detalles del estado HTTP
      errorMessage = `Error ${error.status}: ${errorMessage}`;
      
      // Mensaje más descriptivo para errores 500
      if (error.status === 500) {
        errorMessage += '\n\nDetalle del error en el servidor:';
        errorMessage += `\n- URL: ${error.url}`;
        errorMessage += `\n- Mensaje: ${error.message}`;
      }
    }
    
    console.error('Error completo:', error);
    return throwError(() => new Error(errorMessage));
  }
obtenerEvaluacionPorCurso(idCurso: number): Observable<Evaluacion> {
    if (!idCurso || idCurso <= 0) {
      return throwError(() => new Error('ID de curso inválido'));
    }
    
    return this.http.get<Evaluacion>(`${this.apiUrl}/curso/${idCurso}`).pipe(
      catchError(this.handleError)
    );
  }

  editarEvaluacion(
    idEvaluacion: number,
    idPregunta: number,
    idOpcion: number,
    datosEdicion: Partial<OpcionDTO>
  ): Observable<any> {
    if (!idEvaluacion || !idPregunta || !idOpcion) {
      return throwError(() => new Error('IDs inválidos para edición'));
    }

    return this.http.put(
      `${this.apiUrl}/editar/${idEvaluacion}/${idPregunta}/${idOpcion}`,
      datosEdicion
    ).pipe(
      catchError(this.handleError)
    );
  }

  eliminarEvaluacion(idEvaluacion: number): Observable<any> {
    if (!idEvaluacion || idEvaluacion <= 0) {
      return throwError(() => new Error('ID de evaluación inválido'));
    }

    return this.http.delete(`${this.apiUrl}/eliminar/${idEvaluacion}`).pipe(
      catchError(this.handleError)
    );
  }
}