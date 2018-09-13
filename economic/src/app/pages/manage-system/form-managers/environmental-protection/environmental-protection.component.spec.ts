import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvironmentalProtectionComponent } from './environmental-protection.component';

describe('EnvironmentalProtectionComponent', () => {
  let component: EnvironmentalProtectionComponent;
  let fixture: ComponentFixture<EnvironmentalProtectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnvironmentalProtectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvironmentalProtectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
