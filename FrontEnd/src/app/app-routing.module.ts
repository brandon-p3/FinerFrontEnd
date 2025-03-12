import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsuariosAdminComponent } from './components/administrador/usuarios-admin/usuarios-admin.component';
import { CursosAlumnosComponent } from './components/alumnos/cursos-alumnos/cursos-alumnos.component';
import { ContenidoCursoComponent } from './components/alumnos/contenido-curso/contenido-curso.component';
import { DescripcionCursoAlumnoComponent } from './components/alumnos/descripcion-curso-alumno/descripcion-curso-alumno.component';
import { CursosAdminComponent } from './components/administrador/cursos-admin/cursos-admin.component';
import { PerfilAlumnoComponent } from './components/alumnos/perfil-alumno/perfil-alumno.component';

export const routes: Routes = [
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
  {
    path: 'alumnos',
    children: [
      { path: 'cursos', component: CursosAlumnosComponent },
      { path: 'contenido', component: ContenidoCursoComponent },
      { path: 'descripcion/:id', component: DescripcionCursoAlumnoComponent },
      { path: 'perfil', component: PerfilAlumnoComponent },
      { path: '', redirectTo: 'cursos', pathMatch: 'full' },
      { path: '**', redirectTo: 'cursos' }
    ]
  },
  { path: '', redirectTo: 'alumnos/cursos', pathMatch: 'full' },
  { path: '**', redirectTo: 'alumnos/cursos' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
