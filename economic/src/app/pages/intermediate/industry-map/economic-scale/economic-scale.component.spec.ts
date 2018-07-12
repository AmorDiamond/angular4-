import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EconomicScaleComponent } from './economic-scale.component';

describe('EconomicScaleComponent', () => {
  let component: EconomicScaleComponent;
  let fixture: ComponentFixture<EconomicScaleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EconomicScaleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EconomicScaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
