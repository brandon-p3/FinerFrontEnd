import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitarCategoriaComponent } from './solicitar-categoria.component';

describe('SolicitarCategoriaComponent', () => {
  let component: SolicitarCategoriaComponent;
  let fixture: ComponentFixture<SolicitarCategoriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitarCategoriaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitarCategoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
