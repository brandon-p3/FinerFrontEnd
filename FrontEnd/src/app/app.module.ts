import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
    imports: [
        AppRoutingModule,
        BrowserModule
    ],
    providers: [],
    bootstrap: [
      //AppComponent
      ]
})
export class AppModule { }
