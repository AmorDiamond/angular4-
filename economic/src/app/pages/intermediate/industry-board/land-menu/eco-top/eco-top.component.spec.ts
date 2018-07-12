import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EcoTopComponent } from './eco-top.component';

describe('EcoTopComponent', () => {
  let component: EcoTopComponent;
  let fixture: ComponentFixture<EcoTopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EcoTopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EcoTopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
