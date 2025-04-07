import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

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
    cedula_pdf: string;
  };

  @Output() cerrar = new EventEmitter<void>(); 

  safeCedulaUrl?: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) {}


   //Obtiene las iniciales del nombre del instructor
    getInitials(name?: string): string {
      if (!name) return '??';
      
      const names = name.split(' ');
      if (names.length === 1) return names[0].charAt(0).toUpperCase();
      
      return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
    }
  

    //Sanea la URL para el iframe
    getSafeUrl(url?: string): SafeResourceUrl {
      if (!url) return this.sanitizer.bypassSecurityTrustResourceUrl('about:blank');
      return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }

  ngOnChanges() {
    if (this.instructor?.cedula_pdf) {
      this.safeCedulaUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.instructor.cedula_pdf);
    }
  }

  onCerrar() {
    this.cerrar.emit();
  }
}
