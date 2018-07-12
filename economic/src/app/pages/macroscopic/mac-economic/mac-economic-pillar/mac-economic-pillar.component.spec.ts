import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MacEconomicPillarComponent } from './mac-economic-pillar.component';

describe('MacEconomicPillarComponent', () => {
  let component: MacEconomicPillarComponent;
  let fixture: ComponentFixture<MacEconomicPillarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MacEconomicPillarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MacEconomicPillarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
