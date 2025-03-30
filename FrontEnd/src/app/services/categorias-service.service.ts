import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VerCategoriasDTO } from '../documentos/cursoDocumento';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class CategoriaServiceService {
  private apiUrl = 'http://localhost:8080/api/token'; // Ruta existente

  constructor(private http: HttpClient) { }

  obtenerCategoriasAprobadas(): Observable<VerCategoriasDTO[]> {
    return this.http.get<any>(`${this.apiUrl}/ver-categoria-aprobada`).pipe(
      map(response => response.data) // Extrae solo el array de categorías
    );
  }

  // Método para filtrar por nombre SIN requerir cambios en el backend
  obtenerCategoriaPorNombre(nombre: string): Observable<VerCategoriasDTO | undefined> {
    return new Observable(observer => {
      this.obtenerCategoriasAprobadas().subscribe({
        next: (categorias) => {
          const categoriaEncontrada = categorias.find(c => 
            c.nombreCategoria.toLowerCase().includes(nombre.toLowerCase())
          );
          observer.next(categoriaEncontrada);
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }
}