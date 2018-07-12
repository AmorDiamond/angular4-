import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InefficientLandComponent } from './inefficient-land.component';

describe('InefficientLandComponent', () => {
  let component: InefficientLandComponent;
  let fixture: ComponentFixture<InefficientLandComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InefficientLandComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InefficientLandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
