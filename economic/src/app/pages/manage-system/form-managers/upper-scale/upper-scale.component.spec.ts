import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpperScaleComponent } from './upper-scale.component';

describe('UpperScaleComponent', () => {
  let component: UpperScaleComponent;
  let fixture: ComponentFixture<UpperScaleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpperScaleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpperScaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
