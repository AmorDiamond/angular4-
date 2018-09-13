import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicExpenditureComponent } from './public-expenditure.component';

describe('PublicExpenditureComponent', () => {
  let component: PublicExpenditureComponent;
  let fixture: ComponentFixture<PublicExpenditureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicExpenditureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicExpenditureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
