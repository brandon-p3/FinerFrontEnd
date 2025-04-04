export interface CursoDetalleNombreDTO {

tituloCurso: string;
descripcion: string;
nombreInstructor: string;
apellidoPaterno: string;
apellidoMaterno: string;
nombreCategoria: string;
}
export interface CursoVerDTO {
  idCurso: number;
  titulo: string;
  descripcion: string;
  estatus: string;
  origen: string;
  imagen: string;
  categoria: string; 
}

export interface CursoEditarDTO {
  idCurso: number;
  idInstructor: number;
  titulo: string;
  descripcion: string;
  imagen:string;
  idCategoria: number;
  
}

 export interface VerCategoriasDTO {
  idCategoria: number;
  nombreCategoria: string;
  descripcion: string;

}