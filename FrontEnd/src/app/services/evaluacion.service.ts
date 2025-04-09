import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EvaluacionService {
  private apiUrl = `http://localhost:8080/api/evaluaciones`;

  constructor(private http: HttpClient) { }

  crearEvaluacion(evaluacionData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/crear`, evaluacionData);
  }

  obtenerEvaluacionPorCurso(idCurso: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/curso/${idCurso}`);
  }

  editarEvaluacion(
    idEvaluacion: number,
    idPregunta: number,
    idOpcion: number,
    datosEdicion: any
  ): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/editar/${idEvaluacion}/${idPregunta}/${idOpcion}`,
      datosEdicion
    );
  }

  eliminarEvaluacion(idEvaluacion: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/eliminar/${idEvaluacion}`);
  }
}