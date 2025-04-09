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
    tituloEvaluacion: string ;  // Nombre exacto como lo usa el frontend
    preguntas: PreguntaDTO[];
  }
  
  export interface PreguntaDTO {
    pregunta: string;  
    opciones: OpcionDTO[];
  }
  
  export interface OpcionDTO {
    textoOpcion: string;  // Nombre exacto como lo usa el frontend
    verificar: boolean;   // Nombre exacto como lo usa el frontend
  }

  export interface PreguntaInstructorDTO {
    texto: string;
    opciones: OpcionInstructorDTO[];
  }
  
  export interface OpcionInstructorDTO {
    texto: string;
    correcta: boolean;
  }