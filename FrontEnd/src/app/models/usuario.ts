export interface UsuarioBase {
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    correo: string;
    contrasenia: string;
    nombreUsuario: string;
  }
  
  export interface Alumno extends UsuarioBase {
  }
  
  export interface Instructor extends UsuarioBase {
    telefono: string;
    direccion: string;
    cedula: string;
  }
  
  export type Usuario = Alumno | Instructor;