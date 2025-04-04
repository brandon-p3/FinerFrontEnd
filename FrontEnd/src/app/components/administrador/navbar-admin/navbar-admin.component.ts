import { Component, OnInit, HostListener } from '@angular/core';
import { Renderer2, ElementRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar-admin',
  templateUrl: './navbar-admin.component.html',
  styleUrl: './navbar-admin.component.css'
})
export class NavbarAdminComponent implements OnInit{

  isScrolled: boolean = false;

  constructor(private router: Router, private renderer: Renderer2, private el: ElementRef) {}

  ngOnInit(): void {
    // Detectar la ruta actual y marcar el enlace como activo
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.setActiveNavItem();
    });

    // Ejecutar una vez al inicio para establecer el ítem activo inicialmente
    this.setActiveNavItem();
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.isScrolled = window.scrollY > 10;
  }

  private setActiveNavItem(): void {
    const currentPath = this.router.url;
  
    setTimeout(() => {
      const navLinks = this.el.nativeElement.querySelectorAll('.navbar-nav .nav-link');
  
      navLinks.forEach((link: HTMLElement) => {
        const href = link.getAttribute('href');
        const path = href?.startsWith('http') ? href : href || '';
  
        if (currentPath === path || (path !== '/' && currentPath.startsWith(path))) {
          this.renderer.addClass(link, 'active');
          this.renderer.setAttribute(link, 'aria-current', 'page');
        } else {
          this.renderer.removeClass(link, 'active');
          this.renderer.removeAttribute(link, 'aria-current');
        }
      });
    });
  }
  
  
}
