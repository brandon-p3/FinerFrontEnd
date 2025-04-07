export interface CategoriaSolicitudDTO {
    nombreCategoria: string;  // Nombre de la categoría solicitada
    descripcion: string;      // Motivo de la solicitud de la categoría
    idInstructor: number;     // ID del instructor solicitante
    nombreInstructor?: string; // Nombre del instructor (opcional)
}
