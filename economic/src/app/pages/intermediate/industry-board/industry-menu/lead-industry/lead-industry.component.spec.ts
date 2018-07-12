import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadIndustryComponent } from './lead-industry.component';

describe('LeadIndustryComponent', () => {
  let component: LeadIndustryComponent;
  let fixture: ComponentFixture<LeadIndustryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadIndustryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadIndustryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
