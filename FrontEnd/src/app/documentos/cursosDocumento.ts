export interface Curso {
    idCurso: number;
    titulo: string;
    tituloCurso: string;
    descripcion: string;
    nombreInstructor: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    nombreCategoria: string
    imagen: string;
    instructor: string;
    categoria: string;
    cantidadTemas: string;


}

export interface contenidoCurso{
    idTema: number;
    nombreTema: string;
    contenido: string;
    tipo?: string;

}

export interface RespuestaDTO {
  idEstudiante: number;
  idCurso: number;
  idPreguntas: number[];
  idOpciones: number[];
}

export interface evaluacionC{
    idEvaluacion: number;
}

export interface CategoriaCursos {
    tituloCurso: string;
    descripcion: string;
    nombreInstructor: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    nombreCategoria: string
}
