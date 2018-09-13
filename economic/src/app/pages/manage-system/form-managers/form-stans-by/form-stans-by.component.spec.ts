import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormStansByComponent } from './form-stans-by.component';

describe('FormStansByComponent', () => {
  let component: FormStansByComponent;
  let fixture: ComponentFixture<FormStansByComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormStansByComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormStansByComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
