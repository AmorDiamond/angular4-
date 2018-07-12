import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewIndustryFenbuComponent } from './new-industry-fenbu.component';

describe('NewIndustryFenbuComponent', () => {
  let component: NewIndustryFenbuComponent;
  let fixture: ComponentFixture<NewIndustryFenbuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewIndustryFenbuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewIndustryFenbuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
