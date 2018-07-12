import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MacEconomicExpendComponent } from './mac-economic-expend.component';

describe('MacEconomicExpendComponent', () => {
  let component: MacEconomicExpendComponent;
  let fixture: ComponentFixture<MacEconomicExpendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MacEconomicExpendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MacEconomicExpendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
