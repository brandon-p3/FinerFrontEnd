import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser'; 
import { FormsModule } from '@angular/forms'; 
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component'; 
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UsuariosAdminComponent } from './components/administrador/usuarios-admin/usuarios-admin.component';
import { FooterComponent } from './components/administrador/footer/footer.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NavbarAdminComponent } from './components/administrador/navbar-admin/navbar-admin.component';
import { DetalleInstructorAdminComponent } from './components/administrador/detalle-instructor-admin/detalle-instructor-admin.component';
import { SolicitudesAdminComponent } from './components/administrador/solicitudes-admin/solicitudes-admin.component';
import { CursosAdminComponent } from './components/administrador/cursos-admin/cursos-admin.component';

@NgModule({
  declarations: [
    AppComponent,
    UsuariosAdminComponent,
    FooterComponent,
    NavbarComponent,
    NavbarAdminComponent,
    DetalleInstructorAdminComponent,
    SolicitudesAdminComponent,
    CursosAdminComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
