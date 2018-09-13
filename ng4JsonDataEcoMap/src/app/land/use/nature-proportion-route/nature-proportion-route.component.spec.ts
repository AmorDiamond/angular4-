import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NatureProportionRouteComponent } from './nature-proportion-route.component';

describe('NatureProportionRouteComponent', () => {
  let component: NatureProportionRouteComponent;
  let fixture: ComponentFixture<NatureProportionRouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NatureProportionRouteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NatureProportionRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
