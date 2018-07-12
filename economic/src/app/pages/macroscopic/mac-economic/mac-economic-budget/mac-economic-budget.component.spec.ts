import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MacEconomicBudgetComponent } from './mac-economic-budget.component';

describe('MacEconomicBudgetComponent', () => {
  let component: MacEconomicBudgetComponent;
  let fixture: ComponentFixture<MacEconomicBudgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MacEconomicBudgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MacEconomicBudgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
