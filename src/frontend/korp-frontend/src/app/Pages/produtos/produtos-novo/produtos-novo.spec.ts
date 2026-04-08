import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdutosNovo } from './produtos-novo';
import { provideRouter } from '@angular/router';

describe('ProdutosNovo', () => {
  let component: ProdutosNovo;
  let fixture: ComponentFixture<ProdutosNovo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProdutosNovo],
      providers: [provideRouter([])],
    })
      .compileComponents();

    fixture = TestBed.createComponent(ProdutosNovo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
