import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MacEconomicIncomeComponent } from './mac-economic-income.component';

describe('MacEconomicIncomeComponent', () => {
  let component: MacEconomicIncomeComponent;
  let fixture: ComponentFixture<MacEconomicIncomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MacEconomicIncomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MacEconomicIncomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
