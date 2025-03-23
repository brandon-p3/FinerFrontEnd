export interface AlumnoDocumento {
    nombre: string;
    apellidoPaterno: String;
    apellidoMaterno: String;
    correo: string;
    contraseña: String;
    nombreUsuario: string
}

export interface InstructorDocumento {
    nombre: string;
    apellidoPaterno: String;
    apellidoMaterno: String;
    correo: string;
    contrasenia: string;
    nombreUsuario: string;
    telefono: string;
    direccion: string;
    cedula: File;
}