// alumno.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError  } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { CONFIG } from '../config/config';
import { CursoCertificadoResumenDTO } from '../documentos/cursosDocumento';


export interface VerIdInscripcionDTO {
  idInscripcion: number;
}

@Injectable({
  providedIn: 'root'
})
export class AlumnoService {
  private apiInscripcion = CONFIG.apiUrl + '/token';
  private apiUri = CONFIG.apiUrl + '/alumnos-instructor';
  private apiUrl='http://localhost:8080/api/alumno';
  private apiCursosUrl = 'http://localhost:8080/api/cursos/alumno'; // Endpoint para cursos

  constructor(private http: HttpClient) { }

  // Headers para las solicitudes HTTP
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      // Agrega aquí otros headers si son necesarios (como tokens de autenticación)
    });
  }

  obtenerCursosFinalizados(idAlumno: number): Observable<any[]> {
    const url = `${this.apiCursosUrl}/cursos-finalizados/${idAlumno}`;
    return this.http.get<{ cursos: any[] }>(url).pipe(
      map(response => response.cursos), // <- aquí extraes el array real
      catchError((error) => {
        console.error('Error al obtener cursos finalizados:', error);
        return throwError(() => error);
      })
    );
  } 
  
  descargarCertificado(idInscripcion: number): Observable<Blob> {
    const url = `${this.apiCursosUrl}/certificado/${idInscripcion}`;
    return this.http.get(url, {
      responseType: 'blob'
    }).pipe(
      catchError(error => {
        console.error('Error al descargar certificado:', error);
        return throwError(() => error);
      })
    );
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
      .set('nombreUsuario', nombreUsuario)
      .set('actualizar_contrasenia', contrasenia ? 'true' : 'false'); // Añade este parámetro
  
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
   * Busca cursos por nombre
   * @param terminoBusqueda Término de búsqueda
   * @returns Observable con la lista de cursos encontrados
   */
  buscarCursosPorNombre(nombre: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiCursosUrl}/buscar`, {
      params: { nombre },
      headers: this.getHeaders()
    }).pipe(
      catchError(error => {
        console.error('Error buscando cursos:', error);
        throw error;
      })
    );
  }

  obtenerMisCursos(idAlumno: number): Observable<any[]> {
    const url = `${this.apiCursosUrl}/mis-cursos/${idAlumno}`;
    return this.http.get<any[]>(url).pipe(
      catchError((error) => {
        console.error('Error al obtener los cursos del alumno:', error);
        Swal.fire('Error', 'No se pudieron obtener los cursos del alumno', 'error');
        throw error;
      })
    );
  }
  

  
  /**
   * Inscribirse a un curso
   */
  inscribirseCurso(idAlumno: number, idCurso: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiCursosUrl}/inscripcionCurso/${idCurso}/${idAlumno}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => {
        console.error('Error inscribiéndose al curso:', error);
        throw error;
      })
    );
  }

  bajaCursoAlumno(idInscripcion: number): Observable<any> {
    const url = `${this.apiCursosUrl}/bajaCurso/${idInscripcion}`;
    return this.http.get<any>(url).pipe(
      catchError(error => {
        let mensaje = 'Ocurrió un error inesperado.';

        if (error.status === 404) {
          mensaje = 'El ID de inscripción no es válido o no se encuentra en nuestros registros.';
        } else if (error.status === 500) {
          mensaje = 'Error en la base de datos al intentar procesar la baja.';
        }

        Swal.fire('Error', mensaje, 'error');
        return throwError(() => error);
      })
    );
  }

  /**
   * Obtiene el progreso de un alumno en un curso específico
   * @param idEstudiante ID del estudiante
   * @param idCurso ID del curso
   * @returns Observable con los datos de progreso
   */
  obtenerProgresoCurso(idEstudiante: number, idCurso: number): Observable<number> {
    return this.http.get<number>(`${this.apiUri}/progresoCurso/${idEstudiante}/${idCurso}`);
  }

  // ============== EXTRAS ===============

  obtenerIdInscripcion(idUsuario: number, idCurso: number): Observable<VerIdInscripcionDTO[]> {
    const url = `${this.apiInscripcion}/verIdInscripcion/${idUsuario}/${idCurso}`;
    return this.http.get<VerIdInscripcionDTO[]>(url).pipe(
      catchError(error => {
        console.error('Error al obtener el ID de inscripción', error);
        Swal.fire('Error', 'No se pudo obtener el ID de inscripción.', 'error');
        return throwError(() => error);
      })
    );
  }
  
}