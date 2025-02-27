import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CursosInstructorComponent } from './cursos-instructor.component';

describe('CursosInstructorComponent', () => {
  let component: CursosInstructorComponent;
  let fixture: ComponentFixture<CursosInstructorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CursosInstructorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CursosInstructorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
