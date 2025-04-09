export interface Evaluacion {
    idEvaluacion: number;
    idCurso: number;
    titulo: string;
    preguntas: Pregunta[];
  }
  
  export interface Pregunta {
    idPregunta: number;
    texto: string;
    opciones: Opcion[];
  }
  
  export interface Opcion {
    idOpcion: number;
    texto: string;
    correcta: boolean;
  }
  
  export interface EvaluacionInstructorDTO {
    idCurso: number;
    titulo: string;
    preguntas: PreguntaInstructorDTO[];
  }
  
  export interface PreguntaInstructorDTO {
    texto: string;
    opciones: OpcionInstructorDTO[];
  }
  
  export interface OpcionInstructorDTO {
    texto: string;
    correcta: boolean;
  }