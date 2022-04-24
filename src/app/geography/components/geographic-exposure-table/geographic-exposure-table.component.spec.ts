import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeographicExposureTableComponent } from './geographic-exposure-table.component';

describe('GeographicExposureTableComponent', () => {
  let component: GeographicExposureTableComponent;
  let fixture: ComponentFixture<GeographicExposureTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeographicExposureTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeographicExposureTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
