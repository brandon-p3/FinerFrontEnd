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
    const idInscripcion = `${this.idAlumno}-${this.idCurso}`;

    console.log('➡️ Cambiando al siguiente tema...');
    console.log('🧩 Tema actual ID:', temaActualId);
    console.log('👤 ID Alumno:', this.idAlumno);
    console.log('📘 ID Curso:', this.idCurso);
    console.log('🆔 ID Inscripción:', idInscripcion);

    if (temaActualId !== 0 && this.idAlumno && this.idCurso) {
      this.cursosService.completarTema(idInscripcion, temaActualId.toString()).subscribe(
        response => {
          console.log('✅ Tema completado:', response);
        },
        error => {
          console.error('❌ Error al completar tema:', error);
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

  // Función para manejar el envío de la evaluación

  enviarEvaluacion(): void {
    // Crear el arreglo de idPreguntas y idOpciones
    const idPreguntas = Object.keys(this.respuestas).map(id => Number(id));
    const idOpciones = idPreguntas.map(id => this.respuestas[id]);

    // Construir el objeto `RespuestaDTO` (payload)
    const respuestaDTO: RespuestaDTO = {
      idEstudiante: this.idAlumno,
      idCurso: Number(this.idCurso),
      idPreguntas: idPreguntas,
      idOpciones: idOpciones
    };

    // Mostrar el payload antes de enviarlo (opcional)
    console.log('📋 Respuestas seleccionadas:', this.respuestas);
    console.log('📦 Payload a enviar:', respuestaDTO);

    // Llamar al servicio para guardar las respuestas
    this.cursosService.guardarRespuestas(respuestaDTO).subscribe(
      (response) => {
        console.log('Respuestas guardadas con éxito:', response);
        alert('Evaluación enviada con éxito 🎉');
      },
      (error) => {
        console.error('Error al enviar la evaluación:', error);
        alert('Hubo un error al enviar la evaluación.');
      }
    );
  }

  seleccionarRespuesta(idPregunta: number, idOpcion: number): void {
    this.respuestas[idPregunta] = idOpcion;
    console.log(`Pregunta ${idPregunta}: opción seleccionada → ${idOpcion}`);
    console.log('Respuestas actuales:', this.respuestas);
  }

}
