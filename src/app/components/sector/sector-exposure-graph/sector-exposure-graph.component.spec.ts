import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectorExposureGraphComponent } from './sector-exposure-graph.component';

describe('SectorExposureGraphComponent', () => {
  let component: SectorExposureGraphComponent;
  let fixture: ComponentFixture<SectorExposureGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SectorExposureGraphComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SectorExposureGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
