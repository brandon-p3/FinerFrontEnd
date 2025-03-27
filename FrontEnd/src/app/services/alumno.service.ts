import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CONFIG } from '../config/config';
import { AlumnoDocumento } from '../documentos/usuarioDocumento';

@Injectable({
  providedIn: 'root'
})
export class AlumnoService {
  private apiUri = CONFIG.apiUrl + '/api/alumno';

  constructor(private http: HttpClient) { }

  /**
   * Actualiza el perfil del alumno
   * @param idUsuario ID del usuario a actualizar
   * @param nombre Nuevo nombre
   * @param apellidoPaterno Nuevo apellido paterno
   * @param apellidoMaterno Nuevo apellido materno
   * @param nombreUsuario Nuevo nombre de usuario
   * @param correo Nuevo correo electrónico
   * @param contrasenia Nueva contraseña
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
    const params = {
      idUsuario: idUsuario.toString(),
      nombre,
      apellidoPaterno,
      apellidoMaterno,
      correo,
      contrasenia,
      nombreUsuario
    };

    return this.http.put(`${this.apiUri}/editar-cuenta`, null, { params });
  }

  /**
   * Actualiza solo la contraseña del alumno
   * @param correo Correo electrónico del alumno
   * @param nuevaContrasenia Nueva contraseña
   * @returns Observable con la respuesta del servidor
   */
  actualizarContrasenia(correo: string, nuevaContrasenia: string): Observable<any> {
    const params = {
      correo,
      nuevaContrasenia
    };

    return this.http.put(`${this.apiUri}/actualizar-contrasenia`, null, { params });
  }

  /**
   * Genera un certificado para el alumno
   * @param idInscripcion ID de la inscripción
   * @returns Observable con el PDF del certificado
   */
  generarCertificado(idInscripcion: number): Observable<Blob> {
    return this.http.get(`${this.apiUri}/generar-certificado/${idInscripcion}`, {
      responseType: 'blob'
    });
  }

  /**
   * Busca cursos por nombre
   * @param termino Término de búsqueda
   * @returns Observable con la lista de cursos encontrados
   */
  buscarCursoPorNombre(termino: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUri}/buscar-cursos`, {
      params: { termino }
    });
  }

  /**
   * Obtiene el progreso de un alumno en un curso específico
   * @param idEstudiante ID del estudiante
   * @param idCurso ID del curso
   * @returns Observable con el progreso del alumno
   */
  verProgresoAlumno(idEstudiante: number, idCurso: number): Observable<any> {
    return this.http.get<any>(`${this.apiUri}/progreso`, {
      params: {
        idEstudiante: idEstudiante.toString(),
        idCurso: idCurso.toString()
      }
    });
  }
}