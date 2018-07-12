import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MacroscopicComponent } from './macroscopic.component';

describe('MacroscopicComponent', () => {
  let component: MacroscopicComponent;
  let fixture: ComponentFixture<MacroscopicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MacroscopicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MacroscopicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
