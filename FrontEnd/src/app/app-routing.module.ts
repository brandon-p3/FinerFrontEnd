import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsuariosAdminComponent } from './components/administrador/usuarios-admin/usuarios-admin.component';

import { CursosAlumnosComponent } from './components/alumnos/cursos-alumnos/cursos-alumnos.component';
import { ContenidoCursoComponent } from './components/alumnos/contenido-curso/contenido-curso.component';
import { DescripcionCursoAlumnoComponent } from './components/alumnos/descripcion-curso-alumno/descripcion-curso-alumno.component';

export const routes: Routes = [
  { path: 'usuarios-admin', component: UsuariosAdminComponent },
  { path: 'cursos-alumnos', component: CursosAlumnosComponent},
  { path: 'contenido-curso', component: ContenidoCursoComponent},
  { path: 'descripcion-curso-alumno', component: DescripcionCursoAlumnoComponent},
  { path: '**', redirectTo: 'usuarios-admin' }

import { CursosAdminComponent } from './components/administrador/cursos-admin/cursos-admin.component';
import { PerfilAlumnoComponent } from './components/alumnos/perfil-alumno/perfil-alumno.component';

export const routes: Routes = [
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
  
  { path: 'perfil-alumno', component: PerfilAlumnoComponent },
  // Redirección por defecto 
  { path: '**', redirectTo: 'administrador/usuarios/ver' }

];

export class AppRoutingModule { }
