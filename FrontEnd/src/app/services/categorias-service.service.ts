import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { VerCategoriasDTO } from '../documentos/cursoDocumento';
import { catchError, map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class CategoriaServiceService {
  private apiUrl = 'http://localhost:8080/api/token'; // Ruta existente

  constructor(private http: HttpClient) { }

  obtenerCategoriasAprobadas(): Observable<VerCategoriasDTO[]> {
    return this.http.get<VerCategoriasDTO[]>(`${this.apiUrl}/ver-categoria-aprobada`).pipe(
      catchError(error => {
        console.error('Error al cargar categorías:', error);
        return of([]); // Retorna un array vacío en caso de error
      })
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