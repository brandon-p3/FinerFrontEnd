import { NgModule } from '@angular/core';
<<<<<<< HEAD
import { FormsModule } from '@angular/forms';

import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';  // Importar bootstrapApplication

@NgModule({

    imports: [
        AppRoutingModule,
        BrowserModule,
        FormsModule,
    ],
    providers: [],
    bootstrap: [
      //AppComponent
      ],

=======
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
>>>>>>> 2ce549773846d4b02620a07dec044e61e6adb447
})
export class AppModule { }

// En lugar de declarar bootstrap en AppModule, usas bootstrapApplication
bootstrapApplication(AppComponent);
