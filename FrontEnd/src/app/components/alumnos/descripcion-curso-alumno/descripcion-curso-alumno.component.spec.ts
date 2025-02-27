import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescripcionCursoAlumnoComponent } from './descripcion-curso-alumno.component';

describe('DescripcionCursoAlumnoComponent', () => {
  let component: DescripcionCursoAlumnoComponent;
  let fixture: ComponentFixture<DescripcionCursoAlumnoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DescripcionCursoAlumnoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DescripcionCursoAlumnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
