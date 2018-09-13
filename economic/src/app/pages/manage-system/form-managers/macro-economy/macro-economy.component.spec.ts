import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MacroEconomyComponent } from './macro-economy.component';

describe('MacroEconomyComponent', () => {
  let component: MacroEconomyComponent;
  let fixture: ComponentFixture<MacroEconomyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MacroEconomyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MacroEconomyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
