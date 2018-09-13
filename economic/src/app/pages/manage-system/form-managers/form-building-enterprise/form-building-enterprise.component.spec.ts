import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormBuildingEnterpriseComponent } from './form-building-enterprise.component';

describe('FormBuildingEnterpriseComponent', () => {
  let component: FormBuildingEnterpriseComponent;
  let fixture: ComponentFixture<FormBuildingEnterpriseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormBuildingEnterpriseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormBuildingEnterpriseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
