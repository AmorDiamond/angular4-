import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildInformationComponent } from './build-information.component';

describe('BuildInformationComponent', () => {
  let component: BuildInformationComponent;
  let fixture: ComponentFixture<BuildInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuildInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuildInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
