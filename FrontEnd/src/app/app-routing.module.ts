import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsuariosAdminComponent } from './components/administrador/usuarios-admin/usuarios-admin.component';
import { CursosAdminComponent } from './components/administrador/cursos-admin/cursos-admin.component';

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

  // Redirección por defecto 
  { path: '**', redirectTo: 'administrador/usuarios/ver' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
