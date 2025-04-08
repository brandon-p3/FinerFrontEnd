  import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CursosServiceService } from '../../../services/cursos-service';
import { contenidoCurso, RespuestaDTO } from '../../../documentos/cursosDocumento';
import { UsuariosService } from '../../../services/usuarios-service.service';

@Component({
  selector: 'app-contenido-curso',
  templateUrl: './contenido-curso.component.html',
  styleUrls: ['./contenido-curso.component.css']
})
export class ContenidoCursoComponent implements OnInit {
  idCurso: string | null = '';
  temas: contenidoCurso[] = [];
  temaActual: contenidoCurso | null = null;
  temaIndex: number = 0;
  temaActualIndex: number = 0;
  evaluacion: any = null;
  respuestas: { [idPregunta: number]: number } = {};
  idAlumno: number = 0;
  resultadoVisible: boolean = false;
  resultadoEvaluacion: {
    calificacion: number,
    aciertos: number,
    preguntasTotales: number,
    mensaje: string
  } | null = null;

  constructor(private route: ActivatedRoute, private cursosService: CursosServiceService, private usuariosService: UsuariosService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.idCurso = params.get('id');
      console.log('ID del curso recibido:', this.idCurso);
      if (this.idCurso) {
        this.obtenerTemasDeCurso(Number(this.idCurso));
        this.obtenerEvaluacion(Number(this.idCurso));  // Obtener evaluación usando el idCurso
      }
    });
    const usuario = this.usuariosService.currentUserValue;
    this.idAlumno = usuario?.idUsuario;
    console.log('ID de alumno usado:', this.idAlumno);
  }

  obtenerTemasDeCurso(idCurso: number): void {
    this.cursosService.obtenerTemasCurso(idCurso).subscribe(
      (data) => {
        console.log('Temas obtenidos:', data);
        this.temas = data;

        // Agregar la evaluación como un "tema" más al final de la lista
        this.temas.push({
          nombreTema: 'Evaluación Final',
          contenido: 'Responde las preguntas de la evaluación.',
          tipo: 'evaluacion',
          idTema: 0
        });

        // Mostrar el primer tema
        this.mostrarTema(0);
      },
      (error) => {
        console.error('Error al obtener los temas del curso:', error);
      }
    );
  }

  mostrarTema(index: number): void {
    this.temaActual = this.temas[index];
    this.temaIndex = index;

    // Si el tema seleccionado es la evaluación, cargar la evaluación
    if (this.temaActual.tipo === 'evaluacion') {
      this.cargarEvaluacion();
    }
  }

  mostrarSiguienteTema(): void {
    const temaActualId = this.temas[this.temaActualIndex]?.idTema;

    if (temaActualId !== 0 && this.idAlumno && this.idCurso) {
      // Obtener el idInscripcion real desde el backend
      this.cursosService.obtenerIdInscripcion(this.idAlumno, Number(this.idCurso)).subscribe(
        (data) => {
          const idInscripcion = data[0]?.idInscripcion;

          console.log('➡️ Cambiando al siguiente tema...');
          console.log('🧩 Tema actual ID:', temaActualId);
          console.log('👤 ID Alumno:', this.idAlumno);
          console.log('📘 ID Curso:', this.idCurso);
          console.log('🆔 ID Inscripción:', idInscripcion);

          if (idInscripcion) {
            this.cursosService.completarTema(idInscripcion, temaActualId.toString()).subscribe(
              response => {
                console.log('✅ Tema completado:', response);
              },
              error => {
                console.error('❌ Error al completar tema:', error);
              }
            );
          } else {
            console.error('❌ No se obtuvo idInscripción válido');
          }
        },
        error => {
          console.error('❌ Error al obtener idInscripción:', error);
        }
      );
    }

    if (this.temaActualIndex < this.temas.length - 1) {
      this.temaActualIndex++;
      this.mostrarTema(this.temaActualIndex);
    }
  }

  mostrarTemaAnterior(): void {
    if (this.temaActualIndex > 0) {
      this.temaActualIndex--;
      this.mostrarTema(this.temaActualIndex);
    }
  }

  get siguienteTemaDisponible(): boolean {
    return this.temaIndex < this.temas.length - 1;
  }

  obtenerEvaluacion(idCurso: number): void {
    this.cursosService.obtenerEvaluacion(idCurso).subscribe(
      (data) => {
        console.log('Evaluación obtenida:', data);
        this.evaluacion = data; // Aquí se aseguran de que el formato de evaluación sea el esperado
      },
      (error) => {
        console.error('Error al obtener la evaluación:', error);
      }
    );
  }

  cargarEvaluacion(): void {
    // Asegurarse de que la evaluación esté correctamente cargada
    if (this.evaluacion && this.evaluacion.length > 0) {
      console.log('Cargando evaluación:', this.evaluacion);
    }
  }

  enviarEvaluacion(): void {
    const idPreguntas = Object.keys(this.respuestas).map(id => Number(id));
    const idOpciones = idPreguntas.map(id => this.respuestas[id]);

    const respuestaDTO: RespuestaDTO = {
      idEstudiante: this.idAlumno,
      idCurso: Number(this.idCurso),
      idPreguntas: idPreguntas,
      idOpciones: idOpciones
    };

    console.log('📦 Payload a enviar:', respuestaDTO);

    this.cursosService.guardarRespuestas(respuestaDTO).subscribe(
      () => {
        console.log('✅ Respuestas guardadas');
        // Llamar a la función para obtener el resultado de la evaluación
        this.obtenerResultadoEvaluacion();
      },
      (error) => {
        console.error('❌ Error al enviar respuestas:', error);
        alert('Hubo un error al enviar la evaluación.');
      }
    );
  }

  obtenerResultadoEvaluacion(): void {
    this.cursosService.obtenerIdInscripcion(this.idAlumno, Number(this.idCurso)).subscribe(
      (data) => {
        const idInscripcion = data[0]?.idInscripcion;
        if (idInscripcion) {
          // Obtener los resultados de la evaluación
          this.cursosService.verResultadoEvaluacion(idInscripcion).subscribe(
            (resultado) => {
              console.log('🎯 Resultado:', resultado);

              // Aquí se obtienen los datos de la evaluación
              const preguntasTotales = resultado[0]?.preguntas_totales;
              let aciertos = resultado[0]?.aciertos;

              // Validar que los aciertos no superen el total de preguntas
              if (aciertos > preguntasTotales) {
                aciertos = preguntasTotales;
              }

              let calificacion = (aciertos / preguntasTotales) * 100;

              // Determinar el mensaje basado en la calificación
              let mensaje = '';
              if (calificacion === 100) mensaje = '¡Excelente! Sacaste 100 🎉';
              else if (calificacion >= 80) mensaje = `¡Muy bien! Tienes un buen promedio con ${calificacion.toFixed(2)}% 😊`;
              else if (calificacion >= 60) mensaje = `Pasaste con ${calificacion.toFixed(2)}%, pero podrías mejorar 💪`;
              else mensaje = `Ups... No pasaste con ${calificacion.toFixed(2)}%. ¡Sigue intentando!`;

              // Guardar resultado para mostrarlo en HTML
              this.resultadoEvaluacion = {
                calificacion,
                aciertos,
                preguntasTotales,
                mensaje
              };

              // Agregar el resultado como un nuevo "tema" de evaluación
              const resultadoTema: contenidoCurso = {
                nombreTema: 'Resultado de la Evaluación',
                contenido: '', // Lo mostramos en el HTML
                tipo: 'resultado',
                idTema: -1
              };

              // Agregar el tema y mostrarlo
              this.temas.push(resultadoTema);
              this.temaActualIndex = this.temas.length - 1;
              this.mostrarTema(this.temaActualIndex);
            },
            (error) => {
              console.error('❌ Error al obtener resultado:', error);
              alert('No se pudo obtener la puntuación final.');
            }
          );
        } else {
          console.error('❌ No se obtuvo idInscripción válido');
        }
      },
      (error) => {
        console.error('❌ Error al obtener idInscripción:', error);
      }
    );
  }


  seleccionarRespuesta(idPregunta: number, idOpcion: number): void {
    this.respuestas[idPregunta] = idOpcion;
    console.log(`Pregunta ${idPregunta}: opción seleccionada → ${idOpcion}`);
    console.log('Respuestas actuales:', this.respuestas);
  }

}
