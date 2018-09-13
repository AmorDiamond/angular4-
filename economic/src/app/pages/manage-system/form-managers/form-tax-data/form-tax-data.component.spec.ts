import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormTaxDataComponent } from './form-tax-data.component';

describe('FormTaxDataComponent', () => {
  let component: FormTaxDataComponent;
  let fixture: ComponentFixture<FormTaxDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormTaxDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormTaxDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
