import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandNatureComponent } from './land-nature.component';

describe('LandNatureComponent', () => {
  let component: LandNatureComponent;
  let fixture: ComponentFixture<LandNatureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandNatureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandNatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
