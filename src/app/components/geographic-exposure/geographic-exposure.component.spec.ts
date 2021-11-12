import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeographicExposureComponent } from './geographic-exposure.component';

describe('GeographicExposureComponent', () => {
  let component: GeographicExposureComponent;
  let fixture: ComponentFixture<GeographicExposureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeographicExposureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeographicExposureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
