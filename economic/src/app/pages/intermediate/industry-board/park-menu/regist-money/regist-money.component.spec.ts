import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistMoneyComponent } from './regist-money.component';

describe('RegistMoneyComponent', () => {
  let component: RegistMoneyComponent;
  let fixture: ComponentFixture<RegistMoneyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistMoneyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistMoneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
