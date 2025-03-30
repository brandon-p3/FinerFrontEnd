import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-detalle-instructor-admin',
  templateUrl: './detalle-instructor-admin.component.html',
  styleUrls: ['./detalle-instructor-admin.component.css']
})
export class DetalleInstructorAdminComponent {
  @Input() instructor!: { 
    nombre: string;
    correo: string;
    telefono: string;
    direccion: string;
  };

  @Output() cerrar = new EventEmitter<void>(); 

  onCerrar() {  
    this.cerrar.emit();
  }
}
