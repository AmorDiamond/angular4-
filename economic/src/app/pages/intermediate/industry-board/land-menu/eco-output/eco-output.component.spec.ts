import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EcoOutputComponent } from './eco-output.component';

describe('EcoOutputComponent', () => {
  let component: EcoOutputComponent;
  let fixture: ComponentFixture<EcoOutputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EcoOutputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EcoOutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
