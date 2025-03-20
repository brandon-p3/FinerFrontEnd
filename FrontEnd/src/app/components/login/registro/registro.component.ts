import { Component } from '@angular/core';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  showInstructorFields: boolean = false; 

  toggleInstructorFields() {
    this.showInstructorFields = !this.showInstructorFields;
  }
}