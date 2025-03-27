import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CONFIG } from '../config/config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlumnoService {

  private apiUri = CONFIG.apiUrl + '/api/alumno';

  constructor(private http: HttpClient) { }

  /**
   * Método para actualizar el perfil del alumno.
   */
  actualizarPerfil(
    idUsuario: number,
    nombre: string,
    apellidoPaterno: string,
    apellidoMaterno: string,
    correo: string,
    contrasenia: string,
    nombreUsuario: string
  ): Observable<any> {
    const params = new HttpParams()
      .set('idUsuario', idUsuario.toString())
      .set('nombre', nombre)
      .set('apellidoPaterno', apellidoPaterno)
      .set('apellidoMaterno', apellidoMaterno)
      .set('correo', correo)
      .set('contrasenia', contrasenia)
      .set('nombreUsuario', nombreUsuario);

    return this.http.put(`${this.apiUri}/editar-cuenta`, null, { params });
  }

  /**
   * Método para generar y descargar un certificado.
   * @param idCertificado - ID del certificado a descargar.
   * @returns Observable con el archivo del certificado en formato Blob.
   */
  generarCertificado(idCertificado: number): Observable<Blob> {
    return this.http.get(`${this.apiUri}/generar-certificado/${idCertificado}`, {
      responseType: 'blob' // Indica que la respuesta es un archivo binario
    });
  }

    /**
   * Método para obtener el progreso de un alumno en un curso específico.
   * @param idEstudiante - ID del estudiante.
   * @param idCurso - ID del curso.
   * @returns Observable con el progreso del alumno.
   */
    verProgresoAlumno(idEstudiante: number, idCurso: number): Observable<any> {
      return this.http.get(`${this.apiUri}/progresoCurso/${idEstudiante}/${idCurso}`);
    }
}