import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexAbstractComponent } from './index-abstract.component';

describe('IndexAbstractComponent', () => {
  let component: IndexAbstractComponent;
  let fixture: ComponentFixture<IndexAbstractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndexAbstractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexAbstractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
