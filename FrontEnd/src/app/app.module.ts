import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser'; // Importa BrowserModule
import { FormsModule } from '@angular/forms'; // Importa FormsModule para ngModel
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component'; // Importa tu componente standalone
import { bootstrapApplication } from '@angular/platform-browser';  // Importar bootstrapApplication
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgbModule
  ],
  providers: [],
})
export class AppModule { }

// En lugar de declarar bootstrap en AppModule, usas bootstrapApplication
bootstrapApplication(AppComponent);
