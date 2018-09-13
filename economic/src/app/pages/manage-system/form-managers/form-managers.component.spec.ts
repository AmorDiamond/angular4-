import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormManagersComponent } from './form-managers.component';

describe('FormManagersComponent', () => {
  let component: FormManagersComponent;
  let fixture: ComponentFixture<FormManagersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormManagersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormManagersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
