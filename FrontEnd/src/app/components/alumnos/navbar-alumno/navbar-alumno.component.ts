import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AlumnoService } from '../../../services/alumno.service';

type PageType = 'actualizar-perfil' | 'certificados' | 'historial' | 'mis-cursos';

@Component({
  selector: 'app-navbar-alumno',
  templateUrl: './navbar-alumno.component.html',
  styleUrl: './navbar-alumno.component.css'
})
export class NavbarAlumnoComponent implements OnInit {

  usuario = {
    idUsuario: 0,
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    email: '',
    contrasenia: '',
    nombreUsuario: '',
    cursosCompletados: 0
  };

  menuOpen = false;
  currentPage: PageType = 'actualizar-perfil';
  currentSection: string = 'perfil';

  constructor(private router: Router, private alumnoService: AlumnoService) {}

  ngOnInit(): void {
    const usuarioGuardado = localStorage.getItem('currentUser');
    if (usuarioGuardado) {
      this.usuario = JSON.parse(usuarioGuardado);
    }
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  guardarCambios() {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas guardar los cambios?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, guardar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#8EC3B0',
      cancelButtonColor: '#FF6B6B',
    }).then((result) => {
      if (result.isConfirmed) {
        this.ejecutarGuardado();
      }
    });
  }

  ejecutarGuardado() {
    this.alumnoService.actualizarPerfil(
      this.usuario.idUsuario,
      this.usuario.nombre,
      this.usuario.apellidoPaterno,
      this.usuario.apellidoMaterno,
      this.usuario.email,
      this.usuario.contrasenia,
      this.usuario.nombreUsuario
    ).subscribe({
      next: () => {
        Swal.fire('Éxito', 'Los cambios se guardaron correctamente', 'success');
      },
      error: () => {
        Swal.fire('Error', 'No se pudieron guardar los cambios', 'error');
      }
    });
  }

  descargarCertificado(idCertificado: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas descargar el certificado?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, descargar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#8EC3B0',
      cancelButtonColor: '#FF6B6B',
    }).then((result) => {
      if (result.isConfirmed) {
        this.alumnoService.descargarCertificado(idCertificado).subscribe({
          next: (data) => {
            const blob = new Blob([data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `certificado-${idCertificado}.pdf`;
            a.click();
            window.URL.revokeObjectURL(url);
          },
          error: () => {
            Swal.fire('Error', 'No se pudo descargar el certificado', 'error');
          }
        });
      }
    });
  }

  navigateTo(page: PageType) {
    this.currentPage = page;
    if (page === 'actualizar-perfil') {
      this.currentSection = 'perfil';
    } else if (page === 'certificados') {
      this.currentSection = 'certificados';
    } else if (page === 'historial') {
      this.currentSection = 'historial';
    } else if (page === 'mis-cursos') {
      this.currentSection = 'mis-cursos';
    }
    this.menuOpen = false;
  }

  logout() {
    console.log('Cerrando sesión...');
    localStorage.clear(); 
    this.router.navigate(['/home/inicio']);
  }
  
}
