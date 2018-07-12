import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MacEconomicInvestComponent } from './mac-economic-invest.component';

describe('MacEconomicInvestComponent', () => {
  let component: MacEconomicInvestComponent;
  let fixture: ComponentFixture<MacEconomicInvestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MacEconomicInvestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MacEconomicInvestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
