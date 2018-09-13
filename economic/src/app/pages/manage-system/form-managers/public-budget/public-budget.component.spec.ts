import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicBudgetComponent } from './public-budget.component';

describe('PublicBudgetComponent', () => {
  let component: PublicBudgetComponent;
  let fixture: ComponentFixture<PublicBudgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicBudgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicBudgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
