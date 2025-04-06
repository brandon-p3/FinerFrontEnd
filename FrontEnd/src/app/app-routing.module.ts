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
import { InicioComponent } from './components/inicio/inicio.component';
import { CursosInstructorComponent } from './components/instructores/cursos-instructor/cursos-instructor.component';
import { CrearCursoComponent } from './components/instructores/crear-curso/crear-curso.component';
import { SolicitudesAdminComponent } from './components/administrador/solicitudes-admin/solicitudes-admin.component';
import { QuienesSomosComponent } from './components/inicio/quienes-somos/quienes-somos.component';
import { ContactoComponent } from './components/inicio/contacto/contacto.component';
import { PerfilInstructorComponent } from './components/instructores/perfil-instructor/perfil-instructor.component';


export const routes: Routes = [

  { path: '', redirectTo: 'home/inicio', pathMatch: 'full' },


  { path: 'home/inicio', component: InicioComponent },
  { path: 'home/quienesSomos', component: QuienesSomosComponent},
  { path: 'home/contacto', component: ContactoComponent },
  { path: 'home/login', component: LoginComponent },
  { path: 'home/registro', component: RegistroComponent },


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
      },
      {
        path: 'solicitudes',
        children: [
          { path: 'ver', component: SolicitudesAdminComponent }
        ]
      }
    ]
  },

  {
    path: 'alumnos',
    children: [
      { path: 'cursos', component: CursosAlumnosComponent },
      { path: 'contenido/:id', component: ContenidoCursoComponent },
      { path: 'descripcion/:id', component: DescripcionCursoAlumnoComponent },
      { path: 'perfil', component: PerfilAlumnoComponent },
      { path: '', redirectTo: 'cursos', pathMatch: 'full' }
    ]
  },
    // Rutas para instructor
 {
   path: 'instructor',
   children: [
      { path: 'cursos', component: CursosInstructorComponent },
      { path: 'crear-curso', component: CrearCursoComponent },
      { path: 'perfil', component: PerfilInstructorComponent},
      { path: '', redirectTo: 'cursos', pathMatch: 'full' }
      ]
    },
  { path: '', redirectTo: 'alumnos/cursos', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
