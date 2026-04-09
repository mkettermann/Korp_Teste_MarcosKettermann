import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotaFiscalExcluir } from './nota-fiscal-excluir';
import { provideRouter } from '@angular/router';

describe('NotaFiscalExcluir', () => {
  let component: NotaFiscalExcluir;
  let fixture: ComponentFixture<NotaFiscalExcluir>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotaFiscalExcluir],
      providers: [provideRouter([])],
    })
      .compileComponents();

    fixture = TestBed.createComponent(NotaFiscalExcluir);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
