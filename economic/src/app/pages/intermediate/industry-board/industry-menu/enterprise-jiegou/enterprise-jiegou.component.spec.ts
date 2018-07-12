import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterpriseJiegouComponent } from './enterprise-jiegou.component';

describe('EnterpriseJiegouComponent', () => {
  let component: EnterpriseJiegouComponent;
  let fixture: ComponentFixture<EnterpriseJiegouComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnterpriseJiegouComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterpriseJiegouComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
