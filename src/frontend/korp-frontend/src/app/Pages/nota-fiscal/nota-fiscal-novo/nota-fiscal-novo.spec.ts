import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotaFiscalNovo } from './nota-fiscal-novo';
import { provideRouter } from '@angular/router';

describe('NotaFiscalNovo', () => {
  let component: NotaFiscalNovo;
  let fixture: ComponentFixture<NotaFiscalNovo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotaFiscalNovo],
      providers: [provideRouter([])],
    })
      .compileComponents();

    fixture = TestBed.createComponent(NotaFiscalNovo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
