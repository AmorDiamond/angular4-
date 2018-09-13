import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FamousExcellentComponent } from './famous-excellent.component';

describe('FamousExcellentComponent', () => {
  let component: FamousExcellentComponent;
  let fixture: ComponentFixture<FamousExcellentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FamousExcellentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FamousExcellentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
