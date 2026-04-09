import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RotaNotaFiscal } from './nota-fiscal';
import { provideRouter } from '@angular/router';

describe('RotaNotaFiscal', () => {
  let component: RotaNotaFiscal;
  let fixture: ComponentFixture<RotaNotaFiscal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RotaNotaFiscal],
      providers: [provideRouter([])],
    })
      .compileComponents();

    fixture = TestBed.createComponent(RotaNotaFiscal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
