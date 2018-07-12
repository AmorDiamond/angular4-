import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomizeIndustryFenbuComponent } from './customize-industry-fenbu.component';

describe('CustomizeIndustryFenbuComponent', () => {
  let component: CustomizeIndustryFenbuComponent;
  let fixture: ComponentFixture<CustomizeIndustryFenbuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomizeIndustryFenbuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomizeIndustryFenbuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
