import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormTorchComponent } from './form-torch.component';

describe('FormTorchComponent', () => {
  let component: FormTorchComponent;
  let fixture: ComponentFixture<FormTorchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormTorchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormTorchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
