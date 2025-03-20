import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//Components
import { UsuariosAdminComponent } from './components/administrador/usuarios-admin/usuarios-admin.component';
import { LoginComponent} from './components/login/login/login.component';
import { RegistroComponent } from './components/login/registro/registro.component';
import { CursosAlumnosComponent } from './components/alumnos/cursos-alumnos/cursos-alumnos.component';
import { ContenidoCursoComponent } from './components/alumnos/contenido-curso/contenido-curso.component';
import { DescripcionCursoAlumnoComponent } from './components/alumnos/descripcion-curso-alumno/descripcion-curso-alumno.component';
import { CursosAdminComponent } from './components/administrador/cursos-admin/cursos-admin.component';
import { PerfilAlumnoComponent } from './components/alumnos/perfil-alumno/perfil-alumno.component';
import { CursosInstructorComponent } from './components/instructores/cursos-instructor/cursos-instructor.component';
import { CrearCursoComponent } from './components/instructores/crear-curso/crear-curso.component';


// Rutas combinadas
export const routes: Routes = [
  { path: '', redirectTo: 'usuarios-admin', pathMatch: 'full' },

  {
    path: 'usuarios-admin',
    component: UsuariosAdminComponent
  },

  { path: 'usuarios-admin/login/login',
    component: LoginComponent
   },

  { path: 'usuarios-admin/registro',
    component: RegistroComponent
  },
  // Rutas para el administrador
  {
    path: 'administrador',
    children: [
      {
        path: 'usuarios',
        children: [
          { path: 'ver', component: UsuariosAdminComponent }
        ]
      },
      {
        path: 'cursos',
        children: [
          { path: 'ver', component: CursosAdminComponent }
        ]
      }
    ]
  },

  // Rutas para los alumnos
  { path: 'cursos-alumnos', component: CursosAlumnosComponent },
  { path: 'contenido-curso', component: ContenidoCursoComponent },
  { path: 'descripcion-curso-alumno', component: DescripcionCursoAlumnoComponent },
  { path: 'perfil-alumno', component: PerfilAlumnoComponent },


  //Rutas para el instructor
  {path: 'cursos-instructor', component: CursosInstructorComponent},
  {path: 'crear-curso', component:CrearCursoComponent},

  // Redirección por defecto
  { path: '**', redirectTo: 'administrador/usuarios/ver' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
