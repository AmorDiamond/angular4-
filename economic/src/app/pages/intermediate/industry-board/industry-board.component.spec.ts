import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndustryBoardComponent } from './industry-board.component';

describe('IndustryBoardComponent', () => {
  let component: IndustryBoardComponent;
  let fixture: ComponentFixture<IndustryBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndustryBoardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndustryBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
