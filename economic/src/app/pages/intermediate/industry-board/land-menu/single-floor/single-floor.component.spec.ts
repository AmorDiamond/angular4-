import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleFloorComponent } from './single-floor.component';

describe('SingleFloorComponent', () => {
  let component: SingleFloorComponent;
  let fixture: ComponentFixture<SingleFloorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleFloorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleFloorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
