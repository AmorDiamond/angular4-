import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPraiseComponent } from './form-praise.component';

describe('FormPraiseComponent', () => {
  let component: FormPraiseComponent;
  let fixture: ComponentFixture<FormPraiseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormPraiseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormPraiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
