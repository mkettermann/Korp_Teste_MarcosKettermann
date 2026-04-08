import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdutosEditar } from './produtos-editar';
import { provideRouter } from '@angular/router';

describe('ProdutosEditar', () => {
  let component: ProdutosEditar;
  let fixture: ComponentFixture<ProdutosEditar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProdutosEditar],
      providers: [provideRouter([])],
    })
      .compileComponents();

    fixture = TestBed.createComponent(ProdutosEditar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
