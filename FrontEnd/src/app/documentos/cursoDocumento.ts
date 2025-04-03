export interface CursoDetalleNombreDTO {

tituloCurso: string;
descripcion: string;
nombreInstructor: string;
apellidoPaterno: string;
apellidoMaterno: string;
nombreCategoria: string;
}
export interface CursoVerDTO {
    idCategoria: number;
    idCurso: number;
    titulo: string;
    descripcion: string;
    estatus: string;
    origen: string;
    imagen: string; // Añade este campo
    nombreCategoria: string; // Añade este campo para mostrar el nombre
}

export interface CursoEditarDTO {
  idCurso: number;
  idInstructor: number;
  titulo: string;
  descripcion: string;
  idCategoria: number;
}

 export interface VerCategoriasDTO {
  idCategoria: number;
  nombreCategoria: string;
  descripcion: string;

}