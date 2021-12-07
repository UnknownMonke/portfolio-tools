import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeographicExposureGraphComponent } from './geographic-exposure-graph.component';

describe('GeographicExposureGraphComponent', () => {
  let component: GeographicExposureGraphComponent;
  let fixture: ComponentFixture<GeographicExposureGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeographicExposureGraphComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeographicExposureGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
