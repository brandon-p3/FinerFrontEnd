import { Component, HostListener  } from '@angular/core';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-navbar-inicio',
  templateUrl: './navbar-inicio.component.html',
  styleUrl: './navbar-inicio.component.css'
})
export class NavbarInicioComponent {

  constructor(private router: Router) {} 
  isScrolled = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  navigateToLogin() {
    this.router.navigate(['/home/login']); 
  }

  navigateToRegister() {
    this.router.navigate(['/home/registro']); 
  }

}
