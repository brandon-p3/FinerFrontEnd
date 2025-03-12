import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgModule } from '@angular/core';
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

})
export class AppModule { }


