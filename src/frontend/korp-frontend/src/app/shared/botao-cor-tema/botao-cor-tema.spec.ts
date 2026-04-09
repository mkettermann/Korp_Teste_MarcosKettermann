import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BotaoCorTema } from './botao-cor-tema';
import { provideRouter } from '@angular/router';

describe('BotaoCorTema', () => {
  let component: BotaoCorTema;
  let fixture: ComponentFixture<BotaoCorTema>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BotaoCorTema],
      providers: [provideRouter([])],
    })
      .compileComponents();

    fixture = TestBed.createComponent(BotaoCorTema);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
