import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotaFiscalEditar } from './nota-fiscal-editar';
import { provideRouter } from '@angular/router';

describe('NotaFiscalEditar', () => {
  let component: NotaFiscalEditar;
  let fixture: ComponentFixture<NotaFiscalEditar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotaFiscalEditar],
      providers: [provideRouter([])],
    })
      .compileComponents();

    fixture = TestBed.createComponent(NotaFiscalEditar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
