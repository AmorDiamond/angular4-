import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MicrocosmicComponent } from './microcosmic.component';

describe('MicrocosmicComponent', () => {
  let component: MicrocosmicComponent;
  let fixture: ComponentFixture<MicrocosmicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MicrocosmicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MicrocosmicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
