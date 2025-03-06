import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsuariosAdminComponent } from './components/administrador/usuarios-admin/usuarios-admin.component';
import { PerfilAlumnoComponent } from './components/alumnos/perfil-alumno/perfil-alumno.component';

export const routes: Routes = [
  { path: 'usuarios-admin', component: UsuariosAdminComponent },
  { path: '', redirectTo: 'usuarios-admin', pathMatch: 'full' },
  { path: 'perfil-alumno', component: PerfilAlumnoComponent },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
