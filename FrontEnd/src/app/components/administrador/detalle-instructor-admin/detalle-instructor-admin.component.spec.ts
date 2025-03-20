import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleInstructorAdminComponent } from './detalle-instructor-admin.component';

describe('DetalleInstructorAdminComponent', () => {
  let component: DetalleInstructorAdminComponent;
  let fixture: ComponentFixture<DetalleInstructorAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleInstructorAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleInstructorAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
