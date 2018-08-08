import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkerTotalComponent } from './worker-total.component';

describe('WorkerTotalComponent', () => {
  let component: WorkerTotalComponent;
  let fixture: ComponentFixture<WorkerTotalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkerTotalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkerTotalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
