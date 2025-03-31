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
    
  }

 export interface CursoEditarDTO{
  idCurso: number;
  idInstructor: number;
  descripcion: string;
  idCategoria: number;

 } 
 export interface VerCategoriasDTO {
  idCategoria: number;
  nombreCategoria: string;
  descripcion: string;

}