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
  resultadoEvaluacion: {
    calificacion: number,
    aciertos: number,
    preguntasTotales: number,
    mensaje: string
  } | null = null;

  constructor(
    private route: ActivatedRoute,
    private cursosService: CursosServiceService,
    private usuariosService: UsuariosService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.idCurso = params.get('id');
      if (this.idCurso) {
        this.obtenerTemasDeCurso(Number(this.idCurso));
        this.obtenerEvaluacion(Number(this.idCurso));
      }
    });

    const usuario = this.usuariosService.currentUserValue;
    this.idAlumno = usuario?.idUsuario;
  }

  obtenerTemasDeCurso(idCurso: number): void {
    this.cursosService.obtenerTemasCurso(idCurso).subscribe(
      (data) => {
        this.temas = data;

        this.temas.push({
          nombreTema: 'Evaluación Final',
          contenido: 'Responde las preguntas de la evaluación.',
          tipo: 'evaluacion',
          idTema: 0
        });

        this.mostrarTema(0);
      },
      (error) => {
        console.error('Error al obtener los temas del curso:', error);
      }
    );
  }

  mostrarTema(index: number): void {
    this.temaActual = this.temas[index];
    this.temaActualIndex = index;

    if (this.temaActual.tipo === 'evaluacion') {
      this.cargarEvaluacion();
    }
  }

  mostrarSiguienteTema(): void {
    const temaActualId = this.temas[this.temaActualIndex]?.idTema;

    if (temaActualId !== 0 && this.idAlumno && this.idCurso) {
      this.cursosService.obtenerIdInscripcion(this.idAlumno, Number(this.idCurso)).subscribe(
        (data) => {
          const idInscripcion = data[0]?.idInscripcion;
          if (idInscripcion) {
            this.cursosService.completarTema(idInscripcion, temaActualId.toString()).subscribe();
          }
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
    return this.temaActualIndex < this.temas.length - 1;
  }

  obtenerEvaluacion(idCurso: number): void {
    this.cursosService.obtenerEvaluacion(idCurso).subscribe(
      (data) => {
        this.evaluacion = data;
      },
      (error) => {
        console.error('Error al obtener la evaluación:', error);
      }
    );
  }

  cargarEvaluacion(): void {
    if (this.evaluacion && this.evaluacion.length > 0) {
      console.log('Evaluación lista');
    }
  }

  enviarEvaluacion(): void {
    const idPreguntas = Object.keys(this.respuestas).map(id => Number(id));
    const idOpciones = idPreguntas.map(id => this.respuestas[id]);

    const respuestaDTO: RespuestaDTO = {
      idEstudiante: this.idAlumno,
      idCurso: Number(this.idCurso),
      idPreguntas,
      idOpciones
    };

    this.cursosService.guardarRespuestas(respuestaDTO).subscribe(
      () => {
        this.obtenerResultadoEvaluacion();
        console.log()
      },
      (error) => {
        alert('Error al enviar la evaluación.');
      }
    );
  }

  obtenerResultadoEvaluacion(): void {
    this.cursosService.obtenerIdInscripcion(this.idAlumno, Number(this.idCurso)).subscribe(
      (data) => {
        const idInscripcion = data[0]?.idInscripcion;
        if (idInscripcion) {
          this.cursosService.verResultadoEvaluacion(idInscripcion).subscribe(
            (resultado) => {
              const preguntasTotales = resultado[0]?.preguntas_totales;
              let aciertos = resultado[0]?.aciertos;
              if (aciertos > preguntasTotales) aciertos = preguntasTotales;
              console.log(resultado);

              const calificacion = (aciertos / preguntasTotales) * 100;
              let mensaje = '';
              if (calificacion === 100) mensaje = '¡Excelente! Sacaste 100 🎉';
              else if (calificacion >= 80) mensaje = `¡Muy bien! Promedio de ${calificacion.toFixed(2)}% 😊`;
              else if (calificacion >= 60) mensaje = `Pasaste con ${calificacion.toFixed(2)}%, puedes mejorar 💪`;
              else mensaje = `Ups... No pasaste con ${calificacion.toFixed(2)}%. ¡Sigue intentando!`;

              this.resultadoEvaluacion = {
                calificacion,
                aciertos,
                preguntasTotales,
                mensaje
              };

              this.temas.push({
                nombreTema: 'Resultado de la Evaluación',
                contenido: '',
                tipo: 'resultado',
                idTema: -1
              });

              this.temaActualIndex = this.temas.length - 1;
              this.mostrarTema(this.temaActualIndex);
            },
            (error) => {
              alert('Error al obtener la puntuación.');
            }
          );
        }
      }
    );
  }

  seleccionarRespuesta(idPregunta: number, idOpcion: number): void {
    this.respuestas[idPregunta] = idOpcion;
  }
}
