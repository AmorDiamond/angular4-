import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadIndustryJiegouComponent } from './lead-industry-jiegou.component';

describe('LeadIndustryJiegouComponent', () => {
  let component: LeadIndustryJiegouComponent;
  let fixture: ComponentFixture<LeadIndustryJiegouComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadIndustryJiegouComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadIndustryJiegouComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
