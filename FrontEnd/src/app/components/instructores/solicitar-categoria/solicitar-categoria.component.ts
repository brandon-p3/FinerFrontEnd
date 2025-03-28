import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-solicitar-categoria',
  templateUrl: './solicitar-categoria.component.html',
  styleUrls: ['./solicitar-categoria.component.css']
})
export class SolicitarCategoriaComponent {
  nombreCategoria: string = '';
  descripcion: string = '';


  @Output() cerrar = new EventEmitter<void>();  // ✅ Evento para cerrar el modal

  cerrarModal() {
    this.cerrar.emit();  // ✅ Emite evento para cerrar el modal
  }
}
