import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarAlumnoComponent } from './navbar-alumno.component';

describe('NavbarAlumnoComponent', () => {
  let component: NavbarAlumnoComponent;
  let fixture: ComponentFixture<NavbarAlumnoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarAlumnoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarAlumnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
