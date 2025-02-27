import { Routes } from '@angular/router';
import { UsuariosAdminComponent } from './components/administrador/usuarios-admin/usuarios-admin.component';

export const routes: Routes = [
  { path: 'usuarios-admin', component: UsuariosAdminComponent },
  { path: '**', redirectTo: 'usuarios-admin' }
];
