import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Navegacao } from './navegacao';

describe('Navegacao', () => {
  let component: Navegacao;
  let fixture: ComponentFixture<Navegacao>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Navegacao]
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
