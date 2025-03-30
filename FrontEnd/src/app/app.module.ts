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
import { InicioComponent } from './components/inicio/inicio.component';
import { SolicitarCategoriaComponent } from './components/instructores/solicitar-categoria/solicitar-categoria.component';
import { CrearCursoComponent } from './components/instructores/crear-curso/crear-curso.component';
import { withFetch } from '@angular/common/http';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { PerfilAlumnoComponent } from './components/alumnos/perfil-alumno/perfil-alumno.component';
import { FooterContactoComponent } from './components/inicio/footer-contacto/footer-contacto.component';
import { QuienesSomosComponent } from './components/inicio/quienes-somos/quienes-somos.component';
import { NavbarInicioComponent } from './components/inicio/navbar-inicio/navbar-inicio.component';
import { ContactoComponent } from './components/inicio/contacto/contacto.component';
import { CursosInstructorComponent } from './components/instructores/cursos-instructor/cursos-instructor.component';
import { CursoServiceService } from './services/curso-service.service';
import { CategoriaServiceService } from './services/categorias-service.service';


@NgModule({
  declarations: [
    AppComponent,
    UsuariosAdminComponent,
    FooterComponent,
    NavbarComponent,
    NavbarAdminComponent,
    DetalleInstructorAdminComponent,
    SolicitudesAdminComponent,
    CursosAdminComponent,
    InicioComponent,
    SolicitarCategoriaComponent,
    CrearCursoComponent,
    PerfilAlumnoComponent,
    FooterContactoComponent,
    QuienesSomosComponent,
    NavbarInicioComponent,
    ContactoComponent,
    CursosInstructorComponent

  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    NgbModule
  ],
  providers: [
    provideHttpClient(withFetch()),
    CursoServiceService,
    CategoriaServiceService

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
