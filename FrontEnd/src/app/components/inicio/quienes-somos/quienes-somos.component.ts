import { Component, OnInit, PLATFORM_ID, Inject, OnDestroy} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-quienes-somos',
  templateUrl: './quienes-somos.component.html',
  styleUrl: './quienes-somos.component.css'
})
export class QuienesSomosComponent implements OnInit, OnDestroy{

  learningImages: string[] = [
    'https://cdn.forbes.com.mx/2020/08/clases-1-640x360.jpg',
    'https://udelprado.mx/wp-content/uploads/2018/12/caracteristicas-de-la-educacion-en-linea-en-mexico.jpg',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5MY1lxwiV1SJGHwATKuFv00-boQL14qwuXQ&s'
  ];

  currentSlide = 0;
  private autoSlideInterval: any;
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.startAutoSlide();
    }
  }

  ngOnDestroy() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }

  nextSlide() {
    if (!this.isBrowser) return;
    this.currentSlide = (this.currentSlide + 1) % this.learningImages.length;
  }

  prevSlide() {
    if (!this.isBrowser) return;
    this.currentSlide = (this.currentSlide - 1 + this.learningImages.length) % this.learningImages.length;
  }

  goToSlide(index: number) {
    if (!this.isBrowser) return;
    this.currentSlide = index;
  }

  private startAutoSlide() {
    if (!this.isBrowser) return;
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }
}
