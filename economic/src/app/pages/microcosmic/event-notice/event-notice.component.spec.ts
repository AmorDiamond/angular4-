import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventNoticeComponent } from './event-notice.component';

describe('EventNoticeComponent', () => {
  let component: EventNoticeComponent;
  let fixture: ComponentFixture<EventNoticeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventNoticeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventNoticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
