import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MacEconomicGdpComponent } from './mac-economic-gdp.component';

describe('MacEconomicGdpComponent', () => {
  let component: MacEconomicGdpComponent;
  let fixture: ComponentFixture<MacEconomicGdpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MacEconomicGdpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MacEconomicGdpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
