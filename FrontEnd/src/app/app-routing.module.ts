import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsuariosAdminComponent } from './components/administrador/usuarios-admin/usuarios-admin.component';
import { LoginComponent} from './components/login/login/login.component';
import { RegistroComponent } from './components/login/registro/registro.component';

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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
