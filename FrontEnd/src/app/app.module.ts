import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { bootstrapApplication } from '@angular/platform-browser';  // Importar bootstrapApplication

@NgModule({
  imports: [
    AppRoutingModule,
    FormsModule,  // No es necesario importar BrowserModule aquí
  ],
  providers: [],
})
export class AppModule { }


