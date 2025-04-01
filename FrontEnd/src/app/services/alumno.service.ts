// alumno.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlumnoService {
  private apiUrl='http://localhost:8080/api/alumno';

  constructor(private http: HttpClient) { }

  // Headers para las solicitudes HTTP
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      // Agrega aquí otros headers si son necesarios (como tokens de autenticación)
    });
  }

  /**
   * Actualiza el perfil completo del alumno
   * @param idUsuario ID del usuario
   * @param nombre Nombre del alumno
   * @param apellidoPaterno Apellido paterno
   * @param apellidoMaterno Apellido materno
   * @param email Correo electrónico
   * @param contrasenia Contraseña (opcional)
   * @param nombreUsuario Nombre de usuario
   * @returns Observable con la respuesta del servidor
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
      .set('contrasenia', contrasenia || '') // Envía cadena vacía si es null/undefined
      .set('nombreUsuario', nombreUsuario);
  
    return this.http.put(`${this.apiUrl}/editar-cuenta`, null, {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded' // Cambiado a x-www-form-urlencoded
      }),
      params,
      responseType: 'text' // Espera respuesta como texto
    }).pipe(
      map(response => {
        Swal.fire('Éxito', response || 'Perfil actualizado', 'success');
        return response;
      }),
      catchError(error => {
        console.error('Error completo:', error);
        const errorMsg = error.error?.message || 
                        error.message || 
                        'Error al actualizar el perfil';
        Swal.fire('Error', errorMsg, 'error');
        throw error;
      })
    );
  }
  /**
   * Actualiza solo la contraseña del alumno
   * @param email Correo electrónico del alumno
   * @param nuevaContrasenia Nueva contraseña
   * @returns Observable con la respuesta del servidor
   */
  actualizarContrasenia(email: string, nuevaContrasenia: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/actualizar-contrasenia`, null, {
      headers: this.getHeaders(),
      params: {
        correo: email,
        nuevaContrasenia
      }
    }).pipe(
      map((response: any) => {
        Swal.fire('Éxito', 'Contraseña actualizada correctamente', 'success');
        return response;
      }),
      catchError(error => {
        console.error('Error al actualizar contraseña:', error);
        Swal.fire('Error', error.error?.message || 'Error al actualizar la contraseña', 'error');
        throw error;
      })
    );
  }

  /**
   * Genera un certificado PDF para el alumno
   * @param idInscripcion ID de la inscripción
   * @returns Observable con el blob del PDF
   */
  generarCertificado(idInscripcion: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/generar-certificado/${idInscripcion}`, {
      responseType: 'blob',
      headers: this.getHeaders()
    });
  }

  /**
   * Busca cursos por nombre
   * @param terminoBusqueda Término de búsqueda
   * @returns Observable con la lista de cursos encontrados
   */
  buscarCursoPorNombre(terminoBusqueda: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/buscar-cursos`, {
      headers: this.getHeaders(),
      params: { nombre: terminoBusqueda }
    });
  }

  /**
   * Obtiene el progreso de un alumno en un curso específico
   * @param idEstudiante ID del estudiante
   * @param idCurso ID del curso
   * @returns Observable con los datos de progreso
   */
  verProgresoAlumno(idEstudiante: number, idCurso: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/progreso`, {
      headers: this.getHeaders(),
      params: {
        idEstudiante: idEstudiante.toString(),
        idCurso: idCurso.toString()
      }
    });
  }
}