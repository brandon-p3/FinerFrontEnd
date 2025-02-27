import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContenidoCursoComponent } from './contenido-curso.component';

describe('ContenidoCursoComponent', () => {
  let component: ContenidoCursoComponent;
  let fixture: ComponentFixture<ContenidoCursoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContenidoCursoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContenidoCursoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
