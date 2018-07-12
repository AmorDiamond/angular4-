import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterpriseFenbuComponent } from './enterprise-fenbu.component';

describe('EnterpriseFenbuComponent', () => {
  let component: EnterpriseFenbuComponent;
  let fixture: ComponentFixture<EnterpriseFenbuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnterpriseFenbuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterpriseFenbuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
