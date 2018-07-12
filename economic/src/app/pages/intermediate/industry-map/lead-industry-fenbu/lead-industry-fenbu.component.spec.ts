import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadIndustryFenbuComponent } from './lead-industry-fenbu.component';

describe('LeadIndustryFenbuComponent', () => {
  let component: LeadIndustryFenbuComponent;
  let fixture: ComponentFixture<LeadIndustryFenbuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadIndustryFenbuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadIndustryFenbuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
