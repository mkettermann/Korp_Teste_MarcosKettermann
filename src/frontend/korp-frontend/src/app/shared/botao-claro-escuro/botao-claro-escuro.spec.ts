import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BotaoClaroEscuro } from './botao-claro-escuro';
import { provideRouter } from '@angular/router';

describe('BotaoClaroEscuro', () => {
  let component: BotaoClaroEscuro;
  let fixture: ComponentFixture<BotaoClaroEscuro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BotaoClaroEscuro],
      providers: [provideRouter([])],
    })
      .compileComponents();

    fixture = TestBed.createComponent(BotaoClaroEscuro);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
