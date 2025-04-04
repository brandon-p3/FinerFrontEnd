import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CONFIG } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class InstructorService {

  private apiUri = CONFIG.apiUrl + '/instructor';

  constructor(private http: HttpClient) { }

  actualizarPerfilInstructor(
    idUsuario: number,
    nombre: string,
    apellidoPaterno: string,
    apellidoMaterno: string,
    correo: string,
    telefono: string,
    direccion: string,
    contrasenia: string,
    actualizarContrasenia: boolean, 
    nombreUsuario?: string
  ): Observable<string> {
    
    let params = new HttpParams()
      .set('idUsuario', idUsuario.toString())
      .set('nombre', nombre)
      .set('apellidoPaterno', apellidoPaterno)
      .set('apellidoMaterno', apellidoMaterno)
      .set('correo', correo)
      .set('telefono', telefono)
      .set('direccion', direccion)
      .set('contrasenia', contrasenia) // Ahora se envía la contraseña
      .set('actualizar_contrasenia', actualizarContrasenia.toString()); // Se envía el booleano
  
    if (nombreUsuario) {
      params = params.set('nombreUsuario', nombreUsuario);
    }
  
    return this.http.put<string>(`${this.apiUri}/editar-cuenta`, null, { params });
  }
  
}
