import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Navegacao } from './navegacao';
import { provideRouter } from '@angular/router';

describe('Navegacao', () => {
  let component: Navegacao;
  let fixture: ComponentFixture<Navegacao>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Navegacao],
      providers: [provideRouter([])],
    })
      .compileComponents();

    fixture = TestBed.createComponent(Navegacao);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
