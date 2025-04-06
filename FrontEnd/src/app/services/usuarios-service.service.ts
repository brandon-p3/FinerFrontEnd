import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CONFIG } from '../config/config';
import { Observable, BehaviorSubject } from 'rxjs';
import { AlumnoDocumento, InstructorDocumento } from '../documentos/usuarioDocumento';
import { Curso } from '../documentos/cursosDocumento';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private apiUri = CONFIG.apiUrl + '/administrador';
  private apiInicio = CONFIG.apiInicio + '/token';
  private apiUri3 = CONFIG.apiUrl + '/alumnos-instructor/usuarios';

  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private http: HttpClient, private router: Router) {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<any>(storedUser ? JSON.parse(storedUser) : null);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  getAlumnos(): Observable<AlumnoDocumento[]> {
    return this.http.get<AlumnoDocumento[]>(`${this.apiUri}/getUsuarios/alumnos`);
  }

  getInstructores(): Observable<InstructorDocumento[]> {
    return this.http.get<InstructorDocumento[]>(`${this.apiUri}/getUsuarios/instructores`);
  }

  iniciarSesion(nombreUsuario: string, contrasenia: string): Observable<any> {
    const url = `${this.apiInicio}/iniciar-sesion`;
    const params = {
      nombreUsuario: nombreUsuario,
      contrasenia: contrasenia
    };
    return this.http.get<any>(url, { params });
  }

  obtenerUsuarioPorId(idUsuario: number): Observable<any> {
    return this.http.get<any>(`${this.apiUri3}/${idUsuario}`);
  }

  setCurrentUser(user: any) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getUsuarioCompleto(): Observable<any> {
    const user = this.currentUserValue;
    if (!user || !user.idUsuario) {
      return new Observable(observer => observer.error('Usuario no autenticado'));
    }
    return this.obtenerUsuarioPorId(user.idUsuario);
  }  
}

