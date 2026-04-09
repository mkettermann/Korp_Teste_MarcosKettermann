import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdutosExcluir } from './produtos-excluir';
import { provideRouter } from '@angular/router';

describe('ProdutosExcluir', () => {
  let component: ProdutosExcluir;
  let fixture: ComponentFixture<ProdutosExcluir>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProdutosExcluir],
      providers: [provideRouter([{ path: 'produtos', component: ProdutosExcluir }])],
    })
      .compileComponents();

    fixture = TestBed.createComponent(ProdutosExcluir);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
