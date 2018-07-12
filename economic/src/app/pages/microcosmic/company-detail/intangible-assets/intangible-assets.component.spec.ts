import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntangibleAssetsComponent } from './intangible-assets.component';

describe('IntangibleAssetsComponent', () => {
  let component: IntangibleAssetsComponent;
  let fixture: ComponentFixture<IntangibleAssetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntangibleAssetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntangibleAssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
