import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedInvestmentComponent } from './fixed-investment.component';

describe('FixedInvestmentComponent', () => {
  let component: FixedInvestmentComponent;
  let fixture: ComponentFixture<FixedInvestmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixedInvestmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixedInvestmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
