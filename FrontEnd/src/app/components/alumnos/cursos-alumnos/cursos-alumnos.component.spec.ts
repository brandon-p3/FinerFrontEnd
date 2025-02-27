import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CursosAlumnosComponent } from './cursos-alumnos.component';

describe('CursosAlumnosComponent', () => {
  let component: CursosAlumnosComponent;
  let fixture: ComponentFixture<CursosAlumnosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CursosAlumnosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CursosAlumnosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
