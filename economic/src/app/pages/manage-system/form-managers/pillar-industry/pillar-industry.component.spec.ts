import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PillarIndustryComponent } from './pillar-industry.component';

describe('PillarIndustryComponent', () => {
  let component: PillarIndustryComponent;
  let fixture: ComponentFixture<PillarIndustryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PillarIndustryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PillarIndustryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
